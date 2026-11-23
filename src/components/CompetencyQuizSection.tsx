import React, { useState } from 'react';
import { CheckCircle2, RotateCcw, XCircle, ArrowRight } from 'lucide-react';

interface QuizOption {
  id: string;
  label: string;
  isCorrect: boolean;
  feedback: string;
}

interface QuizQuestion {
  id: string;
  topic: string;
  question: string;
  diagramType?: 'quadrants' | 'roof-views' | 'hidden-edge';
  options: QuizOption[];
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    topic: 'Utilità delle Proiezioni',
    question:
      'Perché falegnami, architetti e progettisti usano le proiezioni ortogonali invece di una normale foto in prospettiva per costruire un oggetto?',
    options: [
      {
        id: 'q1-a',
        label: 'Perché mostrano i colori reali dei materiali',
        isCorrect: false,
        feedback:
          'Non riguarda i colori: una fotografia mostra i colori anche meglio, ma deforma lunghezze e angoli a causa della distanza.',
      },
      {
        id: 'q1-b',
        label: 'Perché conservano le misure reali e gli angoli di 90° senza deformazioni',
        isCorrect: true,
        feedback:
          'Esatto! Con raggi paralleli e perpendicolari ai piani, ogni lato è in vera misura e si può misurare con il righello.',
      },
      {
        id: 'q1-c',
        label: 'Perché permettono di vedere l’oggetto da un solo punto di vista',
        isCorrect: false,
        feedback:
          'Al contrario: un solo punto di vista non basta per conoscere larghezza, profondità e altezza. Le proiezioni usano 3 viste coordinate.',
      },
      {
        id: 'q1-d',
        label: 'Perché sono più veloci da disegnare a mano libera senza righello',
        isCorrect: false,
        feedback:
          'Le proiezioni ortogonali richiedono precisione con squadrette e compasso, proprio per garantire misure esatte.',
      },
    ],
  },
  {
    id: 'q2',
    topic: 'Orientamento nel Foglio',
    question:
      'Nel foglio diviso in quattro quadranti dalla Linea di Terra (LT) e dall’asse verticale, dove si disegna la vista dall’alto (PO)?',
    diagramType: 'quadrants',
    options: [
      {
        id: 'q2-a',
        label: 'Nel quadrante in alto a sinistra, sopra alla Linea di Terra',
        isCorrect: false,
        feedback:
          'In alto a sinistra sopra la LT si trova il Piano Verticale (PV), cioè la vista frontale.',
      },
      {
        id: 'q2-b',
        label: 'Nel quadrante in alto a destra, accanto al PV',
        isCorrect: false,
        feedback:
          'In alto a destra si trova il Piano Laterale (PL), che rappresenta l’oggetto guardato da sinistra.',
      },
      {
        id: 'q2-c',
        label: 'Nel quadrante in basso a sinistra, sotto al PV e alla Linea di Terra',
        isCorrect: true,
        feedback:
          'Corretto! Quando il Triedro si apre, il Piano Orizzontale (PO) ruota verso il basso finendo sotto al PV.',
      },
      {
        id: 'q2-d',
        label: 'Nel quadrante in basso a destra, dove si usa il compasso',
        isCorrect: false,
        feedback:
          'Il quadrante in basso a destra è il Piano di Ribaltamento: serve solo per tracciare gli archi di compasso dal PO al PL.',
      },
    ],
  },
  {
    id: 'q3',
    topic: 'Uso del Compasso',
    question:
      'A cosa servono gli archi di compasso centrati nell’origine O nel quarto quadrante (in basso a destra)?',
    options: [
      {
        id: 'q3-a',
        label: 'A disegnare i cerchi e i fori presenti sull’oggetto',
        isCorrect: false,
        feedback:
          'I cerchi dell’oggetto si disegnano direttamente dentro PO, PV o PL. Nel 4° quadrante non c’è nessuna vista dell’oggetto.',
      },
      {
        id: 'q3-b',
        label: 'A trasferire con esattezza le misure di profondità dal PO al Piano Laterale (PL)',
        isCorrect: true,
        feedback:
          'Perfetto! Il compasso ribalta le distanze dalla Linea di Terra verso destra, mantenendo identica la profondità tra PO e PL.',
      },
      {
        id: 'q3-c',
        label: 'A misurare l’altezza dell’oggetto dal PV al PO',
        isCorrect: false,
        feedback:
          'L’altezza non si legge nel PO: il PO mostra larghezza e profondità. Le altezze passano in orizzontale dal PV al PL.',
      },
      {
        id: 'q3-d',
        label: 'A decorare il bordo del foglio da disegno F4',
        isCorrect: false,
        feedback:
          'Ogni arco è una linea di costruzione geometrica indispensabile per allineare il PL con il PO.',
      },
    ],
  },
  {
    id: 'q4',
    topic: 'Lettura delle Viste',
    question:
      'Osserva le tre viste della Casetta qui accanto: in quale piano vedi la forma triangolare reale delle falde del tetto?',
    diagramType: 'roof-views',
    options: [
      {
        id: 'q4-a',
        label: 'Solo sul Piano Orizzontale (PO)',
        isCorrect: false,
        feedback:
          'Guardando dall’alto (PO) le due falde inclinate appaiono come due rettangoli divisi dalla linea del colmo.',
      },
      {
        id: 'q4-b',
        label: 'Solo sul Piano Verticale (PV)',
        isCorrect: false,
        feedback:
          'Di fronte (PV) vedi la falda anteriore inclinata proiettata come un rettangolo sopra la facciata.',
      },
      {
        id: 'q4-c',
        label: 'Sul Piano Laterale (PL)',
        isCorrect: true,
        feedback:
          'Esatto! Guardando di fianco (PL) vedi il profilo pentagonale della casa con il triangolo reale del tetto.',
      },
      {
        id: 'q4-d',
        label: 'In tutte e tre le viste nello stesso modo',
        isCorrect: false,
        feedback:
          'Le superfici inclinate cambiano forma apparente a seconda del punto di osservazione: solo il PL mostra l’inclinazione reale.',
      },
    ],
  },
  {
    id: 'q5',
    topic: 'Spigoli Nascosti',
    question:
      'Se un oggetto ha una cavità o uno spigolo coperto da una parete quando lo guardi in una vista (come i pilastri sotto il ponte), come va disegnato?',
    diagramType: 'hidden-edge',
    options: [
      {
        id: 'q5-a',
        label: 'Non si disegna affatto per non confondere il lettore',
        isCorrect: false,
        feedback:
          'Errore frequente: nel disegno tecnico gli spigoli nascosti vanno sempre indicati, altrimenti chi costruisce l’oggetto non saprebbe che ci sono.',
      },
      {
        id: 'q5-b',
        label: 'Con una linea continua grossa (matita HB)',
        isCorrect: false,
        feedback:
          'La linea continua grossa (HB) si usa solo per gli spigoli in vista che puoi vedere direttamente da quel lato.',
      },
      {
        id: 'q5-c',
        label: 'Con una linea tratteggiata regolare',
        isCorrect: true,
        feedback:
          'Giusto! La linea tratteggiata indica uno spigolo reale che esiste dietro o sotto una superficie che lo copre.',
      },
      {
        id: 'q5-d',
        label: 'Colorando tutta la zona di rosso',
        isCorrect: false,
        feedback:
          'Le proiezioni ortogonali seguono norme grafiche universali basate sul tipo di tratto (continuo o tratteggiato), non sul colore.',
      },
    ],
  },
  {
    id: 'q6',
    topic: 'Corrispondenza tra i Piani',
    question:
      'Quali due viste sul foglio di Monge sono allineate orizzontalmente e condividono esattamente la stessa altezza?',
    options: [
      {
        id: 'q6-a',
        label: 'PV (frontale) e PO (dall’alto)',
        isCorrect: false,
        feedback:
          'PV e PO sono allineati verticalmente e condividono la LARGHEZZA, ma nel PO non si vede l’altezza.',
      },
      {
        id: 'q6-b',
        label: 'PO (dall’alto) e PL (laterale)',
        isCorrect: false,
        feedback:
          'PO e PL condividono la PROFONDITÀ (tramite il ribaltamento con il compasso), non l’altezza.',
      },
      {
        id: 'q6-c',
        label: 'PV (frontale) e PL (laterale)',
        isCorrect: true,
        feedback:
          'Bravissimo! Le linee orizzontali partono dal PV e arrivano al PL alla stessa quota, garantendo altezze identiche.',
      },
      {
        id: 'q6-d',
        label: 'Nessuna: ogni vista ha una scala diversa',
        isCorrect: false,
        feedback:
          'Tutte e tre le viste sullo stesso foglio usano la medesima scala e sono collegate geometricamente tra loro.',
      },
    ],
  },
];

