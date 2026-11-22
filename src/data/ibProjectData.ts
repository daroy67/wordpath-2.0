import { GRAMMAR_LESSONS } from './grammar';
import { PLACEMENT_QUESTIONS } from './placement';
import { READING_PASSAGE, READING_PASSAGES } from './reading';
import { VOCABULARY_WORDS } from './vocabulary';

const WORD_COUNT = VOCABULARY_WORDS.length;
const GRAMMAR_LESSON_COUNT = GRAMMAR_LESSONS.length;
const GRAMMAR_QUESTION_COUNT = GRAMMAR_LESSONS.reduce(
  (sum, lesson) => sum + lesson.questions.length,
  0
);
const READING_PASSAGE_COUNT = READING_PASSAGES.length;
const READING_WORD_COUNT = READING_PASSAGE.wordCount;
const TOTAL_READING_WORDS = READING_PASSAGES.reduce((sum, p) => sum + p.wordCount, 0);
const READING_QUESTION_COUNT = READING_PASSAGES.reduce(
  (sum, p) => sum + p.questions.length,
  0
);
const PLACEMENT_QUESTION_COUNT = PLACEMENT_QUESTIONS.length;
const TOTAL_TESTED_ITEMS =
  GRAMMAR_QUESTION_COUNT + READING_QUESTION_COUNT + PLACEMENT_QUESTION_COUNT;

export const WORDPATH_CONTENT_METRICS = {
  wordCount: WORD_COUNT,
  grammarLessonCount: GRAMMAR_LESSON_COUNT,
  grammarQuestionCount: GRAMMAR_QUESTION_COUNT,
  readingPassageCount: READING_PASSAGE_COUNT,
  readingWordCount: READING_WORD_COUNT,
  totalReadingWords: TOTAL_READING_WORDS,
  readingQuestionCount: READING_QUESTION_COUNT,
  placementQuestionCount: PLACEMENT_QUESTION_COUNT,
  totalTestedItems: TOTAL_TESTED_ITEMS
};

export interface SuccessCriterionSpec {
  id: string;
  name: string;
  requirement: string;
  measurement: string;
  verificationMethod: string;
  target: string;
  whyImportant: string;
}

export interface ResearchSource {
  id: string;
  author: string;
  year: string;
  title: string;
  publisherOrJournal: string;
  url: string;
  apa7: string;
  mainFindings: string;
  relevanceToWordPath: string;
  limitations: string;
}

export interface ATLSkillRow {
  skill: string;
  plannedAction: string;
  implementedFeature: string;
  studentPerformed: string;
  verifiedTesting: string;
  evidenceRequired: string;
  challenge: string;
  solution: string;
  learningGoalLink: string;
  productGoalLink: string;
}

export type EvaluationStatus =
  | 'Verified in source code'
  | 'Verified through browser testing'
  | 'Tested by a real user'
  | 'Pending verification';

export interface CriterionCEvalRow {
  id: string;
  criterion: string;
  target: string;
  actualResult: string;
  evidence: string;
  status: EvaluationStatus;
  explanation: string;
}

export interface VivaQuestion {
  id: number;
  question: string;
  answer: string;
  focusArea: string;
}

export interface SlideOutline {
  slideNumber: number;
  title: string;
  duration: string;
  keyPoints: string[];
  visualToShow: string;
}

export interface EvidenceItem {
  id: string;
  category: string;
  title: string;
  description: string;
}

export const INITIAL_PROJECT_ANALYSIS = [
  {
    question: '1. How complex is this idea?',
    answer:
      'Moderate-to-high for a frontend application, but well scoped when built without a backend. The challenge lies not in server infrastructure, but in designing clean state transitions across six interactive learning modules, guarded active-recall vocabulary scheduling, defensive LocalStorage validation, and grammatically verified B1–B2 content.'
  },
  {
    question: '2. Is a high-quality MVP realistic in one day?',
    answer:
      'Yes, provided scope is disciplined: a client-side React + Vite SPA using LocalStorage instead of authentication/databases, curated B1–B2 content instead of external paid APIs, and a unified editorial design system.'
  },
  {
    question: '3. What are the main technical risks?',
    answer:
      'Key risks include state desynchronization across modules, LocalStorage schema corruption on reload, accidental erasure of IB notes during progress resets, mobile horizontal overflow at 360 px, and claiming scientific validity for a simplified interval heuristic.'
  },
  {
    question: '4. Why is this idea strong for an IB MYP Personal Project?',
    answer:
      'It authentically integrates a genuine Technical & Product Goal (building an accessible React platform) with a measurable Learning Goal (researching retrieval practice, spaced repetition, and contextual learning) under the Global Context Scientific and Technical Innovation.'
  },
  {
    question: '5. Which elements matter most for product quality?',
    answer:
      'Zero broken buttons or dead states, zero fabricated progress metrics, accurate B1–B2 educational explanations, responsive usability from 360 px to 1366+ px, separated IB documentation from the learner workspace, and clear alignment between every feature and the Success Criteria.'
  }
];

