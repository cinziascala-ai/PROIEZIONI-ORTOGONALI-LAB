import React from 'react';
import { PlaneKey, SolidDefinition } from '../types/projection';

interface MongeSheet2DProps {
  solid: SolidDefinition;
  showDimensions?: boolean;
  showConstruction?: boolean;
  showHidden?: boolean;
  highlightAxis?: 'all' | 'width' | 'depth' | 'height';
  visiblePlanes?: Record<PlaneKey, boolean>;
  onTogglePlane?: (plane: PlaneKey) => void;
  className?: string;
}

/**
 * Renders an exact 4-quadrant Italian Metodo di Monge (Primo Diedro) technical sheet:
 * - Top-Left: PV (Piano Verticale)
 * - Bottom-Left: PO (Piano Orizzontale)
 * - Top-Right: PL (Piano Laterale)
 * - Bottom-Right: Piano di Ribaltamento with compass quarter-arcs centered at O
 */
export const MongeSheet2D: React.FC<MongeSheet2DProps> = ({
  solid,
  showDimensions = true,
  showConstruction = true,
  showHidden = true,
  highlightAxis = 'all',
  visiblePlanes = { PV: true, PO: true, PL: true },
  onTogglePlane,
  className = '',
}) => {
  // World bounds: each quadrant spans 4.6 units from origin (0,0)
  // SVG coordinate system: center (origin) at (220, 220), scale = 42 px per unit
  const origin = 220;
  const scale = 42;
  const size = 440;

  const showPV = visiblePlanes.PV;
  const showPO = visiblePlanes.PO;
  const showPL = visiblePlanes.PL;

  // Coordinate mappers from Triedro local coordinates to SVG (x, y)
  const mapPV = (u: number, v: number) => ({
    x: origin + u * scale, // u is negative (-3.6..-1.0) -> goes left
    y: origin - v * scale, // v is positive (0.6..3.0) -> goes up
  });

  const mapPO = (u: number, v: number) => ({
    x: origin + u * scale, // u is negative -> goes left
    y: origin + v * scale, // v = z positive -> goes down below LT
  });

  const mapPL = (u: number, v: number) => ({
    x: origin + u * scale, // u = z positive -> goes right
    y: origin - v * scale, // v = y positive -> goes up
  });

  const polyPointsString = (
    points: Array<{ u: number; v: number }>,
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

  return (
    <div className={`w-full bg-white border border-slate-200 rounded-xl p-4 ${className}`}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-auto max-h-[430px] mx-auto select-none"
        role="img"
        aria-label={`Proiezioni ortogonali di ${solid.name}`}
      >
        {/* Subtle drafting grid */}
        <defs>
          <pattern id="monge-grid" width={scale / 2} height={scale / 2} patternUnits="userSpaceOnUse">
            <path
              d={`M ${scale / 2} 0 L 0 0 0 ${scale / 2}`}
              fill="none"
              stroke="#F1F5F9"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect x="0" y="0" width={size} height={size} fill="url(#monge-grid)" rx="8" />

        {/* Quadrant faint tints */}
        <rect x="16" y="16" width={origin - 16} height={origin - 16} fill="#ECFDF5" fillOpacity="0.28" />
        <rect x="16" y={origin} width={origin - 16} height={origin - 16} fill="#F0F9FF" fillOpacity="0.32" />
        <rect x={origin} y="16" width={origin - 16} height={origin - 16} fill="#FFFBEB" fillOpacity="0.32" />

        {/* Construction lines (only between visible planes) */}
        {showConstruction && (
          <g stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" opacity="0.8">
            {/* Vertical lines between PO and PV */}
            {showPV &&
              showPO &&
              solid.constructionXs.map((xVal) => {
                const xPx = origin + xVal * scale;
                const topY = origin - maxY * scale;
                const botY = origin + maxZ * scale;
                return (
                  <line
                    key={`cx-${xVal}`}
                    x1={xPx}
                    y1={topY}
                    x2={xPx}
                    y2={botY}
                    stroke={highlightAxis === 'width' ? '#0284C7' : '#94A3B8'}
                    strokeWidth={highlightAxis === 'width' ? 1.5 : 1}
                  />
                );
              })}

            {/* Horizontal lines between PV and PL */}
            {showPV &&
              showPL &&
              solid.constructionYs.map((yVal) => {
                const yPx = origin - yVal * scale;
                const leftX = origin + minX * scale;
                const rightX = origin + maxZ * scale;
                return (
                  <line
                    key={`cy-${yVal}`}
                    x1={leftX}
                    y1={yPx}
                    x2={rightX}
                    y2={yPx}
                    stroke={highlightAxis === 'height' ? '#059669' : '#94A3B8'}
                    strokeWidth={highlightAxis === 'height' ? 1.5 : 1}
                  />
                );
              })}

            {/* Horizontal lines from PO to Vertical Axis + Compass Arcs + Vertical lines to PL */}
            {showPO &&
              showPL &&
              solid.ribaltamentoDepths.map((zVal) => {
                const r = zVal * scale;
                const leftX = origin + minX * scale;
                const poY = origin + r;
                const plX = origin + r;
                const plTopY = origin - maxY * scale;
                const arcStroke = highlightAxis === 'depth' ? '#D97706' : '#94A3B8';
                const arcWidth = highlightAxis === 'depth' ? 1.6 : 1;
                return (
                  <g key={`cz-${zVal}`} stroke={arcStroke} strokeWidth={arcWidth}>
                    <line x1={leftX} y1={poY} x2={origin} y2={poY} />
                    <path
                      d={`M ${origin} ${origin + r} A ${r} ${r} 0 0 0 ${origin + r} ${origin}`}
                      fill="none"
                    />
                    <line x1={plX} y1={origin} x2={plX} y2={plTopY} />
                  </g>
                );
              })}
          </g>
        )}

        {/* Main Axes: Linea di Terra (LT) and Vertical Axis */}
        <line x1="14" y1={origin} x2={size - 14} y2={origin} stroke="#0F172A" strokeWidth="1.75" />
        <line x1={origin} y1="14" x2={origin} y2={size - 14} stroke="#0F172A" strokeWidth="1.25" />
        <text x="20" y={origin - 6} className="fill-slate-800 text-[11px] font-semibold font-mono">
          LT
        </text>
        <text x={size - 32} y={origin - 6} className="fill-slate-800 text-[11px] font-semibold font-mono">
          LT
        </text>
        <text x={origin + 6} y={origin + 14} className="fill-slate-500 text-[11px] font-mono">
          O
        </text>

        {/* Quadrant Labels */}
        <text x="24" y="34" className="fill-emerald-700 text-[12px] font-bold">
          PV · Frontale
        </text>
        <text x="24" y={size - 22} className="fill-sky-700 text-[12px] font-bold">
          PO · Dall’Alto
        </text>
        <text x={origin + 14} y="34" className="fill-amber-700 text-[12px] font-bold">
          PL · Da Sinistra
        </text>
        <text x={origin + 14} y={size - 22} className="fill-slate-400 text-[11px] font-medium">
          Ribaltamento (Compasso)
        </text>

        {/* PV Projection or Masked Card */}
        {showPV ? (
          <g>
            {solid.projections.PV.polygons.map((poly, idx) => (
              <polygon
                key={`pv-p-${idx}`}
                points={polyPointsString(poly.points, mapPV)}
                fill={poly.fill}
                fillOpacity="0.88"
              />
            ))}
            {solid.projections.PV.edges.map((edge, idx) => {
              if (edge.dashed && !showHidden) return null;
              const p1 = mapPV(edge.from.u, edge.from.v);
              const p2 = mapPV(edge.to.u, edge.to.v);
              return (
                <line
                  key={`pv-e-${idx}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={edge.dashed ? '#334155' : '#0F172A'}
                  strokeWidth={edge.dashed ? 1.5 : 2}
                  strokeDasharray={edge.dashed ? '5 4' : undefined}
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        ) : (
          <g
            onClick={() => onTogglePlane?.('PV')}
            className={onTogglePlane ? 'cursor-pointer' : undefined}
          >
            <rect
              x="28"
              y="48"
              width={origin - 44}
              height={origin - 68}
              rx="8"
              fill="#FFFFFF"
              fillOpacity="0.92"
              stroke="#A7F3D0"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <text x={28 + (origin - 44) / 2} y="122" textAnchor="middle" className="fill-emerald-800 text-[12px] font-bold">
              Piano PV nascosto
            </text>
            <text x={28 + (origin - 44) / 2} y="140" textAnchor="middle" className="fill-slate-500 text-[10px]">
              Clicca qui per svelare
            </text>
          </g>
        )}

        {/* PO Projection or Masked Card */}
        {showPO ? (
          <g>
            {solid.projections.PO.polygons.map((poly, idx) => (
              <polygon
                key={`po-p-${idx}`}
                points={polyPointsString(poly.points, mapPO)}
                fill={poly.fill}
                fillOpacity="0.88"
              />
            ))}
            {solid.projections.PO.edges.map((edge, idx) => {
              if (edge.dashed && !showHidden) return null;
              const p1 = mapPO(edge.from.u, edge.from.v);
              const p2 = mapPO(edge.to.u, edge.to.v);
              return (
                <line
                  key={`po-e-${idx}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={edge.dashed ? '#334155' : '#0F172A'}
                  strokeWidth={edge.dashed ? 1.5 : 2}
                  strokeDasharray={edge.dashed ? '5 4' : undefined}
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        ) : (
          <g
            onClick={() => onTogglePlane?.('PO')}
            className={onTogglePlane ? 'cursor-pointer' : undefined}
          >
            <rect
              x="28"
              y={origin + 18}
              width={origin - 44}
              height={origin - 68}
              rx="8"
              fill="#FFFFFF"
              fillOpacity="0.92"
              stroke="#BAE6FD"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <text x={28 + (origin - 44) / 2} y={origin + 88} textAnchor="middle" className="fill-sky-800 text-[12px] font-bold">
              Piano PO nascosto
            </text>
            <text x={28 + (origin - 44) / 2} y={origin + 106} textAnchor="middle" className="fill-slate-500 text-[10px]">
              Clicca qui per svelare
            </text>
          </g>
        )}

        {/* PL Projection or Masked Card */}
        {showPL ? (
          <g>
            {solid.projections.PL.polygons.map((poly, idx) => (
              <polygon
                key={`pl-p-${idx}`}
                points={polyPointsString(poly.points, mapPL)}
                fill={poly.fill}
                fillOpacity="0.88"
              />
            ))}
            {solid.projections.PL.edges.map((edge, idx) => {
              if (edge.dashed && !showHidden) return null;
              const p1 = mapPL(edge.from.u, edge.from.v);
              const p2 = mapPL(edge.to.u, edge.to.v);
              return (
                <line
                  key={`pl-e-${idx}`}
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={edge.dashed ? '#334155' : '#0F172A'}
                  strokeWidth={edge.dashed ? 1.5 : 2}
                  strokeDasharray={edge.dashed ? '5 4' : undefined}
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        ) : (
          <g
            onClick={() => onTogglePlane?.('PL')}
            className={onTogglePlane ? 'cursor-pointer' : undefined}
          >
            <rect
              x={origin + 16}
              y="48"
              width={origin - 44}
              height={origin - 68}
              rx="8"
              fill="#FFFFFF"
              fillOpacity="0.92"
              stroke="#FDE68A"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <text
              x={origin + 16 + (origin - 44) / 2}
              y="122"
              textAnchor="middle"
              className="fill-amber-800 text-[12px] font-bold"
            >
              Piano PL nascosto
            </text>
            <text
              x={origin + 16 + (origin - 44) / 2}
              y="140"
              textAnchor="middle"
              className="fill-slate-500 text-[10px]"
            >
              Clicca qui per svelare
            </text>
          </g>
        )}

        {/* Optional Dimensions in cm (shown for visible planes) */}
        {showDimensions && (
          <g className="font-mono text-[10px]">
            {/* Width under PO */}
            {showPO && (
              <g opacity={highlightAxis === 'all' || highlightAxis === 'width' ? 1 : 0.35}>
                <line
                  x1={origin + minX * scale}
                  y1={origin + maxZ * scale + 16}
                  x2={origin + maxX * scale}
                  y2={origin + maxZ * scale + 16}
                  stroke="#0284C7"
                  strokeWidth="1.25"
                />
                <text
                  x={origin + ((minX + maxX) / 2) * scale}
                  y={origin + maxZ * scale + 28}
                  textAnchor="middle"
                  className="fill-sky-700 font-semibold"
                >
                  L: {solid.dimensionsCm.width.toFixed(1)} cm
                </text>
              </g>
            )}

            {/* Height left of PV */}
            {showPV && (
              <g opacity={highlightAxis === 'all' || highlightAxis === 'height' ? 1 : 0.35}>
                <line
                  x1={origin + minX * scale - 16}
                  y1={origin - minY * scale}
                  x2={origin + minX * scale - 16}
                  y2={origin - maxY * scale}
                  stroke="#059669"
                  strokeWidth="1.25"
                />
                <text
                  x={origin + minX * scale - 22}
                  y={origin - ((minY + maxY) / 2) * scale}
                  textAnchor="middle"
                  transform={`rotate(-90, ${origin + minX * scale - 22}, ${origin - ((minY + maxY) / 2) * scale})`}
                  className="fill-emerald-700 font-semibold"
                >
                  H: {solid.dimensionsCm.height.toFixed(1)} cm
                </text>
              </g>
            )}

            {/* Depth above PL */}
            {showPL && (
              <g opacity={highlightAxis === 'all' || highlightAxis === 'depth' ? 1 : 0.35}>
                <line
                  x1={origin + minZ * scale}
                  y1={origin - maxY * scale - 14}
                  x2={origin + maxZ * scale}
                  y2={origin - maxY * scale - 14}
                  stroke="#D97706"
                  strokeWidth="1.25"
                />
                <text
                  x={origin + ((minZ + maxZ) / 2) * scale}
                  y={origin - maxY * scale - 20}
                  textAnchor="middle"
                  className="fill-amber-700 font-semibold"
                >
                  P: {solid.dimensionsCm.depth.toFixed(1)} cm
                </text>
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
