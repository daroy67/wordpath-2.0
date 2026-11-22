import { useCallback, useEffect, useMemo, useState } from 'react';
import { DAILY_PLAN_CONFIG } from '../data/dailyPlan';
import { GRAMMAR_LESSONS } from '../data/grammar';
import { PLACEMENT_QUESTIONS } from '../data/placement';
import { READING_PASSAGES } from '../data/reading';
import { VOCABULARY_WORDS } from '../data/vocabulary';
import {
  ActivityLogEntry,
  CEFRLevel,
  DailyGoalMinutes,
  ExplanationLanguage,
  GrammarLessonResult,
  IBReflections,
  MentorMessage,
  PlacementResult,
  ReadingPassageProgress,
  ReviewRating,
  SpeakingSessionRecord,
  ThemeMode,
  WordPathState,
  WordProgress,
  WritingDraft
} from '../types/wordpath';
import { computeLearningPath } from '../utils/learningPath';

export const STORAGE_KEY = 'wordpath_state_v2';
export const LEGACY_STORAGE_KEY = 'wordpath_state_v1';

// Simplified spaced-review heuristic intervals in milliseconds:
// Step 0: 10 minutes ("Hard")
// Step 1: 1 day
// Step 2: 3 days
// Step 3: 7 days
// Step 4: 14 days
export const INTERVAL_MS_BY_STEP = [
  10 * 60 * 1000,
  24 * 60 * 60 * 1000,
  3 * 24 * 60 * 60 * 1000,
  7 * 24 * 60 * 60 * 1000,
  14 * 24 * 60 * 60 * 1000
];

export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getLastNDates(days: number, fromDate: Date = new Date()): string[] {
  const result: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(fromDate);
    d.setDate(d.getDate() - i);
    result.push(getLocalDateString(d));
  }
  return result;
}