export const SUCCESS_CRITERIA_SPECS: SuccessCriterionSpec[] = [
  {
    id: 'SC1',
    name: 'Functionality',
    requirement:
      'All core sections (Dashboard, AI Mentor, Learning Path, Vocabulary, Grammar, Reading, Writing & Speaking Studio, Placement Check, Progress, Settings) load cleanly and respond to every interactive control without runtime errors.',
    measurement: 'End-to-end verification of navigation paths, filters, resets, API endpoints, and quizzes.',
    verificationMethod: 'Automated tests + build checks + interactive walkthrough checking zero uncaught errors.',
    target: '10 learning/settings views + separated IB Project Hub functional with 0 uncaught errors',
    whyImportant: 'Broken controls break learner trust and prevent the product from functioning as a usable digital tool.'
  },
  {
    id: 'SC2',
    name: 'Vocabulary',
    requirement:
      `Curated B1–B2 English words across 10 topics with IPA, definitions, Russian translations, synonyms, collocations, translation-reveal active-recall guard, search, filters, and interval review.`,
    measurement: 'Count curated entries and verify search, topic/level/status filters, reveal gate before mastery, Web Speech audio, and Again/Hard/Got it scheduling.',
    verificationMethod: 'Unit tests + dataset inspection + interactive flashcard & Due queue checks.',
    target: `${WORD_COUNT} words (10 topics) with reveal-gated mastery & 3-state interval scheduler`,
    whyImportant: 'Vocabulary acquisition requires genuine active recall rather than accidental single-click mastery.'
  },
  {
    id: 'SC3',
    name: 'Grammar',
    requirement:
      `Comprehensive B1–B2 grammar modules (${GRAMMAR_LESSON_COUNT} lessons) with formulas, common mistakes, and 4 interactive quiz items each.`,
    measurement: 'Verify lesson structure, formula clarity, interactive question grading, and explanatory feedback.',
    verificationMethod: `Automated answer-key verification + interactive check of all ${GRAMMAR_LESSON_COUNT} lesson quizzes.`,
    target: `${GRAMMAR_LESSON_COUNT} lessons × 4 questions each (${GRAMMAR_QUESTION_COUNT} total) with instant rationale feedback`,
    whyImportant: 'Explicit rules paired with common error contrast and immediate testing reinforce retrieval practice.'
  },
  {
    id: 'SC4',
    name: 'Reading',
    requirement:
      `${READING_PASSAGE_COUNT} original B1–B2 articles (${TOTAL_READING_WORDS} total words) with programmatic word counts, reading progress indicator, Focus Reader mode, clickable glossary, and graded comprehension questions.`,
    measurement: 'Programmatic word count check + Focus Reader toggle + MCQ & True/False quiz submission.',
    verificationMethod: 'Unit tests for programmatic word counts & valid answer keys + reading room walkthrough.',
    target: `${READING_PASSAGE_COUNT} original passages (${TOTAL_READING_WORDS} words total) + ${READING_QUESTION_COUNT} graded questions`,
    whyImportant: 'Contextual reading anchors vocabulary and grammar inside coherent discourse rather than isolated drills.'
  },
  {
    id: 'SC5',
    name: 'Assessment',
    requirement:
      `A ${PLACEMENT_QUESTION_COUNT}-question informal diagnostic check (with 12-item quick mode) testing vocabulary, grammar, and reading clues with skill breakdown, suggested lessons, and explicit non-CEFR disclaimer.`,
    measurement: 'Inspect skill breakdown, partial-completion flag, suggested lessons, and non-CEFR disclaimer visibility.',
    verificationMethod: 'Verify all 24 items, answer keys, and non-CEFR disclaimer in source code and tests.',
    target: `${PLACEMENT_QUESTION_COUNT} questions with skill breakdown, lesson suggestions, and informal disclaimer`,
    whyImportant: 'Diagnostic orientation helps learners pick appropriate modules while maintaining academic honesty about CEFR scope.'
  },
  {
    id: 'SC6',
    name: 'Progress Tracking',
    requirement:
      'Every completed review, quiz, draft, speaking session, and placement check updates Dashboard & Progress analytics immediately, persists safely across reloads via LocalStorage (wordpath_state_v2), and partitions Learning Reset from Full Reset.',
    measurement: 'Test state sanitization, v1→v2 migration, Learning Reset preservation of IB notes/theme, and JSON export.',
    verificationMethod: 'Unit tests for sanitizeLoadedState & resetLearningProgressOnly + LocalStorage persistence check.',
    target: '100% persistence across reload + honest zero-state + safe split reset + JSON backup',
    whyImportant: 'Visible, trustworthy feedback sustains learner motivation and prevents accidental loss of student reflections.'
  },
  {
    id: 'SC7',
    name: 'Responsiveness',
    requirement:
      'Layout adapts cleanly across 360 px (mobile), 768 px (tablet), and 1366+ px (desktop) viewports with zero unintended horizontal scroll.',
    measurement: 'Resize viewport to 360 px, 768 px, and 1366 px and check `document.documentElement.scrollWidth <= window.innerWidth`.',
    verificationMethod: 'Responsive browser inspection across all modules at target widths.',
    target: '0 px horizontal overflow across 360 px, 768 px, and 1366 px',
    whyImportant: 'Learners frequently practice on phones as well as laptops; broken overflow makes mobile study unusable.'
  },
  {
    id: 'SC8',
    name: 'User Experience',
    requirement:
      'Intuitive navigation across English modules, selectable daily goal pacing (10 / 15 / 20 estimated minutes), separated Project Documentation section, and self-explanatory instructions.',
    measurement: 'Evaluate goal switching consistency (`3+4+3=10`, `5+6+4=15`, `7+8+5=20`), sidebar separation, and toast feedback.',
    verificationMethod: 'Walkthrough testing following Nielsen’s usability heuristics.',
    target: '≤ 2 clicks to start any module from Dashboard; consistent estimated study pacing',
    whyImportant: 'Minimal cognitive friction keeps focus on learning English rather than figuring out the interface.'
  },
  {
    id: 'SC9',
    name: 'Accessibility',
    requirement:
      'Keyboard-navigable controls, visible focus-visible outlines, readable typography, non-color-only state cues, and WCAG 2.2 AA contrast alignment.',
    measurement: 'Keyboard Tab traversal test, contrast audit (#0F172A on #FFFFFF / #F8FAFC; #0284C7 buttons), check explicit icons/text on feedback.',
    verificationMethod: 'Keyboard-only navigation check and color/label inspection.',
    target: 'Full keyboard tabbing, visible focus rings, ≥ 4.5:1 body text contrast',
    whyImportant: 'Inclusive design aligns with W3C WCAG 2.2 standards and ensures legibility for all users.'
  },
  {
    id: 'SC10',
    name: 'Content Quality',
    requirement:
      `All English explanations, examples, reading prose, and ${TOTAL_TESTED_ITEMS} quiz/test rationales are grammatically accurate, calibrated to B1–B2, and accompanied by clear reasoning.`,
    measurement: `Editorial proofreading of all ${WORD_COUNT} words, ${GRAMMAR_LESSON_COUNT} grammar lessons, ${READING_WORD_COUNT}-word reading text, and ${TOTAL_TESTED_ITEMS} quiz/test items.`,
    verificationMethod: 'Line-by-line linguistic review and answer-key verification.',
    target: '100% verified answer keys and clear rationale on every question',
    whyImportant: 'An educational platform fails its core purpose if instructional content contains errors or unexplained answers.'
  }
];

