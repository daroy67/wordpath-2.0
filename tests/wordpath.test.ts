import assert from 'node:assert/strict';
import test from 'node:test';
import { handler as mentorHandler } from '../netlify/functions/ai-mentor.ts';
import { handler as healthHandler } from '../netlify/functions/health.ts';
import { handler as feedbackHandler } from '../netlify/functions/writing-feedback.ts';
import {
  AIServiceError,
  activeAIProvider,
  validateMentorRequest,
  validateWritingFeedbackRequest
} from '../server/aiMentorService.ts';
import { DAILY_PLAN_CONFIG } from '../src/data/dailyPlan.ts';
import { GRAMMAR_LESSONS } from '../src/data/grammar.ts';
import { PLACEMENT_QUESTIONS } from '../src/data/placement.ts';
import { READING_PASSAGES, computeWordCount } from '../src/data/reading.ts';
import { VOCAB_CATEGORIES, VOCABULARY_WORDS } from '../src/data/vocabulary.ts';
import {
  createInitialState,
  resetLearningProgressOnly,
  sanitizeLoadedState
} from '../src/hooks/useWordPathState.ts';
import { computeLearningPath } from '../src/utils/learningPath.ts';

test('DAILY_PLAN_CONFIG totals stay mathematically consistent', () => {
  for (const minutes of [10, 15, 20] as const) {
    const plan = DAILY_PLAN_CONFIG[minutes];
    assert.equal(plan.totalMinutes, minutes);
    assert.equal(
      plan.vocabMinutes + plan.grammarMinutes + plan.readingMinutes,
      minutes
    );
    assert.ok(plan.vocabTarget >= 3);
  }
});

test('Vocabulary dataset contains 120 unique B1-B2 words across 10 topics and preserves legacy IDs', () => {
  assert.equal(VOCAB_CATEGORIES.length, 10);
  assert.equal(VOCABULARY_WORDS.length, 120);

  const ids = new Set<string>();
  for (const word of VOCABULARY_WORDS) {
    assert.ok(!ids.has(word.id), `Duplicate vocab ID: ${word.id}`);
    ids.add(word.id);
    assert.ok(word.term.trim().length > 0);
    assert.ok(word.ipa.trim().length > 0);
    assert.ok(word.definition.trim().length > 0);
    assert.ok(word.russianTranslation.trim().length > 0);
    assert.ok(word.exampleSentence.trim().length > 0);
    assert.ok(word.synonyms.length >= 1);
    assert.ok(word.collocations.length >= 1);
  }

  for (const prefix of ['acad', 'tech', 'comm', 'ever']) {
    for (let i = 1; i <= 7; i++) {
      assert.ok(ids.has(`${prefix}-${i}`), `Missing legacy ID ${prefix}-${i}`);
    }
  }
});

test('Grammar dataset contains 12 modules and 48 valid quiz items', () => {
  assert.equal(GRAMMAR_LESSONS.length, 12);
  let totalQuestions = 0;

  for (const lesson of GRAMMAR_LESSONS) {
    assert.equal(lesson.questions.length, 4);
    totalQuestions += lesson.questions.length;
    assert.ok(lesson.formula.trim().length > 0);
    assert.ok(lesson.examples.length >= 2);
    assert.ok(lesson.commonMistakes.length >= 1);

    for (const q of lesson.questions) {
      assert.ok(q.options.length >= 2);
      assert.ok(
        q.correctIndex >= 0 && q.correctIndex < q.options.length,
        `Invalid correctIndex on ${q.id}`
      );
      assert.ok(q.explanation.trim().length > 0);
    }
  }
  assert.equal(totalQuestions, 48);
});

test('Reading dataset has 8 passages with programmatic word counts and valid questions', () => {
  assert.equal(READING_PASSAGES.length, 8);
  let totalQuestions = 0;

  for (const passage of READING_PASSAGES) {
    const computed = computeWordCount(passage.paragraphs);
    assert.equal(passage.wordCount, computed);
    assert.ok(passage.wordCount >= 175);
    assert.ok(passage.glossary.length >= 4);
    assert.equal(passage.questions.length, 5);
    totalQuestions += passage.questions.length;

    for (const q of passage.questions) {
      assert.ok(
        q.correctIndex >= 0 && q.correctIndex < q.options.length,
        `Invalid reading question index ${q.id}`
      );
      assert.ok(q.explanation.trim().length > 0);
    }
  }
  assert.equal(totalQuestions, 40);
});

