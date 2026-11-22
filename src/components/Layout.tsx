import React, { useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  BookOpen,
  Bot,
  Compass,
  FileText,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Layers,
  Menu,
  Mic,
  Moon,
  Settings,
  Sun,
  X
} from 'lucide-react';
import { DailyGoalMinutes, NavView, ThemeMode } from '../types/wordpath';

interface LayoutProps {
  activeView: NavView;
  onNavigate: (view: NavView) => void;
  dueWordsCount: number;
  dailyGoalMinutes: DailyGoalMinutes;
  theme: ThemeMode;
  onToggleTheme: () => void;
  storageWarning?: boolean;
  toastMessage: string | null;
  children: React.ReactNode;
}

const PRIMARY_NAV_ITEMS: Array<{
  id: NavView;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'ai-mentor', label: 'AI Mentor', icon: Bot },
  { id: 'learning-path', label: 'Learning Path', icon: Compass },
  { id: 'vocabulary', label: 'Vocabulary', icon: Layers },
  { id: 'grammar', label: 'Grammar', icon: BookOpen },
  { id: 'reading', label: 'Reading', icon: FileText },
  { id: 'studio', label: 'Writing & Speaking', icon: Mic },
  { id: 'placement', label: 'Placement Check', icon: GraduationCap },
  { id: 'progress', label: 'Progress', icon: BarChart3 }
];

export const Layout: React.FC<LayoutProps> = ({
  activeView,
  onNavigate,
  dueWordsCount,
  dailyGoalMinutes,
  theme,
  onToggleTheme,
  storageWarning = false,
  toastMessage,
  children
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelect = (view: NavView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  const activeLabel =
    PRIMARY_NAV_ITEMS.find((item) => item.id === activeView)?.label ||
    (activeView === 'settings'
      ? 'Settings'
      : activeView === 'ib-hub'
        ? 'IB Project Hub'
        : 'WordPath');

  return (
    <div className="wp-canvas min-h-screen text-slate-900 transition-colors dark:text-slate-100">
      {/* Compact Mobile Header */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md lg:hidden dark:border-slate-800 dark:bg-slate-900/90">
        <button
          type="button"
          onClick={() => handleSelect('dashboard')}
          className="flex items-center gap-2.5 text-left"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-teal-500 text-sm font-bold text-white shadow-xs">
            W
          </span>
          <div className="leading-tight">
            <span className="block text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
              WordPath
            </span>
            <span className="block text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {activeLabel}
            </span>
          </div>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-down Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="fixed inset-x-0 top-14 z-30 max-h-[calc(100vh-3.5rem)] overflow-y-auto border-b border-slate-200 bg-white px-4 py-4 shadow-xl lg:hidden dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="space-y-1">
            {PRIMARY_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleSelect(item.id)}
                  className={`flex min-h-[44px] w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-200'
                      : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </span>
                  {item.id === 'vocabulary' && dueWordsCount > 0 && (
                    <span className="font-mono text-xs font-bold text-amber-600 tabular-nums dark:text-amber-400">
                      {dueWordsCount} due
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 border-t border-slate-200 pt-3 dark:border-slate-800">
            <button
              type="button"
              onClick={() => handleSelect('settings')}
              className={`flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                activeView === 'settings'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-200'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Settings &amp; Backup</span>
            </button>

            <p className="mt-3 px-3.5 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Project Documentation
            </p>
            <button
              type="button"
              onClick={() => handleSelect('ib-hub')}
              className={`flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                activeView === 'ib-hub'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-200'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <FolderKanban className="h-4 w-4" />
              <span>IB Project Hub</span>
            </button>
          </div>
        </nav>
      )}

      <div className="mx-auto flex max-w-[1440px]">
        {/* Desktop Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-slate-200/80 bg-white/85 px-4 py-5 backdrop-blur-md lg:flex dark:border-slate-800 dark:bg-slate-900/90">
          <div className="space-y-5 overflow-y-auto pr-1">
            <button
              type="button"
              onClick={() => handleSelect('dashboard')}
              className="flex w-full items-center gap-3 rounded-xl px-2 py-1 text-left transition hover:opacity-90"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-blue-600 to-teal-500 text-base font-bold text-white shadow-sm">
                W
              </span>
              <div>
                <span className="block text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  WordPath
                </span>
                <span className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                  B1–B2 English Studio
                </span>
              </div>
            </button>

            <nav aria-label="Primary navigation" className="space-y-1">
              {PRIMARY_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className={`flex min-h-[42px] w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    <span className="flex items-center gap-3 whitespace-nowrap">
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </span>
                    {item.id === 'vocabulary' && dueWordsCount > 0 && (
                      <span
                        className={`font-mono text-xs font-bold tabular-nums ${
                          isActive ? 'text-indigo-100' : 'text-amber-600 dark:text-amber-400'
                        }`}
                      >
                        {dueWordsCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Separated Bottom Settings + Project Documentation */}
          <div className="space-y-2.5 border-t border-slate-200 pt-4 dark:border-slate-800">
            <div className="flex items-center justify-between px-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="tabular-nums">Daily Goal: ~{dailyGoalMinutes}m</span>
              <button
                type="button"
                onClick={onToggleTheme}
                aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleSelect('settings')}
              className={`flex min-h-[40px] w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                activeView === 'settings'
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-200'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <Settings className="h-4 w-4 shrink-0" />
              <span>Settings</span>
            </button>

            <div className="pt-1">
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Project Documentation
              </p>
              <button
                type="button"
                onClick={() => handleSelect('ib-hub')}
                className={`flex min-h-[40px] w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  activeView === 'ib-hub'
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-200'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                <FolderKanban className="h-4 w-4 shrink-0" />
                <span>IB Project Hub</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Viewport */}
        <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-7">
          {storageWarning && (
            <div
              role="alert"
              className="mb-4 flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-900 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-100"
            >
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>
                Browser local storage could not be updated. Your progress stays active for this tab session; export a JSON backup in Settings if needed.
              </span>
            </div>
          )}

          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>

      {/* Live Toast */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 right-4 z-40 max-w-sm rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-xl dark:border-indigo-500/40 dark:bg-slate-800"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
};
