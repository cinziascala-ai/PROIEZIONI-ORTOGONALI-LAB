export type PlaneKey = 'PO' | 'PV' | 'PL';

export type CameraPreset = 'iso' | 'PO' | 'PV' | 'PL' | 'sheet2d';

export interface BoxPartSpec {
  id: string;
  label: string;
  /** Bounds in 3D Triedro space: x in [-4.5, 0], y in [0, 4.5], z in [0, 4.5] */
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  zMin: number;
  zMax: number;
  color: string;
  roughness: number;
  metalness: number;
  kind?: 'box' | 'gable';
}

export interface Point2D {
  u: number;
  v: number;
}

export interface Poly2D {
  points: Point2D[];
  fill: string;
}

export interface Line2D {
  from: Point2D;
  to: Point2D;
  dashed?: boolean;
}

export interface PlaneProjection2D {
  /** Polygons in local plane coordinates (see coordinate mapping in solids.ts) */
  polygons: Poly2D[];
  /** Crisp visible or hidden edges */
  edges: Line2D[];
  /** Key points to emit construction/projection rays from 3D object */
  rayVertices?: Array<[number, number, number]>;
}

export interface SolidDefinition {
  id: string;
  name: string;
  level: 'Base' | 'Intermedio' | 'Avanzato';
  domainTag: string;
  description: string;
  learningTip: string;
  parts: BoxPartSpec[];
  dimensionsCm: {
    width: number;
    height: number;
    depth: number;
  };
  /** 3D key vertices used to cast orthogonal projection rays onto PO, PV, PL */
  projectionVertices: Array<[number, number, number]>;
  /** Key Z-depths from PV used to draw compass ribaltamento arcs in quadrant 4 */
  ribaltamentoDepths: number[];
  /** Key X coordinates (negative) used to draw vertical construction lines between PO and PV */
  constructionXs: number[];
  /** Key Y heights (positive) used to draw horizontal construction lines between PV and PL */
  constructionYs: number[];
  projections: {
    PV: PlaneProjection2D;
    PO: PlaneProjection2D;
    PL: PlaneProjection2D;
  };
}

export interface MatchChallengeItem {
  id: string;
  title: string;
  prompt: string;
  solidId: string;
  targetPlane: PlaneKey;
  options: Array<{
    id: string;
    label: string;
    projection: PlaneProjection2D;
    isCorrect: boolean;
    feedback: string;
  }>;
}

export interface GridPuzzle {
  id: string;
  title: string;
  difficulty: 'Base' | 'Intermedio' | 'Avanzato';
  hint: string;
  gridSize: number; // e.g. 4 means 4x4 cells per quadrant
  /** Cells filled in PV [col, row] where col 0..gridSize-1 left->right, row 0..gridSize-1 bottom->top */
  pvCells: Array<[number, number]>;
  /** Cells filled in PO [col, row] where col 0..gridSize-1 left->right, row 0..gridSize-1 top(near LT)->bottom */
  poCells: Array<[number, number]>;
  /** Expected cells in PL [col, row] where col 0..gridSize-1 left(near axis)->right, row 0..gridSize-1 bottom->top */
  expectedPlCells: Array<[number, number]>;
  /** Optional 3D solid blocks on the gridSize x gridSize x gridSize voxel space for 3D preview */
  voxels: Array<[number, number, number]>;
}