const QuestionDiagram: React.FC<{ type: QuizQuestion['diagramType'] }> = ({ type }) => {
  if (!type) return null;

  if (type === 'quadrants') {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
        <svg viewBox="0 0 240 180" className="w-full max-w-[230px] mx-auto">
          <rect x="20" y="15" width="95" height="72" fill="#ECFDF5" stroke="#A7F3D0" />
          <rect x="125" y="15" width="95" height="72" fill="#FFFBEB" stroke="#FDE68A" />
          <rect x="20" y="93" width="95" height="72" fill="#F0F9FF" stroke="#BAE6FD" />
          <rect x="125" y="93" width="95" height="72" fill="#F8FAFC" stroke="#E2E8F0" />
          <line x1="12" y1="90" x2="228" y2="90" stroke="#0F172A" strokeWidth="2" />
          <line x1="120" y1="8" x2="120" y2="172" stroke="#0F172A" strokeWidth="1.5" />
          <text x="26" y="84" className="fill-slate-700 text-[9px] font-mono font-bold">LT</text>
          <text x="67" y="55" textAnchor="middle" className="fill-emerald-800 text-[12px] font-bold">?</text>
          <text x="172" y="55" textAnchor="middle" className="fill-amber-800 text-[12px] font-bold">?</text>
          <text x="67" y="133" textAnchor="middle" className="fill-sky-800 text-[12px] font-bold">?</text>
          <path d="M 120 140 A 50 50 0 0 0 170 90" fill="none" stroke="#94A3B8" strokeDasharray="3 3" strokeWidth="1.2" />
        </svg>
      </div>
    );
  }

  if (type === 'roof-views') {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
        <svg viewBox="0 0 240 180" className="w-full max-w-[230px] mx-auto">
          <line x1="12" y1="96" x2="228" y2="96" stroke="#0F172A" strokeWidth="1.5" />
          <line x1="120" y1="10" x2="120" y2="170" stroke="#0F172A" strokeWidth="1.2" />
          {/* PV */}
          <rect x="34" y="48" width="66" height="36" fill="#D1FAE5" stroke="#0F172A" strokeWidth="1.5" />
          <rect x="34" y="24" width="66" height="24" fill="#A7F3D0" stroke="#0F172A" strokeWidth="1.5" />
          <text x="22" y="26" className="fill-emerald-700 text-[10px] font-bold">PV</text>
          {/* PL */}
          <polygon points="142,84 190,84 190,48 166,24 142,48" fill="#FDE68A" stroke="#0F172A" strokeWidth="1.5" />
          <line x1="142" y1="48" x2="190" y2="48" stroke="#0F172A" strokeWidth="1.5" />
          <text x="202" y="26" className="fill-amber-700 text-[10px] font-bold">PL</text>
          {/* PO */}
          <rect x="34" y="110" width="66" height="24" fill="#BAE6FD" stroke="#0F172A" strokeWidth="1.5" />
          <rect x="34" y="134" width="66" height="24" fill="#E0F2FE" stroke="#0F172A" strokeWidth="1.5" />
          <text x="22" y="164" className="fill-sky-700 text-[10px] font-bold">PO</text>
        </svg>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
      <svg viewBox="0 0 240 120" className="w-full max-w-[230px] mx-auto">
        <rect x="45" y="18" width="150" height="84" fill="#BAE6FD" stroke="#0F172A" strokeWidth="1.8" />
        <line x1="95" y1="18" x2="95" y2="102" stroke="#334155" strokeWidth="1.6" strokeDasharray="6 4" />
        <line x1="145" y1="18" x2="145" y2="102" stroke="#334155" strokeWidth="1.6" strokeDasharray="6 4" />
        <text x="120" y="114" textAnchor="middle" className="fill-slate-600 text-[10px]">
          Spigoli interni coperti visti dall’alto
        </text>
      </svg>
    </div>
  );
};