export const RESEARCH_SOURCES: ResearchSource[] = [
  {
    id: 'src-roediger-2006',
    author: 'Roediger, H. L., III, & Karpicke, J. D.',
    year: '2006',
    title: 'Test-enhanced learning: Taking memory tests improves long-term retention',
    publisherOrJournal: 'Psychological Science, 17(3), 249–255',
    url: 'https://doi.org/10.1111/j.1467-9280.2006.01693.x',
    apa7: 'Roediger, H. L., III, & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. Psychological Science, 17(3), 249–255. https://doi.org/10.1111/j.1467-9280.2006.01693.x',
    mainFindings:
      'Experiments comparing repeated reading against active recall testing showed that while rereading helped on an immediate 5-minute check, taking recall tests produced substantially better retention after 2 days and 1 week.',
    relevanceToWordPath:
      'Directly justifies placing retrieval quizzes inside every Grammar lesson, ending Reading with 5 comprehension questions, and requiring translation reveal on Vocabulary cards before enabling mastery.',
    limitations:
      'Laboratory experiments used short prose passages in controlled sessions rather than multi-week second-language web platforms.'
  },
  {
    id: 'src-cepeda-2006',
    author: 'Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D.',
    year: '2006',
    title: 'Distributed practice in verbal recall tasks: A review and quantitative synthesis',
    publisherOrJournal: 'Psychological Bulletin, 132(3), 354–380',
    url: 'https://doi.org/10.1037/0033-2909.132.3.354',
    apa7: 'Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. Psychological Bulletin, 132(3), 354–380. https://doi.org/10.1037/0033-2909.132.3.354',
    mainFindings:
      'Synthesizing 317 experiments across 184 articles, the authors confirmed that spacing practice sessions over time consistently improves long-term verbal recall compared to massed practice, and that optimal gaps scale with the desired retention period.',
    relevanceToWordPath:
      'Supports WordPath’s short daily session options (10 / 15 / 20 estimated minutes) and progressive interval vocabulary review (Again → Hard 10 min → Got it 1d/3d/7d/14d) instead of one-time word lists.',
    limitations:
      'Meta-analysis focuses on experimental verbal recall intervals; WordPath’s 3-button scheduler is a simplified educational heuristic inspired by spacing principles, not a calibrated cognitive algorithm.'
  },
  {
    id: 'src-nation-2022',
    author: 'Nation, I. S. P.',
    year: '2022',
    title: 'Learning vocabulary in another language (3rd ed.)',
    publisherOrJournal: 'Cambridge University Press',
    url: 'https://www.cambridge.org/core/books/learning-vocabulary-in-another-language/669D434B8FA228DBCE9FD3E469147DA8',
    apa7: 'Nation, I. S. P. (2022). Learning vocabulary in another language (3rd ed.). Cambridge University Press. https://www.cambridge.org/core/books/learning-vocabulary-in-another-language/669D434B8FA228DBCE9FD3E469147DA8',
    mainFindings:
      'Demonstrates that robust vocabulary acquisition balances deliberate word-card study with meaning-focused contextual input (such as reading), because repeated encounters across varied contexts build stronger syntactic and collocational knowledge.',
    relevanceToWordPath:
      'Shapes the pairing of WordPath’s Vocabulary Studio (deliberate flashcards with example sentences) and the Reading Room (contextualized prose with inline glossary clues).',
    limitations:
      `Broad textbook synthesis across many classroom contexts; individual digital learners still require long-term exposure beyond a ${WORD_COUNT}-word starter bank.`
  },
  {
    id: 'src-coe-2020',
    author: 'Council of Europe',
    year: '2020',
    title: 'Common European Framework of Reference for Languages: Learning, teaching, assessment — Companion volume',
    publisherOrJournal: 'Council of Europe Publishing',
    url: 'https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume',
    apa7: 'Council of Europe. (2020). Common European Framework of Reference for Languages: Learning, teaching, assessment — Companion volume. Council of Europe Publishing. https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-companion-volume',
    mainFindings:
      'Defines B1 (Independent User — Threshold) and B2 (Independent User — Vantage) descriptors, emphasizing ability to follow main points, understand coherent arguments, and express viewpoints clearly.',
    relevanceToWordPath:
      `Used to calibrate the difficulty of WordPath’s ${WORD_COUNT} vocabulary items, ${GRAMMAR_LESSON_COUNT} grammar topics, and ${READING_WORD_COUNT}-word reading article, as well as to keep the Placement Check honestly labeled as an informal internal guide.`,
    limitations:
      'CEFR provides descriptive proficiency scales rather than prescribing specific software UI mechanics or automated test scoring formulas.'
  },
  {
    id: 'src-w3c-2023',
    author: 'World Wide Web Consortium (W3C)',
    year: '2023',
    title: 'Web Content Accessibility Guidelines (WCAG) 2.2',
    publisherOrJournal: 'W3C Recommendation',
    url: 'https://www.w3.org/TR/WCAG22/',
    apa7: 'World Wide Web Consortium. (2023). Web Content Accessibility Guidelines (WCAG) 2.2. W3C. https://www.w3.org/TR/WCAG22/',
    mainFindings:
      'Establishes testable accessibility criteria including minimum 4.5:1 normal text contrast, visible keyboard focus indicators, target size considerations, and avoiding color-only status indicators.',
    relevanceToWordPath:
      'Directly governs WordPath’s high-contrast paper-and-ink palette (#0F172A on #F8FAFC/#FFFFFF), `focus-visible` outlines, keyboard flashcard controls, and icon + text feedback cues.',
    limitations:
      'Conformance requires careful manual and assistive-technology testing beyond automated color contrast checks.'
  },
  {
    id: 'src-nielsen-2024',
    author: 'Nielsen, J.',
    year: '2024',
    title: '10 usability heuristics for user interface design',
    publisherOrJournal: 'Nielsen Norman Group (Original work published 1994)',
    url: 'https://www.nngroup.com/articles/ten-usability-heuristics/',
    apa7: 'Nielsen, J. (2024). 10 usability heuristics for user interface design. Nielsen Norman Group. https://www.nngroup.com/articles/ten-usability-heuristics/',
    mainFindings:
      'Outlines foundational interface principles including visibility of system status, match between system and real world, user control and freedom, consistency, and error prevention.',
    relevanceToWordPath:
      'Guided the consistent Daily Learning Plan pacing, clear zero-state messages, separation of Learning Reset vs. guarded Full Reset, and immediate feedback on quiz submissions.',
    limitations:
      'Heuristics are general usability principles rather than domain-specific pedagogical metrics, so they must be paired with learning science research.'
  }
];

