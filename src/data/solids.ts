import { GridPuzzle, MatchChallengeItem, SolidDefinition } from '../types/projection';

/**
 * Coordinate system in the Triedro (1 unit = 1 cm in student scale):
 * - Origin O = (0, 0, 0) is where LT and the vertical axis intersect.
 * - PV (Piano Verticale): lies on z = 0, x in [-4.5, 0], y in [0, 4.5] (Top-Left Quadrant).
 *   2D local coords on PV: u = x (negative), v = y (positive).
 * - PO (Piano Orizzontale): starts on y = 0, x in [-4.5, 0], z in [0, 4.5].
 *   Unfolds around LT (X-axis) by +90 deg -> moves (x, 0, z) to (x, -z, 0) (Bottom-Left Quadrant).
 *   2D local coords on PO: u = x (negative), v = z (positive, maps downward as -z).
 * - PL (Piano Laterale): starts on x = 0, y in [0, 4.5], z in [0, 4.5].
 *   Unfolds around vertical hinge (Y-axis) by +90 deg -> moves (0, y, z) to (+z, y, 0) (Top-Right Quadrant).
 *   2D local coords on PL: u = z (positive, maps rightward as +z), v = y (positive).
 */

export const SOLIDS: SolidDefinition[] = [
  {
    id: 'blocco-l',
    name: 'Blocco a L',
    level: 'Base',
    domainTag: 'Geometria Solida',
    description:
      'Un volume composto da una base larga e una torre posteriore più alta. Osserva come la forma a L appare solo sul Piano Laterale.',
    learningTip:
      'Dall’alto (PO) e di fronte (PV) vedi due rettangoli divisi da una linea di spigolo; solo di fianco (PL) riconosci il profilo a L!',
    dimensionsCm: { width: 2.4, height: 2.2, depth: 2.2 },
    parts: [
      {
        id: 'base',
        label: 'Base anteriore',
        xMin: -3.4,
        xMax: -1.0,
        yMin: 0.6,
        yMax: 1.7,
        zMin: 0.8,
        zMax: 3.0,
        color: '#E2C799',
        roughness: 0.68,
        metalness: 0.04,
      },
      {
        id: 'torre',
        label: 'Torre posteriore',
        xMin: -3.4,
        xMax: -1.0,
        yMin: 1.7,
        yMax: 2.8,
        zMin: 0.8,
        zMax: 1.9,
        color: '#C99E67',
        roughness: 0.52,
        metalness: 0.06,
      },
    ],
    projectionVertices: [
      [-3.4, 0.6, 3.0],
      [-1.0, 0.6, 3.0],
      [-3.4, 1.7, 3.0],
      [-1.0, 1.7, 3.0],
      [-3.4, 2.8, 1.9],
      [-1.0, 2.8, 1.9],
      [-3.4, 2.8, 0.8],
      [-1.0, 2.8, 0.8],
      [-1.0, 0.6, 0.8],
    ],
    ribaltamentoDepths: [0.8, 1.9, 3.0],
    constructionXs: [-3.4, -1.0],
    constructionYs: [0.6, 1.7, 2.8],
    projections: {
      PV: {
        polygons: [
          {
            fill: '#D1FAE5',
            points: [
              { u: -3.4, v: 0.6 },
              { u: -1.0, v: 0.6 },
              { u: -1.0, v: 1.7 },
              { u: -3.4, v: 1.7 },
            ],
          },
          {
            fill: '#A7F3D0',
            points: [
              { u: -3.4, v: 1.7 },
              { u: -1.0, v: 1.7 },
              { u: -1.0, v: 2.8 },
              { u: -3.4, v: 2.8 },
            ],
          },
        ],
        edges: [
          { from: { u: -3.4, v: 0.6 }, to: { u: -1.0, v: 0.6 } },
          { from: { u: -1.0, v: 0.6 }, to: { u: -1.0, v: 2.8 } },
          { from: { u: -1.0, v: 2.8 }, to: { u: -3.4, v: 2.8 } },
          { from: { u: -3.4, v: 2.8 }, to: { u: -3.4, v: 0.6 } },
          { from: { u: -3.4, v: 1.7 }, to: { u: -1.0, v: 1.7 } },
        ],
      },
      PO: {
        polygons: [
          {
            fill: '#BAE6FD',
            points: [
              { u: -3.4, v: 0.8 },
              { u: -1.0, v: 0.8 },
              { u: -1.0, v: 1.9 },
              { u: -3.4, v: 1.9 },
            ],
          },
          {
            fill: '#E0F2FE',
            points: [
              { u: -3.4, v: 1.9 },
              { u: -1.0, v: 1.9 },
              { u: -1.0, v: 3.0 },
              { u: -3.4, v: 3.0 },
            ],
          },
        ],
        edges: [
          { from: { u: -3.4, v: 0.8 }, to: { u: -1.0, v: 0.8 } },
          { from: { u: -1.0, v: 0.8 }, to: { u: -1.0, v: 3.0 } },
          { from: { u: -1.0, v: 3.0 }, to: { u: -3.4, v: 3.0 } },
          { from: { u: -3.4, v: 3.0 }, to: { u: -3.4, v: 0.8 } },
          { from: { u: -3.4, v: 1.9 }, to: { u: -1.0, v: 1.9 } },
        ],
      },
      PL: {
        polygons: [
          {
            fill: '#FDE68A',
            points: [
              { u: 0.8, v: 0.6 },
              { u: 3.0, v: 0.6 },
              { u: 3.0, v: 1.7 },
              { u: 1.9, v: 1.7 },
              { u: 1.9, v: 2.8 },
              { u: 0.8, v: 2.8 },
            ],
          },
        ],
        edges: [
          { from: { u: 0.8, v: 0.6 }, to: { u: 3.0, v: 0.6 } },
          { from: { u: 3.0, v: 0.6 }, to: { u: 3.0, v: 1.7 } },
          { from: { u: 3.0, v: 1.7 }, to: { u: 1.9, v: 1.7 } },
          { from: { u: 1.9, v: 1.7 }, to: { u: 1.9, v: 2.8 } },
          { from: { u: 1.9, v: 2.8 }, to: { u: 0.8, v: 2.8 } },
          { from: { u: 0.8, v: 2.8 }, to: { u: 0.8, v: 0.6 } },
        ],
      },
    },
  },
  {
    id: 'scala-3',
    name: 'Scala a 3 Gradini',
    level: 'Base',
    domainTag: 'Edilizia',
    description:
      'Tre gradini regolari che salgono dalla parte anteriore verso il Piano Verticale. Perfetta per seguire ogni gradino con le linee di proiezione.',
    learningTip:
      'Le linee orizzontali nel PV corrispondono esattamente alle altezze dei gradini nel PL, mentre le linee del PO si ribaltano con il compasso fino al PL!',
    dimensionsCm: { width: 2.4, height: 2.1, depth: 2.4 },
    parts: [
      {
        id: 'step-1',
        label: 'Primo gradino',
        xMin: -3.4,
        xMax: -1.0,
        yMin: 0.6,
        yMax: 1.3,
        zMin: 2.4,
        zMax: 3.2,
        color: '#E2E8F0',
        roughness: 0.72,
        metalness: 0.05,
      },
      {
        id: 'step-2',
        label: 'Secondo gradino',
        xMin: -3.4,
        xMax: -1.0,
        yMin: 0.6,
        yMax: 2.0,
        zMin: 1.6,
        zMax: 2.4,
        color: '#CBD5E1',
        roughness: 0.55,
        metalness: 0.08,
      },
      {
        id: 'step-3',
        label: 'Terzo gradino',
        xMin: -3.4,
        xMax: -1.0,
        yMin: 0.6,
        yMax: 2.7,
        zMin: 0.8,
        zMax: 1.6,
        color: '#94A3B8',
        roughness: 0.42,
        metalness: 0.14,
      },
    ],
    projectionVertices: [
      [-3.4, 0.6, 3.2],
      [-1.0, 0.6, 3.2],
      [-3.4, 1.3, 3.2],
      [-1.0, 1.3, 3.2],
      [-3.4, 2.0, 2.4],
      [-1.0, 2.0, 2.4],
      [-3.4, 2.7, 1.6],
      [-1.0, 2.7, 1.6],
      [-3.4, 2.7, 0.8],
      [-1.0, 2.7, 0.8],
    ],
    ribaltamentoDepths: [0.8, 1.6, 2.4, 3.2],
    constructionXs: [-3.4, -1.0],
    constructionYs: [0.6, 1.3, 2.0, 2.7],
    projections: {
      PV: {
        polygons: [
          {
            fill: '#D1FAE5',
            points: [
              { u: -3.4, v: 0.6 },
              { u: -1.0, v: 0.6 },
              { u: -1.0, v: 1.3 },
              { u: -3.4, v: 1.3 },
            ],
          },
          {
            fill: '#A7F3D0',
            points: [
              { u: -3.4, v: 1.3 },
              { u: -1.0, v: 1.3 },
              { u: -1.0, v: 2.0 },
              { u: -3.4, v: 2.0 },
            ],
          },
          {
            fill: '#6EE7B7',
            points: [
              { u: -3.4, v: 2.0 },
              { u: -1.0, v: 2.0 },
              { u: -1.0, v: 2.7 },
              { u: -3.4, v: 2.7 },
            ],
          },
        ],
        edges: [
          { from: { u: -3.4, v: 0.6 }, to: { u: -1.0, v: 0.6 } },
          { from: { u: -1.0, v: 0.6 }, to: { u: -1.0, v: 2.7 } },
          { from: { u: -1.0, v: 2.7 }, to: { u: -3.4, v: 2.7 } },
          { from: { u: -3.4, v: 2.7 }, to: { u: -3.4, v: 0.6 } },
          { from: { u: -3.4, v: 1.3 }, to: { u: -1.0, v: 1.3 } },
          { from: { u: -3.4, v: 2.0 }, to: { u: -1.0, v: 2.0 } },
        ],
      },
      PO: {
        polygons: [
          {
            fill: '#BAE6FD',
            points: [
              { u: -3.4, v: 0.8 },
              { u: -1.0, v: 0.8 },
              { u: -1.0, v: 1.6 },
              { u: -3.4, v: 1.6 },
            ],
          },
          {
            fill: '#E0F2FE',
            points: [
              { u: -3.4, v: 1.6 },
              { u: -1.0, v: 1.6 },
              { u: -1.0, v: 2.4 },
              { u: -3.4, v: 2.4 },
            ],
          },
          {
            fill: '#F0F9FF',
            points: [
              { u: -3.4, v: 2.4 },
              { u: -1.0, v: 2.4 },
              { u: -1.0, v: 3.2 },
              { u: -3.4, v: 3.2 },
            ],
          },
        ],
        edges: [
          { from: { u: -3.4, v: 0.8 }, to: { u: -1.0, v: 0.8 } },
          { from: { u: -1.0, v: 0.8 }, to: { u: -1.0, v: 3.2 } },
          { from: { u: -1.0, v: 3.2 }, to: { u: -3.4, v: 3.2 } },
          { from: { u: -3.4, v: 3.2 }, to: { u: -3.4, v: 0.8 } },
          { from: { u: -3.4, v: 1.6 }, to: { u: -1.0, v: 1.6 } },
          { from: { u: -3.4, v: 2.4 }, to: { u: -1.0, v: 2.4 } },
        ],
      },
      PL: {
        polygons: [
          {
            fill: '#FDE68A',
            points: [
              { u: 0.8, v: 0.6 },
              { u: 3.2, v: 0.6 },
              { u: 3.2, v: 1.3 },
              { u: 2.4, v: 1.3 },
              { u: 2.4, v: 2.0 },
              { u: 1.6, v: 2.0 },
              { u: 1.6, v: 2.7 },
              { u: 0.8, v: 2.7 },
            ],
          },
        ],
        edges: [
          { from: { u: 0.8, v: 0.6 }, to: { u: 3.2, v: 0.6 } },
          { from: { u: 3.2, v: 0.6 }, to: { u: 3.2, v: 1.3 } },
          { from: { u: 3.2, v: 1.3 }, to: { u: 2.4, v: 1.3 } },
          { from: { u: 2.4, v: 1.3 }, to: { u: 2.4, v: 2.0 } },
          { from: { u: 2.4, v: 2.0 }, to: { u: 1.6, v: 2.0 } },
          { from: { u: 1.6, v: 2.0 }, to: { u: 1.6, v: 2.7 } },
          { from: { u: 1.6, v: 2.7 }, to: { u: 0.8, v: 2.7 } },
          { from: { u: 0.8, v: 2.7 }, to: { u: 0.8, v: 0.6 } },
        ],
      },
    },
  },
  {
    id: 'casetta',
    name: 'Casetta a Capanna',
    level: 'Intermedio',
    domainTag: 'Architettura',
    description:
      'Modello classico da tavolo: corpo murario rettangolare e tetto a due falde inclinate con portale d’ingresso frontale.',
    learningTip:
      'Nota come il tetto inclinato sembri un rettangolo visto da davanti (PV) e dall’alto (PO), ma riveli il suo triangolo reale solo sul Piano Laterale!',
    dimensionsCm: { width: 2.6, height: 2.4, depth: 2.0 },
    parts: [
      {
        id: 'muri',
        label: 'Corpo murario',
        xMin: -3.6,
        xMax: -1.0,
        yMin: 0.6,
        yMax: 2.0,
        zMin: 1.0,
        zMax: 3.0,
        color: '#F1F5F9',
        roughness: 0.82,
        metalness: 0.02,
      },
      {
        id: 'tetto',
        label: 'Tetto a due falde',
        xMin: -3.6,
        xMax: -1.0,
        yMin: 2.0,
        yMax: 3.0,
        zMin: 1.0,
        zMax: 3.0,
        color: '#C27D5E',
        roughness: 0.56,
        metalness: 0.04,
        kind: 'gable',
      },
      {
        id: 'porta',
        label: 'Portale frontale',
        xMin: -2.6,
        xMax: -2.0,
        yMin: 0.6,
        yMax: 1.4,
        zMin: 2.98,
        zMax: 3.02,
        color: '#475569',
        roughness: 0.38,
        metalness: 0.25,
      },
    ],
    projectionVertices: [
      [-3.6, 0.6, 3.0],
      [-1.0, 0.6, 3.0],
      [-3.6, 2.0, 3.0],
      [-1.0, 2.0, 3.0],
      [-3.6, 3.0, 2.0],
      [-1.0, 3.0, 2.0],
      [-3.6, 2.0, 1.0],
      [-1.0, 2.0, 1.0],
    ],
    ribaltamentoDepths: [1.0, 2.0, 3.0],
    constructionXs: [-3.6, -2.6, -2.0, -1.0],
    constructionYs: [0.6, 1.4, 2.0, 3.0],
    projections: {
      PV: {
        polygons: [
          {
            fill: '#D1FAE5',
            points: [
              { u: -3.6, v: 0.6 },
              { u: -1.0, v: 0.6 },
              { u: -1.0, v: 2.0 },
              { u: -3.6, v: 2.0 },
            ],
          },
          {
            fill: '#A7F3D0',
            points: [
              { u: -3.6, v: 2.0 },
              { u: -1.0, v: 2.0 },
              { u: -1.0, v: 3.0 },
              { u: -3.6, v: 3.0 },
            ],
          },
          {
            fill: '#6EE7B7',
            points: [
              { u: -2.6, v: 0.6 },
              { u: -2.0, v: 0.6 },
              { u: -2.0, v: 1.4 },
              { u: -2.6, v: 1.4 },
            ],
          },
        ],
        edges: [
          { from: { u: -3.6, v: 0.6 }, to: { u: -1.0, v: 0.6 } },
          { from: { u: -1.0, v: 0.6 }, to: { u: -1.0, v: 3.0 } },
          { from: { u: -1.0, v: 3.0 }, to: { u: -3.6, v: 3.0 } },
          { from: { u: -3.6, v: 3.0 }, to: { u: -3.6, v: 0.6 } },
          { from: { u: -3.6, v: 2.0 }, to: { u: -1.0, v: 2.0 } },
          { from: { u: -2.6, v: 0.6 }, to: { u: -2.6, v: 1.4 } },
          { from: { u: -2.6, v: 1.4 }, to: { u: -2.0, v: 1.4 } },
          { from: { u: -2.0, v: 1.4 }, to: { u: -2.0, v: 0.6 } },
        ],
      },
      PO: {
        polygons: [
          {
            fill: '#BAE6FD',
            points: [
              { u: -3.6, v: 1.0 },
              { u: -1.0, v: 1.0 },
              { u: -1.0, v: 2.0 },
              { u: -3.6, v: 2.0 },
            ],
          },
          {
            fill: '#E0F2FE',
            points: [
              { u: -3.6, v: 2.0 },
              { u: -1.0, v: 2.0 },
              { u: -1.0, v: 3.0 },
              { u: -3.6, v: 3.0 },
            ],
          },
        ],
        edges: [
          { from: { u: -3.6, v: 1.0 }, to: { u: -1.0, v: 1.0 } },
          { from: { u: -1.0, v: 1.0 }, to: { u: -1.0, v: 3.0 } },
          { from: { u: -1.0, v: 3.0 }, to: { u: -3.6, v: 3.0 } },
          { from: { u: -3.6, v: 3.0 }, to: { u: -3.6, v: 1.0 } },
          { from: { u: -3.6, v: 2.0 }, to: { u: -1.0, v: 2.0 } },
        ],
      },
      PL: {
        polygons: [
          {
            fill: '#FDE68A',
            points: [
              { u: 1.0, v: 0.6 },
              { u: 3.0, v: 0.6 },
              { u: 3.0, v: 2.0 },
              { u: 2.0, v: 3.0 },
              { u: 1.0, v: 2.0 },
            ],
          },
        ],
        edges: [
          { from: { u: 1.0, v: 0.6 }, to: { u: 3.0, v: 0.6 } },
          { from: { u: 3.0, v: 0.6 }, to: { u: 3.0, v: 2.0 } },
          { from: { u: 3.0, v: 2.0 }, to: { u: 2.0, v: 3.0 } },
          { from: { u: 2.0, v: 3.0 }, to: { u: 1.0, v: 2.0 } },
          { from: { u: 1.0, v: 2.0 }, to: { u: 1.0, v: 0.6 } },
          { from: { u: 1.0, v: 2.0 }, to: { u: 3.0, v: 2.0 } },
        ],
      },
    },
  },
  {
    id: 'ponte',
    name: 'Portale con Spigoli Nascosti',
    level: 'Avanzato',
    domainTag: 'Ingegneria',
    description:
      'Un portale con passaggio passante al centro. Insegna a disegnare gli spigoli nascosti (linee tratteggiate) che non si vedono dall’esterno.',
    learningTip:
      'Quando osservi dall’alto (PO) o di lato (PL), il tunnel interno c’è ma è coperto dal materiale: si rappresenta con linee tratteggiate!',
    dimensionsCm: { width: 2.6, height: 2.4, depth: 1.8 },
    parts: [
      {
        id: 'pilastro-sx',
        label: 'Pilastro sinistro',
        xMin: -3.6,
        xMax: -2.8,
        yMin: 0.6,
        yMax: 2.2,
        zMin: 1.0,
        zMax: 2.8,
        color: '#CBD5E1',
        roughness: 0.62,
        metalness: 0.08,
      },
      {
        id: 'pilastro-dx',
        label: 'Pilastro destro',
        xMin: -1.8,
        xMax: -1.0,
        yMin: 0.6,
        yMax: 2.2,
        zMin: 1.0,
        zMax: 2.8,
        color: '#CBD5E1',
        roughness: 0.62,
        metalness: 0.08,
      },
      {
        id: 'architrave',
        label: 'Architrave superiore',
        xMin: -3.6,
        xMax: -1.0,
        yMin: 2.2,
        yMax: 3.0,
        zMin: 1.0,
        zMax: 2.8,
        color: '#64748B',
        roughness: 0.35,
        metalness: 0.35,
      },
    ],
    projectionVertices: [
      [-3.6, 0.6, 2.8],
      [-2.8, 0.6, 2.8],
      [-1.8, 0.6, 2.8],
      [-1.0, 0.6, 2.8],
      [-2.8, 2.2, 2.8],
      [-1.8, 2.2, 2.8],
      [-3.6, 3.0, 2.8],
      [-1.0, 3.0, 2.8],
      [-3.6, 3.0, 1.0],
      [-1.0, 3.0, 1.0],
    ],
    ribaltamentoDepths: [1.0, 2.8],
    constructionXs: [-3.6, -2.8, -1.8, -1.0],
    constructionYs: [0.6, 2.2, 3.0],
    projections: {
      PV: {
        polygons: [
          {
            fill: '#D1FAE5',
            points: [
              { u: -3.6, v: 0.6 },
              { u: -2.8, v: 0.6 },
              { u: -2.8, v: 2.2 },
              { u: -1.8, v: 2.2 },
              { u: -1.8, v: 0.6 },
              { u: -1.0, v: 0.6 },
              { u: -1.0, v: 3.0 },
              { u: -3.6, v: 3.0 },
            ],
          },
        ],
        edges: [
          { from: { u: -3.6, v: 0.6 }, to: { u: -2.8, v: 0.6 } },
          { from: { u: -2.8, v: 0.6 }, to: { u: -2.8, v: 2.2 } },
          { from: { u: -2.8, v: 2.2 }, to: { u: -1.8, v: 2.2 } },
          { from: { u: -1.8, v: 2.2 }, to: { u: -1.8, v: 0.6 } },
          { from: { u: -1.8, v: 0.6 }, to: { u: -1.0, v: 0.6 } },
          { from: { u: -1.0, v: 0.6 }, to: { u: -1.0, v: 3.0 } },
          { from: { u: -1.0, v: 3.0 }, to: { u: -3.6, v: 3.0 } },
          { from: { u: -3.6, v: 3.0 }, to: { u: -3.6, v: 0.6 } },
          { from: { u: -3.6, v: 2.2 }, to: { u: -2.8, v: 2.2 } },
          { from: { u: -1.8, v: 2.2 }, to: { u: -1.0, v: 2.2 } },
        ],
      },
      PO: {
        polygons: [
          {
            fill: '#BAE6FD',
            points: [
              { u: -3.6, v: 1.0 },
              { u: -1.0, v: 1.0 },
              { u: -1.0, v: 2.8 },
              { u: -3.6, v: 2.8 },
            ],
          },
        ],
        edges: [
          { from: { u: -3.6, v: 1.0 }, to: { u: -1.0, v: 1.0 } },
          { from: { u: -1.0, v: 1.0 }, to: { u: -1.0, v: 2.8 } },
          { from: { u: -1.0, v: 2.8 }, to: { u: -3.6, v: 2.8 } },
          { from: { u: -3.6, v: 2.8 }, to: { u: -3.6, v: 1.0 } },
          // Hidden walls of the central passage
          { from: { u: -2.8, v: 1.0 }, to: { u: -2.8, v: 2.8 }, dashed: true },
          { from: { u: -1.8, v: 1.0 }, to: { u: -1.8, v: 2.8 }, dashed: true },
        ],
      },
      PL: {
        polygons: [
          {
            fill: '#FDE68A',
            points: [
              { u: 1.0, v: 0.6 },
              { u: 2.8, v: 0.6 },
              { u: 2.8, v: 3.0 },
              { u: 1.0, v: 3.0 },
            ],
          },
        ],
        edges: [
          { from: { u: 1.0, v: 0.6 }, to: { u: 2.8, v: 0.6 } },
          { from: { u: 2.8, v: 0.6 }, to: { u: 2.8, v: 3.0 } },
          { from: { u: 2.8, v: 3.0 }, to: { u: 1.0, v: 3.0 } },
          { from: { u: 1.0, v: 3.0 }, to: { u: 1.0, v: 0.6 } },
          // Hidden lintel ceiling
          { from: { u: 1.0, v: 2.2 }, to: { u: 2.8, v: 2.2 }, dashed: true },
        ],
      },
    },
  },
  {
    id: 'supporto-t',
    name: 'Supporto Meccanico a T',
    level: 'Avanzato',
    domainTag: 'Design Industriale',
    description:
      'Componente meccanico a tre livelli: piastra di appoggio, colonna centrale più stretta e testa superiore sporgente.',
    learningTip:
      'Dall’alto (PO) la testa sporgente copre la colonna centrale, quindi il contorno della colonna va tratteggiato!',
    dimensionsCm: { width: 2.6, height: 2.4, depth: 2.2 },
    parts: [
      {
        id: 'piastra',
        label: 'Piastra di base',
        xMin: -3.6,
        xMax: -1.0,
        yMin: 0.6,
        yMax: 1.2,
        zMin: 0.9,
        zMax: 3.1,
        color: '#94A3B8',
        roughness: 0.48,
        metalness: 0.42,
      },
      {
        id: 'colonna',
        label: 'Nervatura centrale',
        xMin: -2.7,
        xMax: -1.9,
        yMin: 1.2,
        yMax: 2.3,
        zMin: 0.9,
        zMax: 2.3,
        color: '#475569',
        roughness: 0.32,
        metalness: 0.65,
      },
      {
        id: 'testa',
        label: 'Testa superiore',
        xMin: -3.1,
        xMax: -1.5,
        yMin: 2.3,
        yMax: 3.0,
        zMin: 0.9,
        zMax: 2.9,
        color: '#D97706',
        roughness: 0.4,
        metalness: 0.25,
      },
    ],
    projectionVertices: [
      [-3.6, 0.6, 3.1],
      [-1.0, 0.6, 3.1],
      [-3.1, 3.0, 2.9],
      [-1.5, 3.0, 2.9],
      [-2.7, 1.2, 2.3],
      [-1.9, 1.2, 2.3],
      [-3.1, 3.0, 0.9],
      [-1.5, 3.0, 0.9],
    ],
    ribaltamentoDepths: [0.9, 2.3, 2.9, 3.1],
    constructionXs: [-3.6, -3.1, -2.7, -1.9, -1.5, -1.0],
    constructionYs: [0.6, 1.2, 2.3, 3.0],
    projections: {
      PV: {
        polygons: [
          {
            fill: '#D1FAE5',
            points: [
              { u: -3.6, v: 0.6 },
              { u: -1.0, v: 0.6 },
              { u: -1.0, v: 1.2 },
              { u: -3.6, v: 1.2 },
            ],
          },
          {
            fill: '#6EE7B7',
            points: [
              { u: -2.7, v: 1.2 },
              { u: -1.9, v: 1.2 },
              { u: -1.9, v: 2.3 },
              { u: -2.7, v: 2.3 },
            ],
          },
          {
            fill: '#A7F3D0',
            points: [
              { u: -3.1, v: 2.3 },
              { u: -1.5, v: 2.3 },
              { u: -1.5, v: 3.0 },
              { u: -3.1, v: 3.0 },
            ],
          },
        ],
        edges: [
          { from: { u: -3.6, v: 0.6 }, to: { u: -1.0, v: 0.6 } },
          { from: { u: -1.0, v: 0.6 }, to: { u: -1.0, v: 1.2 } },
          { from: { u: -1.0, v: 1.2 }, to: { u: -3.6, v: 1.2 } },
          { from: { u: -3.6, v: 1.2 }, to: { u: -3.6, v: 0.6 } },
          { from: { u: -2.7, v: 1.2 }, to: { u: -2.7, v: 2.3 } },
          { from: { u: -1.9, v: 1.2 }, to: { u: -1.9, v: 2.3 } },
          { from: { u: -3.1, v: 2.3 }, to: { u: -1.5, v: 2.3 } },
          { from: { u: -1.5, v: 2.3 }, to: { u: -1.5, v: 3.0 } },
          { from: { u: -1.5, v: 3.0 }, to: { u: -3.1, v: 3.0 } },
          { from: { u: -3.1, v: 3.0 }, to: { u: -3.1, v: 2.3 } },
        ],
      },
      PO: {
        polygons: [
          {
            fill: '#E0F2FE',
            points: [
              { u: -3.6, v: 0.9 },
              { u: -1.0, v: 0.9 },
              { u: -1.0, v: 3.1 },
              { u: -3.6, v: 3.1 },
            ],
          },
          {
            fill: '#BAE6FD',
            points: [
              { u: -3.1, v: 0.9 },
              { u: -1.5, v: 0.9 },
              { u: -1.5, v: 2.9 },
              { u: -3.1, v: 2.9 },
            ],
          },
        ],
        edges: [
          { from: { u: -3.6, v: 0.9 }, to: { u: -1.0, v: 0.9 } },
          { from: { u: -1.0, v: 0.9 }, to: { u: -1.0, v: 3.1 } },
          { from: { u: -1.0, v: 3.1 }, to: { u: -3.6, v: 3.1 } },
          { from: { u: -3.6, v: 3.1 }, to: { u: -3.6, v: 0.9 } },
          { from: { u: -3.1, v: 0.9 }, to: { u: -3.1, v: 2.9 } },
          { from: { u: -3.1, v: 2.9 }, to: { u: -1.5, v: 2.9 } },
          { from: { u: -1.5, v: 2.9 }, to: { u: -1.5, v: 0.9 } },
          // Hidden stem edges under the top block
          { from: { u: -2.7, v: 0.9 }, to: { u: -2.7, v: 2.3 }, dashed: true },
          { from: { u: -1.9, v: 0.9 }, to: { u: -1.9, v: 2.3 }, dashed: true },
          { from: { u: -2.7, v: 2.3 }, to: { u: -1.9, v: 2.3 }, dashed: true },
        ],
      },
      PL: {
        polygons: [
          {
            fill: '#FEF3C7',
            points: [
              { u: 0.9, v: 0.6 },
              { u: 3.1, v: 0.6 },
              { u: 3.1, v: 1.2 },
              { u: 0.9, v: 1.2 },
            ],
          },
          {
            fill: '#FCD34D',
            points: [
              { u: 0.9, v: 1.2 },
              { u: 2.3, v: 1.2 },
              { u: 2.3, v: 2.3 },
              { u: 0.9, v: 2.3 },
            ],
          },
          {
            fill: '#FDE68A',
            points: [
              { u: 0.9, v: 2.3 },
              { u: 2.9, v: 2.3 },
              { u: 2.9, v: 3.0 },
              { u: 0.9, v: 3.0 },
            ],
          },
        ],
        edges: [
          { from: { u: 0.9, v: 0.6 }, to: { u: 3.1, v: 0.6 } },
          { from: { u: 3.1, v: 0.6 }, to: { u: 3.1, v: 1.2 } },
          { from: { u: 3.1, v: 1.2 }, to: { u: 0.9, v: 1.2 } },
          { from: { u: 0.9, v: 1.2 }, to: { u: 0.9, v: 0.6 } },
          { from: { u: 0.9, v: 1.2 }, to: { u: 0.9, v: 2.3 } },
          { from: { u: 2.3, v: 1.2 }, to: { u: 2.3, v: 2.3 } },
          { from: { u: 0.9, v: 2.3 }, to: { u: 2.9, v: 2.3 } },
          { from: { u: 2.9, v: 2.3 }, to: { u: 2.9, v: 3.0 } },
          { from: { u: 2.9, v: 3.0 }, to: { u: 0.9, v: 3.0 } },
          { from: { u: 0.9, v: 3.0 }, to: { u: 0.9, v: 2.3 } },
        ],
      },
    },
  },
];

