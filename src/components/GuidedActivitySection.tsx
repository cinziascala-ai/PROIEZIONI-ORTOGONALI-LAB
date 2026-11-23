import React, { useMemo, useState } from 'react';
import { CheckCircle2, Box, Scissors, Layers, RotateCcw, HelpCircle } from 'lucide-react';
import { SOLIDS } from '../data/solids';
import { MongeSheet2D } from './MongeSheet2D';
import { GameObject3DViewer } from './GameObject3DViewer';

type MaterialTab = 'blocchi' | 'cartoncino' | 'plastilina';

interface GuidedStep {
  step: number;
  title: string;
  axisHighlight: 'all' | 'width' | 'depth' | 'height';
  planeTag: string;
  explanation: string;
  measureTip: string;
}

const GUIDED_STEPS: GuidedStep[] = [
  {
    step: 1,
    title: 'Passo 1 · Misura la base sul PO (Vista dall’Alto)',
    axisHighlight: 'width',
    planeTag: 'PO · Piano Orizzontale',
    explanation:
      'Parti sempre dalla pianta (PO): guarda quanto spazio occupa l’oggetto appoggiato sul tavolo. Leggi la Larghezza (L = 2,6 cm) e la Profondità (P = 2,0 cm). La linea orizzontale al centro ti avvisa che in alto c’è uno spigolo che divide il tetto a metà.',
    measureTip: 'Dimensioni base lette dal PO: 2,6 cm × 2,0 cm (oppure in scala 2:1 sul banco: 5,2 cm × 4,0 cm).',
  },
  {
    step: 2,
    title: 'Passo 2 · Leggi le altezze sul PV (Vista Frontale)',
    axisHighlight: 'height',
    planeTag: 'PV · Piano Verticale',
    explanation:
      'Spostati in verticale sopra al PO per leggere il Prospetto (PV). Da qui scopri le altezze: i muri laterali salgono fino a 1,4 cm, mentre la punta del tetto arriva a 2,4 cm. Al centro noti anche il portale rettangolare alto 0,8 cm.',
    measureTip: 'Altezza muri: 1,4 cm · Altezza totale al colmo: 2,4 cm.',
  },
  {
    step: 3,
    title: 'Passo 3 · Scopri il profilo reale sul PL (Vista Laterale)',
    axisHighlight: 'depth',
    planeTag: 'PL · Piano Laterale',
    explanation:
      'Adesso guarda il Piano Laterale (PL): ecco la scoperta fondamentale! Quel rettangolo in alto su PV e PO non è un parallelepipedo piatto, ma un tetto triangolare a due falde inclinate. Senza il PL avresti costruito un tetto sbagliato!',
    measureTip: 'Il colmo cade esattamente a metà profondità (1,0 cm dal bordo anteriore).',
  },
  {
    step: 4,
    title: 'Passo 4 · Passa al modello fisico 3D',
    axisHighlight: 'all',
    planeTag: 'Costruzione Reale',
    explanation:
      'Ora che conosci tutte e tre le dimensioni (Larghezza, Profondità, Altezza) e la forma di ogni faccia, costruisci il volume in due parti: prima il corpo murario inferiore (parallelepipedo) e poi il tetto a prisma triangolare sopra.',
    measureTip: 'Usa le quote come controllo finale con il righello sul modello costruito.',
  },
];

interface PracticalTask {
  id: string;
  name: string;
  subtitle: string;
  gridSize: number; // 3x3 base, max height 3
  targetHeights: number[][]; // [row (0=back near PV, 2=front)][col (0=left, 2=right)]
  hint: string;
}