test('Placement Check contains 24 calibrated questions with valid answer keys', () => {
  assert.equal(PLACEMENT_QUESTIONS.length, 24);
  for (const q of PLACEMENT_QUESTIONS) {
    assert.ok(q.options.length >= 3);
    assert.ok(q.correctIndex >= 0 && q.correctIndex < q.options.length);
    assert.ok(q.explanation.trim().length > 0);
  }
});

test('sanitizeLoadedState handles corrupted payloads and migrates v1 state safely', () => {
  const corrupted = sanitizeLoadedState({
    dailyGoalMinutes: 999,
    theme: 'neon-pink',
    learnerName: '   ',
    wordProgress: { 'nonexistent-id': { status: 'mastered' } }
  });
  assert.equal(corrupted.dailyGoalMinutes, 10);
  assert.equal(corrupted.theme, 'light');
  assert.equal(corrupted.learnerName, 'Learner');
  assert.deepEqual(corrupted.wordProgress, {});

  const migratedV1 = sanitizeLoadedState({
    learnerName: 'Dana',
    dailyGoalMinutes: 15,
    wordProgress: {
      'acad-1': {
        wordId: 'acad-1',
        status: 'mastered',
        intervalStep: 2,
        nextReviewAt: Date.now() + 10000,
        reviewCount: 3,
        lastRatedAt: Date.now(),
        lastRating: 'got_it'
      }
    },
    readingProgress: {
      completed: true,
      readProgressPercent: 100,
      quizScore: 4,
      lastAnswers: { 'r-1': 1 },
      completedAt: 1700000000000
    }
  });

  assert.equal(migratedV1.version, 2);
  assert.equal(migratedV1.learnerName, 'Dana');
  assert.equal(migratedV1.onboardingCompleted, true);
  assert.equal(migratedV1.wordProgress['acad-1']?.status, 'mastered');
  assert.equal(
    migratedV1.readingProgressById[READING_PASSAGES[0].id]?.quizScore,
    4
  );
});

test('resetLearningProgressOnly clears study progress while keeping preferences and IB reflections', () => {
  const state = createInitialState();
  state.learnerName = 'Miriam';
  state.theme = 'dark';
  state.dailyGoalMinutes = 20;
  state.practiceLevel = 'B2';
  state.explanationLanguage = 'ru';
  state.onboardingCompleted = true;
  state.ibReflections.studentName = 'Miriam K.';
  state.ibReflections.criterionCReflection = 'My personal reflection note.';
  state.activeDates = ['2026-11-22'];
  state.wordProgress['acad-1'] = {
    wordId: 'acad-1',
    status: 'mastered',
    intervalStep: 1,
    nextReviewAt: Date.now() + 86400000,
    reviewCount: 1,
    correctCount: 1,
    incorrectCount: 0,
    lastRatedAt: Date.now(),
    lastRating: 'got_it'
  };

  const reset = resetLearningProgressOnly(state);
  assert.equal(reset.learnerName, 'Miriam');
  assert.equal(reset.theme, 'dark');
  assert.equal(reset.dailyGoalMinutes, 20);
  assert.equal(reset.practiceLevel, 'B2');
  assert.equal(reset.explanationLanguage, 'ru');
  assert.equal(reset.ibReflections.studentName, 'Miriam K.');
  assert.equal(reset.ibReflections.criterionCReflection, 'My personal reflection note.');
  assert.deepEqual(reset.wordProgress, {});
  assert.deepEqual(reset.activeDates, []);
});