export function calculateStreak(activeDates: string[]): number {
  if (!activeDates.length) return 0;
  const dateSet = new Set(activeDates);
  const today = new Date();
  const todayKey = getLocalDateString(today);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = getLocalDateString(yesterday);

  if (!dateSet.has(todayKey) && !dateSet.has(yesterdayKey)) {
    return 0;
  }

  let streak = 0;
  const cursor = new Date(dateSet.has(todayKey) ? today : yesterday);
  while (dateSet.has(getLocalDateString(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function createInitialState(): WordPathState {
  return {
    version: 2,
    onboardingCompleted: false,
    learnerName: 'Learner',
    theme: 'light',
    practiceLevel: 'B1',
    explanationLanguage: 'en',
    dailyGoalMinutes: 10,
    wordProgress: {},
    grammarResults: {},
    readingProgressById: {},
    placementResult: null,
    writingDrafts: [],
    speakingSessions: [],
    aiMentorHistory: [],
    dailyStudyMinutesByDate: {},
    activeDates: [],
    activityLog: [],
    ibReflections: {
      studentName: '[Editable: Your Full Name]',
      mypYear: 'IB MYP Year 5',
      personalInterestNote:
        '[Editable: Describe how your own interest in coding/web apps and learning English led you to choose WordPath.]',
      priorCodingNote:
        '[Editable: List the real HTML/CSS/JavaScript/React skills you already had before starting, and which ones you learned during this project.]',
      priorEnglishNote:
        '[Editable: Describe your prior experience with English learning tools and what challenges you noticed personally.]',
      criterionBReflection:
        '[Editable: Add specific real moments from your build—such as a bug you fixed, a design choice you changed, or feedback from a tester.]',
      criterionCReflection:
        '[Editable: Reflect honestly on what you learned about software engineering, learning science, and time management after testing WordPath.]',
      evidenceCheckedIds: []
    }
  };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function sanitizeNumberRecord(input: unknown): Record<string, number> {
  if (!isPlainObject(input)) return {};
  const result: Record<string, number> = {};
  for (const [key, val] of Object.entries(input)) {
    if (typeof val === 'number' && Number.isFinite(val) && val >= 0) {
      result[key] = Math.floor(val);
    }
  }
  return result;
}

function sanitizeWordProgress(input: unknown): Record<string, WordProgress> {
  if (!isPlainObject(input)) return {};
  const validIds = new Set(VOCABULARY_WORDS.map((w) => w.id));
  const result: Record<string, WordProgress> = {};

  for (const [wordId, raw] of Object.entries(input)) {
    if (!validIds.has(wordId) || !isPlainObject(raw)) continue;
    const status =
      raw.status === 'new' || raw.status === 'learning' || raw.status === 'mastered'
        ? raw.status
        : 'learning';
    const intervalStep =
      typeof raw.intervalStep === 'number' && Number.isFinite(raw.intervalStep)
        ? Math.max(0, Math.min(INTERVAL_MS_BY_STEP.length - 1, Math.floor(raw.intervalStep)))
        : 0;
    const nextReviewAt =
      typeof raw.nextReviewAt === 'number' && Number.isFinite(raw.nextReviewAt)
        ? raw.nextReviewAt
        : Date.now();
    const reviewCount =
      typeof raw.reviewCount === 'number' && Number.isFinite(raw.reviewCount) && raw.reviewCount >= 0
        ? Math.floor(raw.reviewCount)
        : 0;
    const correctCount =
      typeof raw.correctCount === 'number' && Number.isFinite(raw.correctCount) && raw.correctCount >= 0
        ? Math.floor(raw.correctCount)
        : status === 'mastered'
          ? Math.max(1, reviewCount)
          : 0;
    const incorrectCount =
      typeof raw.incorrectCount === 'number' &&
      Number.isFinite(raw.incorrectCount) &&
      raw.incorrectCount >= 0
        ? Math.floor(raw.incorrectCount)
        : 0;
    const lastRatedAt =
      typeof raw.lastRatedAt === 'number' && Number.isFinite(raw.lastRatedAt)
        ? raw.lastRatedAt
        : 0;
    const lastRating =
      raw.lastRating === 'again' || raw.lastRating === 'hard' || raw.lastRating === 'got_it'
        ? raw.lastRating
        : null;

    result[wordId] = {
      wordId,
      status,
      intervalStep,
      nextReviewAt,
      reviewCount,
      correctCount,
      incorrectCount,
      lastRatedAt,
      lastRating
    };
  }
  return result;
}

function sanitizeGrammarResults(input: unknown): Record<string, GrammarLessonResult> {
  if (!isPlainObject(input)) return {};
  const validLessonMap = new Map(GRAMMAR_LESSONS.map((l) => [l.id, l.questions.length]));
  const result: Record<string, GrammarLessonResult> = {};

  for (const [lessonId, raw] of Object.entries(input)) {
    const expectedTotal = validLessonMap.get(lessonId);
    if (!expectedTotal || !isPlainObject(raw)) continue;

    const totalQuestions = expectedTotal;
    const bestScore =
      typeof raw.bestScore === 'number' && Number.isFinite(raw.bestScore)
        ? Math.max(0, Math.min(totalQuestions, Math.floor(raw.bestScore)))
        : 0;
    const lastScore =
      typeof raw.lastScore === 'number' && Number.isFinite(raw.lastScore)
        ? Math.max(0, Math.min(totalQuestions, Math.floor(raw.lastScore)))
        : 0;
    const attempts =
      typeof raw.attempts === 'number' && Number.isFinite(raw.attempts) && raw.attempts >= 0
        ? Math.floor(raw.attempts)
        : 0;
    const completedAt =
      typeof raw.completedAt === 'number' && Number.isFinite(raw.completedAt)
        ? raw.completedAt
        : 0;

    result[lessonId] = {
      lessonId,
      completed: Boolean(raw.completed),
      attempts,
      bestScore,
      lastScore,
      totalQuestions,
      lastAnswers: sanitizeNumberRecord(raw.lastAnswers),
      completedAt
    };
  }
  return result;
}

function sanitizeReadingProgressById(
  rawById: unknown,
  legacyReading: unknown
): Record<string, ReadingPassageProgress> {
  const validMap = new Map(READING_PASSAGES.map((p) => [p.id, p.questions.length]));
  const result: Record<string, ReadingPassageProgress> = {};

  const parseEntry = (passageId: string, raw: unknown) => {
    const expectedTotal = validMap.get(passageId);
    if (!expectedTotal || !isPlainObject(raw)) return;
    const readProgressPercent =
      typeof raw.readProgressPercent === 'number' && Number.isFinite(raw.readProgressPercent)
        ? Math.max(0, Math.min(100, Math.round(raw.readProgressPercent)))
        : 0;
    const quizScore =
      typeof raw.quizScore === 'number' && Number.isFinite(raw.quizScore)
        ? Math.max(0, Math.min(expectedTotal, Math.floor(raw.quizScore)))
        : null;
    const completedAt =
      typeof raw.completedAt === 'number' && Number.isFinite(raw.completedAt)
        ? raw.completedAt
        : null;

    result[passageId] = {
      passageId,
      completed: Boolean(raw.completed),
      readProgressPercent,
      quizScore,
      totalQuestions: expectedTotal,
      lastAnswers: sanitizeNumberRecord(raw.lastAnswers),
      completedAt
    };
  };

  if (isPlainObject(rawById)) {
    for (const [passageId, raw] of Object.entries(rawById)) {
      parseEntry(passageId, raw);
    }
  } else if (isPlainObject(legacyReading)) {
    // Migrate v1 single-passage progress cleanly
    parseEntry(READING_PASSAGES[0].id, legacyReading);
  }

  return result;
}

function sanitizePlacementResult(input: unknown): PlacementResult | null {
  if (!isPlainObject(input) || !input.completed) return null;
  const totalQuestions = PLACEMENT_QUESTIONS.length;
  const rawTotal =
    typeof input.totalQuestions === 'number' && Number.isFinite(input.totalQuestions)
      ? Math.max(1, Math.floor(input.totalQuestions))
      : totalQuestions;
  const answeredQuestions =
    typeof input.answeredQuestions === 'number' && Number.isFinite(input.answeredQuestions)
      ? Math.max(0, Math.min(totalQuestions, Math.floor(input.answeredQuestions)))
      : Math.min(totalQuestions, rawTotal);
  const score =
    typeof input.score === 'number' && Number.isFinite(input.score)
      ? Math.max(0, Math.min(totalQuestions, Math.floor(input.score)))
      : 0;

  const vocabTotal =
    typeof input.vocabTotal === 'number' && Number.isFinite(input.vocabTotal)
      ? Math.max(0, Math.floor(input.vocabTotal))
      : PLACEMENT_QUESTIONS.filter((q) => q.skill === 'vocabulary').length;
  const grammarTotal =
    typeof input.grammarTotal === 'number' && Number.isFinite(input.grammarTotal)
      ? Math.max(0, Math.floor(input.grammarTotal))
      : PLACEMENT_QUESTIONS.filter((q) => q.skill === 'grammar').length;
  const readingTotal =
    typeof input.readingTotal === 'number' && Number.isFinite(input.readingTotal)
      ? Math.max(0, Math.floor(input.readingTotal))
      : PLACEMENT_QUESTIONS.filter((q) => q.skill === 'reading').length;

  const vocabCorrect =
    typeof input.vocabCorrect === 'number' && Number.isFinite(input.vocabCorrect)
      ? Math.max(0, Math.min(vocabTotal, Math.floor(input.vocabCorrect)))
      : 0;
  const grammarCorrect =
    typeof input.grammarCorrect === 'number' && Number.isFinite(input.grammarCorrect)
      ? Math.max(0, Math.min(grammarTotal, Math.floor(input.grammarCorrect)))
      : 0;
  const readingCorrect =
    typeof input.readingCorrect === 'number' && Number.isFinite(input.readingCorrect)
      ? Math.max(0, Math.min(readingTotal, Math.floor(input.readingCorrect)))
      : 0;

  const recommendedLevel: CEFRLevel =
    input.recommendedLevel === 'B2' || input.recommendedLevel === 'B1'
      ? input.recommendedLevel
      : score / Math.max(1, answeredQuestions) >= 0.7
        ? 'B2'
        : 'B1';

  const suggestedLessonIds = Array.isArray(input.suggestedLessonIds)
    ? input.suggestedLessonIds.filter((id): id is string => typeof id === 'string')
    : [];

  const completedAt =
    typeof input.completedAt === 'number' && Number.isFinite(input.completedAt)
      ? input.completedAt
      : Date.now();

  return {
    completed: true,
    isPartial: Boolean(input.isPartial) || answeredQuestions < totalQuestions,
    score,
    totalQuestions: rawTotal === 8 ? 8 : totalQuestions,
    answeredQuestions,
    vocabCorrect,
    vocabTotal,
    grammarCorrect,
    grammarTotal,
    readingCorrect,
    readingTotal,
    recommendedLevel,
    suggestedLessonIds,
    answers: sanitizeNumberRecord(input.answers),
    completedAt
  };
}

function sanitizeActivityLog(input: unknown): ActivityLogEntry[] {
  if (!Array.isArray(input)) return [];
  const validTypes = new Set([
    'vocabulary',
    'grammar',
    'reading',
    'placement',
    'writing',
    'speaking',
    'ai-mentor'
  ]);
  const sanitized: ActivityLogEntry[] = [];

  for (const item of input) {
    if (!isPlainObject(item)) continue;
    if (
      typeof item.id !== 'string' ||
      typeof item.label !== 'string' ||
      typeof item.detail !== 'string' ||
      typeof item.timestamp !== 'number' ||
      !Number.isFinite(item.timestamp) ||
      typeof item.type !== 'string' ||
      !validTypes.has(item.type)
    ) {
      continue;
    }
    sanitized.push({
      id: item.id,
      type: item.type as ActivityLogEntry['type'],
      label: item.label,
      detail: item.detail,
      minutesEstimated:
        typeof item.minutesEstimated === 'number' && Number.isFinite(item.minutesEstimated)
          ? item.minutesEstimated
          : undefined,
      timestamp: item.timestamp
    });
    if (sanitized.length >= 40) break;
  }
  return sanitized;
}

function sanitizeWritingDrafts(input: unknown): WritingDraft[] {
  if (!Array.isArray(input)) return [];
  const result: WritingDraft[] = [];
  for (const item of input) {
    if (!isPlainObject(item) || typeof item.id !== 'string' || typeof item.content !== 'string') {
      continue;
    }
    result.push({
      id: item.id,
      taskType: typeof item.taskType === 'string' ? (item.taskType as WritingDraft['taskType']) : 'Opinion paragraph',
      promptTitle: typeof item.promptTitle === 'string' ? item.promptTitle : 'Practice Draft',
      level: item.level === 'B2' ? 'B2' : 'B1',
      content: item.content,
      wordCount:
        typeof item.wordCount === 'number' && Number.isFinite(item.wordCount)
          ? Math.max(0, Math.floor(item.wordCount))
          : item.content.trim().split(/\s+/).filter(Boolean).length,
      updatedAt:
        typeof item.updatedAt === 'number' && Number.isFinite(item.updatedAt)
          ? item.updatedAt
          : Date.now(),
      feedback: isPlainObject(item.feedback)
        ? (item.feedback as unknown as WritingDraft['feedback'])
        : undefined,
      feedbackGeneratedAt:
        typeof item.feedbackGeneratedAt === 'number' && Number.isFinite(item.feedbackGeneratedAt)
          ? item.feedbackGeneratedAt
          : undefined
    });
    if (result.length >= 25) break;
  }
  return result;
}

function sanitizeSpeakingSessions(input: unknown): SpeakingSessionRecord[] {
  if (!Array.isArray(input)) return [];
  const result: SpeakingSessionRecord[] = [];
  for (const item of input) {
    if (!isPlainObject(item) || typeof item.id !== 'string' || typeof item.transcript !== 'string') {
      continue;
    }
    result.push({
      id: item.id,
      topic: typeof item.topic === 'string' ? item.topic : 'Speaking Practice',
      level: item.level === 'B2' ? 'B2' : 'B1',
      durationSeconds:
        typeof item.durationSeconds === 'number' && Number.isFinite(item.durationSeconds)
          ? Math.max(0, Math.floor(item.durationSeconds))
          : 0,
      transcript: item.transcript,
      createdAt:
        typeof item.createdAt === 'number' && Number.isFinite(item.createdAt)
          ? item.createdAt
          : Date.now(),
      feedback: isPlainObject(item.feedback)
        ? (item.feedback as unknown as SpeakingSessionRecord['feedback'])
        : undefined
    });
    if (result.length >= 25) break;
  }
  return result;
}

function sanitizeMentorHistory(input: unknown): MentorMessage[] {
  if (!Array.isArray(input)) return [];
  const validModes = new Set(['conversation', 'grammar', 'vocabulary', 'writing', 'quiz']);
  const result: MentorMessage[] = [];
  for (const item of input) {
    if (!isPlainObject(item) || typeof item.id !== 'string' || typeof item.content !== 'string') {
      continue;
    }
    if (item.role !== 'user' && item.role !== 'assistant') continue;
    result.push({
      id: item.id,
      role: item.role,
      content: item.content.slice(0, 8000),
      timestamp:
        typeof item.timestamp === 'number' && Number.isFinite(item.timestamp)
          ? item.timestamp
          : Date.now(),
      mode:
        typeof item.mode === 'string' && validModes.has(item.mode)
          ? (item.mode as MentorMessage['mode'])
          : 'conversation',
      isDemoPreview: Boolean(item.isDemoPreview)
    });
    if (result.length >= 40) break;
  }
  return result;
}

function sanitizeDailyStudyMinutes(input: unknown): Record<string, number> {
  if (!isPlainObject(input)) return {};
  const result: Record<string, number> = {};
  for (const [dateKey, val] of Object.entries(input)) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) continue;
    if (typeof val === 'number' && Number.isFinite(val) && val >= 0) {
      result[dateKey] = Math.round(val * 10) / 10;
    }
  }
  return result;
}

export function sanitizeLoadedState(parsed: unknown): WordPathState {
  const fallback = createInitialState();
  if (!isPlainObject(parsed)) return fallback;

  const dailyGoalMinutes: DailyGoalMinutes =
    parsed.dailyGoalMinutes === 10 ||
    parsed.dailyGoalMinutes === 15 ||
    parsed.dailyGoalMinutes === 20
      ? parsed.dailyGoalMinutes
      : fallback.dailyGoalMinutes;

  const learnerName =
    typeof parsed.learnerName === 'string' && parsed.learnerName.trim().length > 0
      ? parsed.learnerName.trim().slice(0, 32)
      : fallback.learnerName;

  const theme: ThemeMode = parsed.theme === 'dark' ? 'dark' : 'light';
  const practiceLevel: CEFRLevel = parsed.practiceLevel === 'B2' ? 'B2' : 'B1';
  const explanationLanguage: ExplanationLanguage =
    parsed.explanationLanguage === 'ru' ? 'ru' : 'en';

  const rawIB = isPlainObject(parsed.ibReflections) ? parsed.ibReflections : {};
  const ibReflections: IBReflections = {
    studentName:
      typeof rawIB.studentName === 'string'
        ? rawIB.studentName
        : fallback.ibReflections.studentName,
    mypYear:
      typeof rawIB.mypYear === 'string' ? rawIB.mypYear : fallback.ibReflections.mypYear,
    personalInterestNote:
      typeof rawIB.personalInterestNote === 'string'
        ? rawIB.personalInterestNote
        : fallback.ibReflections.personalInterestNote,
    priorCodingNote:
      typeof rawIB.priorCodingNote === 'string'
        ? rawIB.priorCodingNote
        : fallback.ibReflections.priorCodingNote,
    priorEnglishNote:
      typeof rawIB.priorEnglishNote === 'string'
        ? rawIB.priorEnglishNote
        : fallback.ibReflections.priorEnglishNote,
    criterionBReflection:
      typeof rawIB.criterionBReflection === 'string'
        ? rawIB.criterionBReflection
        : fallback.ibReflections.criterionBReflection,
    criterionCReflection:
      typeof rawIB.criterionCReflection === 'string'
        ? rawIB.criterionCReflection
        : fallback.ibReflections.criterionCReflection,
    evidenceCheckedIds: Array.isArray(rawIB.evidenceCheckedIds)
      ? rawIB.evidenceCheckedIds.filter((id): id is string => typeof id === 'string')
      : []
  };

  const activeDates = Array.isArray(parsed.activeDates)
    ? Array.from(
        new Set(
          parsed.activeDates.filter(
            (d): d is string => typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)
          )
        )
      )
    : [];

  const wordProgress = sanitizeWordProgress(parsed.wordProgress);
  const grammarResults = sanitizeGrammarResults(parsed.grammarResults);
  const readingProgressById = sanitizeReadingProgressById(
    parsed.readingProgressById,
    parsed.readingProgress
  );
  const placementResult = sanitizePlacementResult(parsed.placementResult);

  // If migrating from v1 where user already had progress, avoid forcing onboarding
  const hadPriorActivity =
    Object.keys(wordProgress).length > 0 ||
    Object.keys(grammarResults).length > 0 ||
    Object.keys(readingProgressById).length > 0 ||
    Boolean(placementResult);

  const onboardingCompleted =
    typeof parsed.onboardingCompleted === 'boolean'
      ? parsed.onboardingCompleted
      : hadPriorActivity;

  return {
    version: 2,
    onboardingCompleted,
    learnerName,
    theme,
    practiceLevel,
    explanationLanguage,
    dailyGoalMinutes,
    wordProgress,
    grammarResults,
    readingProgressById,
    placementResult,
    writingDrafts: sanitizeWritingDrafts(parsed.writingDrafts),
    speakingSessions: sanitizeSpeakingSessions(parsed.speakingSessions),
    aiMentorHistory: sanitizeMentorHistory(parsed.aiMentorHistory),
    dailyStudyMinutesByDate: sanitizeDailyStudyMinutes(parsed.dailyStudyMinutesByDate),
    activeDates,
    activityLog: sanitizeActivityLog(parsed.activityLog),
    ibReflections
  };
}

export function loadPersistedState(): WordPathState {
  const fallback = createInitialState();
  if (typeof window === 'undefined') return fallback;

  try {
    const rawV2 = window.localStorage.getItem(STORAGE_KEY);
    if (rawV2) {
      return sanitizeLoadedState(JSON.parse(rawV2));
    }
    const rawV1 = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (rawV1) {
      return sanitizeLoadedState(JSON.parse(rawV1));
    }
    return fallback;
  } catch {
    return fallback;
  }
}

export function formatIntervalLabel(wp?: WordProgress): string {
  if (!wp || wp.status === 'new') return 'New word';
  if (wp.lastRating === 'again') return 'Due now (this session)';
  const diffMs = wp.nextReviewAt - Date.now();
  if (diffMs <= 0) return 'Due for review';
  const mins = Math.round(diffMs / (60 * 1000));
  if (mins < 60) return `Next in ${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `Next in ${hours}h`;
  const days = Math.round(hours / 24);
  return `Next in ${days}d`;
}

export function resetLearningProgressOnly(prev: WordPathState): WordPathState {
  const fresh = createInitialState();
  return {
    ...fresh,
    onboardingCompleted: prev.onboardingCompleted,
    learnerName: prev.learnerName,
    theme: prev.theme,
    practiceLevel: prev.practiceLevel,
    explanationLanguage: prev.explanationLanguage,
    dailyGoalMinutes: prev.dailyGoalMinutes,
    ibReflections: prev.ibReflections
  };
}

export function useWordPathState() {
  const [state, setState] = useState<WordPathState>(() => loadPersistedState());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [storageWarning, setStorageWarning] = useState(false);

  // Sync theme class on <html>
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setStorageWarning(false);
    } catch {
      setStorageWarning(true);
    }
  }, [state]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const appendActivity = (
    prev: WordPathState,
    entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>,
    estimatedMinutesDelta = 0
  ): {
    activeDates: string[];
    activityLog: ActivityLogEntry[];
    dailyStudyMinutesByDate: Record<string, number>;
  } => {
    const today = getLocalDateString();
    const activeDates = prev.activeDates.includes(today)
      ? prev.activeDates
      : [...prev.activeDates, today];

    const newLog: ActivityLogEntry = {
      ...entry,
      minutesEstimated: estimatedMinutesDelta > 0 ? estimatedMinutesDelta : undefined,
      id: `${entry.type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now()
    };
    const activityLog = [newLog, ...prev.activityLog].slice(0, 40);

    const prevMinutes = prev.dailyStudyMinutesByDate[today] ?? 0;
    const dailyStudyMinutesByDate =
      estimatedMinutesDelta > 0
        ? {
            ...prev.dailyStudyMinutesByDate,
            [today]: Math.round((prevMinutes + estimatedMinutesDelta) * 10) / 10
          }
        : prev.dailyStudyMinutesByDate;

    return { activeDates, activityLog, dailyStudyMinutesByDate };
  };

  const rateWord = useCallback(
    (wordId: string, rating: ReviewRating) => {
      const word = VOCABULARY_WORDS.find((w) => w.id === wordId);
      const now = Date.now();

      setState((prev) => {
        const existing = prev.wordProgress[wordId];
        let nextStep = existing?.intervalStep ?? 0;
        let nextReviewAt = now;
        let status: WordProgress['status'] = 'learning';
        let correctCount = existing?.correctCount ?? 0;
        let incorrectCount = existing?.incorrectCount ?? 0;

        if (rating === 'again') {
          nextStep = 0;
          nextReviewAt = now;
          status = 'learning';
          incorrectCount += 1;
        } else if (rating === 'hard') {
          nextStep = 0;
          nextReviewAt = now + INTERVAL_MS_BY_STEP[0];
          status = 'learning';
          correctCount += 1;
        } else {
          if (!existing || existing.status === 'new' || existing.lastRating === 'again') {
            nextStep = 1;
          } else {
            nextStep = Math.min(existing.intervalStep + 1, INTERVAL_MS_BY_STEP.length - 1);
          }
          nextReviewAt = now + INTERVAL_MS_BY_STEP[nextStep];
          status = 'mastered';
          correctCount += 1;
        }

        const updatedWord: WordProgress = {
          wordId,
          status,
          intervalStep: nextStep,
          nextReviewAt,
          reviewCount: (existing?.reviewCount ?? 0) + 1,
          correctCount,
          incorrectCount,
          lastRatedAt: now,
          lastRating: rating
        };

        const ratingLabel =
          rating === 'again'
            ? 'Queued again in this session'
            : rating === 'hard'
              ? 'Scheduled in 10 minutes'
              : `Mastered (${nextStep === 1 ? '1 day' : nextStep === 2 ? '3 days' : nextStep === 3 ? '7 days' : '14 days'} interval)`;

        const activity = appendActivity(
          prev,
          {
            type: 'vocabulary',
            label: `Reviewed "${word?.term ?? wordId}"`,
            detail: ratingLabel
          },
          1
        );

        return {
          ...prev,
          wordProgress: {
            ...prev.wordProgress,
            [wordId]: updatedWord
          },
          ...activity
        };
      });

      if (rating === 'got_it') {
        showToast(`"${word?.term ?? 'Word'}" marked as learned.`);
      } else if (rating === 'hard') {
        showToast(`"${word?.term ?? 'Word'}" scheduled for short review (10 min).`);
      } else {
        showToast(`"${word?.term ?? 'Word'}" kept in current session queue.`);
      }
    },
    [showToast]
  );

  const toggleWordLearned = useCallback(
    (wordId: string) => {
      const word = VOCABULARY_WORDS.find((w) => w.id === wordId);
      const now = Date.now();
      let markedLearned = true;

      setState((prev) => {
        const existing = prev.wordProgress[wordId];
        const isCurrentlyMastered = existing?.status === 'mastered';

        if (isCurrentlyMastered) {
          markedLearned = false;
          const nextMap = { ...prev.wordProgress };
          delete nextMap[wordId];
          return {
            ...prev,
            wordProgress: nextMap
          };
        }

        markedLearned = true;
        const activity = appendActivity(
          prev,
          {
            type: 'vocabulary',
            label: `Marked "${word?.term ?? wordId}" learned`,
            detail: 'Scheduled for 1-day review'
          },
          1
        );

        return {
          ...prev,
          wordProgress: {
            ...prev.wordProgress,
            [wordId]: {
              wordId,
              status: 'mastered',
              intervalStep: 1,
              nextReviewAt: now + INTERVAL_MS_BY_STEP[1],
              reviewCount: (existing?.reviewCount ?? 0) + 1,
              correctCount: (existing?.correctCount ?? 0) + 1,
              incorrectCount: existing?.incorrectCount ?? 0,
              lastRatedAt: now,
              lastRating: 'got_it'
            }
          },
          ...activity
        };
      });

      showToast(
        markedLearned
          ? `"${word?.term ?? 'Word'}" marked as learned.`
          : `"${word?.term ?? 'Word'}" returned to unlearned study.`
      );
    },
    [showToast]
  );

  const submitGrammarQuiz = useCallback(
    (lessonId: string, answers: Record<string, number>) => {
      const lesson = GRAMMAR_LESSONS.find((l) => l.id === lessonId);
      if (!lesson) return;

      let score = 0;
      for (const q of lesson.questions) {
        if (answers[q.id] === q.correctIndex) {
          score += 1;
        }
      }

      setState((prev) => {
        const existing = prev.grammarResults[lessonId];
        const bestScore = Math.max(existing?.bestScore ?? 0, score);
        const activity = appendActivity(
          prev,
          {
            type: 'grammar',
            label: `Completed "${lesson.title}"`,
            detail: `Scored ${score}/${lesson.questions.length}`
          },
          lesson.estimatedMinutes
        );

        return {
          ...prev,
          grammarResults: {
            ...prev.grammarResults,
            [lessonId]: {
              lessonId,
              completed: true,
              attempts: (existing?.attempts ?? 0) + 1,
              bestScore,
              lastScore: score,
              totalQuestions: lesson.questions.length,
              lastAnswers: answers,
              completedAt: Date.now()
            }
          },
          ...activity
        };
      });

      showToast(`Grammar quiz saved: ${score}/${lesson.questions.length} correct.`);
    },
    [showToast]
  );

  const updateReadingScroll = useCallback((passageId: string, percent: number) => {
    const passage = READING_PASSAGES.find((p) => p.id === passageId);
    if (!passage) return;
    setState((prev) => {
      const existing = prev.readingProgressById[passageId];
      const currentPct = existing?.readProgressPercent ?? 0;
      const clamped = Math.max(currentPct, Math.min(100, Math.round(percent)));
      if (clamped === currentPct && existing) return prev;
      return {
        ...prev,
        readingProgressById: {
          ...prev.readingProgressById,
          [passageId]: {
            passageId,
            completed: existing?.completed ?? false,
            readProgressPercent: clamped,
            quizScore: existing?.quizScore ?? null,
            totalQuestions: passage.questions.length,
            lastAnswers: existing?.lastAnswers ?? {},
            completedAt: existing?.completedAt ?? null
          }
        }
      };
    });
  }, []);

  const submitReadingQuiz = useCallback(
    (passageId: string, answers: Record<string, number>) => {
      const passage = READING_PASSAGES.find((p) => p.id === passageId);
      if (!passage) return;

      let score = 0;
      for (const q of passage.questions) {
        if (answers[q.id] === q.correctIndex) {
          score += 1;
        }
      }

      setState((prev) => {
        const activity = appendActivity(
          prev,
          {
            type: 'reading',
            label: `Reading: "${passage.title.split(':')[0]}"`,
            detail: `Scored ${score}/${passage.questions.length}`
          },
          passage.estimatedMinutes
        );

        return {
          ...prev,
          readingProgressById: {
            ...prev.readingProgressById,
            [passageId]: {
              passageId,
              completed: true,
              readProgressPercent: 100,
              quizScore: score,
              totalQuestions: passage.questions.length,
              lastAnswers: answers,
              completedAt: Date.now()
            }
          },
          ...activity
        };
      });

      showToast(`Reading quiz saved: ${score}/${passage.questions.length} correct.`);
    },
    [showToast]
  );

  const submitPlacementTest = useCallback(
    (answers: Record<string, number>) => {
      let score = 0;
      let answeredQuestions = 0;
      let vocabCorrect = 0;
      let vocabTotal = 0;
      let grammarCorrect = 0;
      let grammarTotal = 0;
      let readingCorrect = 0;
      let readingTotal = 0;

      for (const q of PLACEMENT_QUESTIONS) {
        const hasAnswer = typeof answers[q.id] === 'number';
        if (hasAnswer) answeredQuestions += 1;
        const isCorrect = answers[q.id] === q.correctIndex;
        if (isCorrect) score += 1;

        if (q.skill === 'vocabulary') {
          if (hasAnswer) {
            vocabTotal += 1;
            if (isCorrect) vocabCorrect += 1;
          }
        } else if (q.skill === 'grammar') {
          if (hasAnswer) {
            grammarTotal += 1;
            if (isCorrect) grammarCorrect += 1;
          }
        } else {
          if (hasAnswer) {
            readingTotal += 1;
            if (isCorrect) readingCorrect += 1;
          }
        }
      }

      const ratio = answeredQuestions > 0 ? score / answeredQuestions : 0;
      const isPartial = answeredQuestions < PLACEMENT_QUESTIONS.length;
      const recommendedLevel: CEFRLevel = ratio >= 0.7 ? 'B2' : 'B1';
      const suggestedLessonIds = GRAMMAR_LESSONS.filter(
        (l) => l.level === recommendedLevel
      )
        .slice(0, 3)
        .map((l) => l.id);

      const result: PlacementResult = {
        completed: true,
        isPartial,
        score,
        totalQuestions: PLACEMENT_QUESTIONS.length,
        answeredQuestions,
        vocabCorrect,
        vocabTotal,
        grammarCorrect,
        grammarTotal,
        readingCorrect,
        readingTotal,
        recommendedLevel,
        suggestedLessonIds,
        answers,
        completedAt: Date.now()
      };

      const focusLabel = recommendedLevel === 'B2' ? 'B2 Extension' : 'B1 Foundations';

      setState((prev) => {
        const activity = appendActivity(
          prev,
          {
            type: 'placement',
            label: isPartial ? 'Indicative Placement Check' : 'Completed 24-Item Placement Check',
            detail: `Scored ${score}/${answeredQuestions} · Focus: ${focusLabel}`
          },
          Math.max(3, Math.round(answeredQuestions * 0.4))
        );

        return {
          ...prev,
          practiceLevel: recommendedLevel,
          placementResult: result,
          ...activity
        };
      });

      showToast(`Diagnostic saved: ${score}/${answeredQuestions} (${focusLabel}).`);
    },
    [showToast]
  );

  const saveWritingDraft = useCallback(
    (draft: WritingDraft, logActivity = true) => {
      setState((prev) => {
        const existingIdx = prev.writingDrafts.findIndex((d) => d.id === draft.id);
        const nextDrafts =
          existingIdx >= 0
            ? prev.writingDrafts.map((d) => (d.id === draft.id ? draft : d))
            : [draft, ...prev.writingDrafts].slice(0, 25);

        const activity = logActivity
          ? appendActivity(
              prev,
              {
                type: 'writing',
                label: `Writing: ${draft.taskType}`,
                detail: `${draft.wordCount} words${draft.feedback ? ' · AI reviewed' : ' · Draft saved'}`
              },
              draft.feedback ? 6 : 4
            )
          : {};

        return {
          ...prev,
          writingDrafts: nextDrafts,
          ...activity
        };
      });
      showToast(draft.feedback ? 'Writing feedback saved locally.' : 'Writing draft saved locally.');
    },
    [showToast]
  );

  const deleteWritingDraft = useCallback(
    (draftId: string) => {
      setState((prev) => ({
        ...prev,
        writingDrafts: prev.writingDrafts.filter((d) => d.id !== draftId)
      }));
      showToast('Draft removed.');
    },
    [showToast]
  );

  const saveSpeakingSession = useCallback(
    (session: SpeakingSessionRecord) => {
      setState((prev) => {
        const activity = appendActivity(
          prev,
          {
            type: 'speaking',
            label: `Speaking: ${session.topic}`,
            detail: `${session.durationSeconds}s${session.feedback ? ' · Transcript reviewed' : ''}`
          },
          Math.max(2, Math.round(session.durationSeconds / 60) + 1)
        );
        return {
          ...prev,
          speakingSessions: [session, ...prev.speakingSessions].slice(0, 25),
          ...activity
        };
      });
      showToast('Speaking practice session saved.');
    },
    [showToast]
  );

  const setMentorHistory = useCallback(
    (updater: MentorMessage[] | ((prev: MentorMessage[]) => MentorMessage[])) => {
      setState((prev) => {
        const next = typeof updater === 'function' ? updater(prev.aiMentorHistory) : updater;
        return {
          ...prev,
          aiMentorHistory: next.slice(-40)
        };
      });
    },
    []
  );

  const logMentorPractice = useCallback((modeLabel: string) => {
    setState((prev) => {
      const activity = appendActivity(
        prev,
        {
          type: 'ai-mentor',
          label: `AI Mentor (${modeLabel})`,
          detail: 'Completed interactive tutoring exchange'
        },
        2
      );
      return {
        ...prev,
        ...activity
      };
    });
  }, []);

  const setDailyGoalMinutes = useCallback(
    (minutes: DailyGoalMinutes) => {
      setState((prev) => ({
        ...prev,
        dailyGoalMinutes: minutes
      }));
      showToast(`Daily learning goal updated to ${minutes} minutes.`);
    },
    [showToast]
  );

  const setLearnerName = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      learnerName: name.trim().slice(0, 32) || 'Learner'
    }));
  }, []);

  const setTheme = useCallback((theme: ThemeMode) => {
    setState((prev) => ({ ...prev, theme }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light'
    }));
  }, []);

  const setPracticeLevel = useCallback((practiceLevel: CEFRLevel) => {
    setState((prev) => ({ ...prev, practiceLevel }));
  }, []);

  const setExplanationLanguage = useCallback((explanationLanguage: ExplanationLanguage) => {
    setState((prev) => ({ ...prev, explanationLanguage }));
  }, []);

  const completeOnboarding = useCallback(
    (patch?: Partial<Pick<WordPathState, 'learnerName' | 'dailyGoalMinutes' | 'practiceLevel' | 'explanationLanguage'>>) => {
      setState((prev) => ({
        ...prev,
        ...patch,
        onboardingCompleted: true
      }));
    },
    []
  );

  const updateIBReflections = useCallback((patch: Partial<IBReflections>) => {
    setState((prev) => ({
      ...prev,
      ibReflections: {
        ...prev.ibReflections,
        ...patch
      }
    }));
  }, []);

  const toggleEvidenceChecked = useCallback((id: string) => {
    setState((prev) => {
      const current = prev.ibReflections.evidenceCheckedIds;
      const exists = current.includes(id);
      const next = exists ? current.filter((item) => item !== id) : [...current, id];
      return {
        ...prev,
        ibReflections: {
          ...prev.ibReflections,
          evidenceCheckedIds: next
        }
      };
    });
  }, []);

  const resetLearningProgress = useCallback(() => {
    setState((prev) => resetLearningProgressOnly(prev));
    showToast('Learning progress reset. Preferences and IB Project Hub notes were kept.');
  }, [showToast]);

  const resetEntireApplication = useCallback(() => {
    const fresh = createInitialState();
    setState(fresh);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // Ignore storage error
    }
    showToast('All app data, preferences, and IB notes have been reset.');
  }, [showToast]);

  const metrics = useMemo(() => {
    const totalWords = VOCABULARY_WORDS.length;
    const learnedWordsCount = VOCABULARY_WORDS.filter(
      (w) => state.wordProgress[w.id]?.status === 'mastered'
    ).length;
    const inProgressWordsCount = VOCABULARY_WORDS.filter(
      (w) => state.wordProgress[w.id]?.status === 'learning'
    ).length;

    const now = Date.now();
    const dueWordsCount = VOCABULARY_WORDS.filter((w) => {
      const wp = state.wordProgress[w.id];
      return wp && wp.status !== 'new' && wp.nextReviewAt <= now;
    }).length;

    const totalGrammarLessons = GRAMMAR_LESSONS.length;
    const completedGrammarLessons = GRAMMAR_LESSONS.filter(
      (lesson) => state.grammarResults[lesson.id]?.completed
    ).length;

    const totalReadingPassages = READING_PASSAGES.length;
    const completedReadingPassages = READING_PASSAGES.filter(
      (p) => state.readingProgressById[p.id]?.completed
    ).length;

    const totalLessons = totalGrammarLessons + totalReadingPassages;
    const completedLessonsCount = completedGrammarLessons + completedReadingPassages;

    const vocabRatio = totalWords > 0 ? learnedWordsCount / totalWords : 0;
    const grammarRatio = totalGrammarLessons > 0 ? completedGrammarLessons / totalGrammarLessons : 0;
    const readingRatio = totalReadingPassages > 0 ? completedReadingPassages / totalReadingPassages : 0;
    const overallCompletionPercent = Math.round(
      (vocabRatio * 0.4 + grammarRatio * 0.35 + readingRatio * 0.25) * 100
    );

    let totalAnsweredQuestions = 0;
    let totalCorrectQuestions = 0;

    for (const lesson of GRAMMAR_LESSONS) {
      const res = state.grammarResults[lesson.id];
      if (res?.completed) {
        totalAnsweredQuestions += res.totalQuestions;
        totalCorrectQuestions += res.lastScore;
      }
    }
    for (const passage of READING_PASSAGES) {
      const rp = state.readingProgressById[passage.id];
      if (rp?.completed && rp.quizScore !== null) {
        totalAnsweredQuestions += rp.totalQuestions;
        totalCorrectQuestions += rp.quizScore;
      }
    }
    if (state.placementResult?.completed) {
      totalAnsweredQuestions += state.placementResult.answeredQuestions;
      totalCorrectQuestions += state.placementResult.score;
    }

    const accuracyPercent =
      totalAnsweredQuestions > 0
        ? Math.round((totalCorrectQuestions / totalAnsweredQuestions) * 100)
        : null;

    const streak = calculateStreak(state.activeDates);

    const dailyPlan = DAILY_PLAN_CONFIG[state.dailyGoalMinutes];
    const todayStr = getLocalDateString();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOfTodayMs = startOfToday.getTime();

    const vocabReviewedToday = Object.values(state.wordProgress).filter(
      (wp) => wp.lastRatedAt >= startOfTodayMs
    ).length;

    const grammarCompletedToday = Object.values(state.grammarResults).some(
      (gr) => gr.completedAt >= startOfTodayMs
    );

    const readingCompletedToday = Object.values(state.readingProgressById).some(
      (rp) => rp.completedAt !== null && rp.completedAt >= startOfTodayMs
    );

    const todayCompletedSteps =
      (vocabReviewedToday >= dailyPlan.vocabTarget ? 1 : 0) +
      (grammarCompletedToday ? 1 : 0) +
      (readingCompletedToday ? 1 : 0);

    const todayStudyMinutes = state.dailyStudyMinutesByDate[todayStr] ?? 0;
    const totalStudyMinutes = Math.round(
      Object.values(state.dailyStudyMinutesByDate).reduce((sum, m) => sum + m, 0)
    );
    const goalCompletionPercent = Math.min(
      100,
      Math.round((todayCompletedSteps / 3) * 100)
    );

    const weeklyActivity = getLastNDates(7).map((dateStr) => {
      const d = new Date(`${dateStr}T12:00:00`);
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        date: dateStr,
        label,
        minutes: Math.round(state.dailyStudyMinutesByDate[dateStr] ?? 0)
      };
    });

    const learningPath = computeLearningPath(state);

    return {
      totalWords,
      learnedWordsCount,
      inProgressWordsCount,
      dueWordsCount,
      totalGrammarLessons,
      completedGrammarLessons,
      totalReadingPassages,
      completedReadingPassages,
      totalLessons,
      completedLessonsCount,
      overallCompletionPercent,
      accuracyPercent,
      totalAnsweredQuestions,
      totalCorrectQuestions,
      streak,
      todayStr,
      vocabReviewedToday,
      grammarCompletedToday,
      readingCompletedToday,
      todayCompletedSteps,
      todayStudyMinutes,
      totalStudyMinutes,
      goalCompletionPercent,
      weeklyActivity,
      dailyPlan,
      nextGrammarLesson: learningPath.recommendedGrammarLesson,
      learningPath
    };
  }, [state]);

  return {
    state,
    metrics,
    toastMessage,
    storageWarning,
    showToast,
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
  };
}
