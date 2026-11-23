import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { ChevronDown, ChevronUp, Eye, EyeOff, Layers, RotateCcw } from 'lucide-react';
import { CameraPreset, SolidDefinition } from '../types/projection';

interface TriedroViewportProps {
  solid: SolidDefinition;
  unfoldValue: number; // 0..1
  onUnfoldChange: (val: number) => void;
  onSelectSolid: (solidId: string) => void;
  solidsList: SolidDefinition[];
}

const PLANE_SIZE = 4.6;

// Reusable math objects outside render loop (Zero GC)
const _targetCamPos = new THREE.Vector3();
const _targetControlsLook = new THREE.Vector3();

function detectSoftwareGl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createDraftingGridTexture(
  bgHex: string,
  lineHex: string,
  accentLabel: string,
  labelHex: string,
  maxAniso: number,
): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = bgHex;
    ctx.fillRect(0, 0, size, size);

    const step = size / 8;
    ctx.strokeStyle = lineHex;
    ctx.lineWidth = 1.5;
    for (let i = 0; i <= 8; i++) {
      const p = i * step;
      ctx.beginPath();
      ctx.moveTo(p, 0);
      ctx.lineTo(p, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, p);
      ctx.lineTo(size, p);
      ctx.stroke();
    }

    // Crisp outer border
    ctx.strokeStyle = labelHex;
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, size - 4, size - 4);

    // Subtle corner label
    ctx.fillStyle = labelHex;
    ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(accentLabel, 20, 42);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAniso;
  return tex;
}

function buildGableRoofGeometry(
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  zMin: number,
  zMax: number,
): THREE.BufferGeometry {
  // Triangular cross section in (z, y), extruded along X from xMin to xMax
  const zMid = (zMin + zMax) / 2;
  const shape = new THREE.Shape();
  shape.moveTo(zMin, yMin);
  shape.lineTo(zMax, yMin);
  shape.lineTo(zMid, yMax);
  shape.closePath();

  const extrudeLength = xMax - xMin;
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: extrudeLength,
    bevelEnabled: false,
    steps: 1,
  });
  // ExtrudeGeometry extrudes along +Z from 0..extrudeLength.
  // Rotate +90 deg around Y so local X becomes +Z, local Z becomes +X?
  // Let's trace: rotateY(-Math.PI/2) maps (x, y, z) -> (-z, y, x).
  // Wait: if we use rotateY(+Math.PI/2): (x, y, z) -> (z, y, -x).
  // Easier: rotateY(-Math.PI/2) maps (z_shape, y_shape, extrude_z) -> (-extrude_z, y_shape, z_shape).
  // Then translate X by xMax so -extrude_z in [-extrudeLength, 0] shifts to [xMin, xMax]!
  geo.rotateY(-Math.PI / 2);
  geo.translate(xMax, 0, 0);
  geo.computeVertexNormals();
  return geo;
}

function disposeObject3D(obj: THREE.Object3D) {
  obj.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((m) => m.dispose());
      } else {
        mesh.material.dispose();
      }
    }
  });
}

