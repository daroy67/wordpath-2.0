export type NavView =
  | 'dashboard'
  | 'ai-mentor'
  | 'learning-path'
  | 'vocabulary'
  | 'grammar'
  | 'reading'
  | 'studio'
  | 'placement'
  | 'progress'
  | 'settings'
  | 'ib-hub';

export type CEFRLevel = 'B1' | 'B2';
export type ThemeMode = 'light' | 'dark';
export type ExplanationLanguage = 'en' | 'ru';

export type VocabCategory =
  | 'Education'
  | 'Technology'
  | 'Business'
  | 'Environment'
  | 'Society'
  | 'Science'
  | 'Travel'
  | 'Communication'
  | 'Psychology'
  | 'Work & Careers';

export type ReviewRating = 'again' | 'hard' | 'got_it';

export interface VocabWord {
  id: string;
  term: string;
  ipa: string;
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'phrasal verb';
  level: CEFRLevel;
  category: VocabCategory;
  definition: string;
  russianTranslation: string;
  exampleSentence: string;
  synonyms: string[];
  collocations: string[];
}

export interface WordProgress {
  wordId: string;
  status: 'new' | 'learning' | 'mastered';
  intervalStep: number; // 0 = session / 10m, 1 = 1d, 2 = 3d, 3 = 7d, 4 = 14d
  nextReviewAt: number; // timestamp in ms
  reviewCount: number;
  correctCount: number;
  incorrectCount: number;
  lastRatedAt: number;
  lastRating: ReviewRating | null;
}

export interface GrammarQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GrammarExample {
  sentence: string;
  note: string;
}

export interface GrammarMistake {
  incorrect: string;
  correct: string;
  why: string;
}

export interface GrammarLesson {
  id: string;
  title: string;
  level: CEFRLevel;
  estimatedMinutes: number;
  summary: string;
  explanation: string[];
  formula: string;
  examples: GrammarExample[];
  commonMistakes: GrammarMistake[];
  questions: GrammarQuestion[];
}

export interface GrammarLessonResult {
  lessonId: string;
  completed: boolean;
  attempts: number;
  bestScore: number;
  lastScore: number;
  totalQuestions: number;
  lastAnswers: Record<string, number>;
  completedAt: number;
}

export interface ReadingGlossaryTerm {
  term: string;
  definition: string;
  russian: string;
}

export interface ReadingQuestion {
  id: string;
  type: 'mcq' | 'tf';
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  subtitle: string;
  level: CEFRLevel;
  topic: string;
  estimatedMinutes: number;
  wordCount: number;
  paragraphs: string[];
  glossary: ReadingGlossaryTerm[];
  questions: ReadingQuestion[];
}

export interface ReadingPassageProgress {
  passageId: string;
  completed: boolean;
  readProgressPercent: number;
  quizScore: number | null;
  totalQuestions: number;
  lastAnswers: Record<string, number>;
  completedAt: number | null;
}

export type PlacementQuestionType = 'mcq' | 'cloze' | 'error_spot' | 'context';
export type PlacementSkill = 'vocabulary' | 'grammar' | 'reading';

export interface PlacementQuestion {
  id: string;
  skill: PlacementSkill;
  questionType: PlacementQuestionType;
  topicTag: string;
  targetLevel: CEFRLevel;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PlacementResult {
  completed: boolean;
  isPartial: boolean;
  score: number;
  totalQuestions: number;
  answeredQuestions: number;
  vocabCorrect: number;
  vocabTotal: number;
  grammarCorrect: number;
  grammarTotal: number;
  readingCorrect: number;
  readingTotal: number;
  recommendedLevel: CEFRLevel;
  suggestedLessonIds: string[];
  answers: Record<string, number>;
  completedAt: number;
}

export type MentorMode = 'conversation' | 'grammar' | 'vocabulary' | 'writing' | 'quiz';

export interface MentorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  mode: MentorMode;
  isDemoPreview?: boolean;
}

export type WritingTaskType =
  | 'Opinion paragraph'
  | 'Email'
  | 'Short essay'
  | 'Argumentative writing'
  | 'Description'
  | 'Summary';

export interface StructuredWritingFeedback {
  overallSummary: string;
  strengths: string[];
  grammarCorrections: Array<{
    original: string;
    corrected: string;
    explanation: string;
  }>;
  vocabularySuggestions: Array<{
    original: string;
    suggestion: string;
    reason: string;
  }>;
  clarityTips: string[];
  nextStep: string;
}

export interface WritingDraft {
  id: string;
  taskType: WritingTaskType;
  promptTitle: string;
  level: CEFRLevel;
  content: string;
  wordCount: number;
  updatedAt: number;
  feedback?: StructuredWritingFeedback;
  feedbackGeneratedAt?: number;
}

export interface SpeakingSessionRecord {
  id: string;
  topic: string;
  level: CEFRLevel;
  durationSeconds: number;
  transcript: string;
  createdAt: number;
  feedback?: StructuredWritingFeedback;
}

export interface ActivityLogEntry {
  id: string;
  type: 'vocabulary' | 'grammar' | 'reading' | 'placement' | 'writing' | 'speaking' | 'ai-mentor';
  label: string;
  detail: string;
  minutesEstimated?: number;
  timestamp: number;
}

export interface IBReflections {
  studentName: string;
  mypYear: string;
  personalInterestNote: string;
  priorCodingNote: string;
  priorEnglishNote: string;
  criterionBReflection: string;
  criterionCReflection: string;
  evidenceCheckedIds: string[];
}

export type DailyGoalMinutes = 10 | 15 | 20;

export interface WordPathState {
  version: number;
  onboardingCompleted: boolean;
  learnerName: string;
  theme: ThemeMode;
  practiceLevel: CEFRLevel;
  explanationLanguage: ExplanationLanguage;
  dailyGoalMinutes: DailyGoalMinutes;
  wordProgress: Record<string, WordProgress>;
  grammarResults: Record<string, GrammarLessonResult>;
  readingProgressById: Record<string, ReadingPassageProgress>;
  placementResult: PlacementResult | null;
  writingDrafts: WritingDraft[];
  speakingSessions: SpeakingSessionRecord[];
  aiMentorHistory: MentorMessage[];
  dailyStudyMinutesByDate: Record<string, number>;
  activeDates: string[]; // YYYY-MM-DD local dates with genuine completed learning actions
  activityLog: ActivityLogEntry[];
  ibReflections: IBReflections;
}
