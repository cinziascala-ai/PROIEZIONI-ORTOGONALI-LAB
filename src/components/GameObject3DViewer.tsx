import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { SolidDefinition } from '../types/projection';

interface GameObject3DViewerProps {
  solid: SolidDefinition;
  className?: string;
}

type MiniViewPreset = 'iso' | 'PV' | 'PO' | 'PL';

const _targetPos = new THREE.Vector3();
const _targetLook = new THREE.Vector3();

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

function buildGableRoofGeometry(
  xMin: number,
  xMax: number,
  yMin: number,
  yMax: number,
  zMin: number,
  zMax: number,
): THREE.BufferGeometry {
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
  geo.rotateY(-Math.PI / 2);
  geo.translate(xMax, 0, 0);
  geo.computeVertexNormals();
  return geo;
}

function disposeGroup(obj: THREE.Object3D) {
  obj.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (mesh.geometry) mesh.geometry.dispose();
    if (mesh.material) {
      if (Array.isArray(mesh.material)) mesh.material.forEach((m) => m.dispose());
      else mesh.material.dispose();
    }
  });
}

export const GameObject3DViewer: React.FC<GameObject3DViewerProps> = ({ solid, className = '' }) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [view, setView] = useState<MiniViewPreset>('iso');
  const [webglError, setWebglError] = useState(false);

  const presetRef = useRef<MiniViewPreset | null>('iso');
  const rebuildRef = useRef<((s: SolidDefinition) => void) | null>(null);
  const requestRenderRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (rebuildRef.current) {
      rebuildRef.current(solid);
      presetRef.current = 'iso';
      setView('iso');
      requestRenderRef.current?.();
    }
  }, [solid]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !isSoftwareGl, powerPreference: 'high-performance' });
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

    const w = container.clientWidth || 380;
    const h = container.clientHeight || 300;
    renderer.setSize(w, h);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const onLost = (e: Event) => {
      e.preventDefault();
      setWebglError(true);
    };
    renderer.domElement.addEventListener('webglcontextlost', onLost);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F8FAFC');

    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    scene.environment = pmrem.fromScene(roomEnv, 0.04).texture;
    roomEnv.dispose();
    pmrem.dispose();

    const camera = new THREE.PerspectiveCamera(36, w / h, 0.1, 60);
    camera.position.set(-4.2, 3.2, 4.6);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.minDistance = 2.5;
    controls.maxDistance = 12;
    controls.target.set(0, 0.9, 0);
    controls.update();
    controls.addEventListener('start', () => {
      presetRef.current = null;
    });

    const hemi = new THREE.HemisphereLight('#E0F2FE', '#E2E8F0', 0.95);
    scene.add(hemi);
    const key = new THREE.DirectionalLight('#FFFBEB', 1.45);
    key.position.set(-4, 7, 5);
    key.castShadow = !isSoftwareGl;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.bias = -0.0005;
    key.shadow.normalBias = 0.02;
    scene.add(key);

    // Subtle tabletop ground plane
    const groundGeo = new THREE.CircleGeometry(3.2, 48);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshStandardMaterial({ color: '#E2E8F0', roughness: 0.92, metalness: 0.0 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.receiveShadow = !isSoftwareGl;
    scene.add(ground);

    const objectGroup = new THREE.Group();
    scene.add(objectGroup);

    const buildModel = (s: SolidDefinition) => {
      while (objectGroup.children.length > 0) {
        const c = objectGroup.children[0];
        objectGroup.remove(c);
        disposeGroup(c);
      }

      // Center bounding box on (x=0, z=0) and ground bottom at y=0
      let minX = Infinity, maxX = -Infinity, minY = Infinity, minZ = Infinity, maxZ = -Infinity;
      s.parts.forEach((p) => {
        minX = Math.min(minX, p.xMin);
        maxX = Math.max(maxX, p.xMax);
        minY = Math.min(minY, p.yMin);
        minZ = Math.min(minZ, p.zMin);
        maxZ = Math.max(maxZ, p.zMax);
      });
      const cx = (minX + maxX) / 2;
      const cz = (minZ + maxZ) / 2;

      s.parts.forEach((p) => {
        let geo: THREE.BufferGeometry;
        if (p.kind === 'gable') {
          geo = buildGableRoofGeometry(p.xMin, p.xMax, p.yMin, p.yMax, p.zMin, p.zMax);
          geo.translate(-cx, -minY, -cz);
        } else {
          const sx = p.xMax - p.xMin;
          const sy = p.yMax - p.yMin;
          const sz = p.zMax - p.zMin;
          geo = new THREE.BoxGeometry(sx, sy, sz);
          geo.translate((p.xMin + p.xMax) / 2 - cx, (p.yMin + p.yMax) / 2 - minY, (p.zMin + p.zMax) / 2 - cz);
        }
        const mat = new THREE.MeshStandardMaterial({
          color: p.color,
          roughness: p.roughness,
          metalness: p.metalness,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = !isSoftwareGl;
        mesh.receiveShadow = !isSoftwareGl;
        objectGroup.add(mesh);

        const edges = new THREE.EdgesGeometry(geo, 20);
        objectGroup.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: '#0F172A' })));
      });
    };

    rebuildRef.current = buildModel;
    buildModel(solid);
    if (!isSoftwareGl) renderer.compile(scene, camera);

    let frameId = 0;
    let renderBusy = false;
    let renderDirty = false;
    let lastTime = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || typeof gl.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const st = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (st === gl.UNSIGNALED) frameId = window.setTimeout(poll, 5);
        else {
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

        let more = false;
        const p = presetRef.current;
        if (p) {
          if (p === 'iso') {
            _targetPos.set(-4.2, 3.2, 4.6);
            _targetLook.set(0, 0.9, 0);
          } else if (p === 'PV') {
            _targetPos.set(0, 1.0, 5.5);
            _targetLook.set(0, 1.0, 0);
          } else if (p === 'PO') {
            _targetPos.set(0, 6.2, 0.01);
            _targetLook.set(0, 0.4, 0);
          } else if (p === 'PL') {
            _targetPos.set(-5.5, 1.0, 0);
            _targetLook.set(0, 1.0, 0);
          }
          const alpha = 1 - Math.exp(-(isSoftwareGl ? 18 : 8) * dt);
          camera.position.lerp(_targetPos, alpha);
          controls.target.lerp(_targetLook, alpha);
          if (camera.position.distanceTo(_targetPos) < 0.03) {
            camera.position.copy(_targetPos);
            controls.target.copy(_targetLook);
            presetRef.current = null;
          } else {
            more = true;
          }
        }

        const damp = controls.update();
        if (damp && !isSoftwareGl) more = true;

        renderer.render(scene, camera);

        const done = () => {
          renderBusy = false;
          if (renderDirty || more) requestRender();
        };
        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    requestRenderRef.current = requestRender;
    controls.addEventListener('change', requestRender);

    const onResize = () => {
      if (!container) return;
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      if (!cw || !ch) return;
      camera.aspect = cw / ch;
      camera.updateProjectionMatrix();
      renderer.setSize(cw, ch);
      requestRender();
    };
    window.addEventListener('resize', onResize);
    requestRender();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      controls.removeEventListener('change', requestRender);
      controls.dispose();
      renderer.domElement.removeEventListener('webglcontextlost', onLost);
      disposeGroup(scene);
      if (scene.environment) scene.environment.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement);
    };
  }, []);

  const selectPreset = (p: MiniViewPreset) => {
    setView(p);
    presetRef.current = p;
    requestRenderRef.current?.();
  };

  return (
    <div className={`relative w-full h-[310px] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden ${className}`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      {webglError && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 p-4 text-xs text-slate-600 text-center">
          Anteprima 3D non supportata dal browser. Osserva il confronto con le tre viste 2D a lato.
        </div>
      )}
      <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg shadow-sm">
        {(
          [
            { key: 'iso', label: '3D' },
            { key: 'PV', label: 'Fronte (PV)' },
            { key: 'PO', label: 'Alto (PO)' },
            { key: 'PL', label: 'Lato (PL)' },
          ] as Array<{ key: MiniViewPreset; label: string }>
        ).map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => selectPreset(item.key)}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              view === item.key ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
