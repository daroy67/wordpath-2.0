import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Info,
  RotateCcw
} from 'lucide-react';
import { GRAMMAR_LESSONS } from '../data/grammar';
import { PLACEMENT_QUESTIONS } from '../data/placement';
import { NavView, PlacementResult } from '../types/wordpath';

interface PlacementTestViewProps {
  placementResult: PlacementResult | null;
  onSubmitTest: (answers: Record<string, number>) => void;
  onNavigate: (view: NavView, targetId?: string) => void;
}

export const PlacementTestView: React.FC<PlacementTestViewProps> = ({
  placementResult,
  onSubmitTest,
  onNavigate
}) => {
  const [questionLimit, setQuestionLimit] = useState<24 | 12>(24);
  const [answers, setAnswers] = useState<Record<string, number>>(
    placementResult?.answers ?? {}
  );
  const [isRetaking, setIsRetaking] = useState(!placementResult?.completed);

  const activeQuestions = useMemo(
    () =>
      questionLimit === 24
        ? PLACEMENT_QUESTIONS
        : PLACEMENT_QUESTIONS.filter((_, i) => i % 2 === 0).slice(0, 12),
    [questionLimit]
  );

  const answeredCount = activeQuestions.filter(
    (q) => typeof answers[q.id] === 'number'
  ).length;
  const allAnswered = answeredCount === activeQuestions.length;
  const progressPct = Math.round((answeredCount / activeQuestions.length) * 100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allAnswered) return;
    onSubmitTest(answers);
    setIsRetaking(false);
  };

  const startRetake = (limit: 24 | 12) => {
    setQuestionLimit(limit);
    setAnswers({});
    setIsRetaking(true);
  };

  if (!isRetaking && placementResult?.completed) {
    const pct = Math.round(
      (placementResult.score / Math.max(1, placementResult.answeredQuestions)) * 100
    );
    const focusTitle =
      placementResult.recommendedLevel === 'B2' ? 'B2 Extension' : 'B1 Foundations';

    const suggestedLessons = GRAMMAR_LESSONS.filter((l) =>
      placementResult.suggestedLessonIds.includes(l.id)
    );

    return (
      <div className="space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {placementResult.isPartial ? 'Indicative Quick Check Result' : 'Full 24-Item Diagnostic Result'}
              </p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
                Recommended Practice Focus: {focusTitle}
              </h2>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 tabular-nums">
                Score: {placementResult.score} / {placementResult.answeredQuestions} ({pct}%)
              </p>
            </div>

            <button
              type="button"
              onClick={() => startRetake(24)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Retake Diagnostic</span>
            </button>
          </div>

          {/* Skill Breakdown */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              {
                label: 'Vocabulary',
                correct: placementResult.vocabCorrect,
                total: placementResult.vocabTotal
              },
              {
                label: 'Grammar',
                correct: placementResult.grammarCorrect,
                total: placementResult.grammarTotal
              },
              {
                label: 'Reading & Context',
                correct: placementResult.readingCorrect,
                total: placementResult.readingTotal
              }
            ].map((sk) => {
              const sPct = sk.total > 0 ? Math.round((sk.correct / sk.total) * 100) : 0;
              return (
                <div
                  key={sk.label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60"
                >
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {sk.label}
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900 tabular-nums dark:text-slate-100">
                    {sk.correct}/{sk.total} <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">({sPct}%)</span>
                  </p>
                </div>
              );
            })}
          </div>

          {/* Honest Non-CEFR Disclaimer */}
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs leading-relaxed text-blue-950 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="font-semibold">Informal Internal Placement Check Disclaimer</p>
              <p className="mt-0.5">
                This short check guides lesson selection inside WordPath only. It is not an official CEFR exam and does not certify language proficiency.
                {placementResult.isPartial
                  ? ' You completed the 12-item quick check; take all 24 items for fuller topic coverage.'
                  : ''}
              </p>
            </div>
          </div>

          {/* Suggested Next Lessons */}
          {suggestedLessons.length > 0 && (
            <div className="mt-6 border-t border-slate-200 pt-5 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Suggested Starting Modules
              </h3>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
                {suggestedLessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    type="button"
                    onClick={() => onNavigate('grammar', lesson.id)}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-left text-xs font-semibold text-slate-800 hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <span className="truncate">{lesson.title}</span>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-indigo-600 dark:text-indigo-400" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Detailed Answer Review */}
        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Answer Review
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {PLACEMENT_QUESTIONS.filter((q) => typeof placementResult.answers[q.id] === 'number').map(
              (q, idx) => {
                const userChoice = placementResult.answers[q.id];
                const isRight = userChoice === q.correctIndex;
                return (
                  <div key={q.id} className="py-3.5 text-sm">
                    <div className="flex items-start gap-2.5">
                      {isRight ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                      ) : (
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                      )}
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {idx + 1}. {q.prompt}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-400">
                          Your answer: <strong>{q.options[userChoice]}</strong> · Correct:{' '}
                          <strong className="text-teal-700 dark:text-teal-400">
                            {q.options[q.correctIndex]}
                          </strong>
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {q.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <GraduationCap className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Informal Diagnostic Check
              </span>
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Placement Check ({activeQuestions.length} Items)
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Covers vocabulary precision, core B1–B2 grammar, and contextual reading clues.
            </p>
          </div>

          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
            <button
              type="button"
              onClick={() => startRetake(24)}
              className={`min-h-[38px] rounded-lg px-3.5 text-xs font-semibold transition ${
                questionLimit === 24
                  ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-900 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Full (24 Qs)
            </button>
            <button
              type="button"
              onClick={() => startRetake(12)}
              className={`min-h-[38px] rounded-lg px-3.5 text-xs font-semibold transition ${
                questionLimit === 12
                  ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-900 dark:text-indigo-300'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Quick (12 Qs)
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-500 tabular-nums dark:text-slate-400">
            <span>Answered {answeredCount} of {activeQuestions.length}</span>
            <span>{progressPct}%</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-teal-500 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4">
        {activeQuestions.map((q, idx) => (
          <div
            key={q.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {q.skill} · {q.topicTag} · {q.targetLevel}
            </p>
            <p className="mt-1.5 text-sm font-bold text-slate-900 dark:text-slate-100">
              {idx + 1}. {q.prompt}
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {q.options.map((opt, optIdx) => {
                const picked = answers[q.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                    className={`min-h-[44px] rounded-xl border px-3.5 py-2 text-left text-sm transition ${
                      picked
                        ? 'border-indigo-600 bg-indigo-50 font-semibold text-indigo-950 dark:border-indigo-400 dark:bg-indigo-950/60 dark:text-indigo-100'
                        : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Informal learning check only (not an official CEFR exam).
          </span>
          <button
            type="submit"
            disabled={!allAnswered}
            className="min-h-[44px] rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-6 text-sm font-semibold text-white transition hover:from-indigo-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Score &amp; Save Diagnostic
          </button>
        </div>
      </form>
    </div>
  );
};