export const TriedroViewport: React.FC<TriedroViewportProps> = ({
  solid,
  unfoldValue,
  onUnfoldChange,
  onSelectSolid,
  solidsList,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [preset, setPreset] = useState<CameraPreset>('iso');
  const [showRays, setShowRays] = useState(true);
  const [showSolid, setShowSolid] = useState(true);
  const [dockCollapsed, setDockCollapsed] = useState(false);
  const [webglError, setWebglError] = useState(false);

  // Refs synced with React state for stable WebGL loop
  const unfoldTargetRef = useRef(unfoldValue);
  const showRaysRef = useRef(showRays);
  const showSolidRef = useRef(showSolid);
  const presetTargetRef = useRef<CameraPreset | null>('iso');
  const rebuildSolidRef = useRef<((s: SolidDefinition) => void) | null>(null);
  const requestRenderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    unfoldTargetRef.current = unfoldValue;
    requestRenderRef.current?.();
  }, [unfoldValue]);

  useEffect(() => {
    showRaysRef.current = showRays;
    requestRenderRef.current?.();
  }, [showRays]);

  useEffect(() => {
    showSolidRef.current = showSolid;
    requestRenderRef.current?.();
  }, [showSolid]);

  useEffect(() => {
    if (rebuildSolidRef.current) {
      rebuildSolidRef.current(solid);
      requestRenderRef.current?.();
    }
  }, [solid]);

  const handlePresetClick = (nextPreset: CameraPreset) => {
    setPreset(nextPreset);
    presetTargetRef.current = nextPreset;
    if (nextPreset === 'sheet2d') {
      onUnfoldChange(1);
      unfoldTargetRef.current = 1;
    } else if (nextPreset === 'iso' && unfoldValue > 0.9) {
      onUnfoldChange(0);
      unfoldTargetRef.current = 0;
    }
    requestRenderRef.current?.();
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: false,
      });
    } catch {
      setWebglError(true);
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 600;
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError(true);
    };
    const handleContextRestored = () => {
      setWebglError(false);
      requestRenderRef.current?.();
    };
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F8FAFC');
    scene.fog = new THREE.Fog('#F8FAFC', 22, 46);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    scene.environment = pmremGenerator.fromScene(roomEnv, 0.04).texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(-7.6, 5.8, 8.6);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.minDistance = 4.5;
    controls.maxDistance = 20;
    controls.maxPolarAngle = Math.PI * 0.85;
    controls.target.set(-1.5, 1.2, 1.2);
    controls.update();

    // Cancel scripted preset animation if user manually interacts
    controls.addEventListener('start', () => {
      presetTargetRef.current = null;
    });

    // 3-Point Studio Lighting Rig
    const hemiLight = new THREE.HemisphereLight('#E0F2FE', '#E2E8F0', 0.9);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight('#FFFBEB', 1.4);
    keyLight.position.set(-5.5, 8.5, 6.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.left = -6;
    keyLight.shadow.camera.right = 6;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -6;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight('#BAE6FD', 0.55);
    rimLight.position.set(5, 3, -5);
    scene.add(rimLight);

    // Triedro Hierarchical Groups
    const triedroRoot = new THREE.Group();
    scene.add(triedroRoot);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const pvTex = createDraftingGridTexture('#F0FDF4', '#BBF7D0', 'PV', '#047857', maxAniso);
    const poTex = createDraftingGridTexture('#F0F9FF', '#BAE6FD', 'PO', '#0369A1', maxAniso);
    const plTex = createDraftingGridTexture('#FFFBEB', '#FDE68A', 'PL', '#B45309', maxAniso);

    // PV Group (fixed on z=0, x in [-4.6, 0], y in [0, 4.6])
    const pvGroup = new THREE.Group();
    triedroRoot.add(pvGroup);
    const pvPlaneGeo = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE);
    const pvPlaneMat = new THREE.MeshStandardMaterial({
      map: pvTex,
      roughness: 0.9,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
    const pvPlaneMesh = new THREE.Mesh(pvPlaneGeo, pvPlaneMat);
    pvPlaneMesh.position.set(-PLANE_SIZE / 2, PLANE_SIZE / 2, -0.02);
    pvPlaneMesh.receiveShadow = !isSoftwareGl;
    pvGroup.add(pvPlaneMesh);

    // PO Group (pivots along X-axis at y=0, z=0)
    const poGroup = new THREE.Group();
    triedroRoot.add(poGroup);
    const poPlaneGeo = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE);
    const poPlaneMat = new THREE.MeshStandardMaterial({
      map: poTex,
      roughness: 0.9,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
    const poPlaneMesh = new THREE.Mesh(poPlaneGeo, poPlaneMat);
    poPlaneMesh.rotation.x = -Math.PI / 2;
    poPlaneMesh.position.set(-PLANE_SIZE / 2, -0.02, PLANE_SIZE / 2);
    poPlaneMesh.receiveShadow = !isSoftwareGl;
    poGroup.add(poPlaneMesh);

    // PL Group (pivots along Y-axis at x=0, z=0)
    const plGroup = new THREE.Group();
    triedroRoot.add(plGroup);
    const plPlaneGeo = new THREE.PlaneGeometry(PLANE_SIZE, PLANE_SIZE);
    const plPlaneMat = new THREE.MeshStandardMaterial({
      map: plTex,
      roughness: 0.9,
      metalness: 0.0,
      side: THREE.DoubleSide,
    });
    const plPlaneMesh = new THREE.Mesh(plPlaneGeo, plPlaneMat);
    plPlaneMesh.rotation.y = -Math.PI / 2;
    plPlaneMesh.position.set(0.02, PLANE_SIZE / 2, PLANE_SIZE / 2);
    plPlaneMesh.receiveShadow = !isSoftwareGl;
    plGroup.add(plPlaneMesh);

    // Quadrant 4 Ribaltamento Backdrop + Axes (Linea di Terra LT & Vertical Axis)
    const axisGroup = new THREE.Group();
    triedroRoot.add(axisGroup);

    const ltMat = new THREE.LineBasicMaterial({ color: '#0F172A' });
    const ltGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-PLANE_SIZE - 0.15, 0, 0.02),
      new THREE.Vector3(PLANE_SIZE + 0.15, 0, 0.02),
    ]);
    axisGroup.add(new THREE.Line(ltGeo, ltMat));

    const vAxisGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -PLANE_SIZE - 0.15, 0.02),
      new THREE.Vector3(0, PLANE_SIZE + 0.15, 0.02),
    ]);
    axisGroup.add(new THREE.Line(vAxisGeo, ltMat));

    // Dynamic sub-groups populated per solid
    const pvContent = new THREE.Group();
    const poContent = new THREE.Group();
    const plContent = new THREE.Group();
    const solidGroup = new THREE.Group();
    const raysGroup = new THREE.Group();
    const ribaltamentoGroup = new THREE.Group();

    pvGroup.add(pvContent);
    poGroup.add(poContent);
    plGroup.add(plContent);
    triedroRoot.add(solidGroup);
    triedroRoot.add(raysGroup);
    triedroRoot.add(ribaltamentoGroup);

    const solidMaterials: THREE.MeshStandardMaterial[] = [];

    const populateSolid = (s: SolidDefinition) => {
      // Clear previous meshes
      [pvContent, poContent, plContent, solidGroup, raysGroup, ribaltamentoGroup].forEach((grp) => {
        while (grp.children.length > 0) {
          const child = grp.children[0];
          grp.remove(child);
          disposeObject3D(child);
        }
      });
      solidMaterials.length = 0;

      // 1. Build 3D composite parts
      s.parts.forEach((part) => {
        let geo: THREE.BufferGeometry;
        if (part.kind === 'gable') {
          geo = buildGableRoofGeometry(part.xMin, part.xMax, part.yMin, part.yMax, part.zMin, part.zMax);
        } else {
          const sx = part.xMax - part.xMin;
          const sy = part.yMax - part.yMin;
          const sz = part.zMax - part.zMin;
          geo = new THREE.BoxGeometry(sx, sy, sz);
          geo.translate((part.xMin + part.xMax) / 2, (part.yMin + part.yMax) / 2, (part.zMin + part.zMax) / 2);
        }

        const mat = new THREE.MeshStandardMaterial({
          color: part.color,
          roughness: part.roughness,
          metalness: part.metalness,
          transparent: true,
          opacity: 1,
        });
        solidMaterials.push(mat);

        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = !isSoftwareGl;
        mesh.receiveShadow = !isSoftwareGl;
        solidGroup.add(mesh);

        const edgesGeo = new THREE.EdgesGeometry(geo, 18);
        const edgesMat = new THREE.LineBasicMaterial({
          color: '#0F172A',
          transparent: true,
          opacity: 0.75,
        });
        solidGroup.add(new THREE.LineSegments(edgesGeo, edgesMat));
      });

      // 2. Build 2D PV Projections on pvContent (z = 0.008)
      s.projections.PV.polygons.forEach((poly) => {
        const shape = new THREE.Shape();
        poly.points.forEach((pt, idx) => {
          if (idx === 0) shape.moveTo(pt.u, pt.v);
          else shape.lineTo(pt.u, pt.v);
        });
        shape.closePath();
        const geo = new THREE.ShapeGeometry(shape);
        const mat = new THREE.MeshBasicMaterial({
          color: poly.fill,
          side: THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.z = 0.008;
        pvContent.add(mesh);
      });

      s.projections.PV.edges.forEach((edge) => {
        const pts = [new THREE.Vector3(edge.from.u, edge.from.v, 0.015), new THREE.Vector3(edge.to.u, edge.to.v, 0.015)];
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = edge.dashed
          ? new THREE.LineDashedMaterial({ color: '#334155', dashSize: 0.14, gapSize: 0.1 })
          : new THREE.LineBasicMaterial({ color: '#0F172A' });
        const line = new THREE.Line(geo, mat);
        if (edge.dashed) line.computeLineDistances();
        pvContent.add(line);
      });

      // 3. Build 2D PO Projections on poContent (lying on y = 0.008)
      s.projections.PO.polygons.forEach((poly) => {
        const shape = new THREE.Shape();
        poly.points.forEach((pt, idx) => {
          // u = x, v = z -> shape (u, -v) rotated -90 deg X becomes (u, 0, +v)
          if (idx === 0) shape.moveTo(pt.u, -pt.v);
          else shape.lineTo(pt.u, -pt.v);
        });
        shape.closePath();
        const geo = new THREE.ShapeGeometry(shape);
        geo.rotateX(-Math.PI / 2);
        const mat = new THREE.MeshBasicMaterial({
          color: poly.fill,
          side: THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.y = 0.008;
        poContent.add(mesh);
      });

      s.projections.PO.edges.forEach((edge) => {
        const pts = [new THREE.Vector3(edge.from.u, 0.015, edge.from.v), new THREE.Vector3(edge.to.u, 0.015, edge.to.v)];
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = edge.dashed
          ? new THREE.LineDashedMaterial({ color: '#334155', dashSize: 0.14, gapSize: 0.1 })
          : new THREE.LineBasicMaterial({ color: '#0F172A' });
        const line = new THREE.Line(geo, mat);
        if (edge.dashed) line.computeLineDistances();
        poContent.add(line);
      });

      // 4. Build 2D PL Projections on plContent (lying on x = -0.008 facing -X)
      s.projections.PL.polygons.forEach((poly) => {
        const shape = new THREE.Shape();
        poly.points.forEach((pt, idx) => {
          // u = z, v = y -> shape (u, v) rotated -90 deg Y becomes (0, v, u) with normal -X
          if (idx === 0) shape.moveTo(pt.u, pt.v);
          else shape.lineTo(pt.u, pt.v);
        });
        shape.closePath();
        const geo = new THREE.ShapeGeometry(shape);
        geo.rotateY(-Math.PI / 2);
        const mat = new THREE.MeshBasicMaterial({
          color: poly.fill,
          side: THREE.DoubleSide,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.x = -0.008;
        plContent.add(mesh);
      });

      s.projections.PL.edges.forEach((edge) => {
        const pts = [new THREE.Vector3(-0.015, edge.from.v, edge.from.u), new THREE.Vector3(-0.015, edge.to.v, edge.to.u)];
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const mat = edge.dashed
          ? new THREE.LineDashedMaterial({ color: '#334155', dashSize: 0.14, gapSize: 0.1 })
          : new THREE.LineBasicMaterial({ color: '#0F172A' });
        const line = new THREE.Line(geo, mat);
        if (edge.dashed) line.computeLineDistances();
        plContent.add(line);
      });

      // 5. Projection Rays from 3D vertices to PV, PO, PL
      const rayMatPV = new THREE.LineDashedMaterial({ color: '#059669', dashSize: 0.1, gapSize: 0.08, transparent: true, opacity: 0.55 });
      const rayMatPO = new THREE.LineDashedMaterial({ color: '#0284C7', dashSize: 0.1, gapSize: 0.08, transparent: true, opacity: 0.55 });
      const rayMatPL = new THREE.LineDashedMaterial({ color: '#D97706', dashSize: 0.1, gapSize: 0.08, transparent: true, opacity: 0.55 });

      s.projectionVertices.forEach(([vx, vy, vz]) => {
        // Ray to PV (z = 0)
        const gPV = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(vx, vy, vz), new THREE.Vector3(vx, vy, 0)]);
        const lPV = new THREE.Line(gPV, rayMatPV);
        lPV.computeLineDistances();
        raysGroup.add(lPV);

        // Ray to PO (y = 0)
        const gPO = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(vx, vy, vz), new THREE.Vector3(vx, 0, vz)]);
        const lPO = new THREE.Line(gPO, rayMatPO);
        lPO.computeLineDistances();
        raysGroup.add(lPO);

        // Ray to PL (x = 0)
        const gPL = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(vx, vy, vz), new THREE.Vector3(0, vy, vz)]);
        const lPL = new THREE.Line(gPL, rayMatPL);
        lPL.computeLineDistances();
        raysGroup.add(lPL);
      });

      // 6. Quadrant 4 Compass Ribaltamento Arcs & Sheet Construction Lines
      const constrMat = new THREE.LineDashedMaterial({
        color: '#64748B',
        dashSize: 0.1,
        gapSize: 0.08,
        transparent: true,
        opacity: 0.6,
      });

      const minX = Math.min(...s.constructionXs);
      const maxY = Math.max(...s.constructionYs);
      const maxZ = Math.max(...s.ribaltamentoDepths);

      s.constructionXs.forEach((cx) => {
        const g = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(cx, -maxZ, 0.012),
          new THREE.Vector3(cx, maxY, 0.012),
        ]);
        const line = new THREE.Line(g, constrMat);
        line.computeLineDistances();
        ribaltamentoGroup.add(line);
      });

      s.constructionYs.forEach((cy) => {
        const g = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(minX, cy, 0.012),
          new THREE.Vector3(maxZ, cy, 0.012),
        ]);
        const line = new THREE.Line(g, constrMat);
        line.computeLineDistances();
        ribaltamentoGroup.add(line);
      });

      s.ribaltamentoDepths.forEach((r) => {
        // Horizontal PO line to vertical axis
        const g1 = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(minX, -r, 0.012),
          new THREE.Vector3(0, -r, 0.012),
        ]);
        const l1 = new THREE.Line(g1, constrMat);
        l1.computeLineDistances();
        ribaltamentoGroup.add(l1);

        // Quarter-circle compass arc in Quadrant 4 (from -90 deg to 0 deg)
        const curvePts: THREE.Vector3[] = [];
        const steps = 28;
        for (let i = 0; i <= steps; i++) {
          const ang = -Math.PI / 2 + (i / steps) * (Math.PI / 2);
          curvePts.push(new THREE.Vector3(Math.cos(ang) * r, Math.sin(ang) * r, 0.012));
        }
        const gArc = new THREE.BufferGeometry().setFromPoints(curvePts);
        const lArc = new THREE.Line(gArc, new THREE.LineBasicMaterial({ color: '#D97706', transparent: true, opacity: 0.75 }));
        ribaltamentoGroup.add(lArc);

        // Vertical PL line rising from LT
        const g2 = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(r, 0, 0.012),
          new THREE.Vector3(r, maxY, 0.012),
        ]);
        const l2 = new THREE.Line(g2, constrMat);
        l2.computeLineDistances();
        ribaltamentoGroup.add(l2);
      });
    };

    rebuildSolidRef.current = populateSolid;
    populateSolid(solid);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    let currentUnfold = unfoldTargetRef.current;
    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let lastTime = performance.now();

    function applyCameraPreset(p: CameraPreset, dt: number): boolean {
      if (p === 'iso') {
        _targetCamPos.set(-7.6, 5.8, 8.6);
        _targetControlsLook.set(-1.5, 1.3, 1.3);
      } else if (p === 'PV') {
        _targetCamPos.set(-2.2, 1.8, 8.5);
        _targetControlsLook.set(-2.2, 1.8, 0.5);
      } else if (p === 'PO') {
        _targetCamPos.set(-2.2, 9.2, 2.1);
        _targetControlsLook.set(-2.2, 0.5, 2.0);
      } else if (p === 'PL') {
        _targetCamPos.set(-9.2, 1.8, 2.0);
        _targetControlsLook.set(-1.0, 1.8, 2.0);
      } else if (p === 'sheet2d') {
        _targetCamPos.set(0.0, 0.0, 13.5);
        _targetControlsLook.set(0.0, 0.0, 0.0);
      }

      const lambda = isSoftwareGl ? 18 : 7.5;
      const alpha = 1 - Math.exp(-lambda * dt);
      camera.position.lerp(_targetCamPos, alpha);
      controls.target.lerp(_targetControlsLook, alpha);

      const dist = camera.position.distanceTo(_targetCamPos) + controls.target.distanceTo(_targetControlsLook);
      if (dist < 0.03) {
        camera.position.copy(_targetCamPos);
        controls.target.copy(_targetControlsLook);
        return false; // arrived
      }
      return true;
    }

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function requestRender() {
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame(() => {
        renderDirty = false;
        const now = performance.now();
        const dt = Math.min((now - lastTime) / 1000, 0.05);
        lastTime = now;

        let needsMoreFrames = false;

        // Smoothly damp Triedro unfold
        const targetU = unfoldTargetRef.current;
        if (Math.abs(currentUnfold - targetU) > 0.002) {
          currentUnfold = THREE.MathUtils.damp(currentUnfold, targetU, isSoftwareGl ? 16 : 8, dt);
          needsMoreFrames = true;
        } else {
          currentUnfold = targetU;
        }

        const angle = currentUnfold * (Math.PI / 2);
        poGroup.rotation.x = angle;
        plGroup.rotation.y = angle;

        // Fade 3D solid gracefully when sheet unfolds flat
        const solidVisible = showSolidRef.current;
        solidGroup.visible = solidVisible;
        if (solidVisible) {
          const solidAlpha = currentUnfold > 0.35 ? THREE.MathUtils.lerp(1, 0.16, (currentUnfold - 0.35) / 0.65) : 1;
          solidMaterials.forEach((m) => {
            m.opacity = solidAlpha;
            m.depthWrite = solidAlpha > 0.85;
          });
        }

        // Rays visibility & fade during unfold
        raysGroup.visible = showRaysRef.current && currentUnfold < 0.25;
        ribaltamentoGroup.visible = currentUnfold > 0.65;

        // Camera preset damping
        if (presetTargetRef.current) {
          const moving = applyCameraPreset(presetTargetRef.current, dt);
          if (moving) needsMoreFrames = true;
          else presetTargetRef.current = null;
        }

        const dampingActive = controls.update();
        if (dampingActive && !isSoftwareGl) needsMoreFrames = true;

        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (renderDirty || needsMoreFrames) {
            requestRender();
          }
        };

        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    requestRenderRef.current = requestRender;
    controls.addEventListener('change', requestRender);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };
    window.addEventListener('resize', handleResize);

    // Initial render
    requestRender();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('change', requestRender);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      [pvTex, poTex, plTex].forEach((t) => t.dispose());
      disposeObject3D(scene);
      if (scene.environment) scene.environment.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const unfoldDeg = Math.round(unfoldValue * 90);

  return (
    <div className="relative w-full h-[540px] lg:h-[620px] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden select-none">
      {/* Isolated WebGL Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Graceful fallback if WebGL is unavailable */}
      {webglError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 p-6 text-center">
          <p className="text-base font-bold text-slate-900 mb-1">Modalità 3D non disponibile su questo dispositivo</p>
          <p className="text-sm text-slate-600 max-w-md">
            Attiva la vista "Foglio 2D Sync" qui sopra per esplorare tutte le proiezioni ortogonali di {solid.name}.
          </p>
        </div>
      )}

      {/* Minimal Top-Left Corner Legend (no center occlusion) */}
      <div className="pointer-events-none absolute top-3 left-3 flex flex-col gap-1 bg-white/95 border border-slate-200 rounded-lg px-3 py-2 text-xs shadow-sm">
        <div className="font-bold text-slate-900">{solid.name}</div>
        <div className="flex items-center gap-2 text-slate-600 font-mono tabular-nums">
          <span className="text-emerald-700 font-semibold">PV</span>
          <span aria-hidden="true">·</span>
          <span className="text-sky-700 font-semibold">PO</span>
          <span aria-hidden="true">·</span>
          <span className="text-amber-700 font-semibold">PL</span>
        </div>
      </div>

      {/* Collapsible Bottom Control Dock (Unified, zero side-panel clutter) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-[min(900px,95%)] flex flex-col items-center pointer-events-none z-10">
        <button
          type="button"
          onClick={() => setDockCollapsed((v) => !v)}
          className="pointer-events-auto mb-1.5 inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-700 hover:bg-slate-100 shadow-sm cursor-pointer whitespace-nowrap"
        >
          {dockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {dockCollapsed ? 'Mostra Controlli 3D' : 'Nascondi Controlli'}
        </button>

        {!dockCollapsed && (
          <div className="pointer-events-auto w-full bg-white/95 border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col gap-3">
            {/* Row 1: Solid Selector + Quick Camera Presets */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1">
                {solidsList.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => onSelectSolid(s.id)}
                    className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      s.id === solid.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                {(
                  [
                    { key: 'iso', label: '3D' },
                    { key: 'PV', label: 'PV' },
                    { key: 'PO', label: 'PO' },
                    { key: 'PL', label: 'PL' },
                    { key: 'sheet2d', label: 'Foglio 2D' },
                  ] as Array<{ key: CameraPreset; label: string }>
                ).map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handlePresetClick(item.key)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      preset === item.key
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 2: Unfold Slider + Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-3 flex-1 min-w-[220px]">
                <label htmlFor="unfold-slider" className="text-xs font-semibold text-slate-800 whitespace-nowrap">
                  Apri il Triedro:
                </label>
                <input
                  id="unfold-slider"
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(unfoldValue * 100)}
                  onChange={(e) => {
                    const v = Number(e.target.value) / 100;
                    onUnfoldChange(v);
                    if (v === 0) setPreset('iso');
                  }}
                  className="w-full accent-sky-600 cursor-pointer"
                />
                <span className="text-xs font-mono font-semibold text-sky-700 tabular-nums w-10 text-right">
                  {unfoldDeg}°
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowRays((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    showRays
                      ? 'bg-sky-50 border-sky-200 text-sky-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Raggi
                </button>
                <button
                  type="button"
                  onClick={() => setShowSolid((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    showSolid
                      ? 'bg-slate-100 border-slate-300 text-slate-800'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {showSolid ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  Solido 3D
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onUnfoldChange(0);
                    handlePresetClick('iso');
                  }}
                  title="Ripristina vista"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-100 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