export const CRITERION_B_ATL_ROWS: ATLSkillRow[] = [
  {
    skill: 'Research Skills (Information Literacy)',
    plannedAction:
      'Identify peer-reviewed cognitive science studies, CEFR B1–B2 descriptors, and WCAG 2.2 / UX guidelines before designing features.',
    implementedFeature:
      'Six APA 7 research entries with verified DOIs/publisher URLs embedded in `ibProjectData.ts` and reflected in active-recall flashcard guards and graded quizzes.',
    studentPerformed:
      '[Editable: Note which specific articles or CEFR/WCAG pages you read personally and how you summarized key takeaways in your own words.]',
    verifiedTesting:
      'All six URLs/DOIs verified via web search; active-recall gate (`hasRevealedCurrent`) and informal Placement Check disclaimer verified in source code.',
    evidenceRequired:
      'Your personal annotated reading notes and a screenshot of the Research & APA 7 tab.',
    challenge:
      'Avoiding exaggerated claims when translating academic spaced-repetition research into a lightweight client-side web scheduler.',
    solution:
      'Built an explicit, transparent 3-button interval formula (Again, Hard, Got it) and documented its scope limits inside Vocabulary Studio and IB documentation.',
    learningGoalLink:
      'Deepened understanding of how empirical memory research informs digital learning mechanics.',
    productGoalLink:
      'Shaped the design of Vocabulary Studio, Grammar Quizzes, Reading Room, and Placement Check.'
  },
  {
    skill: 'Thinking Skills (Critical & Computational Thinking)',
    plannedAction:
      'Architect centralized TypeScript state management, defensive LocalStorage hydration, and split reset flows with zero fabricated metrics.',
    implementedFeature:
      '`useWordPathState.ts` + `dailyPlan.ts` with schema sanitization (`sanitizeLoadedState`), dynamic metrics derivation, `resetLearningProgress()`, and guarded `resetEntireApplication()`.',
    studentPerformed:
      '[Editable: Describe a specific bug or logic flaw you analyzed yourself—such as separating learning resets from IB notes or aligning daily goal step totals.]',
    verifiedTesting:
      'TypeScript type-check (`tsc --noEmit`), production Vite build (`vite build`), and state-hook validation tests across reset and goal-switching edge cases.',
    evidenceRequired:
      'Code snippet of `useWordPathState.ts` + DevTools `localStorage` (`wordpath_state_v1`) before/after reload and reset screenshots.',
    challenge:
      'Preventing corrupted storage payloads, daily-plan duration mismatches, or progress resets from breaking state or wiping IB reflections.',
    solution:
      'Added field-level state sanitization on load, a single `DAILY_PLAN_CONFIG` source of truth (`10/15/20 min`), and partitioned learning reset from full reset.',
    learningGoalLink:
      'Strengthened architectural reasoning around state integrity, defensive parsing, and React hooks.',
    productGoalLink:
      'Delivered reliable cross-module progress tracking and safe data management across reloads.'
  },
  {
    skill: 'Thinking Skills (Creative Thinking)',
    plannedAction:
      'Design a distraction-free editorial interface separating English study from IB project documentation and author an original B1–B2 reading passage.',
    implementedFeature:
      `Clean light-theme workspace with separated bottom "Project Documentation" navigation, ${READING_WORD_COUNT}-word original article with clickable glossary, and keyboard-accessible flashcards.`,
    studentPerformed:
      '[Editable: Explain design choices you compared or changed (for example, simplifying cards, moving IB docs to the bottom sidebar, or adjusting mobile layout).]',
    verifiedTesting:
      'Source inspection of `Layout.tsx`, `DashboardView.tsx`, and `ReadingView.tsx` + responsive viewport testing status recorded in Criterion C.',
    evidenceRequired:
      'Desktop (1366 px) and mobile (360 px) screenshots of Dashboard, Vocabulary, and Reading Room.',
    challenge:
      'Keeping the learning interface calm and commercially credible on 360 px mobile screens without letting school project documentation clutter daily study.',
    solution:
      'Moved IB Project Hub to a separated bottom sidebar/drawer section labeled "Project Documentation" and enforced clean card density and zero-pill metadata.',
    learningGoalLink:
      'Practiced translating pedagogical clarity into calm visual hierarchy and responsive UI architecture.',
    productGoalLink:
      'Produced a focused EdTech interface suitable for everyday English practice.'
  },
  {
    skill: 'Communication Skills',
    plannedAction:
      'Author clear B1–B2 definitions, Russian translations, grammar mistake contrasts, quiz rationales, and honest diagnostic wording.',
    implementedFeature:
      `${WORD_COUNT} vocabulary cards, ${GRAMMAR_LESSON_COUNT} grammar lessons (${GRAMMAR_QUESTION_COUNT} questions), ${READING_QUESTION_COUNT} reading MCQs, and ${PLACEMENT_QUESTION_COUNT} placement items with explicit rationales and non-CEFR disclaimer.`,
    studentPerformed:
      '[Editable: Record any wording revisions you made after reading explanations aloud or getting feedback from a classmate or teacher.]',
    verifiedTesting:
      'Editorial audit of all 28 words, 29 total quiz/diagnostic questions, and placement disclaimer text in source code.',
    evidenceRequired:
      'Screenshots of Grammar mistake contrasts, Vocabulary active-recall card, Placement disclaimer, and README documentation.',
    challenge:
      'Writing concise explanations for grammar contrasts (e.g., Present Perfect vs. Past Simple) and communicating honest Placement Check boundaries.',
    solution:
      'Structured every grammar lesson as Explanation → Formula → Examples → Common Mistakes → Graded Check and changed Placement output to "Recommended Practice Focus: B1 Foundations / B2 Extension".',
    learningGoalLink:
      'Improved technical and pedagogical clarity when writing instructional copy for B1–B2 learners.',
    productGoalLink:
      `Ensured all ${TOTAL_TESTED_ITEMS} interactive questions and diagnostic screens deliver clear, non-misleading guidance.`
  },
  {
    skill: 'Self-Management Skills (Organization & Affective)',
    plannedAction:
      'Execute a disciplined one-day sprint separating MVP functionality, educational content, QA testing, and IB reflection evidence.',
    implementedFeature:
      'In-app `IB Project Hub` with editable reflection fields, persistent 8-item Evidence Checklist, Markdown dossier export, and dedicated `FINAL_QA_REPORT.md`.',
    studentPerformed:
      '[Editable: Reflect on how you actually paced your work, handled setbacks, and what personal evidence screenshots/tester notes you still need to gather.]',
    verifiedTesting:
      'Verified `npm run lint`, `npm run build`, and updated Criterion C table reflecting exact verification boundaries.',
    evidenceRequired:
      'Build/lint terminal output, personal testing notes from 2–3 real users, and completed reflection fields before final IB submission.',
    challenge:
      'Distinguishing what was genuinely verified in code/build/browser versus what still requires real classmate testing and personal evidence collection.',
    solution:
      'Explicitly partitioned Criterion B into planned, implemented, student-performed, verified-testing, and pending-evidence columns and kept personal fields editable.',
    learningGoalLink:
      'Developed realistic scoping, verification discipline, and academic honesty under time constraints.',
    productGoalLink:
      'Delivered a clean, build-verified application with transparent documentation ready for defense.'
  }
];

