import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  Circle,
  Compass,
  FileText,
  Flame,
  GraduationCap,
  Layers,
  Mic
} from 'lucide-react';
import { DAILY_PLAN_CONFIG } from '../data/dailyPlan';
import { DailyGoalMinutes, NavView, WordPathState } from '../types/wordpath';
import { PersonalizedLearningPath } from '../utils/learningPath';
import { MentorMascot } from './MentorMascot';

interface DashboardViewProps {
  state: WordPathState;
  metrics: {
    totalWords: number;
    learnedWordsCount: number;
    dueWordsCount: number;
    totalGrammarLessons: number;
    completedGrammarLessons: number;
    totalReadingPassages: number;
    completedReadingPassages: number;
    overallCompletionPercent: number;
    accuracyPercent: number | null;
    streak: number;
    vocabReviewedToday: number;
    grammarCompletedToday: boolean;
    readingCompletedToday: boolean;
    todayCompletedSteps: number;
    todayStudyMinutes: number;
    goalCompletionPercent: number;
    weeklyActivity: Array<{ date: string; label: string; minutes: number }>;
    dailyPlan: {
      totalMinutes: DailyGoalMinutes;
      vocabMinutes: number;
      grammarMinutes: number;
      readingMinutes: number;
      vocabTarget: number;
    };
    learningPath: PersonalizedLearningPath;
  };
  onNavigate: (view: NavView, targetId?: string) => void;
  onSelectGoal: (minutes: DailyGoalMinutes) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  state,
  metrics,
  onNavigate,
  onSelectGoal
}) => {
  const maxWeeklyMinutes = Math.max(20, ...metrics.weeklyActivity.map((d) => d.minutes));

  const dailySteps = [
    {
      id: 'vocab',
      title: `Review ${metrics.dailyPlan.vocabTarget} Vocabulary Words`,
      subtitle: `${Math.min(metrics.vocabReviewedToday, metrics.dailyPlan.vocabTarget)}/${metrics.dailyPlan.vocabTarget} today · ~${metrics.dailyPlan.vocabMinutes} min`,
      done: metrics.vocabReviewedToday >= metrics.dailyPlan.vocabTarget,
      view: 'vocabulary' as NavView
    },
    {
      id: 'grammar',
      title: `Grammar: ${metrics.learningPath.recommendedGrammarLesson.title}`,
      subtitle: `~${metrics.dailyPlan.grammarMinutes} min estimated`,
      done: metrics.grammarCompletedToday,
      view: 'grammar' as NavView,
      targetId: metrics.learningPath.recommendedGrammarLesson.id
    },
    {
      id: 'reading',
      title: `Reading: ${metrics.learningPath.recommendedReadingPassage.title.split(':')[0]}`,
      subtitle: `~${metrics.dailyPlan.readingMinutes} min estimated`,
      done: metrics.readingCompletedToday,
      view: 'reading' as NavView,
      targetId: metrics.learningPath.recommendedReadingPassage.id
    }
  ];

  const primaryRecommendation = metrics.learningPath.recommendations[0];

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <section className="rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-indigo-600 via-blue-600 to-teal-600 p-6 text-white shadow-sm dark:border-indigo-800/70">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-100">
              {state.practiceLevel} Daily Studio · Learn → Practice → Remember
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back, {state.learnerName}
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-indigo-100">
              Build your English, one focused session at a time. Choose a {state.dailyGoalMinutes}-minute daily pace or jump straight into AI-guided practice.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-xl bg-white/15 px-4 py-2.5 backdrop-blur-xs">
              <div className="flex items-center gap-1.5 text-xs font-medium text-indigo-100">
                <Flame className="h-4 w-4 text-amber-300" />
                <span>Streak</span>
              </div>
              <p className="mt-0.5 text-xl font-bold tabular-nums">
                {metrics.streak} {metrics.streak === 1 ? 'day' : 'days'}
              </p>
            </div>

            <div className="rounded-xl bg-white/15 px-4 py-2.5 backdrop-blur-xs">
              <p className="text-xs font-medium text-indigo-100">Mastered Words</p>
              <p className="mt-0.5 text-xl font-bold tabular-nums">
                {metrics.learnedWordsCount}/{metrics.totalWords}
              </p>
            </div>

            <div className="rounded-xl bg-white/15 px-4 py-2.5 backdrop-blur-xs">
              <p className="text-xs font-medium text-indigo-100">Overall Accuracy</p>
              <p className="mt-0.5 text-xl font-bold tabular-nums">
                {metrics.accuracyPercent !== null ? `${metrics.accuracyPercent}%` : '—'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Primary CTA Cards: Daily Plan + AI Mentor */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Daily Learning Plan */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-2 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Today&apos;s Learning Plan
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                {metrics.todayCompletedSteps}/3 core steps done · ~{metrics.todayStudyMinutes} min logged today
              </p>
            </div>

            <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
              {([10, 15, 20] as DailyGoalMinutes[]).map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => onSelectGoal(mins)}
                  className={`min-h-[36px] rounded-lg px-3 text-xs font-semibold transition whitespace-nowrap tabular-nums ${
                    state.dailyGoalMinutes === mins
                      ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-900 dark:text-indigo-300'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                  }`}
                >
                  {mins}m ({DAILY_PLAN_CONFIG[mins].vocabTarget}w)
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-blue-500 to-teal-500 transition-all duration-300"
              style={{ width: `${metrics.goalCompletionPercent}%` }}
            />
          </div>

          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {dailySteps.map((step) => (
              <div key={step.id} className="flex items-center justify-between gap-3 py-3">
                <div className="flex items-start gap-3">
                  {step.done ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600 dark:text-teal-400" />
                  ) : (
                    <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-300 dark:text-slate-600" />
                  )}
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        step.done
                          ? 'text-slate-500 line-through dark:text-slate-400'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{step.subtitle}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate(step.view, step.targetId)}
                  className="inline-flex min-h-[38px] shrink-0 items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-indigo-300 dark:hover:bg-indigo-950/60"
                >
                  <span>{step.done ? 'Revisit' : 'Start'}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Quick AI Mentor Card */}
        <section className="flex flex-col justify-between rounded-2xl border border-indigo-200 bg-gradient-to-b from-indigo-50/90 to-white p-5 shadow-xs dark:border-indigo-900/70 dark:from-indigo-950/50 dark:to-slate-900">
          <div>
            <div className="flex items-center gap-3">
              <MentorMascot state="ready" size="sm" />
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  WordPath AI Mentor
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  5 tutoring modes · {state.practiceLevel} focus
                </p>
              </div>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              Practice live conversation, get instant grammar contrasts, check collocations, or test yourself with custom mini-quizzes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('ai-mentor')}
            className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-blue-700"
          >
            <Bot className="h-4 w-4" />
            <span>Open AI Mentor</span>
          </button>
        </section>
      </div>

      {/* Weekly Activity + Recommended Focus */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 7-Day Activity Mini Chart */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                7-Day Study Activity
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Estimated minutes recorded from completed actions
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('progress')}
              className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
            >
              Full analytics
            </button>
          </div>

          <div className="mt-5 flex h-32 items-end justify-between gap-2">
            {metrics.weeklyActivity.map((day) => {
              const heightPct = day.minutes > 0 ? Math.max(12, Math.round((day.minutes / maxWeeklyMinutes) * 100)) : 6;
              return (
                <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-[11px] font-medium text-slate-500 tabular-nums dark:text-slate-400">
                    {day.minutes > 0 ? `${day.minutes}m` : '0'}
                  </span>
                  <div className="flex h-20 w-full items-end justify-center">
                    <div
                      className={`w-full max-w-[32px] rounded-t-lg transition-all ${
                        day.minutes > 0
                          ? 'bg-gradient-to-t from-indigo-600 to-teal-500'
                          : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                      style={{ height: `${heightPct}%` }}
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

        {/* Adaptive Recommendation & Skill Focus */}
        <section className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Adaptive Next Step
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('learning-path')}
                className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
              >
                View full path
              </button>
            </div>

            {primaryRecommendation && (
              <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {primaryRecommendation.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                  {primaryRecommendation.reason}
                </p>
                <button
                  type="button"
                  onClick={() =>
                    onNavigate(primaryRecommendation.targetView, primaryRecommendation.targetId)
                  }
                  className="mt-3 inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 text-xs font-semibold text-white transition hover:bg-indigo-700"
                >
                  <span>{primaryRecommendation.actionLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>

          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {metrics.learningPath.dataSummaryNote}
          </p>
        </section>
      </div>

      {/* Quick Access Grid Across Modules */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {[
          {
            view: 'vocabulary' as NavView,
            title: 'Vocabulary',
            stat: `${metrics.learnedWordsCount}/${metrics.totalWords} learned`,
            detail: metrics.dueWordsCount > 0 ? `${metrics.dueWordsCount} due for review` : '10 B1–B2 topics',
            icon: Layers,
            accent: 'text-indigo-600 dark:text-indigo-400'
          },
          {
            view: 'grammar' as NavView,
            title: 'Grammar',
            stat: `${metrics.completedGrammarLessons}/${metrics.totalGrammarLessons} modules`,
            detail: '48 practice questions',
            icon: BookOpen,
            accent: 'text-blue-600 dark:text-blue-400'
          },
          {
            view: 'reading' as NavView,
            title: 'Reading',
            stat: `${metrics.completedReadingPassages}/${metrics.totalReadingPassages} passages`,
            detail: 'Glossary + comprehension',
            icon: FileText,
            accent: 'text-teal-600 dark:text-teal-400'
          },
          {
            view: 'studio' as NavView,
            title: 'Writing & Speaking',
            stat: `${state.writingDrafts.length} drafts · ${state.speakingSessions.length} spoken`,
            detail: 'Draft & transcript coach',
            icon: Mic,
            accent: 'text-violet-600 dark:text-violet-400'
          },
          {
            view: 'placement' as NavView,
            title: 'Placement Check',
            stat: state.placementResult
              ? `${state.placementResult.score}/${state.placementResult.answeredQuestions}`
              : '24 questions',
            detail: state.placementResult
              ? `Focus: ${state.placementResult.recommendedLevel}`
              : 'Informal skill check',
            icon: GraduationCap,
            accent: 'text-amber-600 dark:text-amber-400'
          }
        ].map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.view}
              type="button"
              onClick={() => onNavigate(card.view)}
              className="flex flex-col items-start rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-xs transition hover:border-indigo-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
            >
              <Icon className={`h-5 w-5 ${card.accent}`} />
              <p className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">
                {card.title}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-slate-700 tabular-nums dark:text-slate-300">
                {card.stat}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{card.detail}</p>
            </button>
          );
        })}
      </section>
    </div>
  );
};