export const MATCH_CHALLENGES: MatchChallengeItem[] = [
  {
    id: 'mc-1',
    title: 'Livello 1 · Il Blocco a L',
    prompt: 'Osservando il Blocco a L da sinistra verso destra (Piano Laterale PL), quale profilo disegni?',
    solidId: 'blocco-l',
    targetPlane: 'PL',
    options: [
      {
        id: 'opt-a',
        label: 'Rettangolo diviso a metà',
        projection: SOLIDS[0].projections.PV,
        isCorrect: false,
        feedback: 'Questo è il Prospetto (PV) guardando da davanti: si vede uno spigolo orizzontale ma non il profilo a L.',
      },
      {
        id: 'opt-b',
        label: 'Profilo a L',
        projection: SOLIDS[0].projections.PL,
        isCorrect: true,
        feedback: 'Esatto! Guardando da sinistra (PL), vedi la torre alta contro il PV a sinistra e il gradino basso verso davanti.',
      },
      {
        id: 'opt-c',
        label: 'L specchiata',
        projection: {
          polygons: [
            {
              fill: '#FDE68A',
              points: [
                { u: 0.8, v: 0.6 },
                { u: 3.0, v: 0.6 },
                { u: 3.0, v: 2.8 },
                { u: 1.9, v: 2.8 },
                { u: 1.9, v: 1.7 },
                { u: 0.8, v: 1.7 },
              ],
            },
          ],
          edges: [
            { from: { u: 0.8, v: 0.6 }, to: { u: 3.0, v: 0.6 } },
            { from: { u: 3.0, v: 0.6 }, to: { u: 3.0, v: 2.8 } },
            { from: { u: 3.0, v: 2.8 }, to: { u: 1.9, v: 2.8 } },
            { from: { u: 1.9, v: 2.8 }, to: { u: 1.9, v: 1.7 } },
            { from: { u: 1.9, v: 1.7 }, to: { u: 0.8, v: 1.7 } },
            { from: { u: 0.8, v: 1.7 }, to: { u: 0.8, v: 0.6 } },
          ],
        },
        isCorrect: false,
        feedback: 'Attenzione all’orientamento: la parte più alta tocca il fondo (vicino all’asse verticale), non il bordo anteriore!',
      },
    ],
  },
  {
    id: 'mc-2',
    title: 'Livello 2 · La Casetta a Capanna',
    prompt: 'Se guardi la casetta esattamente dall’alto (Piano Orizzontale PO), cosa vedi sul foglio?',
    solidId: 'casetta',
    targetPlane: 'PO',
    options: [
      {
        id: 'opt-a',
        label: 'Due falde rettangolari',
        projection: SOLIDS[2].projections.PO,
        isCorrect: true,
        feedback: 'Perfetto! Dall’alto vedi il colmo centrale (linea orizzontale) che divide le due falde inclinate del tetto.',
      },
      {
        id: 'opt-b',
        label: 'Pentagono con tetto a punta',
        projection: SOLIDS[2].projections.PL,
        isCorrect: false,
        feedback: 'Il profilo pentagonale si vede guardando di fianco (PL), non dall’alto!',
      },
      {
        id: 'opt-c',
        label: 'Rettangolo unico senza linea',
        projection: {
          polygons: [
            {
              fill: '#BAE6FD',
              points: [
                { u: -3.6, v: 1.0 },
                { u: -1.0, v: 1.0 },
                { u: -1.0, v: 3.0 },
                { u: -3.6, v: 3.0 },
              ],
            },
          ],
          edges: [
            { from: { u: -3.6, v: 1.0 }, to: { u: -1.0, v: 1.0 } },
            { from: { u: -1.0, v: 1.0 }, to: { u: -1.0, v: 3.0 } },
            { from: { u: -1.0, v: 3.0 }, to: { u: -3.6, v: 3.0 } },
            { from: { u: -3.6, v: 3.0 }, to: { u: -3.6, v: 1.0 } },
          ],
        },
        isCorrect: false,
        feedback: 'Manca lo spigolo del colmo del tetto! Ogni cambiamento di inclinazione genera una linea visibile.',
      },
    ],
  },
  {
    id: 'mc-3',
    title: 'Livello 3 · Il Portale e gli Spigoli Nascosti',
    prompt: 'Nel Portale, come rappresenti sul Piano Orizzontale (PO) i due pilastri che stanno sotto l’architrave?',
    solidId: 'ponte',
    targetPlane: 'PO',
    options: [
      {
        id: 'opt-a',
        label: 'Solo il rettangolo esterno',
        projection: {
          polygons: SOLIDS[3].projections.PO.polygons,
          edges: SOLIDS[3].projections.PO.edges.filter((e) => !e.dashed),
        },
        isCorrect: false,
        feedback: 'Quasi: manca qualcosa di importante! Nel disegno tecnico gli spigoli coperti non si ignorano.',
      },
      {
        id: 'opt-b',
        label: 'Rettangolo con due linee continue',
        projection: {
          polygons: SOLIDS[3].projections.PO.polygons,
          edges: SOLIDS[3].projections.PO.edges.map((e) => ({ ...e, dashed: false })),
        },
        isCorrect: false,
        feedback: 'Una linea continua indica uno spigolo visibile dall’alto, ma qui i pilastri sono coperti dall’architrave!',
      },
      {
        id: 'opt-c',
        label: 'Rettangolo con due linee tratteggiate',
        projection: SOLIDS[3].projections.PO,
        isCorrect: true,
        feedback: 'Bravissimo! Gli spigoli interni dei pilastri esistono sotto l’architrave e si indicano sempre con il tratteggio.',
      },
    ],
  },
  {
    id: 'mc-4',
    title: 'Livello 4 · Il Supporto Meccanico a T',
    prompt: 'Qual è la vista corretta sul Piano Verticale (PV, vista frontale) del Supporto Meccanico a T?',
    solidId: 'supporto-t',
    targetPlane: 'PV',
    options: [
      {
        id: 'opt-a',
        label: 'Profilo simmetrico a I / T',
        projection: SOLIDS[4].projections.PV,
        isCorrect: true,
        feedback: 'Centro pieno! Di fronte si distinguono chiaramente la base larga, la nervatura stretta e la testa superiore.',
      },
      {
        id: 'opt-b',
        label: 'Gradini asimmetrici',
        projection: SOLIDS[4].projections.PL,
        isCorrect: false,
        feedback: 'Questa è la vista laterale (PL), dove la nervatura e la testa allineano il lato sinistro vicino al PV.',
      },
      {
        id: 'opt-c',
        label: 'Rettangoli concentrici dall’alto',
        projection: SOLIDS[4].projections.PO,
        isCorrect: false,
        feedback: 'Questa è la pianta (PO): mostra la larghezza della base e della testa viste dall’alto.',
      },
    ],
  },
];