export const CRITERION_C_EVALUATION: CriterionCEvalRow[] = [
  {
    id: 'SC1',
    criterion: 'Functionality',
    target: 'All learning views + AI Mentor + Studio + IB Hub functional with 0 uncaught errors',
    actualResult: 'All 11 views, ErrorBoundary, OnboardingModal, and Express/Netlify API proxy wired cleanly.',
    evidence: 'src/App.tsx, server.ts, npm run lint, npm test & npm run build',
    status: 'Verified in source code',
    explanation: 'TypeScript compilation, unit tests, and Vite production bundling pass cleanly; live browser visual inspection boundary noted in FINAL_QA_REPORT.md.'
  },
  {
    id: 'SC2',
    criterion: 'Vocabulary',
    target: `${WORD_COUNT} words (10 topics) + reveal-gated mastery & 3-state interval scheduler`,
    actualResult: `${WORD_COUNT} B1–B2 words across 10 topics with IPA, synonyms, collocations, and reveal-gated mastery.`,
    evidence: 'src/data/vocabulary.ts, src/components/VocabularyView.tsx, tests/wordpath.test.ts',
    status: 'Verified in source code',
    explanation: 'Active-recall gate (`hasRevealedCurrent` and Directory reveal) prevents accidental single-click mastery while preserving Again/Hard/Got it interval scheduling.'
  },
  {
    id: 'SC3',
    criterion: 'Grammar',
    target: `${GRAMMAR_LESSON_COUNT} lessons × 4 questions (${GRAMMAR_QUESTION_COUNT} total) with rationales`,
    actualResult: `${GRAMMAR_LESSON_COUNT} lessons × 4 questions (${GRAMMAR_QUESTION_COUNT} total) with formulas, mistake contrasts, and instant rationales.`,
    evidence: 'src/data/grammar.ts, src/components/GrammarView.tsx, tests/wordpath.test.ts',
    status: 'Verified in source code',
    explanation: 'All 12 topics and 48 answer keys verified programmatically and in source code with best/last score persistence.'
  },
  {
    id: 'SC4',
    criterion: 'Reading',
    target: `${READING_PASSAGE_COUNT} original articles + ${READING_QUESTION_COUNT} comprehension questions + glossary`,
    actualResult: `${READING_PASSAGE_COUNT} original B1–B2 passages (${TOTAL_READING_WORDS} words) with inline glossary, Focus Reader mode, Web Speech, and ${READING_QUESTION_COUNT} MCQ/TF checks.`,
    evidence: 'src/data/reading.ts, src/components/ReadingView.tsx, tests/wordpath.test.ts',
    status: 'Verified in source code',
    explanation: 'Word counts are calculated programmatically via computeWordCount() and checked in unit tests.'
  },
  {
    id: 'SC5',
    criterion: 'Assessment',
    target: `${PLACEMENT_QUESTION_COUNT}-question diagnostic + informal non-CEFR disclaimer`,
    actualResult: `${PLACEMENT_QUESTION_COUNT} calibrated items (plus 12-item quick mode) with skill breakdown, lesson suggestions, and explicit non-CEFR disclaimer.`,
    evidence: 'src/data/placement.ts, src/components/PlacementTestView.tsx, tests/wordpath.test.ts',
    status: 'Verified in source code',
    explanation: 'Clearly communicates that an internal diagnostic guides WordPath study focus and does not establish official CEFR proficiency.'
  },
  {
    id: 'SC6',
    criterion: 'Progress Tracking',
    target: 'Validated LocalStorage persistence + v1→v2 migration + split Learning vs. Full Reset',
    actualResult: 'Defensive sanitizeLoadedState() hydration, v1→v2 migration, resetLearningProgressOnly(), JSON export backup, and guarded Full Reset.',
    evidence: 'src/hooks/useWordPathState.ts, src/components/SettingsView.tsx, tests/wordpath.test.ts',
    status: 'Verified in source code',
    explanation: 'State hook sanitizes malformed payloads, protects student IB reflections, and passes automated migration/reset tests.'
  },
  {
    id: 'SC7',
    criterion: 'Responsiveness',
    target: '0 px horizontal overflow across 360 px, 768 px, and 1366 px',
    actualResult: 'Responsive grid, wrapped formula boxes, compact 56 px mobile header, and slide-down drawer implemented.',
    evidence: 'src/components/Layout.tsx, src/components/*.tsx (pending live viewport script check)',
    status: 'Pending verification',
    explanation: 'Requires real browser viewport measurement at 360/768/1366 px (or manual DevTools inspection if headless browser is unavailable).'
  },
  {
    id: 'SC8',
    criterion: 'User Experience',
    target: 'Consistent 10/15/20 estimated daily plans + separated IB documentation',
    actualResult: 'Centralized `DAILY_PLAN_CONFIG` (`3+4+3=10`, `5+6+4=15`, `7+8+5=20`) and bottom "Project Documentation" sidebar section.',
    evidence: 'src/data/dailyPlan.ts, src/components/DashboardView.tsx, src/components/Layout.tsx',
    status: 'Verified in source code',
    explanation: 'Daily plan durations and vocabulary targets stay synchronized across goal buttons and step completion counters.'
  },
  {
    id: 'SC9',
    criterion: 'Accessibility',
    target: 'WCAG 2.2 AA contrast, focus-visible rings, keyboard nav, dual-coded feedback',
    actualResult: '#0F172A on #F8FAFC/#FFFFFF palette, `:focus-visible` outlines, 44 px mobile targets, and icon+text quiz feedback.',
    evidence: 'src/index.css, src/components/VocabularyView.tsx, src/components/GrammarView.tsx',
    status: 'Pending verification',
    explanation: 'Styling and ARIA attributes are implemented in code; manual keyboard-only traversal and screen-reader/user check remain pending.'
  },
  {
    id: 'SC10',
    criterion: 'Content Quality',
    target: '100% accurate B1–B2 explanations and verified APA 7 sources',
    actualResult: `Proofread ${WORD_COUNT} words, ${TOTAL_TESTED_ITEMS} questions, and 6 APA 7 references with verified DOIs/publisher links.`,
    evidence: 'src/data/*.ts, FINAL_QA_REPORT.md',
    status: 'Verified in source code',
    explanation: 'Linguistic explanations and bibliography URLs were audited; real student/teacher pilot feedback (`Tested by a real user`) must be collected by the student.'
  }
];

