import React, { useState } from 'react';
import {
  AlertTriangle,
  Download,
  Moon,
  RotateCcw,
  Sun,
  Trash2
} from 'lucide-react';
import { DAILY_PLAN_CONFIG } from '../data/dailyPlan';
import {
  CEFRLevel,
  DailyGoalMinutes,
  ExplanationLanguage,
  ThemeMode,
  WordPathState
} from '../types/wordpath';

interface SettingsViewProps {
  state: WordPathState;
  onUpdateLearnerName: (name: string) => void;
  onSelectGoal: (minutes: DailyGoalMinutes) => void;
  onSetTheme: (theme: ThemeMode) => void;
  onSetPracticeLevel: (level: CEFRLevel) => void;
  onSetExplanationLanguage: (lang: ExplanationLanguage) => void;
  onResetLearning: () => void;
  onResetAll: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  state,
  onUpdateLearnerName,
  onSelectGoal,
  onSetTheme,
  onSetPracticeLevel,
  onSetExplanationLanguage,
  onResetLearning,
  onResetAll
}) => {
  const [nameInput, setNameInput] = useState(state.learnerName);
  const [showLearningResetModal, setShowLearningResetModal] = useState(false);
  const [showFullResetModal, setShowFullResetModal] = useState(false);
  const [fullResetConfirmText, setFullResetConfirmText] = useState('');

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wordpath-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Settings &amp; Data Preferences
        </h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Customize your daily learning pacing, theme, AI Mentor language, and local storage backups.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile & Preferences */}
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Learning Preferences
          </h3>

          <div>
            <label
              htmlFor="settings-name"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"
            >
              Learner Name
            </label>
            <div className="mt-1.5 flex gap-2">
              <input
                id="settings-name"
                type="text"
                maxLength={32}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
              <button
                type="button"
                onClick={() => onUpdateLearnerName(nameInput)}
                className="min-h-[44px] shrink-0 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Save
              </button>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Daily Learning Goal
            </p>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {([10, 15, 20] as DailyGoalMinutes[]).map((mins) => {
                const spec = DAILY_PLAN_CONFIG[mins];
                return (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => onSelectGoal(mins)}
                    className={`min-h-[44px] rounded-xl border px-3 py-2 text-left transition ${
                      state.dailyGoalMinutes === mins
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-950 dark:border-indigo-400 dark:bg-indigo-950/60 dark:text-indigo-100'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <p className="text-sm font-bold tabular-nums">{mins} min</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 tabular-nums">
                      {spec.vocabTarget} words + 2 tasks
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Practice Level
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(['B1', 'B2'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => onSetPracticeLevel(lvl)}
                    className={`min-h-[44px] rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                      state.practiceLevel === lvl
                        ? 'border-blue-600 bg-blue-50 text-blue-950 dark:border-blue-400 dark:bg-blue-950/60 dark:text-blue-100'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                AI Explanation Language
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'en', label: 'English' },
                    { id: 'ru', label: 'EN + RU' }
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSetExplanationLanguage(item.id)}
                    className={`min-h-[44px] rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                      state.explanationLanguage === item.id
                        ? 'border-teal-600 bg-teal-50 text-teal-950 dark:border-teal-400 dark:bg-teal-950/60 dark:text-teal-100'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Appearance, Backup & Resets */}
        <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Appearance &amp; Local Data
          </h3>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Color Theme
            </p>
            <div className="mt-2 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => onSetTheme('light')}
                className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  state.theme === 'light'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 dark:border-indigo-400 dark:bg-indigo-950/60 dark:text-indigo-100'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300'
                }`}
              >
                <Sun className="h-4 w-4" />
                <span>Light Editorial</span>
              </button>
              <button
                type="button"
                onClick={() => onSetTheme('dark')}
                className={`inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                  state.theme === 'dark'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-950 dark:border-indigo-400 dark:bg-indigo-950/60 dark:text-indigo-100'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300'
                }`}
              >
                <Moon className="h-4 w-4" />
                <span>Dark Focus</span>
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              Privacy &amp; Storage Transparency
            </p>
            <p className="mt-1">
              All learning stats, drafts, AI Mentor chat history, and IB Project reflections are stored locally in your browser under{' '}
              <code className="font-mono text-indigo-700 dark:text-indigo-300">wordpath_state_v2</code>.
              IB reflections are never sent to AI endpoints.
            </p>
            <button
              type="button"
              onClick={handleExportJSON}
              className="mt-3 inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          <div className="space-y-2.5 border-t border-slate-200 pt-4 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setShowLearningResetModal(true)}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 dark:border-amber-700/70 dark:bg-amber-950/40 dark:text-amber-200"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Reset Learning Progress (Keep Preferences &amp; IB Notes)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowFullResetModal(true)}
              className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800 transition hover:bg-rose-100 dark:border-rose-800/70 dark:bg-rose-950/40 dark:text-rose-200"
            >
              <Trash2 className="h-4 w-4" />
              <span>Full Application Reset</span>
            </button>
          </div>
        </section>
      </div>

      {/* Learning Reset Modal */}
      {showLearningResetModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Reset learning progress?
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              This clears vocabulary mastery, grammar/reading scores, placement results, drafts, and streak dates—while preserving your preferences and IB Project Hub notes.
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
              This permanently erases all learning history, saved preferences, and IB Project Hub reflections. Type{' '}
              <code className="font-mono font-bold text-rose-700 dark:text-rose-300">RESET ALL</code>{' '}
              to confirm.
            </p>
            <input
              type="text"
              value={fullResetConfirmText}
              onChange={(e) => setFullResetConfirmText(e.target.value)}
              placeholder="RESET ALL"
              className="mt-3 w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2 text-sm font-mono text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
            <div className="mt-5 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowFullResetModal(false);
                  setFullResetConfirmText('');
                }}
                className="min-h-[44px] rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={fullResetConfirmText.trim() !== 'RESET ALL'}
                onClick={() => {
                  onResetAll();
                  setShowFullResetModal(false);
                  setFullResetConfirmText('');
                }}
                className="min-h-[44px] rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Erase Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
