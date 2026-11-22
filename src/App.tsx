/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode, useState } from 'react';
import { AIMentorView } from './components/AIMentorView';
import { DashboardView } from './components/DashboardView';
import { GrammarView } from './components/GrammarView';
import { IBProjectHubView } from './components/IBProjectHubView';
import { Layout } from './components/Layout';
import { LearningPathView } from './components/LearningPathView';
import { OnboardingModal } from './components/OnboardingModal';
import { PlacementTestView } from './components/PlacementTestView';
import { ProgressView } from './components/ProgressView';
import { ReadingView } from './components/ReadingView';
import { SettingsView } from './components/SettingsView';
import { StudioView } from './components/StudioView';
import { VocabularyView } from './components/VocabularyView';
import { useWordPathState } from './hooks/useWordPathState';
import { NavView } from './types/wordpath';

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('WordPath UI boundary caught an error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
          <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h1 className="text-lg font-bold">Something interrupted this view</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Your local learning data stays saved. Reload the page to continue.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 min-h-[44px] rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Reload WordPath
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [activeView, setActiveView] = useState<NavView>('dashboard');
  const [selectedGrammarId, setSelectedGrammarId] = useState<string | undefined>(undefined);
  const [selectedReadingId, setSelectedReadingId] = useState<string | undefined>(undefined);

  const {
    state,
    metrics,
    toastMessage,
    storageWarning,
    rateWord,
    toggleWordLearned,
    submitGrammarQuiz,
    updateReadingScroll,
    submitReadingQuiz,
    submitPlacementTest,
    saveWritingDraft,
    deleteWritingDraft,
    saveSpeakingSession,
    setMentorHistory,
    logMentorPractice,
    setDailyGoalMinutes,
    setLearnerName,
    setTheme,
    toggleTheme,
    setPracticeLevel,
    setExplanationLanguage,
    completeOnboarding,
    updateIBReflections,
    toggleEvidenceChecked,
    resetLearningProgress,
    resetEntireApplication
  } = useWordPathState();

  const handleNavigate = (view: NavView, targetId?: string) => {
    if (view === 'grammar' && targetId) {
      setSelectedGrammarId(targetId);
    } else if (view === 'reading' && targetId) {
      setSelectedReadingId(targetId);
    }
    setActiveView(view);
  };

  return (
    <ErrorBoundary>
      {!state.onboardingCompleted && (
        <OnboardingModal
          initialName={state.learnerName}
          initialGoal={state.dailyGoalMinutes}
          initialLevel={state.practiceLevel}
          initialExplanationLanguage={state.explanationLanguage}
          onComplete={completeOnboarding}
          onNavigate={(v) => handleNavigate(v)}
        />
      )}

      <Layout
        activeView={activeView}
        onNavigate={(v) => handleNavigate(v)}
        dueWordsCount={metrics.dueWordsCount}
        dailyGoalMinutes={state.dailyGoalMinutes}
        theme={state.theme}
        onToggleTheme={toggleTheme}
        storageWarning={storageWarning}
        toastMessage={toastMessage}
      >
        {activeView === 'dashboard' && (
          <DashboardView
            state={state}
            metrics={metrics}
            onNavigate={handleNavigate}
            onSelectGoal={setDailyGoalMinutes}
          />
        )}

        {activeView === 'ai-mentor' && (
          <AIMentorView
            practiceLevel={state.practiceLevel}
            explanationLanguage={state.explanationLanguage}
            history={state.aiMentorHistory}
            onSetHistory={setMentorHistory}
            onLogPractice={logMentorPractice}
            onChangeLevel={setPracticeLevel}
            onChangeExplanationLanguage={setExplanationLanguage}
          />
        )}

        {activeView === 'learning-path' && (
          <LearningPathView
            state={state}
            learningPath={metrics.learningPath}
            onNavigate={handleNavigate}
          />
        )}

        {activeView === 'vocabulary' && (
          <VocabularyView
            wordProgress={state.wordProgress}
            onRateWord={rateWord}
            onToggleLearned={toggleWordLearned}
          />
        )}

        {activeView === 'grammar' && (
          <GrammarView
            grammarResults={state.grammarResults}
            selectedLessonId={selectedGrammarId}
            onSubmitQuiz={submitGrammarQuiz}
          />
        )}

        {activeView === 'reading' && (
          <ReadingView
            readingProgressById={state.readingProgressById}
            selectedPassageId={selectedReadingId}
            onUpdateScrollProgress={updateReadingScroll}
            onSubmitQuiz={submitReadingQuiz}
          />
        )}

        {activeView === 'studio' && (
          <StudioView
            practiceLevel={state.practiceLevel}
            explanationLanguage={state.explanationLanguage}
            writingDrafts={state.writingDrafts}
            speakingSessions={state.speakingSessions}
            onSaveWritingDraft={saveWritingDraft}
            onDeleteWritingDraft={deleteWritingDraft}
            onSaveSpeakingSession={saveSpeakingSession}
          />
        )}

        {activeView === 'placement' && (
          <PlacementTestView
            placementResult={state.placementResult}
            onSubmitTest={submitPlacementTest}
            onNavigate={handleNavigate}
          />
        )}

        {activeView === 'progress' && (
          <ProgressView
            state={state}
            metrics={metrics}
            onNavigate={handleNavigate}
            onResetLearning={resetLearningProgress}
            onResetAll={resetEntireApplication}
          />
        )}

        {activeView === 'settings' && (
          <SettingsView
            state={state}
            onUpdateLearnerName={setLearnerName}
            onSelectGoal={setDailyGoalMinutes}
            onSetTheme={setTheme}
            onSetPracticeLevel={setPracticeLevel}
            onSetExplanationLanguage={setExplanationLanguage}
            onResetLearning={resetLearningProgress}
            onResetAll={resetEntireApplication}
          />
        )}

        {activeView === 'ib-hub' && (
          <IBProjectHubView
            reflections={state.ibReflections}
            onUpdateReflections={updateIBReflections}
            onToggleEvidence={toggleEvidenceChecked}
          />
        )}
      </Layout>
    </ErrorBoundary>
  );
}
