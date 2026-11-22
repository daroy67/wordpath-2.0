import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BarChart3,
  Clock,
  Flame,
  RotateCcw,
  Trash2
} from 'lucide-react';
import { GRAMMAR_LESSONS } from '../data/grammar';
import { READING_PASSAGES } from '../data/reading';
import { VOCAB_CATEGORIES, VOCABULARY_WORDS } from '../data/vocabulary';
import { NavView, WordPathState } from '../types/wordpath';

interface ProgressViewProps {
  state: WordPathState;
  metrics: {
    totalWords: number;
    learnedWordsCount: number;
    inProgressWordsCount: number;
    dueWordsCount: number;
    totalGrammarLessons: number;
    completedGrammarLessons: number;
    totalReadingPassages: number;
    completedReadingPassages: number;
    overallCompletionPercent: number;
    accuracyPercent: number | null;
    totalAnsweredQuestions: number;
    totalCorrectQuestions: number;
    streak: number;
    totalStudyMinutes: number;
    weeklyActivity: Array<{ date: string; label: string; minutes: number }>;
  };
  onNavigate: (view: NavView, targetId?: string) => void;
  onResetLearning: () => void;
  onResetAll: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  state,
  metrics,
  onNavigate,
  onResetLearning,
  onResetAll
}) => {
  const [showLearningResetModal, setShowLearningResetModal] = useState(false);
  const [showFullResetModal, setShowFullResetModal] = useState(false);
  const [confirmResetText, setConfirmResetText] = useState('');

  const newWordsCount = Math.max(
    0,
    metrics.totalWords - metrics.learnedWordsCount - metrics.inProgressWordsCount
  );

  const categoryBreakdown = useMemo(
    () =>
      VOCAB_CATEGORIES.map((category) => {
        const words = VOCABULARY_WORDS.filter((w) => w.category === category);
        const mastered = words.filter(
          (w) => state.wordProgress[w.id]?.status === 'mastered'
        ).length;
        const pct = Math.round((mastered / words.length) * 100);
        return { category, total: words.length, mastered, pct };
      }),
    [state.wordProgress]
  );

  const grammarScoreAvg = useMemo(() => {
    const completed = GRAMMAR_LESSONS.map((l) => state.grammarResults[l.id]).filter(
      (r): r is NonNullable<typeof r> => Boolean(r?.completed)
    );
    if (completed.length === 0) return null;
    const sum = completed.reduce((acc, r) => acc + (r.bestScore / r.totalQuestions) * 100, 0);
    return Math.round(sum / completed.length);
  }, [state.grammarResults]);

  const readingScoreAvg = useMemo(() => {
    const completed = READING_PASSAGES.map((p) => state.readingProgressById[p.id]).filter(
      (r): r is NonNullable<typeof r> => Boolean(r?.completed && r.quizScore !== null)
    );
    if (completed.length === 0) return null;
    const sum = completed.reduce(
      (acc, r) => acc + ((r.quizScore ?? 0) / r.totalQuestions) * 100,
      0
    );
    return Math.round(sum / completed.length);
  }, [state.readingProgressById]);

  const maxWeeklyMinutes = Math.max(20, ...metrics.weeklyActivity.map((d) => d.minutes));

  return (
    <div className="space-y-6">
      {/* Header Summary KPIs */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Progress &amp; Analytics
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Every figure below is computed directly from your completed reviews, quizzes, drafts, and diagnostic checks.
            </p>
          </div>
          <span className="font-mono text-sm font-bold text-indigo-600 tabular-nums dark:text-indigo-400">
            Overall Progress: {metrics.overallCompletionPercent}%
          </span>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Flame className="h-4 w-4 text-amber-500" />
              <span>Active Streak</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums dark:text-slate-100">
              {metrics.streak} {metrics.streak === 1 ? 'day' : 'days'}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Clock className="h-4 w-4 text-indigo-500" />
              <span>Estimated Study Time</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums dark:text-slate-100">
              {metrics.totalStudyMinutes} min
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Award className="h-4 w-4 text-teal-500" />
              <span>Quiz Accuracy</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums dark:text-slate-100">
              {metrics.accuracyPercent !== null ? `${metrics.accuracyPercent}%` : '—'}
            </p>
            <p className="text-[11px] text-slate-500 tabular-nums dark:text-slate-400">
              {metrics.totalAnsweredQuestions > 0
                ? `${metrics.totalCorrectQuestions}/${metrics.totalAnsweredQuestions} items`
                : 'No graded items yet'}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              <span>Studio Output</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums dark:text-slate-100">
              {state.writingDrafts.length + state.speakingSessions.length}
            </p>
            <p className="text-[11px] text-slate-500 tabular-nums dark:text-slate-400">
              {state.writingDrafts.length} drafts · {state.speakingSessions.length} spoken
            </p>
          </div>
        </div>
      </section>

      {/* Visual Charts Row: Weekly Activity + Skill Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Weekly Activity (Estimated Minutes)
          </h3>
          <div className="mt-5 flex h-40 items-end justify-between gap-2.5">
            {metrics.weeklyActivity.map((day) => {
              const pct = day.minutes > 0 ? Math.max(12, Math.round((day.minutes / maxWeeklyMinutes) * 100)) : 5;
              return (
                <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                    {day.minutes}m
                  </span>
                  <div className="flex h-24 w-full items-end justify-center">
                    <div
                      className={`w-full max-w-[36px] rounded-t-xl transition-all ${
                        day.minutes > 0
                          ? 'bg-gradient-to-t from-indigo-600 via-blue-500 to-teal-500'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                      style={{ height: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Skill Performance &amp; Vocabulary Distribution
          </h3>

          <div className="mt-4 space-y-3">
            {[
              {
                label: 'Vocabulary Mastered',
                pct: Math.round((metrics.learnedWordsCount / Math.max(1, metrics.totalWords)) * 100),
                detail: `${metrics.learnedWordsCount}/${metrics.totalWords}`,
                color: 'bg-indigo-600'
              },
              {
                label: 'Grammar Best Accuracy',
                pct: grammarScoreAvg ?? 0,
                detail:
                  grammarScoreAvg !== null
                    ? `${grammarScoreAvg}% (${metrics.completedGrammarLessons}/${metrics.totalGrammarLessons} done)`
                    : 'Not attempted yet',
                color: 'bg-blue-600'
              },
              {
                label: 'Reading Comprehension Avg',
                pct: readingScoreAvg ?? 0,
                detail:
                  readingScoreAvg !== null
                    ? `${readingScoreAvg}% (${metrics.completedReadingPassages}/${metrics.totalReadingPassages} done)`
                    : 'Not attempted yet',
                color: 'bg-teal-600'
              }
            ].map((bar) => (
              <div key={bar.label}>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>{bar.label}</span>
                  <span className="tabular-nums">{bar.detail}</span>
                </div>
                <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className={`h-full rounded-full ${bar.color}`} style={{ width: `${bar.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Vocabulary Mastery Distribution Stacked Bar */}
          <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              Vocabulary Deck Distribution ({metrics.totalWords} words)
            </p>
            <div className="mt-2 flex h-3.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="bg-teal-600"
                style={{ width: `${(metrics.learnedWordsCount / metrics.totalWords) * 100}%` }}
                title={`Mastered: ${metrics.learnedWordsCount}`}
              />
              <div
                className="bg-amber-500"
                style={{ width: `${(metrics.inProgressWordsCount / metrics.totalWords) * 100}%` }}
                title={`Learning: ${metrics.inProgressWordsCount}`}
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-600 tabular-nums dark:text-slate-400">
              <span>Mastered: {metrics.learnedWordsCount}</span>
              <span>Learning: {metrics.inProgressWordsCount}</span>
              <span>Due Now: {metrics.dueWordsCount}</span>
              <span>Unseen: {newWordsCount}</span>
            </div>
          </div>
        </section>
      </div>

      {/* 10-Category Vocabulary Breakdown */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Vocabulary Mastery by Topic (10 Categories)
          </h3>
          <button
            type="button"
            onClick={() => onNavigate('vocabulary')}
            className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Open Vocabulary
          </button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {categoryBreakdown.map((item) => (
            <div
              key={item.category}
              className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-800/50"
            >
              <p className="truncate text-xs font-bold text-slate-900 dark:text-slate-100">
                {item.category}
              </p>
              <p className="mt-1 font-mono text-xs text-slate-600 tabular-nums dark:text-slate-400">
                {item.mastered}/{item.total} ({item.pct}%)
              </p>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-indigo-600 dark:bg-indigo-400"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Activity History & Safe Reset Controls */}
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Recent Learning Log
          </h3>
          {state.activityLog.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              No completed reviews, quizzes, or drafts yet. Everything you complete appears here in chronological order.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
              {state.activityLog.slice(0, 10).map((entry) => (
                <li key={entry.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                      {entry.label}
                    </p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {entry.detail}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-slate-400 tabular-nums">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Reset Controls
          </h3>
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            Resetting learning progress clears words, quizzes, and drafts while keeping your preferences and IB Project Hub notes safe.
          </p>
          <button
            type="button"
            onClick={() => setShowLearningResetModal(true)}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 text-xs font-semibold text-amber-900 hover:bg-amber-100 dark:border-amber-700/70 dark:bg-amber-950/40 dark:text-amber-200"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset Learning Progress</span>
          </button>
          <button
            type="button"
            onClick={() => setShowFullResetModal(true)}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 text-xs font-semibold text-rose-800 hover:bg-rose-100 dark:border-rose-800/70 dark:bg-rose-950/40 dark:text-rose-200"
          >
            <Trash2 className="h-4 w-4" />
            <span>Full Application Reset</span>
          </button>
        </section>
      </div>

      {/* Reset Learning Modal */}
      {showLearningResetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Reset Learning Progress?
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Your vocabulary, grammar, reading, placement, drafts, and streak data will reset to zero. Your theme, goal preferences, and IB Project Hub notes remain intact.
            </p>
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowLearningResetModal(false)}
                className="min-h-[44px] rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetLearning();
                  setShowLearningResetModal(false);
                }}
                className="min-h-[44px] rounded-xl bg-amber-600 px-4 text-sm font-semibold text-white hover:bg-amber-700"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Reset Modal */}
      {showFullResetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="text-lg font-bold">Full Application Reset</h3>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              This deletes all progress, settings, and IB reflections. Type{' '}
              <code className="font-mono font-bold text-rose-700 dark:text-rose-300">RESET ALL</code>{' '}
              to proceed.
            </p>
            <input
              type="text"
              value={confirmResetText}
              onChange={(e) => setConfirmResetText(e.target.value)}
              placeholder="RESET ALL"
              className="mt-3 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 font-mono text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowFullResetModal(false);
                  setConfirmResetText('');
                }}
                className="min-h-[44px] rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={confirmResetText.trim() !== 'RESET ALL'}
                onClick={() => {
                  onResetAll();
                  setShowFullResetModal(false);
                  setConfirmResetText('');
                }}
                className="min-h-[44px] rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Erase All Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
