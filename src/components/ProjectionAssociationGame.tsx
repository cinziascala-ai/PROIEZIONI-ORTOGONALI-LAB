import React, { useState } from 'react';
import { AlertTriangle, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { ASSOCIATION_EXERCISES } from '../data/exerciseAndAssociation';
import { AssociationOption, Point2D } from '../types/projection';
import { GameObject3DViewer } from './GameObject3DViewer';

interface MiniMongeOptionSvgProps {
  option: AssociationOption;
  exerciseId: string;
}

const MiniMongeOptionSvg: React.FC<MiniMongeOptionSvgProps> = ({ option, exerciseId }) => {
  const origin = 120;
  const scale = 23;
  const size = 240;

  const mapPV = (u: number, v: number) => ({ x: origin + u * scale, y: origin - v * scale });
  const mapPO = (u: number, v: number) => ({ x: origin + u * scale, y: origin + v * scale });
  const mapPL = (u: number, v: number) => ({ x: origin + u * scale, y: origin - v * scale });

  const polyPoints = (
    points: Point2D[],
    mapper: (u: number, v: number) => { x: number; y: number },
  ) =>
    points
      .map((p) => {
        const mapped = mapper(p.u, p.v);
        return `${mapped.x.toFixed(1)},${mapped.y.toFixed(1)}`;
      })
      .join(' ');

  const minX = Math.min(...option.constructionXs);
  const maxY = Math.max(...option.constructionYs);
  const maxZ = Math.max(...option.ribaltamentoDepths);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-full h-auto mx-auto select-none"
      role="img"
      aria-label={`${option.label} per esercizio ${exerciseId}`}
    >
      <rect x="0" y="0" width={size} height={size} fill="#FFFFFF" rx="6" />
      <rect x="8" y="8" width={origin - 8} height={origin - 8} fill="#ECFDF5" fillOpacity="0.32" />
      <rect x="8" y={origin} width={origin - 8} height={origin - 8} fill="#F0F9FF" fillOpacity="0.34" />
      <rect x={origin} y="8" width={origin - 8} height={origin - 8} fill="#FFFBEB" fillOpacity="0.34" />

      {/* Subtle continuous 2H construction lines */}
      <g stroke="#94A3B8" strokeWidth="0.7" opacity="0.55">
        {option.constructionXs.map((xVal) => (
          <line
            key={`x-${xVal}`}
            x1={origin + xVal * scale}
            y1={origin - maxY * scale}
            x2={origin + xVal * scale}
            y2={origin + maxZ * scale}
          />
        ))}
        {option.constructionYs.map((yVal) => (
          <line
            key={`y-${yVal}`}
            x1={origin + minX * scale}
            y1={origin - yVal * scale}
            x2={origin + maxZ * scale}
            y2={origin - yVal * scale}
          />
        ))}
        {option.ribaltamentoDepths.map((zVal) => {
          const r = zVal * scale;
          return (
            <g key={`z-${zVal}`} fill="none">
              <line x1={origin + minX * scale} y1={origin + r} x2={origin} y2={origin + r} />
              <path d={`M ${origin} ${origin + r} A ${r} ${r} 0 0 0 ${origin + r} ${origin}`} />
              <line x1={origin + r} y1={origin} x2={origin + r} y2={origin - maxY * scale} />
            </g>
          );
        })}
      </g>

      {/* Main Axes */}
      <line x1="8" y1={origin} x2={size - 8} y2={origin} stroke="#334155" strokeWidth="1.2" />
      <line x1={origin} y1="8" x2={origin} y2={size - 8} stroke="#334155" strokeWidth="1" />

      <text x="12" y="20" className="fill-emerald-700 text-[9px] font-bold">
        PV
      </text>
      <text x="12" y={size - 12} className="fill-sky-700 text-[9px] font-bold">
        PO
      </text>
      <text x={origin + 8} y="20" className="fill-amber-700 text-[9px] font-bold">
        PL
      </text>

      {/* PV */}
      <g>
        {option.projections.PV.polygons.map((poly, idx) => (
          <polygon
            key={`pv-p-${idx}`}
            points={polyPoints(poly.points, mapPV)}
            fill={poly.fill}
            fillOpacity="0.9"
          />
        ))}
        {option.projections.PV.edges.map((e, idx) => {
          const p1 = mapPV(e.from.u, e.from.v);
          const p2 = mapPV(e.to.u, e.to.v);
          return (
            <line
              key={`pv-e-${idx}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={e.dashed ? '#475569' : '#0F172A'}
              strokeWidth={e.dashed ? 1.2 : 1.75}
              strokeDasharray={e.dashed ? '3.5 3' : undefined}
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* PO */}
      <g>
        {option.projections.PO.polygons.map((poly, idx) => (
          <polygon
            key={`po-p-${idx}`}
            points={polyPoints(poly.points, mapPO)}
            fill={poly.fill}
            fillOpacity="0.9"
          />
        ))}
        {option.projections.PO.edges.map((e, idx) => {
          const p1 = mapPO(e.from.u, e.from.v);
          const p2 = mapPO(e.to.u, e.to.v);
          return (
            <line
              key={`po-e-${idx}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={e.dashed ? '#475569' : '#0F172A'}
              strokeWidth={e.dashed ? 1.2 : 1.75}
              strokeDasharray={e.dashed ? '3.5 3' : undefined}
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* PL */}
      <g>
        {option.projections.PL.polygons.map((poly, idx) => (
          <polygon
            key={`pl-p-${idx}`}
            points={polyPoints(poly.points, mapPL)}
            fill={poly.fill}
            fillOpacity="0.9"
          />
        ))}
        {option.projections.PL.edges.map((e, idx) => {
          const p1 = mapPL(e.from.u, e.from.v);
          const p2 = mapPL(e.to.u, e.to.v);
          return (
            <line
              key={`pl-e-${idx}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={e.dashed ? '#475569' : '#0F172A'}
              strokeWidth={e.dashed ? 1.2 : 1.75}
              strokeDasharray={e.dashed ? '3.5 3' : undefined}
              strokeLinecap="round"
            />
          );
        })}
      </g>
    </svg>
  );
};

export const ProjectionAssociationGame: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedByExercise, setSelectedByExercise] = useState<Record<string, string>>({});

  const activeExercise = ASSOCIATION_EXERCISES[currentIdx] ?? ASSOCIATION_EXERCISES[0];
  const chosenOptionId = selectedByExercise[activeExercise.id];
  const chosenOption = activeExercise.options.find((o) => o.id === chosenOptionId);

  const totalExercises = ASSOCIATION_EXERCISES.length;
  const answeredCount = Object.keys(selectedByExercise).length;
  const score = ASSOCIATION_EXERCISES.reduce((acc, ex) => {
    const picked = ex.options.find((o) => o.id === selectedByExercise[ex.id]);
    return acc + (picked?.isCorrect ? 1 : 0);
  }, 0);

  const handleSelectOption = (optionId: string) => {
    setSelectedByExercise((prev) => ({
      ...prev,
      [activeExercise.id]: optionId,
    }));
  };

  const handleResetGame = () => {
    setSelectedByExercise({});
    setCurrentIdx(0);
  };

  return (
    <section id="associazione-proiezioni" className="py-12 border-b border-slate-200 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-700">
              Gioco di Associazione · 6 Sfide Visive
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Associa l’oggetto alla proiezione giusta
            </h2>
            <p className="text-sm md:text-base text-slate-600 mt-1.5">
              Osserva il modello tridimensionale ruotandolo da più angolazioni, confronta le tre tavole proposte e scegli l’unica terna (PV, PO, PL) esatta.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-end">
            <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold text-slate-800 tabular-nums">
              Punteggio: {score} / {totalExercises}
            </div>
            <button
              type="button"
              onClick={handleResetGame}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Ricomincia
            </button>
          </div>
        </div>

        {/* Exercise Selector Tabs (6 distinct exercises) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
          {ASSOCIATION_EXERCISES.map((ex, idx) => {
            const isActive = idx === currentIdx;
            const pickedId = selectedByExercise[ex.id];
            const picked = ex.options.find((o) => o.id === pickedId);
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`text-left px-3 py-2.5 rounded-xl border transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 border-slate-900 text-white'
                    : picked
                    ? picked.isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-slate-800 hover:bg-emerald-100/70'
                      : 'bg-rose-50 border-rose-200 text-slate-800 hover:bg-rose-100/70'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between gap-1 text-[11px] font-mono tabular-nums">
                  <span className={isActive ? 'text-sky-300' : 'text-slate-500'}>
                    Esercizio {idx + 1}
                  </span>
                  {picked && (
                    picked.isCorrect ? (
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-300' : 'text-emerald-600'}`} />
                    ) : (
                      <AlertTriangle className={`w-3.5 h-3.5 ${isActive ? 'text-rose-300' : 'text-rose-600'}`} />
                    )
                  )}
                </div>
                <div className="text-xs font-semibold truncate mt-0.5">{ex.title}</div>
              </button>
            );
          })}
        </div>

        {/* Active Challenge Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Rotatable 3D Target Object */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
              <span className="font-mono font-semibold text-sky-700 tabular-nums">
                Sfida {currentIdx + 1} di {totalExercises}
              </span>
              <span>{activeExercise.focusTag}</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">{activeExercise.title}</h3>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed">{activeExercise.prompt}</p>

            <GameObject3DViewer solid={activeExercise.solid} className="h-[290px]" />

            <p className="text-xs text-slate-600 bg-white border border-slate-200 rounded-lg px-3 py-2 leading-relaxed">
              <strong>Suggerimento:</strong> {activeExercise.solid.learningTip}
            </p>
          </div>

          {/* Right: 3 Candidate Orthogonal Projection Sheets */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {activeExercise.options.map((opt) => {
                const isSelected = chosenOptionId === opt.id;
                const isRevealed = Boolean(chosenOption);

                let cardStyle = 'border-slate-200 bg-white hover:border-sky-400';
                if (isRevealed) {
                  if (opt.isCorrect) {
                    cardStyle = 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500';
                  } else if (isSelected && !opt.isCorrect) {
                    cardStyle = 'border-rose-400 bg-rose-50/50 ring-1 ring-rose-400';
                  } else {
                    cardStyle = 'border-slate-200 bg-slate-50/60 opacity-75';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleSelectOption(opt.id)}
                    className={`flex flex-col text-left border rounded-xl p-3 transition-all cursor-pointer ${cardStyle}`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-900">{opt.label}</span>
                      {isRevealed && opt.isCorrect && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Esatta
                        </span>
                      )}
                      {isRevealed && isSelected && !opt.isCorrect && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Errata
                        </span>
                      )}
                    </div>
                    <div className="border border-slate-100 rounded-lg overflow-hidden bg-white">
                      <MiniMongeOptionSvg option={opt} exerciseId={activeExercise.id} />
                    </div>
                    <span className="mt-2.5 text-[11px] font-semibold text-sky-700">
                      {isSelected ? 'Risposta selezionata' : 'Scegli questa tavola'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Immediate Feedback Panel */}
            {chosenOption ? (
              <div
                className={`border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  chosenOption.isCorrect
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-start gap-3">
                  {chosenOption.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="text-sm font-bold">
                      {chosenOption.isCorrect
                        ? `Ottimo! ${chosenOption.label} è la proiezione corretta.`
                        : `${chosenOption.label} non corrisponde al solido 3D.`}
                    </div>
                    <p className="text-xs md:text-sm mt-1 leading-relaxed">{chosenOption.feedback}</p>
                    {!chosenOption.isCorrect && (
                      <p className="text-xs font-medium mt-1.5 text-slate-700">
                        Confronta il bordo verde evidenziato per vedere qual era la terna esatta, oppure prova subito l’esercizio successivo.
                      </p>
                    )}
                  </div>
                </div>

                {currentIdx < totalExercises - 1 && (
                  <button
                    type="button"
                    onClick={() => setCurrentIdx((i) => Math.min(totalExercises - 1, i + 1))}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-center"
                  >
                    Prossimo esercizio
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-600">
                Confronta le tre viste (<strong>PV</strong> in alto a sinistra, <strong>PO</strong> in basso a sinistra, <strong>PL</strong> in alto a destra) con l’oggetto 3D e clicca sulla proiezione che ritieni corretta.
              </div>
            )}

            {/* Completion Summary Banner when all 6 exercises have been answered */}
            {answeredCount === totalExercises && (
              <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    Sfida completata: {score} su {totalExercises} associazioni corrette!
                  </div>
                  <p className="text-xs text-slate-700 mt-0.5">
                    {score === totalExercises
                      ? 'Eccellente: sai leggere perfettamente dimensioni, orientamento e spigoli nascosti.'
                      : 'Rivedi gli esercizi con spunta rossa e prova a ruotare il solido nelle viste PV, PO e PL per migliorare ancora.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetGame}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sky-600 text-white text-xs font-semibold rounded-lg hover:bg-sky-700 whitespace-nowrap shrink-0 cursor-pointer self-start sm:self-center"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Ripeti tutti i 6 esercizi
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