export const EVIDENCE_CHECKLIST: EvidenceItem[] = [
  {
    id: 'ev-1',
    category: 'Development Process',
    title: 'Initial Planning & Architecture Diagram',
    description: 'Capture screenshot of your implementation plan / state architecture and early design choices before finalizing.'
  },
  {
    id: 'ev-2',
    category: 'Interface & Responsiveness',
    title: 'Desktop (1366 px), Tablet (768 px) & Mobile (360 px) Screenshots',
    description: 'Screenshot Dashboard, Vocabulary, Grammar, Reading, Placement, and Progress at all three widths showing zero horizontal scroll.'
  },
  {
    id: 'ev-3',
    category: 'Working Functionality',
    title: 'Vocabulary Active Recall Guard & Web Speech Demo',
    description: 'Screenshot a word card before and after clicking "Show Russian translation" showing "Got it" unlocking and Due count updating.'
  },
  {
    id: 'ev-4',
    category: 'Working Functionality',
    title: 'Grammar, Reading & Placement Feedback Screenshots',
    description: 'Capture graded grammar/reading rationales and the Placement Check summary with its non-CEFR disclaimer.'
  },
  {
    id: 'ev-5',
    category: 'Persistence & Safe Reset',
    title: 'LocalStorage Reload & Split Reset Verification',
    description: 'Screenshot DevTools `localStorage` (`wordpath_state_v1`) before/after hard refresh, and confirm Reset Learning Progress preserves IB notes.'
  },
  {
    id: 'ev-6',
    category: 'Source Code & Build',
    title: 'Key Code Snippets & Clean Build Log',
    description: 'Save code snippets of `useWordPathState.ts` / `dailyPlan.ts` and passing `npm run lint` + `npm run build` terminal output.'
  },
  {
    id: 'ev-7',
    category: 'User Testing',
    title: 'Real Peer / Teacher Pilot Feedback Notes',
    description: 'Ask 2–3 classmates or an English teacher to complete a 10-minute session and record genuine usability observations (never fabricate quotes).'
  },
  {
    id: 'ev-8',
    category: 'Criterion A & C Reflection',
    title: 'Completed Personal Reflections & Viva Rehearsal',
    description: 'Replace all `[Editable]` placeholders with your authentic prior knowledge, bug-fix stories, and post-testing reflections.'
  }
];

