import { useState } from 'react';
import { Columns2, Maximize2 } from 'lucide-react';
import { SOLIDS } from './data/solids';
import { TriedroViewport } from './components/TriedroViewport';
import { MongeSheet2D } from './components/MongeSheet2D';
import { WhyProjectionsSection } from './components/WhyProjectionsSection';
import { GuidedActivitySection } from './components/GuidedActivitySection';
import { GuessObjectGame } from './components/GuessObjectGame';
import { TeacherGuideSection } from './components/TeacherGuideSection';
import { CompetencyQuizSection } from './components/CompetencyQuizSection';

export default function App() {
  const [selectedSolidId, setSelectedSolidId] = useState<string>(SOLIDS[0].id);
  const [unfoldValue, setUnfoldValue] = useState<number>(0);
  const [splitSheetView, setSplitSheetView] = useState<boolean>(true);

  const activeSolid = SOLIDS.find((s) => s.id === selectedSolidId) ?? SOLIDS[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-white/95 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#laboratorio"
            className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            Atelier Monge
          </a>

          {/* Zone 2: 4 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#obiettivi" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              A Cosa Servono
            </a>
            <a href="#laboratorio" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Laboratorio 3D
            </a>
            <a href="#esempio-guidato" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Attività Pratica
            </a>
            <a href="#guida-classe" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Guida Docente
            </a>
            <a href="#verifica-competenze" className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0">
              Verifica
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#indovina-oggetto"
              className="px-4 py-2 text-xs font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0"
            >
              Indovina l’Oggetto
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero + Interactive 3D Triedro Workbench */}
        <section id="laboratorio" className="py-10 border-b border-slate-200 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            {/* Compact Editorial Hero Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
              <div className="max-w-2xl">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-2">
                  <span>Tecnologia</span>
                  <span aria-hidden="true">·</span>
                  <span>Classe Seconda</span>
                  <span aria-hidden="true">·</span>
                  <span>Metodo di Monge</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight text-balance">
                  Capire le proiezioni ortogonali dallo spazio 3D al foglio
                </h1>
                <p className="text-sm md:text-base text-slate-600 mt-2.5 leading-relaxed">
                  Ruota l’oggetto nei tre piani (<strong className="text-emerald-700">PV</strong>,{' '}
                  <strong className="text-sky-700">PO</strong>,{' '}
                  <strong className="text-amber-700">PL</strong>) e muovi il cursore <em>Apri il Triedro</em> per vedere come le tre viste si distendono sul tuo foglio da disegno.
                </p>
              </div>

              {/* Workspace Toolbar Toggle: 3D Solo vs 3D + Foglio 2D */}
              <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start lg:self-end">
                <button
                  type="button"
                  onClick={() => setSplitSheetView(true)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    splitSheetView ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Columns2 className="w-3.5 h-3.5" />
                  3D + Foglio 2D
                </button>
                <button
                  type="button"
                  onClick={() => setSplitSheetView(false)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    !splitSheetView ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  Solo Laboratorio 3D
                </button>
              </div>
            </div>

            {/* Interactive Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className={splitSheetView ? 'lg:col-span-7' : 'lg:col-span-12'}>
                <TriedroViewport
                  solid={activeSolid}
                  unfoldValue={unfoldValue}
                  onUnfoldChange={setUnfoldValue}
                  onSelectSolid={setSelectedSolidId}
                  solidsList={SOLIDS}
                />
              </div>

              {splitSheetView && (
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <MongeSheet2D
                    solid={activeSolid}
                    showDimensions={true}
                    showConstruction={true}
                    showHidden={true}
                  />
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-slate-900">{activeSolid.name}</span>
                      <span className="text-xs font-mono text-slate-500">
                        {activeSolid.level} · {activeSolid.domainTag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed mb-2">{activeSolid.description}</p>
                    <p className="text-xs text-sky-800 bg-sky-50 border border-sky-200 rounded-lg px-3 py-2 leading-relaxed">
                      <strong>Consiglio chiave:</strong> {activeSolid.learningTip}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Objective 1 & 2: Why orthogonal projections matter */}
        <WhyProjectionsSection />

        {/* Objective 3 (Part A): Guided Example + Hands-On 3D Build */}
        <GuidedActivitySection />

        {/* Objective 3 (Part B): "Indovina l'Oggetto" Game (Sedia, Tavolo, Libro) */}
        <GuessObjectGame />

        {/* Classroom & Teacher Guide */}
        <TeacherGuideSection />

        {/* Final Competency Quiz with Immediate Error Feedback */}
        <CompetencyQuizSection />
      </main>

      <footer className="no-print border-t border-slate-200 bg-slate-50 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <span>Atelier Monge · Percorso interattivo di Tecnologia per la Scuola Secondaria di Primo Grado</span>
          <a href="#laboratorio" className="font-medium text-slate-700 hover:text-slate-900">
            Torna al Laboratorio 3D
          </a>
        </div>
      </footer>
    </div>
  );
}
