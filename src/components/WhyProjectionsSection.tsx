import React, { useState } from 'react';
import { Ruler, Building2, Hammer, Cpu } from 'lucide-react';

type ApplicationTab = 'falegnameria' | 'architettura' | 'meccanica';

const APPLICATIONS: Record<
  ApplicationTab,
  {
    title: string;
    role: string;
    summary: string;
    views: Array<{ plane: string; colorClass: string; role: string }>;
  }
> = {
  falegnameria: {
    title: 'Design & Falegnameria',
    role: 'Costruire un mobile su misura',
    summary:
      'Prima di tagliare il legno, il falegname legge le proiezioni ortogonali per conoscere lo spessore esatto di ogni tavola e la posizione delle viti.',
    views: [
      { plane: 'PO · Dall’Alto', colorClass: 'text-sky-700', role: 'Larghezza del piano e profondità di appoggio' },
      { plane: 'PV · Frontale', colorClass: 'text-emerald-700', role: 'Altezza totale e posizione di ante o ripiani' },
      { plane: 'PL · Laterale', colorClass: 'text-amber-700', role: 'Spessore dei fianchi e incastri posteriori' },
    ],
  },
  architettura: {
    title: 'Architettura & Edilizia',
    role: 'Progettare una casa o una scuola',
    summary:
      'Gli architetti chiamano Pianta il PO e Prospetti il PV e PL: senza queste viste in scala, i muratori non potrebbero tracciare i muri sul cantiere.',
    views: [
      { plane: 'PO · Pianta', colorClass: 'text-sky-700', role: 'Distribuzione di stanze, porte e finestre' },
      { plane: 'PV · Prospetto', colorClass: 'text-emerald-700', role: 'Facciata principale, altezza dei piani e tetto' },
      { plane: 'PL · Fianco', colorClass: 'text-amber-700', role: 'Inclinazione delle falde e aperture laterali' },
    ],
  },
  meccanica: {
    title: 'Meccanica & Stampa 3D',
    role: 'Produrre pezzi precisi al millimetro',
    summary:
      'Un ingranaggio o un supporto stampato in 3D richiede misure reali su ogni faccia, compresi fori e cavità interne indicate con linee tratteggiate.',
    views: [
      { plane: 'PO · dall’Alto', colorClass: 'text-sky-700', role: 'Fori di fissaggio e ingombro della base' },
      { plane: 'PV · Frontale', colorClass: 'text-emerald-700', role: 'Profilo della staffa e scanalature centrali' },
      { plane: 'PL · Laterale', colorClass: 'text-amber-700', role: 'Spessori delle nervature e sporgenze' },
    ],
  },
};