export const GRID_PUZZLES: GridPuzzle[] = [
  {
    id: 'gp-1',
    title: 'Puzzle 1 · Cubo a Gradino',
    difficulty: 'Base',
    hint: 'Segui le altezze dal PV verso destra e ribalta le profondità dal PO con gli archi di compasso!',
    gridSize: 4,
    // PV: col 0..3 (L->R), row 0..3 (bottom->top)
    pvCells: [
      [1, 0], [2, 0],
      [1, 1], [2, 1],
    ],
    // PO: col 0..3, row 0..3 (0 = near LT / back, 3 = far from LT / front)
    poCells: [
      [1, 1], [2, 1],
      [1, 2], [2, 2],
    ],
    // PL: col 0..3 (0 = near axis / back, 3 = right / front), row 0..3 (bottom->top)
    expectedPlCells: [
      [1, 0], [2, 0],
      [1, 1], [2, 1],
    ],
    voxels: [
      [1, 0, 1], [2, 0, 1], [1, 0, 2], [2, 0, 2],
      [1, 1, 1], [2, 1, 1], [1, 1, 2], [2, 1, 2],
    ],
  },
  {
    id: 'gp-2',
    title: 'Puzzle 2 · Blocco a L',
    difficulty: 'Base',
    hint: 'Sul PO la fila 1 ha un blocco alto (che nel PV arriva a riga 2) e la fila 2 arriva solo a riga 0.',
    gridSize: 4,
    pvCells: [
      [1, 0], [2, 0],
      [1, 1], [2, 1],
      [1, 2], [2, 2],
    ],
    poCells: [
      [1, 1], [2, 1],
      [1, 2], [2, 2],
    ],
    expectedPlCells: [
      [1, 0], [2, 0],
      [1, 1],
      [1, 2],
    ],
    voxels: [
      [1, 0, 1], [2, 0, 1], [1, 0, 2], [2, 0, 2],
      [1, 1, 1], [2, 1, 1],
      [1, 2, 1], [2, 2, 1],
    ],
  },
  {
    id: 'gp-3',
    title: 'Puzzle 3 · Torre d’Angolo',
    difficulty: 'Intermedio',
    hint: 'La base occupa 2×2 quadrati a terra (altezza 1), mentre la colonna sale fino al 3° livello solo nella fila posteriore.',
    gridSize: 4,
    pvCells: [
      [1, 0], [2, 0],
      [1, 1],
      [1, 2],
    ],
    poCells: [
      [1, 1], [2, 1],
      [1, 2], [2, 2],
    ],
    expectedPlCells: [
      [1, 0], [2, 0],
      [1, 1],
      [1, 2],
    ],
    voxels: [
      [1, 0, 1], [2, 0, 1], [1, 0, 2], [2, 0, 2],
      [1, 1, 1],
      [1, 2, 1],
    ],
  },
  {
    id: 'gp-4',
    title: 'Puzzle 4 · Ponte Asimmetrico',
    difficulty: 'Avanzato',
    hint: 'Osserva il vuoto al centro in PV e lo sbalzo verso il davanti nel PO: proietta ogni quota orizzontalmente!',
    gridSize: 4,
    pvCells: [
      [0, 0], [2, 0],
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ],
    poCells: [
      [0, 1], [1, 1], [2, 1],
      [0, 2], [1, 2], [2, 2],
    ],
    expectedPlCells: [
      [1, 0], [2, 0],
      [1, 1], [2, 1],
      [1, 2], [2, 2],
    ],
    voxels: [
      [0, 0, 1], [2, 0, 1], [0, 0, 2], [2, 0, 2],
      [0, 1, 1], [1, 1, 1], [2, 1, 1], [0, 1, 2], [1, 1, 2], [2, 1, 2],
      [0, 2, 1], [1, 2, 1], [2, 2, 1], [0, 2, 2], [1, 2, 2], [2, 2, 2],
    ],
  },
];