const PRACTICAL_TASKS: PracticalTask[] = [
  {
    id: 'mobiletto',
    name: 'Mobiletto a L con Alzata',
    subtitle: 'Costruisci un piccolo mobiletto con piano basso davanti e colonna alta dietro a sinistra.',
    gridSize: 3,
    // Row 0 = back (near PV), Row 2 = front
    targetHeights: [
      [3, 2, 1],
      [2, 1, 1],
      [1, 0, 0],
    ],
    hint: 'Sul PO vedi quali caselle hanno almeno 1 blocco. Sul PV vedi la colonna più alta a sinistra (3 piani), poi 2 e 1. Sul PL vedi scendere l’altezza da dietro (3) verso davanti (1).',
  },
  {
    id: 'podio',
    name: 'Podio Simmetrico a Gradoni',
    subtitle: 'Un podio a tre livelli dove il blocco centrale è il più alto e i fianchi scendono.',
    gridSize: 3,
    targetHeights: [
      [1, 2, 1],
      [1, 3, 1],
      [0, 1, 0],
    ],
    hint: 'Guarda la simmetria nel PV (1 - 3 - 1) e osserva nel PO che davanti sporge solo il gradino centrale!',
  },
];

const MATERIAL_INSTRUCTIONS: Record<
  MaterialTab,
  {
    title: string;
    tools: string;
    steps: string[];
  }
> = {
  blocchi: {
    title: 'Con Blocchi da Costruzione (Cubetti o Mattoncini)',
    tools: '12–15 cubetti uguali (es. lato 2 cm) o mattoncini modulari quadrati',
    steps: [
      'Considera 1 quadrato della griglia = 1 cubetto di base (scala 1 blocchetto = 2 cm).',
      'Parti dal Piano Orizzontale (PO): appoggia sul tavolo il primo strato di cubetti nelle sole caselle colorate.',
      'Guarda il PV e il PL per sapere quanti cubetti impilare sopra ogni casella (1, 2 o 3 piani).',
      'Verifica il risultato: guarda il tuo modello esattamente dall’alto, da davanti e da sinistra per controllare che combaci con le 3 viste!',
    ],
  },
  cartoncino: {
    title: 'Con Cartoncino, Forbici e Colla',
    tools: 'Cartoncino rigido (200 g/m²), righello, matita, forbici e nastro carta/colla',
    steps: [
      'Scegli una scala comoda sul banco (es. 1 unità della griglia = 3 cm sul righello).',
      'Disegna la sagoma di base dal PO sul cartoncino e ritagliala come pavimento del mobiletto.',
      'Ricava le facce verticali leggendo le altezze esatte dal PV (larghezza × altezza) e dal PL (profondità × altezza).',
      'Lascia delle alette da 1 cm sui bordi, piega gli spigoli lungo il righello e incolla le pareti formando il solido chiuso.',
    ],
  },
  plastilina: {
    title: 'Con Plastilina o Pasta Modellabile',
    tools: 'Plastilina o Das, righello di plastica e stecca piatta per tagliare dritto',
    steps: [
      'Modella prima un parallelepipedo unico che contenga l’ingombro massimo letto sulle tre viste (3×3×3 unità).',
      'Controlla le misure con il righello prima di tagliare: larghezza dal PO, altezza dal PV, profondità dal PL.',
      'Asporta a fette dritte le parti vuote leggendo prima il profilo del PV e poi quello del PL.',
      'Appoggia il modello su un foglio su cui hai disegnato i 3 assi e verifica che ogni faccia rispetti le proiezioni!',
    ],
  },
};

function computeViewsFromHeights(heights: number[][]) {
  const n = heights.length;
  // PO: boolean [row][col] (row 0 = back near LT, row n-1 = front)
  const po = heights.map((r) => r.map((h) => h > 0));
  // PV: [y from bottom 0..n-1][col 0..n-1] -> max height in that column across all rows
  const pv: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));
  for (let col = 0; col < n; col++) {
    let maxH = 0;
    for (let row = 0; row < n; row++) maxH = Math.max(maxH, heights[row][col]);
    for (let y = 0; y < maxH; y++) pv[y][col] = true;
  }
  // PL: [y from bottom 0..n-1][row 0..n-1] -> max height in that row across all cols
  const pl: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));
  for (let row = 0; row < n; row++) {
    let maxH = 0;
    for (let col = 0; col < n; col++) maxH = Math.max(maxH, heights[row][col]);
    for (let y = 0; y < maxH; y++) pl[y][row] = true;
  }
  return { po, pv, pl };
}