export const WhyProjectionsSection: React.FC = () => {
  const [rulerActive, setRulerActive] = useState(false);
  const [activeApp, setActiveApp] = useState<ApplicationTab>('falegnameria');

  const app = APPLICATIONS[activeApp];

  return (
    <section id="obiettivi" className="py-12 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-sky-700 mb-2">
              Obiettivo 1 e 2 · Conoscere e capire a cosa servono
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight text-balance">
              Perché non basta una foto? L’inganno della prospettiva
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setRulerActive((v) => !v)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              rulerActive
                ? 'bg-sky-600 text-white hover:bg-sky-700'
                : 'bg-white border border-slate-300 text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Ruler className="w-4 h-4" />
            {rulerActive ? 'Nascondi Righello di Verifica' : 'Misura con il Righello'}
          </button>
        </div>

        {/* Interactive Perspective vs Orthogonal Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          {/* Left: Perspective illusion */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between gap-4 mb-3">
              <h3 className="text-base font-bold text-slate-900">1. Disegno o Foto in Prospettiva</h3>
              <span className="text-xs font-medium text-amber-700 whitespace-nowrap">
                Le misure cambiano con la distanza
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              Due colonne identiche alte <strong>60 cm</strong> sembrano diverse: quella più lontana appare più piccola e gli angoli retti diventano obliqui.
            </p>

            <svg viewBox="0 0 420 210" className="w-full h-auto bg-slate-50 rounded-lg border border-slate-200">
              {/* Horizon vanishing lines */}
              <line x1="20" y1="55" x2="400" y2="55" stroke="#CBD5E1" strokeDasharray="4 4" strokeWidth="1" />
              <text x="26" y="48" className="fill-slate-400 text-[10px] font-mono">
                Linea dell’orizzonte
              </text>
              {/* Perspective vanishing rays to (350, 55) */}
              <line x1="85" y1="68" x2="350" y2="55" stroke="#CBD5E1" strokeWidth="1" />
              <line x1="85" y1="178" x2="350" y2="55" stroke="#CBD5E1" strokeWidth="1" />

              {/* Front column (tall on screen: 110px) */}
              <polygon points="85,68 130,68 130,178 85,178" fill="#E2C799" stroke="#0F172A" strokeWidth="1.75" />
              <polygon points="130,68 158,64 158,162 130,178" fill="#C99E67" stroke="#0F172A" strokeWidth="1.75" />

              {/* Back column (identical real height, shorter on screen: 66px) */}
              <polygon points="225,61 255,61 255,127 225,127" fill="#E2C799" stroke="#0F172A" strokeWidth="1.75" />
              <polygon points="255,61 273,59 273,117 255,127" fill="#C99E67" stroke="#0F172A" strokeWidth="1.75" />

              {/* Ruler comparison overlay */}
              {rulerActive && (
                <g>
                  <line x1="70" y1="68" x2="70" y2="178" stroke="#DC2626" strokeWidth="2" />
                  <line x1="65" y1="68" x2="75" y2="68" stroke="#DC2626" strokeWidth="2" />
                  <line x1="65" y1="178" x2="75" y2="178" stroke="#DC2626" strokeWidth="2" />
                  <text x="36" y="128" className="fill-red-600 text-[11px] font-mono font-semibold">
                    11,0 cm
                  </text>

                  <line x1="286" y1="61" x2="286" y2="127" stroke="#DC2626" strokeWidth="2" />
                  <line x1="281" y1="61" x2="291" y2="61" stroke="#DC2626" strokeWidth="2" />
                  <line x1="281" y1="127" x2="291" y2="127" stroke="#DC2626" strokeWidth="2" />
                  <text x="296" y="98" className="fill-red-600 text-[11px] font-mono font-semibold">
                    6,6 cm!
                  </text>

                  <text x="210" y="196" textAnchor="middle" className="fill-red-700 text-[11px] font-semibold">
                    Errore visivo: sullo schermo la seconda sembra più corta del 40%
                  </text>
                </g>
              )}
            </svg>
          </div>

          {/* Right: Orthogonal projection precision */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center justify-between gap-4 mb-3">
              <h3 className="text-base font-bold text-slate-900">2. Proiezione Ortogonale (PV)</h3>
              <span className="text-xs font-medium text-emerald-700 whitespace-nowrap">
                Misure reali e angoli di 90°
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-4">
              I raggi di proiezione viaggiano paralleli e perpendicolari al foglio: così entrambe le colonne conservano la stessa altezza esatta e si possono misurare!
            </p>

            <svg viewBox="0 0 420 210" className="w-full h-auto bg-slate-50 rounded-lg border border-slate-200">
              {/* Ground / LT */}
              <line x1="20" y1="165" x2="400" y2="165" stroke="#0F172A" strokeWidth="1.5" />
              <text x="26" y="180" className="fill-slate-600 text-[10px] font-mono">
                LT (Linea di Terra)
              </text>

              {/* Parallel projection guide */}
              <line x1="65" y1="55" x2="355" y2="55" stroke="#94A3B8" strokeDasharray="4 4" strokeWidth="1" />

              {/* Left column (true height 110px) */}
              <rect x="105" y="55" width="52" height="110" fill="#D1FAE5" stroke="#0F172A" strokeWidth="1.75" />
              {/* Right column (identical true height 110px) */}
              <rect x="245" y="55" width="52" height="110" fill="#A7F3D0" stroke="#0F172A" strokeWidth="1.75" />

              {rulerActive && (
                <g>
                  <line x1="88" y1="55" x2="88" y2="165" stroke="#059669" strokeWidth="2" />
                  <line x1="83" y1="55" x2="93" y2="55" stroke="#059669" strokeWidth="2" />
                  <line x1="83" y1="165" x2="93" y2="165" stroke="#059669" strokeWidth="2" />
                  <text x="52" y="114" className="fill-emerald-700 text-[11px] font-mono font-semibold">
                    60 cm
                  </text>

                  <line x1="314" y1="55" x2="314" y2="165" stroke="#059669" strokeWidth="2" />
                  <line x1="309" y1="55" x2="319" y2="55" stroke="#059669" strokeWidth="2" />
                  <line x1="309" y1="165" x2="319" y2="165" stroke="#059669" strokeWidth="2" />
                  <text x="324" y="114" className="fill-emerald-700 text-[11px] font-mono font-semibold">
                    60 cm
                  </text>

                  <text x="210" y="196" textAnchor="middle" className="fill-emerald-700 text-[11px] font-semibold">
                    Precisione 100%: entrambe misurano esattamente uguale
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>

        {/* Real-world Tecnologia contexts */}
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Dove si usano ogni giorno?</h3>
              <p className="text-sm text-slate-600">
                Seleziona un settore tecnico per scoprire cosa rivela ogni piano di proiezione.
              </p>
            </div>
            <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
              <button
                type="button"
                onClick={() => setActiveApp('falegnameria')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeApp === 'falegnameria'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Hammer className="w-3.5 h-3.5" />
                Falegnameria
              </button>
              <button
                type="button"
                onClick={() => setActiveApp('architettura')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeApp === 'architettura'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Architettura
              </button>
              <button
                type="button"
                onClick={() => setActiveApp('meccanica')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeApp === 'meccanica'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                Meccanica 3D
              </button>
            </div>
          </div>

          <div className="pt-5 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-5">
              <p className="text-xs font-medium text-slate-500 mb-1">{app.role}</p>
              <h4 className="text-lg font-bold text-slate-900 mb-2">{app.title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{app.summary}</p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {app.views.map((v) => (
                <div key={v.plane} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                  <div className={`text-xs font-bold mb-1.5 ${v.colorClass}`}>{v.plane}</div>
                  <p className="text-xs text-slate-700 leading-relaxed">{v.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
