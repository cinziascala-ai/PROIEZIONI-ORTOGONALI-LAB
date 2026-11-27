import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, RotateCcw } from 'lucide-react';
import { EXERCISE_SHEET_SOLIDS } from '../data/exerciseAndAssociation';
import { GameObject3DViewer } from './GameObject3DViewer';
import { ExerciseSheetSolid, PlaneKey, Point2D } from '../types/projection';

interface ProgressiveMongeSvgProps {
  sheet: ExerciseSheetSolid;
  stepIndex: number;
}

const ProgressiveMongeSvg: React.FC<ProgressiveMongeSvgProps> = ({ sheet, stepIndex }) => {
  const origin = 220;
  const scale = 42;
  const size = 440;

  const { solid, vertexLabels, steps } = sheet;
  const currentStep = steps[stepIndex] ?? steps[0];
  const { layers } = currentStep;

  const mapPV = (u: number, v: number) => ({
    x: origin + u * scale,
    y: origin - v * scale,
  });

  const mapPO = (u: number, v: number) => ({
    x: origin + u * scale,
    y: origin + v * scale,
  });

  const mapPL = (u: number, v: number) => ({
    x: origin + u * scale,
    y: origin - v * scale,
  });

  const mapVertex = (plane: PlaneKey, u: number, v: number) => {
    if (plane === 'PV') return mapPV(u, v);
    if (plane === 'PO') return mapPO(u, v);
    return mapPL(u, v);
  };

  const polyPointsString = (
    points: Point2D[],
    mapper: (u: number, v: number) => { x: number; y: number },
  ) =>
    points
      .map((p) => {
        const mapped = mapper(p.u, p.v);
        return `${mapped.x.toFixed(1)},${mapped.y.toFixed(1)}`;
      })
      .join(' ');

  const minX = Math.min(...solid.constructionXs);
  const maxX = Math.max(...solid.constructionXs);
  const minY = Math.min(...solid.constructionYs);
  const maxY = Math.max(...solid.constructionYs);
  const minZ = Math.min(...solid.ribaltamentoDepths);
  const maxZ = Math.max(...solid.ribaltamentoDepths);

  const highlightRayColor = stepIndex === 2 ? '#0284C7' : '#94A3B8';
  const highlightCompassColor = stepIndex === 4 ? '#D97706' : '#94A3B8';

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl p-4">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-auto max-h-[460px] mx-auto select-none"
        role="img"
        aria-label={`Costruzione passo ${currentStep.stepNumber} di ${sheet.name}`}
      >
        <defs>
          <pattern id={`sheet-grid-${sheet.id}`} width={scale / 2} height={scale / 2} patternUnits="userSpaceOnUse">
            <path
              d={`M ${scale / 2} 0 L 0 0 0 ${scale / 2}`}
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect x="0" y="0" width={size} height={size} fill={`url(#sheet-grid-${sheet.id})`} rx="8" />

        {/* Quadrant faint tints */}
        <rect x="16" y="16" width={origin - 16} height={origin - 16} fill="#ECFDF5" fillOpacity="0.28" />
        <rect x="16" y={origin} width={origin - 16} height={origin - 16} fill="#F0F9FF" fillOpacity="0.32" />
        <rect x={origin} y="16" width={origin - 16} height={origin - 16} fill="#FFFBEB" fillOpacity="0.32" />

        {/* Step 2 guide lines from axes to PO */}
        {layers.poConstruction && (
          <g stroke="#94A3B8" strokeWidth="0.8" opacity="0.65">
            <line
              x1={origin + minX * scale}
              y1={origin}
              x2={origin + minX * scale}
              y2={origin + minZ * scale}
            />
            <line
              x1={origin}
              y1={origin + minZ * scale}
              x2={origin + minX * scale}
              y2={origin + minZ * scale}
            />
          </g>
        )}

        {/* Step 3: Vertical 2H rays from PO up into PV + PV base guide */}
        {layers.verticalRays && (
          <g stroke={highlightRayColor} strokeWidth={stepIndex === 2 ? 1.15 : 0.8} opacity={stepIndex === 2 ? 0.85 : 0.65}>
            {solid.constructionXs.map((xVal) => {
              const xPx = origin + xVal * scale;
              const isCenterAxis = Math.abs(xVal - (minX + maxX) / 2) < 0.05 && sheet.id === 'piramide';
              const topY = origin - maxY * scale - 10;
              const botY = isCenterAxis ? origin + ((minZ + maxZ) / 2) * scale : origin + maxZ * scale;
              return <line key={`vr-${xVal}`} x1={xPx} y1={botY} x2={xPx} y2={topY} />;
            })}
            {/* Horizontal base line in PV (y = minY) */}
            <line
              x1={origin + minX * scale - 14}
              y1={origin - minY * scale}
              x2={origin + maxX * scale + 14}
              y2={origin - minY * scale}
            />
          </g>
        )}

        {/* Step 5: Horizontal height lines from PV to PL + Compass ribaltamento arcs from PO to PL */}
        {layers.compassAndHorizontals && (
          <g>
            {/* Horizontal height rays PV -> PL */}
            <g stroke={stepIndex === 4 ? '#059669' : '#94A3B8'} strokeWidth={stepIndex === 4 ? 1.15 : 0.8} opacity={stepIndex === 4 ? 0.85 : 0.65}>
              {solid.constructionYs.map((yVal) => {
                const yPx = origin - yVal * scale;
                return (
                  <line
                    key={`hr-${yVal}`}
                    x1={origin + (sheet.id === 'piramide' && yVal === maxY ? (minX + maxX) / 2 : minX) * scale}
                    y1={yPx}
                    x2={origin + maxZ * scale + 10}
                    y2={yPx}
                  />
                );
              })}
            </g>

            {/* PO -> Vertical Axis -> Compass Arc -> LT -> Vertical up into PL */}
            <g stroke={highlightCompassColor} strokeWidth={stepIndex === 4 ? 1.15 : 0.8} opacity={stepIndex === 4 ? 0.85 : 0.65} fill="none">
              {solid.ribaltamentoDepths.map((zVal) => {
                const r = zVal * scale;
                const isMidDepth = Math.abs(zVal - (minZ + maxZ) / 2) < 0.05 && sheet.id === 'piramide';
                const leftX = origin + (isMidDepth ? (minX + maxX) / 2 : maxX) * scale;
                const poY = origin + r;
                const plX = origin + r;
                const plTopY = origin - maxY * scale - 8;
                return (
                  <g key={`arc-${zVal}`}>
                    <line x1={leftX} y1={poY} x2={origin} y2={poY} />
                    <path d={`M ${origin} ${origin + r} A ${r} ${r} 0 0 0 ${origin + r} ${origin}`} />
                    <line x1={plX} y1={origin} x2={plX} y2={plTopY} />
                  </g>
                );
              })}
              {/* Small compass center dot in O */}
              <circle cx={origin} cy={origin} r="2.8" fill={highlightCompassColor} />
            </g>
          </g>
        )}

        {/* Step 1+: Main Axes (LT + Vertical Axis + Labels) */}
        {layers.axes && (
          <g>
            <line x1="14" y1={origin} x2={size - 14} y2={origin} stroke="#0F172A" strokeWidth="1.75" />
            <line x1={origin} y1="14" x2={origin} y2={size - 14} stroke="#0F172A" strokeWidth="1.25" />
            <text x="20" y={origin - 6} className="fill-slate-800 text-[11px] font-semibold font-mono">
              LT
            </text>
            <text x={size - 32} y={origin - 6} className="fill-slate-800 text-[11px] font-semibold font-mono">
              LT
            </text>
            <text x={origin + 6} y={origin + 14} className="fill-slate-600 text-[11px] font-mono">
              O
            </text>
            <text x="24" y="34" className="fill-emerald-700 text-[12px] font-bold">
              PV · Frontale
            </text>
            <text x="24" y={size - 20} className="fill-sky-700 text-[12px] font-bold">
              PO · Dall’Alto
            </text>
            <text x={origin + 14} y="34" className="fill-amber-700 text-[12px] font-bold">
              PL · Da Sinistra
            </text>
            <text x={origin + 14} y={size - 20} className="fill-slate-400 text-[11px] font-medium">
              Ribaltamento (Compasso)
            </text>
          </g>
        )}

        {/* Step 2+: PO Shape */}
        {layers.poFill && (
          <g>
            {solid.projections.PO.polygons.map((poly, idx) => (
              <polygon
                key={`po-poly-${idx}`}
                points={polyPointsString(poly.points, mapPO)}
                fill={poly.fill}
                fillOpacity="0.86"
              />
            ))}
            {solid.projections.PO.edges.map((e, idx) => {
              const p1 = mapPO(e.from.u, e.from.v);
              const p2 = mapPO(e.to.u, e.to.v);
              return (
                <line
                  key={`po-edge-${idx}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#0F172A"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                />
              );
            })}
            {sheet.id === 'piramide' && (
              <circle
                cx={mapPO(-2.2, 2.0).x}
                cy={mapPO(-2.2, 2.0).y}
                r="3"
                fill="#0F172A"
              />
            )}
          </g>
        )}

        {/* Step 4+: PV Shape */}
        {layers.pvFill && (
          <g>
            {solid.projections.PV.polygons.map((poly, idx) => (
              <polygon
                key={`pv-poly-${idx}`}
                points={polyPointsString(poly.points, mapPV)}
                fill={poly.fill}
                fillOpacity="0.86"
              />
            ))}
            {solid.projections.PV.edges.map((e, idx) => {
              const p1 = mapPV(e.from.u, e.from.v);
              const p2 = mapPV(e.to.u, e.to.v);
              return (
                <line
                  key={`pv-edge-${idx}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#0F172A"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                />
              );
            })}
            {sheet.id === 'piramide' && (
              <circle
                cx={mapPV(-2.2, 3.2).x}
                cy={mapPV(-2.2, 3.2).y}
                r="3"
                fill="#0F172A"
              />
            )}
          </g>
        )}

        {/* Step 6: PL Shape */}
        {layers.plFill && (
          <g>
            {solid.projections.PL.polygons.map((poly, idx) => (
              <polygon
                key={`pl-poly-${idx}`}
                points={polyPointsString(poly.points, mapPL)}
                fill={poly.fill}
                fillOpacity="0.86"
              />
            ))}
            {solid.projections.PL.edges.map((e, idx) => {
              const p1 = mapPL(e.from.u, e.from.v);
              const p2 = mapPL(e.to.u, e.to.v);
              return (
                <line
                  key={`pl-edge-${idx}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke="#0F172A"
                  strokeWidth="2.1"
                  strokeLinecap="round"
                />
              );
            })}
            {sheet.id === 'piramide' && (
              <circle
                cx={mapPL(2.0, 3.2).x}
                cy={mapPL(2.0, 3.2).y}
                r="3"
                fill="#0F172A"
              />
            )}
          </g>
        )}

        {/* Step 6: Vertex Letters & Dimension Callouts */}
        {layers.labelsAndDims && (
          <g>
            {vertexLabels.map((lbl, i) => {
              const pos = mapVertex(lbl.plane, lbl.u, lbl.v);
              return (
                <text
                  key={`lbl-${i}`}
                  x={pos.x + (lbl.dx ?? 0)}
                  y={pos.y + (lbl.dy ?? 0)}
                  textAnchor="middle"
                  className="fill-slate-900 text-[10px] font-bold font-mono"
                >
                  {lbl.text}
                </text>
              );
            })}

            <g className="font-mono text-[10px]">
              {/* Width L below PO */}
              <line
                x1={origin + minX * scale}
                y1={origin + maxZ * scale + 20}
                x2={origin + maxX * scale}
                y2={origin + maxZ * scale + 20}
                stroke="#0284C7"
                strokeWidth="1.25"
              />
              <text
                x={origin + ((minX + maxX) / 2) * scale}
                y={origin + maxZ * scale + 32}
                textAnchor="middle"
                className="fill-sky-700 font-semibold"
              >
                L: {solid.dimensionsCm.width.toFixed(1).replace('.', ',')} cm
              </text>

              {/* Height H left of PV */}
              <line
                x1={origin + minX * scale - 20}
                y1={origin - minY * scale}
                x2={origin + minX * scale - 20}
                y2={origin - maxY * scale}
                stroke="#059669"
                strokeWidth="1.25"
              />
              <text
                x={origin + minX * scale - 26}
                y={origin - ((minY + maxY) / 2) * scale}
                textAnchor="middle"
                transform={`rotate(-90, ${origin + minX * scale - 26}, ${origin - ((minY + maxY) / 2) * scale})`}
                className="fill-emerald-700 font-semibold"
              >
                H: {solid.dimensionsCm.height.toFixed(1).replace('.', ',')} cm
              </text>

              {/* Depth P above PL */}
              <line
                x1={origin + minZ * scale}
                y1={origin - maxY * scale - 18}
                x2={origin + maxZ * scale}
                y2={origin - maxY * scale - 18}
                stroke="#D97706"
                strokeWidth="1.25"
              />
              <text
                x={origin + ((minZ + maxZ) / 2) * scale}
                y={origin - maxY * scale - 24}
                textAnchor="middle"
                className="fill-amber-700 font-semibold"
              >
                P: {solid.dimensionsCm.depth.toFixed(1).replace('.', ',')} cm
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};

export const StepByStepSheetSection: React.FC = () => {
  const [selectedSolidId, setSelectedSolidId] = useState<string>(EXERCISE_SHEET_SOLIDS[0].id);
  const [stepIndex, setStepIndex] = useState<number>(0);

  const activeSheet =
    EXERCISE_SHEET_SOLIDS.find((s) => s.id === selectedSolidId) ?? EXERCISE_SHEET_SOLIDS[0];
  const currentStep = activeSheet.steps[stepIndex] ?? activeSheet.steps[0];
  const lastStepIndex = activeSheet.steps.length - 1;

  const handleSelectSolid = (id: string) => {
    setSelectedSolidId(id);
    setStepIndex(0);
  };

  return (
    <section id="schede-solidi" className="py-12 border-b border-slate-200 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
          <div className="max-w-2xl">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-sky-700">
              Schede di Esercizio Guidate
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mt-1">
              Costruzione delle proiezioni passo passo
            </h2>
            <p className="text-sm md:text-base text-slate-600 mt-1.5">
              Scegli il solido geometrico su cui esercitarti e segui tutti i passaggi dal foglio bianco fino al disegno completato con matita 2H, compasso e matita HB.
            </p>
          </div>

          {/* Solid selector */}
          <div className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-xl self-start lg:self-end">
            {EXERCISE_SHEET_SOLIDS.map((item) => {
              const active = item.id === activeSheet.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelectSolid(item.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary bar for chosen solid */}
        <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-500">
              <span className="font-semibold text-slate-900 text-sm font-sans">{activeSheet.name}</span>
              <span aria-hidden="true">·</span>
              <span>{activeSheet.subtitle}</span>
            </div>
            <p className="text-xs md:text-sm text-slate-600 mt-1 leading-relaxed">{activeSheet.description}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setStepIndex(0)}
              disabled={stepIndex === 0}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 disabled:opacity-45 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Ricomincia
            </button>
            <button
              type="button"
              onClick={() => setStepIndex(lastStepIndex)}
              disabled={stepIndex === lastStepIndex}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-800 bg-sky-50 border border-sky-200 rounded-lg hover:bg-sky-100 disabled:opacity-45 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              Tavola Completa
            </button>
          </div>
        </div>

        {/* Main Stage: Progressive Monge Sheet + Step Controls & 3D Model */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Progressive Construction Sheet */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <ProgressiveMongeSvg sheet={activeSheet} stepIndex={stepIndex} />

            {/* Legend strip below sheet */}
            <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <span className="inline-flex items-center gap-2">
                <span className="w-5 border-t border-slate-400 inline-block" />
                Linee di costruzione leggere e continue (matita 2H)
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-5 border-t-2 border-slate-900 inline-block" />
                Spigoli in vista (matita HB)
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border border-amber-600 inline-block" />
                Ribaltamento (compasso in O)
              </span>
            </div>
          </div>

          {/* Right: Active Step Instructions + 6-Step Index + Rotatable 3D Solid */}
          <div className="lg:col-span-6 flex flex-col gap-5">
            {/* Active step card */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-mono font-semibold text-sky-700 tabular-nums">
                  Passo {currentStep.stepNumber} di {activeSheet.steps.length}
                </span>
                <span className="text-xs font-mono text-slate-600">
                  Strumento: <strong className="text-slate-900">{currentStep.pencil}</strong>
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{currentStep.title}</h3>
              <p className="text-sm text-slate-700 leading-relaxed mb-3">{currentStep.instruction}</p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5 text-xs text-slate-700 leading-relaxed">
                <strong>Consiglio pratico:</strong> {currentStep.tip}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
                  disabled={stepIndex === 0}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Passo precedente
                </button>
                <button
                  type="button"
                  onClick={() => setStepIndex((i) => Math.min(lastStepIndex, i + 1))}
                  disabled={stepIndex === lastStepIndex}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Passo successivo
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Step List */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="text-xs font-semibold text-slate-700 mb-2.5">
                Tutti i passaggi della tavola ({activeSheet.name})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeSheet.steps.map((st, idx) => {
                  const isActive = idx === stepIndex;
                  const isDone = idx < stepIndex;
                  return (
                    <button
                      key={st.stepNumber}
                      type="button"
                      onClick={() => setStepIndex(idx)}
                      className={`text-left px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-sky-50 border-sky-400 text-slate-900 font-semibold'
                          : isDone
                          ? 'bg-emerald-50/50 border-emerald-200 text-slate-700 hover:bg-emerald-50'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span className="font-mono font-bold mr-1.5 tabular-nums">
                        {String(st.stepNumber).padStart(2, '0')}
                      </span>
                      {st.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rotatable 3D Solid Companion */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <h4 className="text-xs font-bold text-slate-900">
                  Osserva il {activeSheet.name.toLowerCase()} in 3D
                </h4>
                <span className="text-xs text-slate-500">Ruota liberamente o allinea alle viste</span>
              </div>
              <GameObject3DViewer solid={activeSheet.solid} className="h-[250px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
