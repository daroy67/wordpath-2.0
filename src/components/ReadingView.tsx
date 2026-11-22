import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Maximize2,
  Minimize2,
  RotateCcw,
  Square,
  Volume2
} from 'lucide-react';
import { READING_PASSAGES } from '../data/reading';
import { CEFRLevel, ReadingPassageProgress } from '../types/wordpath';
import { speakEnglish, stopSpeech } from '../utils/speech';

interface ReadingViewProps {
  readingProgressById: Record<string, ReadingPassageProgress>;
  selectedPassageId?: string;
  onUpdateScrollProgress: (passageId: string, percent: number) => void;
  onSubmitQuiz: (passageId: string, answers: Record<string, number>) => void;
}

export const ReadingView: React.FC<ReadingViewProps> = ({
  readingProgressById,
  selectedPassageId,
  onUpdateScrollProgress,
  onSubmitQuiz
}) => {
  const [levelFilter, setLevelFilter] = useState<'All' | CEFRLevel>('All');
  const [activePassageId, setActivePassageId] = useState<string>(
    selectedPassageId || READING_PASSAGES[0].id
  );
  const [activeTerm, setActiveTerm] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [distractionFree, setDistractionFree] = useState(false);

  useEffect(() => {
    if (selectedPassageId && READING_PASSAGES.some((p) => p.id === selectedPassageId)) {
      setActivePassageId(selectedPassageId);
    }
  }, [selectedPassageId]);

  const filteredPassages = useMemo(
    () =>
      levelFilter === 'All'
        ? READING_PASSAGES
        : READING_PASSAGES.filter((p) => p.level === levelFilter),
    [levelFilter]
  );

  const passage =
    READING_PASSAGES.find((p) => p.id === activePassageId) ??
    filteredPassages[0] ??
    READING_PASSAGES[0];
  const savedProgress = readingProgressById[passage.id];

  useEffect(() => {
    stopSpeech();
    setIsSpeaking(false);
    setActiveTerm(null);
    if (savedProgress?.completed) {
      setSelectedAnswers(savedProgress.lastAnswers ?? {});
      setSubmitted(true);
    } else {
      setSelectedAnswers({});
      setSubmitted(false);
    }
  }, [passage.id, savedProgress]);

  useEffect(() => {
    return () => stopSpeech();
  }, []);

  const glossaryMap = useMemo(() => {
    const map = new Map<string, (typeof passage.glossary)[number]>();
    for (const g of passage.glossary) {
      map.set(g.term.toLowerCase(), g);
    }
    return map;
  }, [passage.glossary]);

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      speakEnglish(passage.paragraphs.join(' '), {
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false)
      });
    }
  };

  const renderParagraphWithGlossary = (text: string) => {
    if (passage.glossary.length === 0) return text;
    const escaped = passage.glossary.map((g) =>
      g.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    const regex = new RegExp(`\\b(${escaped.join('|')})\\b`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const match = glossaryMap.get(part.toLowerCase());
      if (!match) return <React.Fragment key={index}>{part}</React.Fragment>;
      const isSelected = activeTerm === match.term;
      return (
        <button
          key={index}
          type="button"
          onClick={() => setActiveTerm(isSelected ? null : match.term)}
          className={`mx-0.5 inline rounded-md border-b-2 px-1 font-semibold transition ${
            isSelected
              ? 'border-indigo-600 bg-indigo-100 text-indigo-950 dark:border-indigo-400 dark:bg-indigo-900 dark:text-indigo-100'
              : 'border-teal-500/70 bg-teal-50/70 text-teal-900 hover:bg-teal-100 dark:border-teal-400/60 dark:bg-teal-950/50 dark:text-teal-200'
          }`}
        >
          {part}
        </button>
      );
    });
  };

  const activeGlossaryItem = passage.glossary.find((g) => g.term === activeTerm);

  const allAnswered = passage.questions.every((q) => typeof selectedAnswers[q.id] === 'number');
  const currentScore = passage.questions.reduce(
    (sum, q) => sum + (selectedAnswers[q.id] === q.correctIndex ? 1 : 0),
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAnswered) return;
    onSubmitQuiz(passage.id, selectedAnswers);
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      {/* Passage Selector (hidden in distraction-free mode) */}
      {!distractionFree && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Reading Room
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {READING_PASSAGES.length} original B1–B2 passages with clickable inline glossaries, speech audio, and comprehension checks.
              </p>
            </div>
            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
              {(['All', 'B1', 'B2'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevelFilter(lvl)}
                  className={`min-h-[36px] rounded-lg px-3.5 text-xs font-semibold transition ${
                    levelFilter === lvl
                      ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-900 dark:text-indigo-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {filteredPassages.map((item) => {
              const rp = readingProgressById[item.id];
              const active = item.id === passage.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActivePassageId(item.id)}
                  className={`flex min-h-[60px] flex-col justify-between rounded-xl border p-3 text-left transition ${
                    active
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-xs dark:border-indigo-400 dark:bg-indigo-950/60 dark:text-indigo-50'
                      : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <p className="line-clamp-2 text-xs font-bold leading-snug">{item.title}</p>
                  <p className="mt-1.5 flex items-center justify-between text-[11px] text-slate-500 tabular-nums dark:text-slate-400">
                    <span>
                      {item.level} · {item.wordCount}w
                    </span>
                    {rp?.completed && rp.quizScore !== null && (
                      <span className="font-bold text-teal-600 dark:text-teal-400">
                        {rp.quizScore}/{rp.totalQuestions}
                      </span>
                    )}
                  </p>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Passage Article */}
      <article className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-8 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-5 dark:border-slate-800">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              {passage.level} · {passage.topic} · {passage.wordCount} words · ~{passage.estimatedMinutes} min
            </p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {passage.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{passage.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleToggleSpeech}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {isSpeaking ? <Square className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
              <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
            </button>

            <button
              type="button"
              onClick={() => setDistractionFree((v) => !v)}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {distractionFree ? (
                <>
                  <Minimize2 className="h-3.5 w-3.5" />
                  <span>Exit Focus Mode</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-3.5 w-3.5" />
                  <span>Focus Reader</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Reading Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Tap highlighted words to open glossary definitions</span>
            </span>
            <span className="font-mono tabular-nums">
              {savedProgress?.readProgressPercent ?? 0}% read
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-indigo-600 transition-all"
              style={{ width: `${savedProgress?.readProgressPercent ?? 0}%` }}
            />
          </div>
        </div>

        {/* Paragraphs with checkpoints */}
        <div className="space-y-5 text-base leading-relaxed text-slate-800 dark:text-slate-200">
          {passage.paragraphs.map((para, idx) => {
            const pct = Math.round(((idx + 1) / passage.paragraphs.length) * 100);
            return (
              <div
                key={idx}
                onMouseEnter={() => onUpdateScrollProgress(passage.id, pct)}
                onClick={() => onUpdateScrollProgress(passage.id, pct)}
              >
                <p>{renderParagraphWithGlossary(para)}</p>
              </div>
            );
          })}
        </div>

        {/* Active Glossary Card */}
        {activeGlossaryItem && (
          <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm dark:border-teal-800 dark:bg-teal-950/50">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-teal-950 dark:text-teal-100">
                {activeGlossaryItem.term}
              </span>
              <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">
                RU: {activeGlossaryItem.russian}
              </span>
            </div>
            <p className="mt-1 text-teal-900 dark:text-teal-200">
              {activeGlossaryItem.definition}
            </p>
          </div>
        )}

        {/* Glossary Chips Reference */}
        <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4 text-xs dark:border-slate-800">
          <span className="font-semibold text-slate-500 dark:text-slate-400">Glossary:</span>
          {passage.glossary.map((g) => (
            <button
              key={g.term}
              type="button"
              onClick={() => setActiveTerm(activeTerm === g.term ? null : g.term)}
              className={`min-h-[32px] rounded-lg border px-2.5 font-semibold transition ${
                activeTerm === g.term
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-800 dark:border-indigo-400 dark:bg-indigo-950 dark:text-indigo-200'
                  : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              {g.term}
            </button>
          ))}
        </div>

        {/* Comprehension Quiz */}
        <form onSubmit={handleSubmit} className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Comprehension Check ({passage.questions.length} Questions)
            </h4>
            {submitted && (
              <span className="font-mono text-sm font-bold text-teal-600 tabular-nums dark:text-teal-400">
                Score: {currentScore}/{passage.questions.length}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {passage.questions.map((q, qIdx) => {
              const userChoice = selectedAnswers[q.id];
              const isCorrect = userChoice === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {q.type === 'tf' ? 'True / False' : 'Multiple Choice'}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {qIdx + 1}. {q.prompt}
                  </p>

                  <div className="mt-3 space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const picked = userChoice === optIdx;
                      const showRight = submitted && optIdx === q.correctIndex;
                      const showWrong = submitted && picked && !showRight;
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={submitted}
                          onClick={() =>
                            setSelectedAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                          }
                          className={`min-h-[44px] w-full rounded-xl border px-3.5 py-2 text-left text-sm transition ${
                            showRight
                              ? 'border-teal-600 bg-teal-50 font-semibold text-teal-950 dark:border-teal-500 dark:bg-teal-950/60 dark:text-teal-100'
                              : showWrong
                                ? 'border-rose-500 bg-rose-50 text-rose-900 dark:border-rose-500 dark:bg-rose-950/50 dark:text-rose-200'
                                : picked
                                  ? 'border-indigo-600 bg-indigo-50 font-semibold text-indigo-950 dark:border-indigo-400 dark:bg-indigo-950/60 dark:text-indigo-100'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && (
                    <div
                      className={`mt-3 flex items-start gap-2 rounded-lg px-3 py-2 text-xs ${
                        isCorrect
                          ? 'bg-teal-50 text-teal-900 dark:bg-teal-950/50 dark:text-teal-200'
                          : 'bg-rose-50 text-rose-900 dark:bg-rose-950/50 dark:text-rose-200'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                      ) : (
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                      )}
                      <span>{q.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end">
            {submitted ? (
              <button
                type="button"
                onClick={() => {
                  setSelectedAnswers({});
                  setSubmitted(false);
                }}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Retake Quiz</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!allAnswered}
                className="min-h-[44px] rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Submit Reading Check
              </button>
            )}
          </div>
        </form>
      </article>
    </div>
  );
};