export const PRESENTATION_SLIDES: SlideOutline[] = [
  {
    slideNumber: 1,
    title: 'WordPath: Learn → Practice → Remember → Track Progress',
    duration: '45 sec',
    keyPoints: [
      'Project title, slogan ("Build your English, one focused session at a time"), and Global Context: Scientific and Technical Innovation.',
      'Why passive word lists fail B1–B2 learners and how an integrated 10/15/20-minute daily workflow solves it.'
    ],
    visualToShow: 'Clean Dashboard hero screenshot showing the Daily Learning Plan and goal selector.'
  },
  {
    slideNumber: 2,
    title: 'Learning Goal, Product Goal & Research Grounding',
    duration: '60 sec',
    keyPoints: [
      'Research Question connecting retrieval practice (Roediger & Karpicke, 2006), spacing (Cepeda et al., 2006), and contextual learning (Nation, 2022).',
      'Alignment with CEFR B1–B2 descriptors (Council of Europe, 2020) and WCAG 2.2 accessibility (W3C, 2023).'
    ],
    visualToShow: 'Compact 4-card research synthesis diagram with verified APA 7 DOIs.'
  },
  {
    slideNumber: 3,
    title: 'Technical Architecture & Safe Local Persistence',
    duration: '60 sec',
    keyPoints: [
      'Built with React 19, TypeScript, Vite, Tailwind CSS, and validated LocalStorage (`wordpath_state_v1`)—zero paid APIs.',
      'Guarded active-recall flashcards, transparent 3-step interval scheduler (Again / Hard / Got it), and partitioned Learning Reset vs. Full Reset.'
    ],
    visualToShow: 'Component & LocalStorage state flow diagram.'
  },
  {
    slideNumber: 4,
    title: 'Live Product Walkthrough: Core Modules & AI Mentor',
    duration: '90 sec',
    keyPoints: [
      `Vocabulary Studio (${WORD_COUNT} B1–B2 words), ${GRAMMAR_LESSON_COUNT} Grammar Workshops (${GRAMMAR_QUESTION_COUNT} tested items), Reading Room (${READING_PASSAGE_COUNT} passages / ${READING_QUESTION_COUNT} items), Writing & Speaking Studio, Adaptive Learning Path, and ${PLACEMENT_QUESTION_COUNT}-item Placement Check.`,
      'WordPath AI Mentor with 5 modes powered by a secure server-side Gemini proxy, plus Light/Dark themes and separated Project Documentation.'
    ],
    visualToShow: 'Live app demo or side-by-side screenshots of Dashboard, AI Mentor, Vocabulary & Reading.'
  },
  {
    slideNumber: 5,
    title: 'Success Criteria Evaluation & Testing Results',
    duration: '60 sec',
    keyPoints: [
      'Review of SC1–SC10 verification distinguishing source-code checks, browser QA, and pending real-user testing.',
      'Honest discussion of limitations (local-only browser storage, simplified interval heuristic, static starter bank).'
    ],
    visualToShow: 'Criterion C 6-column evaluation summary table.'
  },
  {
    slideNumber: 6,
    title: 'Reflection & Next Steps',
    duration: '45 sec',
    keyPoints: [
      'Key ATL skills developed: translating educational research into defensive TypeScript state logic and accessible UI.',
      'Future roadmap: custom user vocabulary decks, cross-device sync, expanded reading library, and real classmate retention trials.'
    ],
    visualToShow: 'Personal takeaway quote and future version roadmap.'
  }
];

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 1,
    focusArea: 'Motivation & Goal',
    question: 'Why did you choose to build an English learning platform for your IB MYP Personal Project?',
    answer:
      'I wanted a project that genuinely combined my interest in web development with English language learning. Instead of building a static informational site, WordPath let me research how cognitive strategies like retrieval practice and spacing work and engineer them into an interactive tool.'
  },
  {
    id: 2,
    focusArea: 'Learning vs. Product Goal',
    question: 'How is your Learning Goal different from your Product Goal?',
    answer:
      'My Product Goal is the tangible artifact—the responsive WordPath web app. My Learning Goal focuses on what I personally had to learn to build it well: modern React/TypeScript state architecture, defensive persistence, WCAG accessibility, and how retrieval practice, spaced repetition, and contextual learning support B1–B2 learners.'
  },
  {
    id: 3,
    focusArea: 'Global Context',
    question: 'Why does WordPath fit the Global Context "Scientific and Technical Innovation"?',
    answer:
      'WordPath applies software engineering and human-computer interaction principles to turn empirical findings from cognitive psychology into an accessible, zero-cost study tool.'
  },
  {
    id: 4,
    focusArea: 'System Overview',
    question: 'Walk me through how the platform works for a first-time learner.',
    answer:
      `A new user sees an optional setup wizard, starts at an honest zero-state on the Dashboard, chooses a 10, 15, or 20-minute daily goal (or takes the ${PLACEMENT_QUESTION_COUNT}-question informal Placement Check), recalls ${WORD_COUNT} B1–B2 words before revealing translations, completes ${GRAMMAR_LESSON_COUNT} grammar and ${READING_PASSAGE_COUNT} reading exercises, practices with Writing/Speaking Studio & AI Mentor, and tracks progress in Progress Analytics.`
  },
  {
    id: 5,
    focusArea: 'Tech Stack Choice',
    question: 'Why did you choose React, Vite, TypeScript, Express, and Tailwind CSS?',
    answer:
      'React with TypeScript makes multi-view state synchronization and strict data typing reliable. Adding a thin Express/Netlify serverless proxy keeps any AI API key safely on the server while keeping every core study module 100% functional offline via LocalStorage.'
  },
  {
    id: 6,
    focusArea: 'LocalStorage & Safety',
    question: 'How does LocalStorage work in your code, and how do you protect against corrupted data or accidental resets?',
    answer:
      'User state is serialized under `wordpath_state_v2` (with automatic migration from `wordpath_state_v1`) and passed through `sanitizeLoadedState()` on startup to validate types and clamp numbers. Reset Learning Progress clears only study history while preserving theme, preferences, and IB notes, whereas Full Reset requires typing "RESET ALL".'
  },
  {
    id: 7,
    focusArea: 'Spaced Repetition',
    question: 'How does your spaced repetition system work, and is it a full scientific algorithm?',
    answer:
      'It is an interval-based review scheduler inspired by distributed practice research—not a full psychometric algorithm like SM-2. Rating "Again" keeps the word in the current session queue; "Hard" schedules it 10 minutes later; "Got it" (enabled only after translation reveal) advances its interval step through 1 day, 3 days, 7 days, and 14 days.'
  },
  {
    id: 8,
    focusArea: 'Pedagogy',
    question: 'Where can we see "retrieval practice" and "contextual learning" in WordPath?',
    answer:
      `Retrieval practice appears on flashcards (where "Got it" and "Mark learned" stay locked until you reveal the translation) and in immediate graded questions after every grammar lesson and reading passage. Contextual learning appears in every vocabulary card’s example sentence, collocations, and across ${READING_PASSAGE_COUNT} reading articles (${TOTAL_READING_WORDS} words) with clickable inline glossary terms.`
  },
  {
    id: 9,
    focusArea: 'Assessment Integrity',
    question: 'Does your Placement Check establish an official CEFR B1 or B2 level?',
    answer:
      `No—and the interface states that explicitly. A ${PLACEMENT_QUESTION_COUNT}-question diagnostic (or 12-item quick mode) is strictly an informal learning guide inside WordPath to recommend B1 Foundations or B2 Extension focus, and cannot establish official CEFR proficiency.`
  },
  {
    id: 10,
    focusArea: 'Audio Feature',
    question: 'How did you add pronunciation audio without paying for an external Text-to-Speech API?',
    answer:
      'I used the browser’s built-in Web Speech API (`window.speechSynthesis`), selecting an available English voice (`en-GB` or `en-US`) and providing a capability check so pronunciation buttons degrade gracefully if a browser lacks speech voices.'
  },
  {
    id: 11,
    focusArea: 'Accessibility',
    question: 'How did you align WordPath with WCAG 2.2 AA accessibility?',
    answer:
      'I used high-contrast ink on light surfaces (#0F172A on #FFFFFF/#F8FAFC), added visible `focus-visible` outlines, ensured touch targets meet mobile guidelines, supported keyboard flashcard navigation, and paired every red/green feedback state with explicit icons and text labels.'
  },
  {
    id: 12,
    focusArea: 'Technical Challenge',
    question: 'What were the hardest technical bugs you caught during quality assurance?',
    answer:
      'Three concrete issues surfaced: Reset Local Data originally wiped IB reflections along with learning progress; changing the daily goal to 15 or 20 minutes did not update the hardcoded 10-minute Dashboard steps; and flashcards allowed marking "Got it" before revealing the translation. Centralizing `DAILY_PLAN_CONFIG`, partitioning resets, and gating mastery on reveal solved all three.'
  },
  {
    id: 13,
    focusArea: 'ATL Skills',
    question: 'Which IB ATL skill helped you the most and why?',
    answer:
      'Thinking skills (computational and critical thinking) paired with self-management: separating what was verified in code from what still requires live browser or peer testing kept the evaluation honest and focused.'
  },
  {
    id: 14,
    focusArea: 'Success Criteria',
    question: 'How do you evaluate whether your product meets its Success Criteria (SC1–SC10)?',
    answer:
      `Each criterion has a measurable target and a transparent status—for example, counting ${WORD_COUNT} vocabulary items, verifying ${GRAMMAR_LESSON_COUNT} grammar lessons (${GRAMMAR_QUESTION_COUNT} items), checking the ${READING_WORD_COUNT}-word reading passage, testing split resets, and separating code verification from pending real-user testing.`
  },
  {
    id: 15,
    focusArea: 'Limitations & Future',
    question: 'If you had another month to develop WordPath, what would you improve first?',
    answer:
      'I would add user-created custom vocabulary decks, expand the Reading Room across more B1 and B2 topics, add optional cloud sync for cross-device study, and conduct longitudinal user testing with B1–B2 classmates to measure real retention gains.'
  }
];
