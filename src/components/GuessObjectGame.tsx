import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, Eraser, Eye, EyeOff, Pencil, RotateCcw, Sparkles, XCircle } from 'lucide-react';
import { GAME_OBJECTS } from '../data/gameObjects';
import { PlaneKey } from '../types/projection';
import { MongeSheet2D } from './MongeSheet2D';
import { GameObject3DViewer } from './GameObject3DViewer';

export const GuessObjectGame: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [studentDescription, setStudentDescription] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [visiblePlanes, setVisiblePlanes] = useState<Record<PlaneKey, boolean>>({
    PV: false,
    PO: false,
    PL: false,
  });

  // Interactive 3D Sketchpad Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef(false);
  const [eraserMode, setEraserMode] = useState(false);

  const item = GAME_OBJECTS[currentIdx];

  const clearSketch = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Subtle isometric guide dots
    ctx.fillStyle = '#E2E8F0';
    for (let x = 20; x < canvas.width; x += 24) {
      for (let y = 20; y < canvas.height; y += 24) {
        ctx.fillRect(x, y, 2, 2);
      }
    }
  };

  useEffect(() => {
    clearSketch();
  }, [currentIdx]);

  const getPointerPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    isDrawingRef.current = true;
    const pos = getPointerPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = eraserMode ? '#FFFFFF' : '#0F172A';
    ctx.lineWidth = eraserMode ? 14 : 2.5;
    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPointerPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const handlePointerUp = () => {
    isDrawingRef.current = false;
  };

  const handleSelectObject = (idx: number) => {
    setCurrentIdx(idx);
    setSelectedOption(null);
    setStudentDescription('');
    setRevealed(false);
    setEraserMode(false);
    setVisiblePlanes({ PV: false, PO: false, PL: false });
  };

  const handleTogglePlane = (plane: PlaneKey) => {
    setVisiblePlanes((prev) => ({ ...prev, [plane]: !prev[plane] }));
  };

  const handleSetAllPlanes = (show: boolean) => {
    setVisiblePlanes({ PV: show, PO: show, PL: show });
  };

  const handleVerifyAndReveal = () => {
    setRevealed(true);
    setVisiblePlanes({ PV: true, PO: true, PL: true });
    if (selectedOption === item.correctOptionId && !solvedIds.includes(item.id)) {
      setSolvedIds((prev) => [...prev, item.id]);
    }
  };

  const isCorrect = selectedOption === item.correctOptionId;

  return (
    <section id="indovina-oggetto" className="py-14 border-b border-slate-200 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-amber-700 mb-2">
              Gioco Didattico · Relazione tra viste 2D e oggetto 3D
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight text-balance">
              Gioco: “Indovina l’Oggetto”
            </h2>
            <p className="text-sm md:text-base text-slate-600 mt-2">
              Osserva le tre proiezioni ortogonali di ciascun oggetto misterioso, disegna uno schizzo 3D o descrivilo a parole, poi svela il modello tridimensionale ruotabile!
            </p>
          </div>

          {/* Level selector & score */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-semibold text-slate-700 tabular-nums">
              Risolti: {solvedIds.length}/{GAME_OBJECTS.length}
            </span>
            <div className="inline-flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg">
              {GAME_OBJECTS.map((obj, idx) => {
                const done = solvedIds.includes(obj.id);
                return (
                  <button
                    key={obj.id}
                    type="button"
                    onClick={() => handleSelectObject(idx)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      currentIdx === idx
                        ? 'bg-slate-900 text-white'
                        : done
                        ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Oggetto {obj.order}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Game Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: The 3 Orthogonal Views of the Mystery Object */}
          <div className="lg:col-span-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-base font-bold text-slate-900">{item.clueTitle} · Le 3 Viste</h3>
              <span className="text-xs text-slate-500 font-mono">
                {item.solid.dimensionsCm.width.toFixed(1)} × {item.solid.dimensionsCm.depth.toFixed(1)} × {item.solid.dimensionsCm.height.toFixed(1)} cm
              </span>
            </div>

            {/* Selective Plane Reveal Bar */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-700 mr-1">Svela piani:</span>
                {(
                  [
                    { key: 'PV', label: 'PV · Frontale', activeClass: 'bg-emerald-600 text-white border-emerald-700' },
                    { key: 'PO', label: 'PO · Alto', activeClass: 'bg-sky-600 text-white border-sky-700' },
                    { key: 'PL', label: 'PL · Lato', activeClass: 'bg-amber-600 text-white border-amber-700' },
                  ] as Array<{ key: PlaneKey; label: string; activeClass: string }>
                ).map((p) => {
                  const isVis = visiblePlanes[p.key];
                  return (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => handleTogglePlane(p.key)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        isVis
                          ? p.activeClass
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {isVis ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {p.label}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleSetAllPlanes(true)}
                  className="px-2 py-1 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 cursor-pointer whitespace-nowrap"
                >
                  Mostra tutti
                </button>
                <span className="text-slate-300" aria-hidden="true">|</span>
                <button
                  type="button"
                  onClick={() => handleSetAllPlanes(false)}
                  className="px-2 py-1 rounded text-xs font-medium text-slate-500 hover:bg-slate-100 cursor-pointer whitespace-nowrap"
                >
                  Nascondi tutti
                </button>
              </div>
            </div>

            <MongeSheet2D
              solid={item.solid}
              showDimensions={true}
              showConstruction={true}
              showHidden={true}
              visiblePlanes={visiblePlanes}
              onTogglePlane={handleTogglePlane}
            />
            <p className="text-xs text-slate-600 mt-3 leading-relaxed">{item.descriptionPrompt}</p>
          </div>

          {/* Right: Draw 3D Sketch + Describe + Guess + Reveal 3D */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {!revealed ? (
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-5">
                {/* Step A: 3D Sketchpad */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-900">
                      1. Disegna lo schizzo 3D (facoltativo ma utile!)
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEraserMode(false)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium cursor-pointer ${
                          !eraserMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Pencil className="w-3 h-3" />
                        Matita
                      </button>
                      <button
                        type="button"
                        onClick={() => setEraserMode(true)}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium cursor-pointer ${
                          eraserMode ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Eraser className="w-3 h-3" />
                        Gomma
                      </button>
                      <button
                        type="button"
                        onClick={clearSketch}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-medium cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Pulisci
                      </button>
                    </div>
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={480}
                    height={190}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                    className="w-full h-[170px] border border-slate-200 rounded-lg bg-white touch-none cursor-crosshair"
                  />
                </div>

                {/* Step B: Describe in words */}
                <div>
                  <label htmlFor="desc-input" className="block text-xs font-bold text-slate-900 mb-1.5">
                    2. Descrivi com’è fatto questo oggetto in 3D:
                  </label>
                  <textarea
                    id="desc-input"
                    rows={2}
                    value={studentDescription}
                    onChange={(e) => setStudentDescription(e.target.value)}
                    placeholder="Es. Ha una base piatta, quattro sostegni agli angoli e..."
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
                  />
                </div>

                {/* Step C: Pick Hypothesis */}
                <div>
                  <div className="text-xs font-bold text-slate-900 mb-2">
                    3. Di quale oggetto si tratta?
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {item.options.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedOption(opt.id)}
                        className={`text-left px-3.5 py-2.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                          selectedOption === opt.id
                            ? 'bg-sky-50 border-sky-600 text-sky-900'
                            : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500">
                    Scegli un’ipotesi per svelare la soluzione 3D.
                  </span>
                  <button
                    type="button"
                    disabled={!selectedOption}
                    onClick={handleVerifyAndReveal}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Verifica e Svela il 3D
                  </button>
                </div>
              </div>
            ) : (
              /* REVEALED 3D SOLUTION PANEL */
              <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    )}
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        {isCorrect ? `Esatto! È ${item.objectName}` : `Soluzione: ${item.objectName}`}
                      </h4>
                      <p className="text-xs text-slate-600">
                        Ruota il modello 3D oppure clicca i tasti in basso per allinearlo a PV, PO e PL!
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRevealed(false)}
                    className="px-2.5 py-1 rounded border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer whitespace-nowrap"
                  >
                    Torna allo Schizzo
                  </button>
                </div>

                <GameObject3DViewer solid={item.solid} />

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-lg p-3.5">
                  {item.explanation3D}
                </p>

                {studentDescription.trim() && (
                  <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <span className="font-semibold text-slate-800">La tua descrizione:</span> “{studentDescription}”
                  </div>
                )}

                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">Domanda per la classe: </span>
                  {item.reflectionQuestions[0]}
                </div>

                <div className="flex items-center justify-end pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleSelectObject((currentIdx + 1) % GAME_OBJECTS.length)}
                    className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
                  >
                    {currentIdx < GAME_OBJECTS.length - 1 ? 'Prossimo Oggetto Misterioso' : 'Ricomincia da Oggetto 1'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
