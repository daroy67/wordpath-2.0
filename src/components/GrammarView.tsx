import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { GRAMMAR_LESSONS } from '../data/grammar';
import { CEFRLevel, GrammarLessonResult } from '../types/wordpath';

interface GrammarViewProps {
  grammarResults: Record<string, GrammarLessonResult>;
  selectedLessonId?: string;
  onSubmitQuiz: (lessonId: string, answers: Record<string, number>) => void;
}

export const GrammarView: React.FC<GrammarViewProps> = ({
  grammarResults,
  selectedLessonId,
  onSubmitQuiz
}) => {
  const [levelFilter, setLevelFilter] = useState<'All' | CEFRLevel>('All');
  const [activeLessonId, setActiveLessonId] = useState<string>(
    selectedLessonId || GRAMMAR_LESSONS[0].id
  );
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (selectedLessonId && GRAMMAR_LESSONS.some((l) => l.id === selectedLessonId)) {
      setActiveLessonId(selectedLessonId);
    }
  }, [selectedLessonId]);

  const filteredLessons = useMemo(
    () =>
      levelFilter === 'All'
        ? GRAMMAR_LESSONS
        : GRAMMAR_LESSONS.filter((l) => l.level === levelFilter),
    [levelFilter]
  );

  const activeLesson =
    GRAMMAR_LESSONS.find((l) => l.id === activeLessonId) ?? filteredLessons[0] ?? GRAMMAR_LESSONS[0];
  const savedResult = grammarResults[activeLesson.id];

  useEffect(() => {
    if (savedResult?.completed) {
      setSelectedAnswers(savedResult.lastAnswers ?? {});
      setSubmitted(true);
    } else {
      setSelectedAnswers({});
      setSubmitted(false);
    }
  }, [activeLesson.id, savedResult]);

  const allAnswered = activeLesson.questions.every(
    (q) => typeof selectedAnswers[q.id] === 'number'
  );

  const currentScore = activeLesson.questions.reduce(
    (sum, q) => sum + (selectedAnswers[q.id] === q.correctIndex ? 1 : 0),
    0
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAnswered) return;
    onSubmitQuiz(activeLesson.id, selectedAnswers);
    setSubmitted(true);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Lesson Selector */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Grammar Workshops
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {GRAMMAR_LESSONS.length} structured B1–B2 modules with clear formulas, common error contrasts, and instant graded practice.
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

        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLessons.map((lesson) => {
            const res = grammarResults[lesson.id];
            const isActive = lesson.id === activeLesson.id;
            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => setActiveLessonId(lesson.id)}
                className={`flex min-h-[52px] items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left transition ${
                  isActive
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-xs dark:border-indigo-400 dark:bg-indigo-950/60 dark:text-indigo-50'
                    : 'border-slate-200 bg-slate-50/70 text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold">{lesson.title}</p>
                  <p className="text-[11px] text-slate-500 tabular-nums dark:text-slate-400">
                    {lesson.level} · {lesson.estimatedMinutes} min
                  </p>
                </div>
                {res?.completed && (
                  <span className="shrink-0 font-mono text-xs font-bold text-teal-600 tabular-nums dark:text-teal-400">
                    {res.bestScore}/{res.totalQuestions}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Lesson Content */}
      <article className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {activeLesson.level} Grammar · ~{activeLesson.estimatedMinutes} min
            {savedResult?.completed
              ? ` · Best Score ${savedResult.bestScore}/${savedResult.totalQuestions}`
              : ''}
          </p>
          <h3 className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">
            {activeLesson.title}
          </h3>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
            {activeLesson.summary}
          </p>
        </div>

        {/* Formula Callout */}
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/70 p-4 dark:border-indigo-900 dark:bg-indigo-950/40">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
            Core Pattern
          </p>
          <p className="mt-1 font-mono text-sm font-medium text-indigo-950 break-words dark:text-indigo-100">
            {activeLesson.formula}
          </p>
        </div>

        {/* Clear Rules */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            How to Use It
          </h4>
          <ul className="space-y-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {activeLesson.explanation.map((line, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Examples & Mistake Contrasts */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
              Natural Examples
            </h4>
            <ul className="mt-2.5 space-y-3">
              {activeLesson.examples.map((ex, idx) => (
                <li key={idx} className="text-sm">
                  <p className="font-semibold text-slate-900 dark:text-slate-100">{ex.sentence}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{ex.note}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              Common Mistakes to Avoid
            </h4>
            <ul className="mt-2.5 space-y-3">
              {activeLesson.commonMistakes.map((m, idx) => (
                <li key={idx} className="text-sm">
                  <p className="text-rose-700 line-through dark:text-rose-400">{m.incorrect}</p>
                  <p className="font-semibold text-teal-700 dark:text-teal-300">{m.correct}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{m.why}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 4-Question Interactive Check */}
        <form onSubmit={handleSubmit} className="space-y-4 border-t border-slate-200 pt-5 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Interactive Practice ({activeLesson.questions.length} Questions)
            </h4>
            {submitted && (
              <span className="font-mono text-sm font-bold text-teal-600 tabular-nums dark:text-teal-400">
                Score: {currentScore}/{activeLesson.questions.length}
              </span>
            )}
          </div>

          <div className="space-y-4">
            {activeLesson.questions.map((q, qIdx) => {
              const userChoice = selectedAnswers[q.id];
              const isCorrect = userChoice === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {qIdx + 1}. {q.prompt}
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
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
                          className={`min-h-[44px] rounded-xl border px-3.5 py-2 text-left text-sm transition ${
                            showRight
                              ? 'border-teal-600 bg-teal-50 font-semibold text-teal-950 dark:border-teal-500 dark:bg-teal-950/60 dark:text-teal-100'
                              : showWrong
                                ? 'border-rose-500 bg-rose-50 text-rose-900 dark:border-rose-500 dark:bg-rose-950/50 dark:text-rose-200'
                                : picked
                                  ? 'border-indigo-600 bg-indigo-50 font-semibold text-indigo-950 dark:border-indigo-400 dark:bg-indigo-950/60 dark:text-indigo-100'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
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
                      <span>
                        <strong>{isCorrect ? 'Correct: ' : 'Incorrect: '}</strong>
                        {q.explanation}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            {submitted ? (
              <button
                type="button"
                onClick={handleRetake}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Retake Practice</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!allAnswered}
                className="min-h-[44px] rounded-xl bg-indigo-600 px-6 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Check Answers
              </button>
            )}
          </div>
        </form>
      </article>
    </div>
  );
};
