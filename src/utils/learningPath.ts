import { GRAMMAR_LESSONS } from '../data/grammar';
import { READING_PASSAGES } from '../data/reading';
import { VOCABULARY_WORDS } from '../data/vocabulary';
import { GrammarLesson, NavView, ReadingPassage, WordPathState } from '../types/wordpath';

export interface LearningAreaSummary {
  id: string;
  label: string;
  scorePercent: number | null;
  detail: string;
  targetView: NavView;
}

export interface AdaptiveRecommendation {
  id: string;
  priority: 'high' | 'medium' | 'next';
  title: string;
  reason: string;
  actionLabel: string;
  targetView: NavView;
  targetId?: string;
}

export interface PersonalizedLearningPath {
  hasEnoughData: boolean;
  dataSummaryNote: string;
  strongAreas: LearningAreaSummary[];
  areasToImprove: LearningAreaSummary[];
  recommendations: AdaptiveRecommendation[];
  recommendedGrammarLesson: GrammarLesson;
  recommendedReadingPassage: ReadingPassage;
}

export function computeLearningPath(state: WordPathState): PersonalizedLearningPath {
  const now = Date.now();
  const totalWords = VOCABULARY_WORDS.length;
  const wordEntries = Object.values(state.wordProgress);
  const masteredWords = wordEntries.filter((w) => w.status === 'mastered').length;
  const dueWords = wordEntries.filter((w) => w.status !== 'new' && w.nextReviewAt <= now).length;
  const strugglingWords = wordEntries.filter(
    (w) => w.incorrectCount > w.correctCount || w.lastRating === 'again'
  ).length;

  const completedGrammar = GRAMMAR_LESSONS.filter(
    (l) => state.grammarResults[l.id]?.completed
  );
  const weakGrammarLessons = GRAMMAR_LESSONS.filter((l) => {
    const res = state.grammarResults[l.id];
    return res?.completed && res.lastScore / res.totalQuestions < 0.75;
  });
  const strongGrammarLessons = GRAMMAR_LESSONS.filter((l) => {
    const res = state.grammarResults[l.id];
    return res?.completed && res.bestScore / res.totalQuestions >= 0.75;
  });

  const completedReadings = READING_PASSAGES.filter(
    (p) => state.readingProgressById[p.id]?.completed
  );
  const readingScores = completedReadings
    .map((p) => {
      const rp = state.readingProgressById[p.id];
      return rp && rp.quizScore !== null ? rp.quizScore / rp.totalQuestions : null;
    })
    .filter((v): v is number => v !== null);
  const avgReadingPct =
    readingScores.length > 0
      ? Math.round((readingScores.reduce((a, b) => a + b, 0) / readingScores.length) * 100)
      : null;

  const grammarPctList = completedGrammar.map((l) => {
    const r = state.grammarResults[l.id];
    return r ? r.lastScore / r.totalQuestions : 0;
  });
  const avgGrammarPct =
    grammarPctList.length > 0
      ? Math.round((grammarPctList.reduce((a, b) => a + b, 0) / grammarPctList.length) * 100)
      : null;

  const interactionsCount =
    wordEntries.length +
    completedGrammar.length +
    completedReadings.length +
    (state.placementResult ? 1 : 0) +
    state.writingDrafts.length +
    state.speakingSessions.length;

  const hasEnoughData =
    completedGrammar.length >= 1 ||
    completedReadings.length >= 1 ||
    wordEntries.length >= 5 ||
    Boolean(state.placementResult);

  const dataSummaryNote = hasEnoughData
    ? `Recommendations reflect ${interactionsCount} recorded learning actions across your local history.`
    : `Not enough practice history yet (${interactionsCount} recorded actions). Complete the diagnostic or your first lesson to unlock tailored focus insights.`;

  const strongAreas: LearningAreaSummary[] = [];
  const areasToImprove: LearningAreaSummary[] = [];

  if (masteredWords >= 8) {
    strongAreas.push({
      id: 'area-vocab-strong',
      label: 'Vocabulary Retention',
      scorePercent: Math.round((masteredWords / totalWords) * 100),
      detail: `${masteredWords}/${totalWords} words mastered with active recall`,
      targetView: 'vocabulary'
    });
  }
  if (dueWords > 0 || strugglingWords > 0) {
    areasToImprove.push({
      id: 'area-vocab-due',
      label: 'Vocabulary Revision',
      scorePercent: Math.round((masteredWords / totalWords) * 100),
      detail: `${dueWords} due for review${strugglingWords > 0 ? ` · ${strugglingWords} marked difficult` : ''}`,
      targetView: 'vocabulary'
    });
  }

  if (avgGrammarPct !== null) {
    if (avgGrammarPct >= 75 && weakGrammarLessons.length === 0) {
      strongAreas.push({
        id: 'area-grammar-strong',
        label: 'Grammar Accuracy',
        scorePercent: avgGrammarPct,
        detail: `${strongGrammarLessons.length}/${GRAMMAR_LESSONS.length} modules at >=75%`,
        targetView: 'grammar'
      });
    } else if (weakGrammarLessons.length > 0) {
      areasToImprove.push({
        id: 'area-grammar-weak',
        label: `Grammar: ${weakGrammarLessons[0].title}`,
        scorePercent: avgGrammarPct,
        detail: `${weakGrammarLessons.length} completed module(s) below 75% accuracy`,
        targetView: 'grammar'
      });
    }
  }

  if (avgReadingPct !== null) {
    if (avgReadingPct >= 80) {
      strongAreas.push({
        id: 'area-reading-strong',
        label: 'Reading Comprehension',
        scorePercent: avgReadingPct,
        detail: `${completedReadings.length}/${READING_PASSAGES.length} passages completed at ${avgReadingPct}%`,
        targetView: 'reading'
      });
    } else {
      areasToImprove.push({
        id: 'area-reading-weak',
        label: 'Reading Comprehension',
        scorePercent: avgReadingPct,
        detail: `Average score ${avgReadingPct}% — re-read with inline glossary clues`,
        targetView: 'reading'
      });
    }
  }

  if (state.placementResult) {
    const p = state.placementResult;
    if (p.grammarTotal > 0 && p.grammarCorrect / p.grammarTotal < 0.7) {
      areasToImprove.push({
        id: 'area-placement-grammar',
        label: 'Diagnostic Grammar Focus',
        scorePercent: Math.round((p.grammarCorrect / p.grammarTotal) * 100),
        detail: `${p.grammarCorrect}/${p.grammarTotal} on Placement Check`,
        targetView: 'grammar'
      });
    }
    if (p.vocabTotal > 0 && p.vocabCorrect / p.vocabTotal < 0.7) {
      areasToImprove.push({
        id: 'area-placement-vocab',
        label: 'Diagnostic Vocabulary Focus',
        scorePercent: Math.round((p.vocabCorrect / p.vocabTotal) * 100),
        detail: `${p.vocabCorrect}/${p.vocabTotal} on Placement Check`,
        targetView: 'vocabulary'
      });
    }
  }

  const preferredLevel = state.placementResult?.recommendedLevel || state.practiceLevel;

  // Next grammar lesson: prioritize weak lesson -> preferred level uncompleted -> first uncompleted
  const recommendedGrammarLesson =
    weakGrammarLessons[0] ||
    GRAMMAR_LESSONS.find(
      (l) => l.level === preferredLevel && !state.grammarResults[l.id]?.completed
    ) ||
    GRAMMAR_LESSONS.find((l) => !state.grammarResults[l.id]?.completed) ||
    GRAMMAR_LESSONS[0];

  // Next reading passage: if strong reading results, prioritize B2 unread; otherwise preferred level unread
  const readingTargetLevel =
    avgReadingPct !== null && avgReadingPct >= 80 ? 'B2' : preferredLevel;
  const recommendedReadingPassage =
    READING_PASSAGES.find(
      (p) => p.level === readingTargetLevel && !state.readingProgressById[p.id]?.completed
    ) ||
    READING_PASSAGES.find((p) => !state.readingProgressById[p.id]?.completed) ||
    READING_PASSAGES[0];

  const recommendations: AdaptiveRecommendation[] = [];

  if (!state.placementResult) {
    recommendations.push({
      id: 'rec-placement',
      priority: 'high',
      title: 'Take the 24-Question Placement Check',
      reason:
        'Establishes an indicative B1 Foundations or B2 Extension starting direction across vocabulary, grammar, and reading.',
      actionLabel: 'Start Diagnostic',
      targetView: 'placement'
    });
  }

  if (dueWords > 0) {
    recommendations.push({
      id: 'rec-vocab-due',
      priority: 'high',
      title: `Review ${dueWords} Due Vocabulary Card${dueWords === 1 ? '' : 's'}`,
      reason:
        'Scheduled spaced-review items are ready now to reinforce active recall before fading.',
      actionLabel: 'Open Review Queue',
      targetView: 'vocabulary'
    });
  } else if (masteredWords < 10) {
    recommendations.push({
      id: 'rec-vocab-start',
      priority: 'medium',
      title: `Build Your ${preferredLevel} Word Bank`,
      reason: `Master your first 10 ${preferredLevel} vocabulary cards with IPA pronunciation and example collocations.`,
      actionLabel: 'Study Flashcards',
      targetView: 'vocabulary'
    });
  }

  if (weakGrammarLessons.length > 0) {
    recommendations.push({
      id: 'rec-grammar-retry',
      priority: 'high',
      title: `Review Grammar: ${weakGrammarLessons[0].title}`,
      reason: `Your previous score was below 75%. Inspect the mistake contrasts and retake the 4-item check.`,
      actionLabel: 'Review Lesson',
      targetView: 'grammar',
      targetId: weakGrammarLessons[0].id
    });
  } else {
    recommendations.push({
      id: 'rec-grammar-next',
      priority: 'medium',
      title: `Next Grammar Module: ${recommendedGrammarLesson.title}`,
      reason: `Calibrated to ${recommendedGrammarLesson.level} (${recommendedGrammarLesson.estimatedMinutes} min estimated).`,
      actionLabel: 'Open Grammar',
      targetView: 'grammar',
      targetId: recommendedGrammarLesson.id
    });
  }

  recommendations.push({
    id: 'rec-reading-next',
    priority: 'next',
    title: `Read: ${recommendedReadingPassage.title.split(':')[0]}`,
    reason:
      avgReadingPct !== null && avgReadingPct >= 80
        ? `Strong reading accuracy (${avgReadingPct}%) — try this ${recommendedReadingPassage.level} passage next.`
        : `${recommendedReadingPassage.wordCount} words · ${recommendedReadingPassage.level} contextual reading with inline glossary.`,
    actionLabel: 'Open Reading',
    targetView: 'reading',
    targetId: recommendedReadingPassage.id
  });

  if (state.writingDrafts.length === 0) {
    recommendations.push({
      id: 'rec-studio',
      priority: 'next',
      title: 'Practice Writing or Speaking in the Studio',
      reason: `Apply newly learned ${preferredLevel} words in an opinion paragraph, email, or spoken response.`,
      actionLabel: 'Open Studio',
      targetView: 'studio'
    });
  }

  return {
    hasEnoughData,
    dataSummaryNote,
    strongAreas,
    areasToImprove,
    recommendations: recommendations.slice(0, 4),
    recommendedGrammarLesson,
    recommendedReadingPassage
  };
}
