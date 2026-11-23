import React from 'react';
import { Printer, ClipboardList, Compass } from 'lucide-react';

const LESSON_PHASES = [
  {
    phase: '01. Aggancio Reale',
    duration: '15 min',
    description:
      'Mostra alla LIM l’esperimento “L’inganno della prospettiva” e usa il righello di verifica per far scoprire perché per costruire mobili, case o pezzi 3D servono viste senza deformazioni.',
  },
  {
    phase: '02. Esplorazione del Triedro 3D',
    duration: '20 min',
    description:
      'Nel Laboratorio 3D, ruota i 5 solidi insieme alla classe e muovi il cursore “Apri il Triedro” da 0° a 90°: gli studenti vedono concretamente come PO e PL si ribaltano sul foglio piatto con gli archi di compasso.',
  },
  {
    phase: '03. Gioco “Indovina l’Oggetto”',
    duration: '25 min',
    description:
      'Divisi a coppie, gli studenti osservano le 3 viste di Sedia, Tavolo e Libro, tracciano uno schizzo 3D sulla lavagna digitale e confrontano le loro ipotesi svelando i modelli 3D ruotabili.',
  },
  {
    phase: '04. Costruzione sul Banco & Tavola F4',
    duration: '40 min',
    description:
      'Dopo l’esempio guidato della Casetta, ogni gruppo costruisce il Mobiletto con cubetti, cartoncino o plastilina e poi disegna le sue tre viste su foglio F4 con squadrette (2H leggere, HB spigoli in vista).',
  },
];

const RUBRIC_ROWS = [
  {
    criterion: 'Orientamento nel Triedro (PO, PV, PL)',
    base: 'Riconosce i tre quadranti con aiuto della guida.',
    intermedio: 'Colloca correttamente pianta, prospetto e fianco nei quadranti giusti.',
    avanzato: 'Collega con sicurezza ogni vista al punto di osservazione e legge anche gli spigoli nascosti.',
  },
  {
    criterion: 'Corrispondenza tra Misure 2D e Volume 3D',
    base: 'Riporta le dimensioni principali con qualche imprecisione.',
    intermedio: 'Mantiene uguali larghezza (PO-PV), altezza (PV-PL) e profondità (PO-PL).',
    avanzato: 'Costruisce il modello 3D rispettando in ogni parte le proporzioni e le quote delle tre viste.',
  },
  {
    criterion: 'Linee di Costruzione e Compasso',
    base: 'Traccia alcune linee di proiezione verticali o orizzontali.',
    intermedio: 'Usa squadrette e compasso nel 4° quadrante per ribaltare le profondità dal PO al PL.',
    avanzato: 'Esegue un tracciato geometrico pulito distinguendo linee leggere (2H), spigoli (HB) e tratteggi.',
  },
];

export const TeacherGuideSection: React.FC = () => {
  return (
    <section id="guida-classe" className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-slate-500 mb-2">
              Guida per la Classe · Tecnologia Classe Seconda
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight text-balance">
              Organizzazione della lezione, strumenti e valutazione
            </h2>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="no-print inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-xs font-semibold hover:bg-slate-100 transition-colors whitespace-nowrap shrink-0 cursor-pointer self-start"
          >
            <Printer className="w-4 h-4" />
            Stampa Scheda Lezione
          </button>
        </div>

        {/* 4 Lesson Phases */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {LESSON_PHASES.map((item) => (
            <div key={item.phase} className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="text-sm font-bold text-slate-900">{item.phase}</h3>
                <span className="text-xs font-mono text-sky-700 font-semibold tabular-nums whitespace-nowrap">
                  {item.duration}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Tools & Materials + Rubric */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Compass className="w-4 h-4 text-sky-700" />
              <h3 className="text-base font-bold text-slate-900">Strumenti per gli Studenti</h3>
            </div>
            <ul className="space-y-3 text-xs text-slate-700">
              <li className="pb-2.5 border-b border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Per il disegno tecnico</strong>
                Foglio F4 squadrato, coppia di squadrette (45° e 30°/60°), compasso, matita 2H (linee di costruzione leggere) e matita HB (spigoli in vista), gomma morbida.
              </li>
              <li className="pb-2.5 border-b border-slate-200">
                <strong className="text-slate-900 block mb-0.5">Per la costruzione del modello 3D</strong>
                Cubetti in legno/plastica (12–15 per gruppo) oppure cartoncino rigido + forbici + colla, oppure plastilina con righello.
              </li>
              <li>
                <strong className="text-slate-900 block mb-0.5">In laboratorio / LIM</strong>
                Tablet o PC a coppie per ruotare il Triedro 3D e completare il gioco “Indovina l’Oggetto”.
              </li>
            </ul>
          </div>

          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 overflow-x-auto">
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="w-4 h-4 text-emerald-700" />
              <h3 className="text-base font-bold text-slate-900">Griglia di Osservazione e Valutazione</h3>
            </div>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2.5 pr-4 font-semibold">Criterio</th>
                  <th className="py-2.5 pr-4 font-semibold">Livello Base</th>
                  <th className="py-2.5 pr-4 font-semibold">Livello Intermedio</th>
                  <th className="py-2.5 font-semibold">Livello Avanzato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {RUBRIC_ROWS.map((row) => (
                  <tr key={row.criterion}>
                    <td className="py-3 pr-4 font-semibold text-slate-900 align-top">{row.criterion}</td>
                    <td className="py-3 pr-4 align-top leading-relaxed">{row.base}</td>
                    <td className="py-3 pr-4 align-top leading-relaxed">{row.intermedio}</td>
                    <td className="py-3 align-top leading-relaxed">{row.avanzato}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};