export const CompetencyQuizSection: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [firstTryResults, setFirstTryResults] = useState<Record<string, boolean>>({});
  const [solvedQuestions, setSolvedQuestions] = useState<Record<string, boolean>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];
  const selectedOption = currentQ.options.find((o) => o.id === selectedOptionId) ?? null;

  const handleSelectOption = (opt: QuizOption) => {
    setSelectedOptionId(opt.id);

    // Record whether the very first attempt for this question was correct
    if (firstTryResults[currentQ.id] === undefined) {
      setFirstTryResults((prev) => ({ ...prev, [currentQ.id]: opt.isCorrect }));
    }

    if (opt.isCorrect) {
      setSolvedQuestions((prev) => ({ ...prev, [currentQ.id]: true }));
    }
  };

  const handleRetryQuestion = () => {
    setSelectedOptionId(null);
  };

  const handleNext = () => {
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((i) => i + 1);
      setSelectedOptionId(null);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleJumpQuestion = (idx: number) => {
    setQuizCompleted(false);
    setCurrentIdx(idx);
    setSelectedOptionId(null);
  };

  const handleResetQuiz = () => {
    setCurrentIdx(0);
    setSelectedOptionId(null);
    setFirstTryResults({});
    setSolvedQuestions({});
    setQuizCompleted(false);
  };

  const firstTryScore = Object.values(firstTryResults).filter(Boolean).length;
  const totalSolved = Object.values(solvedQuestions).filter(Boolean).length;

  return (
    <section id="verifica-competenze" className="py-14 border-t border-slate-200 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <p className="text-xs font-medium text-sky-700 mb-2">
              Autovalutazione Finale · Feedback Immediato
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight text-balance">
              Verifica le tue competenze
            </h2>
            <p className="text-sm md:text-base text-slate-600 mt-2">
              Rispondi alle 6 domande sulle proiezioni ortogonali: se sbagli, ricevi subito una spiegazione mirata dell’errore e puoi riprovare.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-semibold text-slate-700 tabular-nums">
              Completate: {totalSolved}/{QUIZ_QUESTIONS.length}
            </span>
            <div className="inline-flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg">
              {QUIZ_QUESTIONS.map((q, idx) => {
                const isSolved = solvedQuestions[q.id];
                const isActive = !quizCompleted && currentIdx === idx;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => handleJumpQuestion(idx)}
                    className={`w-8 h-8 rounded-md text-xs font-mono font-semibold transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-slate-900 text-white'
                        : isSolved
                        ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                    aria-label={`Vai alla domanda ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {!quizCompleted ? (
          <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <span className="font-mono font-semibold text-slate-900 tabular-nums">
                  Domanda {currentIdx + 1} di {QUIZ_QUESTIONS.length}
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-sky-700 font-semibold">{currentQ.topic}</span>
              </div>
              {firstTryResults[currentQ.id] !== undefined && (
                <span className="text-xs font-medium text-slate-500">
                  {firstTryResults[currentQ.id] ? 'Primo tentativo esatto' : 'In fase di correzione'}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className={currentQ.diagramType ? 'lg:col-span-8' : 'lg:col-span-12'}>
                <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-5 leading-snug text-balance">
                  {currentQ.question}
                </h3>

                <div className="grid grid-cols-1 gap-3">
                  {currentQ.options.map((opt, oIdx) => {
                    const isSelected = selectedOptionId === opt.id;
                    let cardStyle =
                      'bg-white border-slate-200 text-slate-800 hover:bg-slate-50 hover:border-slate-300';
                    if (isSelected) {
                      cardStyle = opt.isCorrect
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950'
                        : 'bg-red-50 border-red-500 text-red-950';
                    }

                    const letter = String.fromCharCode(65 + oIdx);

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectOption(opt)}
                        className={`w-full text-left px-4 py-3.5 rounded-lg border transition-colors flex items-start justify-between gap-3 cursor-pointer ${cardStyle}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="font-mono text-xs font-bold mt-0.5 text-slate-500 shrink-0">
                            {letter}.
                          </span>
                          <span className="text-sm font-medium leading-relaxed">{opt.label}</span>
                        </div>
                        {isSelected &&
                          (opt.isCorrect ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                          ))}
                      </button>
                    );
                  })}
                </div>

                {/* Immediate Error / Success Feedback Box */}
                {selectedOption && (
                  <div
                    role="status"
                    className={`mt-5 rounded-xl border p-4 ${
                      selectedOption.isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                        : 'bg-red-50 border-red-200 text-red-950'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {selectedOption.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="text-xs font-bold mb-1">
                          {selectedOption.isCorrect
                            ? 'Risposta corretta'
                            : 'Attenzione: risposta non corretta'}
                        </div>
                        <p className="text-xs md:text-sm leading-relaxed">{selectedOption.feedback}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    {selectedOption && !selectedOption.isCorrect && (
                      <button
                        type="button"
                        onClick={handleRetryQuestion}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Riprova questa domanda
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={!selectedOption || !selectedOption.isCorrect}
                    onClick={handleNext}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-sky-600 text-white text-xs font-semibold hover:bg-sky-700 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Prossima Domanda' : 'Vedi Risultato Finale'}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {currentQ.diagramType && (
                <div className="lg:col-span-4">
                  <QuestionDiagram type={currentQ.diagramType} />
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Quiz Completion Summary Card */
          <div className="bg-white border border-slate-200 rounded-xl p-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-emerald-700 mb-1">Verifica completata</p>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Hai completato tutte le {QUIZ_QUESTIONS.length} domande!
              </h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Risposte esatte al primo tentativo:{' '}
                <strong className="font-mono text-slate-900 tabular-nums">
                  {firstTryScore}/{QUIZ_QUESTIONS.length}
                </strong>
                .{' '}
                {firstTryScore >= 5
                  ? 'Ottima padronanza delle proiezioni ortogonali: sei pronto per la tavola su foglio F4!'
                  : 'Buon lavoro! Rivedi gli argomenti dove hai fatto più tentativi usando il Laboratorio 3D qui sopra.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {QUIZ_QUESTIONS.map((q, idx) => {
                  const firstOk = firstTryResults[q.id];
                  return (
                    <button
                      key={q.id}
                      type="button"
                      onClick={() => handleJumpQuestion(idx)}
                      className="text-left p-3.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-slate-700">
                          Domanda {idx + 1}
                        </span>
                        <span
                          className={`text-xs font-semibold ${
                            firstOk ? 'text-emerald-700' : 'text-amber-700'
                          }`}
                        >
                          {firstOk ? 'Al 1° colpo' : 'Corretta dopo errore'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 truncate">{q.topic}</div>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={handleResetQuiz}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Ripeti la Verifica
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