export const GuidedActivitySection: React.FC = () => {
  const casetta = SOLIDS[2]; // casetta a capanna
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeTaskIdx, setActiveTaskIdx] = useState<number>(0);
  const [activeMaterial, setActiveMaterial] = useState<MaterialTab>('blocchi');
  const [studentHeights, setStudentHeights] = useState<number[][]>([
    [1, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ]);
  const [checkedResult, setCheckedResult] = useState<'idle' | 'success' | 'retry'>('idle');
  const [showTaskHint, setShowTaskHint] = useState(false);

  const stepInfo = GUIDED_STEPS.find((s) => s.step === activeStep) ?? GUIDED_STEPS[0];
  const task = PRACTICAL_TASKS[activeTaskIdx];

  const targetViews = useMemo(() => computeViewsFromHeights(task.targetHeights), [task]);
  const studentViews = useMemo(() => computeViewsFromHeights(studentHeights), [studentHeights]);

  const handleCellClick = (row: number, col: number) => {
    setCheckedResult('idle');
    setStudentHeights((prev) =>
      prev.map((r, rIdx) =>
        r.map((val, cIdx) => (rIdx === row && cIdx === col ? (val + 1) % 4 : val)),
      ),
    );
  };

  const handleVerifyBuild = () => {
    const pvMatch = JSON.stringify(targetViews.pv) === JSON.stringify(studentViews.pv);
    const poMatch = JSON.stringify(targetViews.po) === JSON.stringify(studentViews.po);
    const plMatch = JSON.stringify(targetViews.pl) === JSON.stringify(studentViews.pl);
    setCheckedResult(pvMatch && poMatch && plMatch ? 'success' : 'retry');
  };

  const handleSwitchTask = (idx: number) => {
    setActiveTaskIdx(idx);
    setStudentHeights([
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
    ]);
    setCheckedResult('idle');
    setShowTaskHint(false);
  };

  // Isometric SVG block stack renderer for studentHeights
  const isoBlocks = useMemo(() => {
    const blocks: Array<{ row: number; col: number; y: number; key: string }> = [];
    // Painter's order: back-to-front (row 0 -> 2), left-to-right (col 0 -> 2), bottom-to-top
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const h = studentHeights[row][col];
        for (let y = 0; y < h; y++) {
          blocks.push({ row, col, y, key: `${row}-${col}-${y}` });
        }
      }
    }
    return blocks;
  }, [studentHeights]);

  // Isometric projection helpers
  const isoOriginX = 165;
  const isoOriginY = 185;
  const dx = 28;
  const dy = 15;
  const dz = 28;

  const toIso = (col: number, row: number, y: number) => ({
    x: isoOriginX + (col - row) * dx,
    y: isoOriginY + (col + row) * dy - y * dz,
  });

  const renderCubeFaces = (col: number, row: number, y: number) => {
    // Unit cube spanning [col..col+1], [row..row+1], [y..y+1]
    const p001 = toIso(col, row, y + 1);
    const p101 = toIso(col + 1, row, y + 1);
    const p111 = toIso(col + 1, row + 1, y + 1);
    const p011 = toIso(col, row + 1, y + 1);
    const p100 = toIso(col + 1, row, y);
    const p110 = toIso(col + 1, row + 1, y);
    const p010 = toIso(col, row + 1, y);

    return (
      <g key={`${row}-${col}-${y}`}>
        {/* Top face */}
        <polygon
          points={`${p001.x},${p001.y} ${p101.x},${p101.y} ${p111.x},${p111.y} ${p011.x},${p011.y}`}
          fill="#E0F2FE"
          stroke="#0F172A"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        {/* Left-front face (facing row+) */}
        <polygon
          points={`${p011.x},${p011.y} ${p111.x},${p111.y} ${p110.x},${p110.y} ${p010.x},${p010.y}`}
          fill="#BAE6FD"
          stroke="#0F172A"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
        {/* Right-front face (facing col+) */}
        <polygon
          points={`${p101.x},${p101.y} ${p111.x},${p111.y} ${p110.x},${p110.y} ${p100.x},${p100.y}`}
          fill="#7DD3FC"
          stroke="#0F172A"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
      </g>
    );
  };

  const matInfo = MATERIAL_INSTRUCTIONS[activeMaterial];

  return (
    <section id="esempio-guidato" className="py-14 border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <div className="max-w-2xl mb-10">
          <p className="text-xs font-medium text-emerald-700 mb-2">
            Obiettivo 3 · Saperle rappresentare e utilizzare
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight text-balance">
            Attività Pratica: dalle 3 viste 2D al modello 3D reale
          </h2>
          <p className="text-sm md:text-base text-slate-600 mt-2">
            Impara prima con l’esempio guidato della Casetta Stilizzata, poi costruisci tu il Mobiletto leggendo le proiezioni ortogonali.
          </p>
        </div>

        {/* PART 1: GUIDED EXAMPLE */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                1. Esempio Guidato: come si legge la “Casetta Stilizzata”
              </h3>
              <p className="text-sm text-slate-600">
                Clicca i 4 passaggi per illuminare le misure sul foglio e capire cosa rivela ciascuna vista.
              </p>
            </div>
            <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-lg self-start">
              {GUIDED_STEPS.map((s) => (
                <button
                  key={s.step}
                  type="button"
                  onClick={() => setActiveStep(s.step)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeStep === s.step
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  Passo {s.step}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 flex flex-col gap-5">
              <MongeSheet2D
                solid={casetta}
                showDimensions={true}
                showConstruction={true}
                highlightAxis={stepInfo.axisHighlight}
              />
            </div>

            <div className="lg:col-span-6 flex flex-col gap-5">
              {/* Rotatable 3D Overview of the Casetta */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <h4 className="text-sm font-bold text-slate-900">
                    Vista d’insieme 3D della Casetta
                  </h4>
                  <span className="text-xs text-slate-500">
                    Trascina per ruotare
                  </span>
                </div>
                <GameObject3DViewer solid={casetta} className="!h-[250px]" />
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <p className="text-xs font-semibold text-sky-700 mb-1">{stepInfo.planeTag}</p>
                <h4 className="text-lg font-bold text-slate-900 mb-2">{stepInfo.title}</h4>
                <p className="text-sm text-slate-700 leading-relaxed mb-4">{stepInfo.explanation}</p>
                <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs font-mono text-slate-800">
                  {stepInfo.measureTip}
                </div>
              </div>

              {/* Mini dimension decoder summary */}
              <div className="grid grid-cols-3 gap-3">
                <div
                  className={`p-3.5 rounded-lg border transition-colors ${
                    stepInfo.axisHighlight === 'width'
                      ? 'bg-sky-50 border-sky-300'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold text-sky-700 mb-1">PO (Alto)</div>
                  <div className="text-xs text-slate-700">Larghezza e Profondità</div>
                </div>
                <div
                  className={`p-3.5 rounded-lg border transition-colors ${
                    stepInfo.axisHighlight === 'height'
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold text-emerald-700 mb-1">PV (Fronte)</div>
                  <div className="text-xs text-slate-700">Larghezza e Altezza</div>
                </div>
                <div
                  className={`p-3.5 rounded-lg border transition-colors ${
                    stepInfo.axisHighlight === 'depth'
                      ? 'bg-amber-50 border-amber-300'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold text-amber-700 mb-1">PL (Fianco)</div>
                  <div className="text-xs text-slate-700">Profondità e Altezza</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  disabled={activeStep === 1}
                  onClick={() => setActiveStep((p) => Math.max(1, p - 1))}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
                >
                  Precedente
                </button>
                <button
                  type="button"
                  onClick={() => setActiveStep((p) => (p < 4 ? p + 1 : 1))}
                  className="px-4 py-2 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 cursor-pointer"
                >
                  {activeStep < 4 ? 'Prossimo Passo' : 'Ricomincia Esempio'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PART 2: PRACTICAL HANDS-ON BUILD + INTERACTIVE 3D BLOCK BUILDER */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-200">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                2. Sfida Pratica: costruisci il modello 3D dalle sue proiezioni
              </h3>
              <p className="text-sm text-slate-600">
                Leggi le tre viste qui sotto, impila i blocchetti cliccando sulle caselle (o realizzalo sul banco con cartoncino o plastilina).
              </p>
            </div>
            <div className="flex items-center gap-1 bg-white border border-slate-200 p-1 rounded-lg self-start">
              {PRACTICAL_TASKS.map((t, idx) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleSwitchTask(idx)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeTaskIdx === idx
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
            {/* Left: Target 3 Orthogonal Views (PO, PV, PL) */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900">Proiezioni da realizzare: {task.name}</h4>
                  <p className="text-xs text-slate-600">{task.subtitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTaskHint((v) => !v)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  Suggerimento
                </button>
              </div>

              {showTaskHint && (
                <div className="mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  {task.hint}
                </div>
              )}

              {/* 4-Quadrant Target Grid */}
              <div className="grid grid-cols-2 gap-4 max-w-[380px] mx-auto py-2">
                {/* PV Top-Left */}
                <div className="border-r-2 border-b-2 border-slate-900 pr-3 pb-3">
                  <div className="text-[11px] font-bold text-emerald-700 mb-1.5">PV · Frontale</div>
                  <div className="grid grid-cols-3 gap-1">
                    {[2, 1, 0].map((y) =>
                      [0, 1, 2].map((col) => (
                        <div
                          key={`pv-${y}-${col}`}
                          className={`aspect-square rounded-sm border ${
                            targetViews.pv[y][col]
                              ? 'bg-emerald-300 border-slate-800'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        />
                      )),
                    )}
                  </div>
                </div>

                {/* PL Top-Right */}
                <div className="border-b-2 border-slate-900 pl-3 pb-3">
                  <div className="text-[11px] font-bold text-amber-700 mb-1.5">PL · Da Sinistra</div>
                  <div className="grid grid-cols-3 gap-1">
                    {[2, 1, 0].map((y) =>
                      [0, 1, 2].map((row) => (
                        <div
                          key={`pl-${y}-${row}`}
                          className={`aspect-square rounded-sm border ${
                            targetViews.pl[y][row]
                              ? 'bg-amber-300 border-slate-800'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        />
                      )),
                    )}
                  </div>
                </div>

                {/* PO Bottom-Left */}
                <div className="border-r-2 border-slate-900 pr-3 pt-3">
                  <div className="grid grid-cols-3 gap-1 mb-1.5">
                    {[0, 1, 2].map((row) =>
                      [0, 1, 2].map((col) => (
                        <div
                          key={`po-${row}-${col}`}
                          className={`aspect-square rounded-sm border ${
                            targetViews.po[row][col]
                              ? 'bg-sky-300 border-slate-800'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        />
                      )),
                    )}
                  </div>
                  <div className="text-[11px] font-bold text-sky-700">PO · Dall’Alto</div>
                </div>

                {/* Ribaltamento Quadrant */}
                <div className="pl-3 pt-3 flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full max-w-[110px]">
                    <path d="M 0 22 A 22 22 0 0 0 22 0" fill="none" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="1.5" />
                    <path d="M 0 54 A 54 54 0 0 0 54 0" fill="none" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="1.5" />
                    <path d="M 0 86 A 86 86 0 0 0 86 0" fill="none" stroke="#CBD5E1" strokeDasharray="3 3" strokeWidth="1.5" />
                    <text x="12" y="94" className="fill-slate-400 text-[9px] font-mono">
                      1 blocco = 2 cm
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            {/* Right: Interactive 3D Block Builder */}
            <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h4 className="text-base font-bold text-slate-900">Costruttore 3D Virtuale</h4>
                <button
                  type="button"
                  onClick={() => {
                    setStudentHeights([
                      [0, 0, 0],
                      [0, 0, 0],
                      [0, 0, 0],
                    ]);
                    setCheckedResult('idle');
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Svuota Base
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                {/* Clickable 3x3 height matrix */}
                <div>
                  <p className="text-xs text-slate-600 mb-2">
                    Clicca su una casella della base (PO) per alzare la pila (0 → 1 → 2 → 3 blocchi):
                  </p>
                  <div className="grid grid-cols-3 gap-2 max-w-[200px]">
                    {studentHeights.map((rowArr, rIdx) =>
                      rowArr.map((h, cIdx) => (
                        <button
                          key={`cell-${rIdx}-${cIdx}`}
                          type="button"
                          onClick={() => handleCellClick(rIdx, cIdx)}
                          className={`aspect-square rounded-lg border text-sm font-mono font-bold tabular-nums transition-colors cursor-pointer ${
                            h === 0
                              ? 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100'
                              : h === 1
                              ? 'bg-sky-100 border-sky-300 text-sky-900'
                              : h === 2
                              ? 'bg-sky-300 border-sky-500 text-slate-900'
                              : 'bg-sky-600 border-sky-800 text-white'
                          }`}
                          aria-label={`Riga ${rIdx + 1}, Colonna ${cIdx + 1}: altezza ${h}`}
                        >
                          {h}
                        </button>
                      )),
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    Alto = vicino al PV · Basso = lato frontale
                  </p>
                </div>

                {/* Live Isometric Preview of Built Blocks */}
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2">
                  <svg viewBox="0 0 330 280" className="w-full h-auto">
                    {/* Baseplate grid */}
                    {[0, 1, 2].map((r) =>
                      [0, 1, 2].map((c) => {
                        const a = toIso(c, r, 0);
                        const b = toIso(c + 1, r, 0);
                        const d = toIso(c + 1, r + 1, 0);
                        const e = toIso(c, r + 1, 0);
                        return (
                          <polygon
                            key={`base-${r}-${c}`}
                            points={`${a.x},${a.y} ${b.x},${b.y} ${d.x},${d.y} ${e.x},${e.y}`}
                            fill="#FFFFFF"
                            stroke="#CBD5E1"
                            strokeWidth="1"
                          />
                        );
                      }),
                    )}
                    {/* Stacked cubes in painter's order */}
                    {isoBlocks.map((b) => renderCubeFaces(b.col, b.row, b.y))}
                    <text x="165" y="266" textAnchor="middle" className="fill-slate-500 text-[11px]">
                      Il tuo modello 3D in assonometria
                    </text>
                  </svg>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleVerifyBuild}
                  className="px-4 py-2 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 cursor-pointer"
                >
                  Verifica il Modello 3D
                </button>

                {checkedResult === 'success' && (
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="w-4 h-4" />
                    Perfetto! Tutte e tre le viste coincidono al 100%!
                  </div>
                )}
                {checkedResult === 'retry' && (
                  <div className="text-xs font-semibold text-amber-700">
                    Non corrisponde ancora: confronta bene l’altezza di ogni fila tra PV e PL.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Physical Materials Switcher for the Desk Activity */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Costruiscilo sul banco: istruzioni per materiale
                </h4>
                <p className="text-xs text-slate-600">
                  Scegli il materiale disponibile in aula per trasformare le proiezioni in un oggetto fisico.
                </p>
              </div>
              <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
                <button
                  type="button"
                  onClick={() => setActiveMaterial('blocchi')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                    activeMaterial === 'blocchi' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Box className="w-3.5 h-3.5" />
                  Blocchi
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMaterial('cartoncino')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                    activeMaterial === 'cartoncino' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                  Cartoncino
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMaterial('plastilina')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer whitespace-nowrap shrink-0 ${
                    activeMaterial === 'plastilina' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  Plastilina
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="text-xs font-bold text-slate-900 mb-1">{matInfo.title}</div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Occorrente:</strong> {matInfo.tools}
                </p>
              </div>
              <ol className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                {matInfo.steps.map((st, idx) => (
                  <li key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 leading-relaxed">
                    <span className="font-mono font-bold text-sky-700 mr-1.5">0{idx + 1}.</span>
                    {st}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