test('computeLearningPath returns honest empty state and adapts when weak grammar exists', () => {
  const emptyState = createInitialState();
  const emptyPath = computeLearningPath(emptyState);
  assert.equal(emptyPath.hasEnoughData, false);
  assert.ok(emptyPath.recommendations.some((r) => r.targetView === 'placement'));

  const practiced = createInitialState();
  practiced.grammarResults[GRAMMAR_LESSONS[0].id] = {
    lessonId: GRAMMAR_LESSONS[0].id,
    completed: true,
    attempts: 1,
    bestScore: 2,
    lastScore: 2,
    totalQuestions: 4,
    lastAnswers: {},
    completedAt: Date.now()
  };
  const adaptedPath = computeLearningPath(practiced);
  assert.equal(adaptedPath.hasEnoughData, true);
  assert.ok(adaptedPath.areasToImprove.some((a) => a.targetView === 'grammar'));
  assert.equal(adaptedPath.recommendedGrammarLesson.id, GRAMMAR_LESSONS[0].id);
});

test('Server AI request validation rejects invalid inputs and handles missing API key cleanly', async () => {
  assert.throws(
    () => validateMentorRequest({ mode: 'unknown', messages: [] }),
    (err: unknown) => err instanceof AIServiceError && err.statusCode === 400
  );

  assert.throws(
    () =>
      validateMentorRequest({
        mode: 'grammar',
        level: 'B1',
        explanationLanguage: 'en',
        messages: [{ role: 'user', content: 'x'.repeat(3500) }]
      }),
    (err: unknown) => err instanceof AIServiceError && err.errorCode === 'MESSAGE_TOO_LONG'
  );

  assert.throws(
    () => validateWritingFeedbackRequest({ text: 'too short' }),
    (err: unknown) => err instanceof AIServiceError && err.errorCode === 'TEXT_TOO_SHORT'
  );

  const prevKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  try {
    const validated = validateMentorRequest({
      mode: 'grammar',
      level: 'B1',
      explanationLanguage: 'en',
      messages: [{ role: 'user', content: 'Explain Present Perfect vs Past Simple.' }]
    });
    await assert.rejects(
      () => activeAIProvider.generateMentorReply(validated),
      (err: unknown) =>
        err instanceof AIServiceError &&
        err.statusCode === 503 &&
        err.errorCode === 'AI_NOT_CONFIGURED'
    );
  } finally {
    if (prevKey !== undefined) {
      process.env.GEMINI_API_KEY = prevKey;
    }
  }
});

test('Netlify functions handle health check, invalid JSON, method checks, and missing API key cleanly', async () => {
  const prevKey = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  try {
    const healthRes = await healthHandler({ httpMethod: 'GET' });
    assert.equal(healthRes.statusCode, 200);
    const healthBody = JSON.parse(healthRes.body) as { ok: boolean; aiConfigured: boolean; model: string };
    assert.equal(healthBody.ok, true);
    assert.equal(healthBody.aiConfigured, false);
    assert.ok(healthBody.model.length > 0);

    const methodRes = await mentorHandler({ httpMethod: 'GET', body: null });
    assert.equal(methodRes.statusCode, 405);

    const badJsonRes = await mentorHandler({ httpMethod: 'POST', body: '{invalid-json' });
    assert.equal(badJsonRes.statusCode, 400);
    assert.equal(JSON.parse(badJsonRes.body).errorCode, 'INVALID_JSON');

    const unconfiguredMentorRes = await mentorHandler({
      httpMethod: 'POST',
      body: JSON.stringify({
        mode: 'grammar',
        level: 'B1',
        explanationLanguage: 'en',
        messages: [{ role: 'user', content: 'Explain articles.' }]
      })
    });
    assert.equal(unconfiguredMentorRes.statusCode, 503);
    assert.equal(JSON.parse(unconfiguredMentorRes.body).errorCode, 'AI_NOT_CONFIGURED');

    const unconfiguredFeedbackRes = await feedbackHandler({
      httpMethod: 'POST',
      body: JSON.stringify({
        kind: 'writing',
        taskType: 'Email',
        promptTitle: 'Test',
        level: 'B1',
        explanationLanguage: 'en',
        text: 'This is a sample English paragraph for testing validation.'
      })
    });
    assert.equal(unconfiguredFeedbackRes.statusCode, 503);
    assert.equal(JSON.parse(unconfiguredFeedbackRes.body).errorCode, 'AI_NOT_CONFIGURED');
  } finally {
    if (prevKey !== undefined) {
      process.env.GEMINI_API_KEY = prevKey;
    }
  }
});
