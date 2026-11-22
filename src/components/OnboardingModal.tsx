import React, { useState } from 'react';
import { ArrowRight, Check, Sparkles, X } from 'lucide-react';
import { DAILY_PLAN_CONFIG } from '../data/dailyPlan';
import { CEFRLevel, DailyGoalMinutes, ExplanationLanguage, NavView } from '../types/wordpath';
import { MentorMascot } from './MentorMascot';

interface OnboardingModalProps {
  initialName: string;
  initialGoal: DailyGoalMinutes;
  initialLevel: CEFRLevel;
  initialExplanationLanguage: ExplanationLanguage;
  onComplete: (patch: {
    learnerName: string;
    dailyGoalMinutes: DailyGoalMinutes;
    practiceLevel: CEFRLevel;
    explanationLanguage: ExplanationLanguage;
  }) => void;
  onNavigate: (view: NavView) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialName,
  initialGoal,
  initialLevel,
  initialExplanationLanguage,
  onComplete,
  onNavigate
}) => {
  const [name, setName] = useState(initialName === 'Learner' ? '' : initialName);
  const [goal, setGoal] = useState<DailyGoalMinutes>(initialGoal);
  const [level, setLevel] = useState<CEFRLevel>(initialLevel);
  const [expLang, setExpLang] = useState<ExplanationLanguage>(initialExplanationLanguage);

  const handleFinish = (goTo: NavView) => {
    onComplete({
      learnerName: name.trim().slice(0, 32) || 'Learner',
      dailyGoalMinutes: goal,
      practiceLevel: level,
      explanationLanguage: expLang
    });
    onNavigate(goTo);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Top Gradient Header */}
        <div className="flex items-start justify-between gap-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-teal-600 px-6 py-5 text-white">
          <div className="flex items-center gap-3.5">
            <MentorMascot state="ready" size="sm" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-indigo-100">
                WordPath 2.0 Setup
              </p>
              <h2 id="onboarding-title" className="text-xl font-bold tracking-tight">
                Personalize your daily English studio
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleFinish('dashboard')}
            aria-label="Skip onboarding"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="max-h-[75vh] space-y-5 overflow-y-auto px-6 py-5">
          <div>
            <label
              htmlFor="onboarding-name"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Your First Name (Optional)
            </label>
            <input
              id="onboarding-name"
              type="text"
              maxLength={32}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Alex"
              className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Focus Level
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(['B1', 'B2'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`min-h-[44px] rounded-xl border px-3 py-2 text-left transition ${
                      level === lvl
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 dark:border-indigo-400 dark:bg-indigo-950/60 dark:text-indigo-100'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span>{lvl}</span>
                      {level === lvl && <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {lvl === 'B1' ? 'Foundations' : 'Upper-Intermediate'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Mentor Explanations
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'en', title: 'English', sub: 'Simple & clear' },
                    { id: 'ru', title: 'EN + RU', sub: 'Russian notes' }
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setExpLang(item.id)}
                    className={`min-h-[44px] rounded-xl border px-3 py-2 text-left transition ${
                      expLang === item.id
                        ? 'border-teal-600 bg-teal-50 text-teal-900 dark:border-teal-400 dark:bg-teal-950/50 dark:text-teal-100'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span>{item.title}</span>
                      {expLang === item.id && <Check className="h-4 w-4 text-teal-600 dark:text-teal-400" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{item.sub}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Estimated Daily Study Goal
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2.5">
              {([10, 15, 20] as DailyGoalMinutes[]).map((mins) => {
                const spec = DAILY_PLAN_CONFIG[mins];
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setGoal(mins)}
                    className={`min-h-[44px] rounded-xl border px-3 py-2.5 text-left transition ${
                      goal === mins
                        ? 'border-blue-600 bg-blue-50 text-blue-950 dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-100'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300'
                    }`}
                  >
                    <p className="text-sm font-bold tabular-nums">{mins} min / day</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      {spec.vocabTarget} words + 2 tasks
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
            Your progress, drafts, and preferences stay saved in this browser&apos;s local storage—no account required. You can adjust any option later in Settings.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col-reverse gap-2.5 border-t border-slate-200 bg-slate-50/70 px-6 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900/80">
          <button
            type="button"
            onClick={() => handleFinish('dashboard')}
            className="min-h-[44px] rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Go to Dashboard
          </button>
          <button
            type="button"
            onClick={() => handleFinish('placement')}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-blue-700"
          >
            <Sparkles className="h-4 w-4" />
            <span>Start 24-Item Diagnostic</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
