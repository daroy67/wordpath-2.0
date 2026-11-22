import React from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  FileText,
  TrendingUp
} from 'lucide-react';
import { GRAMMAR_LESSONS } from '../data/grammar';
import { READING_PASSAGES } from '../data/reading';
import { NavView, WordPathState } from '../types/wordpath';
import { PersonalizedLearningPath } from '../utils/learningPath';

interface LearningPathViewProps {
  state: WordPathState;
  learningPath: PersonalizedLearningPath;
  onNavigate: (view: NavView, targetId?: string) => void;
}

export const LearningPathView: React.FC<LearningPathViewProps> = ({
  state,
  learningPath,
  onNavigate
}) => {
  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Adaptive Learning Path
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Your personalized next steps
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {learningPath.dataSummaryNote}
            </p>
          </div>
          <div className="shrink-0 rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2.5 text-sm dark:border-indigo-800 dark:bg-indigo-950/50">
            <span className="text-xs text-indigo-700 dark:text-indigo-300">Current Target</span>
            <p className="font-bold text-indigo-950 dark:text-indigo-100">
              {state.placementResult
                ? `${state.placementResult.recommendedLevel} Focus`
                : `${state.practiceLevel} Practice`}
            </p>
          </div>
        </div>
      </section>

      {/* Recommended Actions */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Recommended Actions
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {learningPath.recommendations.map((rec) => (
            <div
              key={rec.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-indigo-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs font-semibold">
                  <span
                    className={
                      rec.priority === 'high'
                        ? 'text-rose-600 dark:text-rose-400'
                        : rec.priority === 'medium'
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-teal-600 dark:text-teal-400'
                    }
                  >
                    {rec.priority === 'high'
                      ? 'Priority Focus'
                      : rec.priority === 'medium'
                        ? 'Core Step'
                        : 'Suggested Next'}
                  </span>
                </div>
                <h4 className="mt-1.5 text-base font-bold text-slate-900 dark:text-slate-100">
                  {rec.title}
                </h4>
                <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{rec.reason}</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(rec.targetView, rec.targetId)}
                className="mt-4 inline-flex min-h-[44px] w-fit items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700"
              >
                <span>{rec.actionLabel}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Strong Areas vs Areas to Improve */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Strong Areas</h3>
          </div>
          {learningPath.strongAreas.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              Complete vocabulary reviews, grammar checks (75%+), or reading passages (80%+) to highlight verified strengths here.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
              {learningPath.strongAreas.map((area) => (
                <li key={area.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {area.label}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{area.detail}</p>
                  </div>
                  {area.scorePercent !== null && (
                    <span className="text-sm font-bold text-teal-600 tabular-nums dark:text-teal-400">
                      {area.scorePercent}%
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <Compass className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Areas to Improve
            </h3>
          </div>
          {learningPath.areasToImprove.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              {learningPath.hasEnoughData
                ? 'No weak spots detected right now. Keep practicing new B2 topics!'
                : 'No recorded weak areas yet. Take the Placement Check or try a lesson to map focus spots.'}
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
              {learningPath.areasToImprove.map((area) => (
                <li key={area.id} className="flex items-center justify-between gap-3 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {area.label}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{area.detail}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate(area.targetView)}
                    className="min-h-[36px] shrink-0 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-50 dark:border-slate-700 dark:text-indigo-400 dark:hover:bg-indigo-950/50"
                  >
                    Practice
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Curriculum Map: Grammar & Reading */}
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Grammar Curriculum ({GRAMMAR_LESSONS.length})
              </h3>
            </div>
          </div>
          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            {GRAMMAR_LESSONS.map((lesson) => {
              const res = state.grammarResults[lesson.id];
              const done = Boolean(res?.completed);
              return (
                <div key={lesson.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {lesson.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      {lesson.level} · {lesson.estimatedMinutes} min
                      {done && res ? ` · Best ${res.bestScore}/${res.totalQuestions}` : ' · Upcoming'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('grammar', lesson.id)}
                    className={`inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${
                      done
                        ? 'bg-teal-50 text-teal-800 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 dark:bg-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {done && <CheckCircle2 className="h-3.5 w-3.5" />}
                    <span>{done ? 'Review' : 'Start'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Reading Library ({READING_PASSAGES.length})
            </h3>
          </div>
          <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
            {READING_PASSAGES.map((passage) => {
              const rp = state.readingProgressById[passage.id];
              const done = Boolean(rp?.completed);
              return (
                <div key={passage.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {passage.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      {passage.level} · {passage.wordCount} words ·{' '}
                      {done && rp?.quizScore !== null
                        ? `Score ${rp.quizScore}/${rp.totalQuestions}`
                        : 'Unread'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('reading', passage.id)}
                    className={`inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition ${
                      done
                        ? 'bg-teal-50 text-teal-800 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300'
                        : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 dark:bg-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {done && <CheckCircle2 className="h-3.5 w-3.5" />}
                    <span>{done ? 'Re-read' : 'Read'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
