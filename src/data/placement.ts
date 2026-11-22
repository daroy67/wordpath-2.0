import { PlacementQuestion } from '../types/wordpath';

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // Vocabulary (8 items: 4 B1, 4 B2)
  {
    id: 'pl-1',
    skill: 'vocabulary',
    questionType: 'mcq',
    topicTag: 'Psychology & Learning',
    targetLevel: 'B1',
    prompt: 'Choose the closest meaning to "gradually": Our confidence grew gradually over the term.',
    options: ['slowly and steadily', 'suddenly and unexpectedly', 'loudly and proudly', 'barely at all'],
    correctIndex: 0,
    explanation: '"Gradually" means happening step by step over time rather than all at once.'
  },
  {
    id: 'pl-2',
    skill: 'vocabulary',
    questionType: 'cloze',
    topicTag: 'Education',
    targetLevel: 'B1',
    prompt: 'Which word best completes the sentence? "Can you ______ the main findings of the report in two sentences?"',
    options: ['hesitate', 'summarize', 'adapt', 'persuade'],
    correctIndex: 1,
    explanation: '"Summarize" means stating the main points briefly without unnecessary detail.'
  },
  {
    id: 'pl-3',
    skill: 'vocabulary',
    questionType: 'cloze',
    topicTag: 'Work & Careers',
    targetLevel: 'B1',
    prompt: 'Because the team had a strict ______ on Friday, everyone finished their sections by Thursday.',
    options: ['scenery', 'deadline', 'habit', 'currency'],
    correctIndex: 1,
    explanation: 'A "deadline" is the latest time or date by which work must be completed.'
  },
  {
    id: 'pl-4',
    skill: 'vocabulary',
    questionType: 'mcq',
    topicTag: 'Environment',
    targetLevel: 'B1',
    prompt: 'Solar and wind power are described as ______ energy sources because they are naturally replenished.',
    options: ['renewable', 'ambiguous', 'remote', 'fluent'],
    correctIndex: 0,
    explanation: '"Renewable" refers to resources that can be replaced naturally and do not run out.'
  },
  {
    id: 'pl-5',
    skill: 'vocabulary',
    questionType: 'mcq',
    topicTag: 'Communication',
    targetLevel: 'B2',
    prompt: 'An explanation that is clear, logical, and well structured is described as ______.',
    options: ['ambiguous', 'coherent', 'fragile', 'hesitant'],
    correctIndex: 1,
    explanation: '"Coherent" describes ideas or writing that fit together logically and clearly.'
  },
  {
    id: 'pl-6',
    skill: 'vocabulary',
    questionType: 'mcq',
    topicTag: 'Technology',
    targetLevel: 'B2',
    prompt: 'Which verb means "to make a process simpler and more efficient by removing extra steps"?',
    options: ['streamline', 'emphasize', 'hesitate', 'evaluate'],
    correctIndex: 0,
    explanation: '"Streamline" means simplifying and improving a system or workflow so it runs smoothly.'
  },
  {
    id: 'pl-7',
    skill: 'vocabulary',
    questionType: 'cloze',
    topicTag: 'Science',
    targetLevel: 'B2',
    prompt: 'Deep sleep helps the brain ______ newly learned words so they stay accessible days later.',
    options: ['consolidate', 'delegate', 'negotiate', 'hesitate'],
    correctIndex: 0,
    explanation: '"Consolidate" means making memories or skills firmer and more durable over time.'
  },
  {
    id: 'pl-8',
    skill: 'vocabulary',
    questionType: 'mcq',
    topicTag: 'Business & Society',
    targetLevel: 'B2',
    prompt: 'When a group reaches a general agreement shared by almost everyone, they achieve a ______.',
    options: ['setback', 'consensus', 'bias', 'itinerary'],
    correctIndex: 1,
    explanation: '"Consensus" means broad agreement across a group after discussion.'
  },

  // Grammar (10 items: 5 B1, 5 B2)
  {
    id: 'pl-9',
    skill: 'grammar',
    questionType: 'cloze',
    topicTag: 'Past Perfect',
    targetLevel: 'B1',
    prompt: 'By the time we checked the results, Maya ______ three grammar exercises.',
    options: ['has already finished', 'already finishes', 'had already finished', 'was finish'],
    correctIndex: 2,
    explanation: 'Past Perfect ("had already finished") shows an action completed before another past point ("we checked").'
  },
  {
    id: 'pl-10',
    skill: 'grammar',
    questionType: 'cloze',
    topicTag: 'Conditionals',
    targetLevel: 'B1',
    prompt: 'If you practice for ten minutes tonight, you ______ tomorrow’s quiz much easier.',
    options: ['find', 'will find', 'would find', 'found'],
    correctIndex: 1,
    explanation: 'First Conditional pairs Present Simple ("practice") in the if-clause with "will + base verb" ("will find") for a likely future result.'
  },
  {
    id: 'pl-11',
    skill: 'grammar',
    questionType: 'cloze',
    topicTag: 'Present Perfect vs. Past Simple',
    targetLevel: 'B1',
    prompt: 'Daniel ______ his placement check fifteen minutes ago.',
    options: ['has finished', 'finished', 'finishes', 'is finishing'],
    correctIndex: 1,
    explanation: 'Finished past time expressions like "fifteen minutes ago" require Past Simple ("finished").'
  },
  {
    id: 'pl-12',
    skill: 'grammar',
    questionType: 'cloze',
    topicTag: 'Articles',
    targetLevel: 'B1',
    prompt: 'We spent ______ hour discussing how to organize our study schedule.',
    options: ['a', 'an', 'the', 'no article'],
    correctIndex: 1,
    explanation: '"Hour" begins with a silent "h" and a vowel sound, so it takes "an".'
  },
  {
    id: 'pl-13',
    skill: 'grammar',
    questionType: 'cloze',
    topicTag: 'Passive Voice',
    targetLevel: 'B1',
    prompt: 'All saved flashcards ______ automatically in your browser storage.',
    options: ['store', 'are stored', 'stored', 'have storing'],
    correctIndex: 1,
    explanation: 'Flashcards receive the action routinely, requiring Present Simple passive ("are stored").'
  },
  {
    id: 'pl-14',
    skill: 'grammar',
    questionType: 'cloze',
    topicTag: 'Gerunds & Infinitives',
    targetLevel: 'B2',
    prompt: 'She suggested ______ the vocabulary cards before attempting the reading test.',
    options: ['to review', 'review', 'reviewing', 'reviewed'],
    correctIndex: 2,
    explanation: 'The verb "suggest" is followed by a gerund (-ing form), never a to-infinitive.'
  },
  {
    id: 'pl-15',
    skill: 'grammar',
    questionType: 'cloze',
    topicTag: 'Second Conditional',
    targetLevel: 'B2',
    prompt: 'If I ______ more confident about academic writing, I would enter the essay competition.',
    options: ['am', 'will be', 'were', 'have been'],
    correctIndex: 2,
    explanation: 'Second Conditional expresses an imaginary present situation using Past Simple ("were") in the if-clause.'
  },
  {
    id: 'pl-16',
    skill: 'grammar',
    questionType: 'error_spot',
    topicTag: 'Modal Verbs',
    targetLevel: 'B2',
    prompt: 'Which sentence uses modal verbs accurately?',
    options: [
      'He mustn’t be at school because his bicycle is parked outside our house.',
      'He can’t be at school because his bicycle is parked outside our house.',
      'You mustn’t bring a dictionary; it’s optional.',
      'She must have forgot her notes at home.'
    ],
    correctIndex: 1,
    explanation: 'Logical impossibility uses "can’t" (not "mustn’t"), optionality uses "don’t have to", and past modals use V3 ("forgotten").'
  },
  {
    id: 'pl-17',
    skill: 'grammar',
    questionType: 'error_spot',
    topicTag: 'Reported Speech',
    targetLevel: 'B2',
    prompt: 'Choose the grammatically correct reported question:',
    options: [
      'She asked me where did I find that article.',
      'She asked me where I had found that article.',
      'She said me where I found that article.',
      'She asked where had I found that article.'
    ],
    correctIndex: 1,
    explanation: 'Indirect questions keep subject-before-verb order without "did", and "ask" takes a direct personal object.'
  },
  {
    id: 'pl-18',
    skill: 'grammar',
    questionType: 'cloze',
    topicTag: 'Advanced Structures',
    targetLevel: 'B2',
    prompt: 'Not only ______ the grammar check, but he also wrote a clear summary.',
    options: ['he passed', 'did he pass', 'passed he', 'he did pass'],
    correctIndex: 1,
    explanation: 'Opening a sentence with "Not only" triggers auxiliary-subject inversion ("did he pass").'
  },

  // Reading & Contextual Usage (6 items: 3 B1, 3 B2)
  {
    id: 'pl-19',
    skill: 'reading',
    questionType: 'context',
    topicTag: 'Contextual Reading',
    targetLevel: 'B1',
    prompt: '"Although the town café is tiny, neighbors gather there every Saturday to repair broken lamps and bicycles for free." Why do people visit the café on Saturdays?',
    options: [
      'To buy brand-new bicycles',
      'To fix broken items together instead of throwing them away',
      'To take formal engineering exams',
      'To sell old lamps online'
    ],
    correctIndex: 1,
    explanation: 'The sentence explicitly states neighbors gather to repair broken items for free.'
  },
  {
    id: 'pl-20',
    skill: 'reading',
    questionType: 'context',
    topicTag: 'Cohesion & Discourse',
    targetLevel: 'B1',
    prompt: 'Which linking word best fits? "The bus was delayed by twenty minutes; ______, we still arrived before the lecture began."',
    options: ['therefore', 'however', 'for example', 'similarly'],
    correctIndex: 1,
    explanation: '"However" introduces a contrast between the delay and arriving on time anyway.'
  },
  {
    id: 'pl-21',
    skill: 'reading',
    questionType: 'context',
    topicTag: 'Register & Tone',
    targetLevel: 'B1',
    prompt: 'Which sentence is most appropriate for a polite email to a teacher?',
    options: [
      'Hey, send me the slides ASAP.',
      'Could you please share the slides from Tuesday’s workshop when you have a moment?',
      'You forgot to upload the slides, fix it.',
      'Give me the slides now.'
    ],
    correctIndex: 1,
    explanation: '"Could you please... when you have a moment?" uses polite B1–B2 indirect phrasing.'
  },
  {
    id: 'pl-22',
    skill: 'reading',
    questionType: 'context',
    topicTag: 'Inference',
    targetLevel: 'B2',
    prompt: '"While scrolling through ten-second clips trains rapid scanning, deep reading requires holding an argument in mind across several paragraphs." What contrast does the writer draw?',
    options: [
      'Printed books are always superior to any screen.',
      'Quick scanning differs from sustained comprehension of connected ideas.',
      'Readers should stop using smartphones completely.',
      'Short videos improve long-term essay writing.'
    ],
    correctIndex: 1,
    explanation: 'The sentence contrasts rapid scanning on short feeds with sustained comprehension across paragraphs.'
  },
  {
    id: 'pl-23',
    skill: 'reading',
    questionType: 'context',
    topicTag: 'Academic Precision',
    targetLevel: 'B2',
    prompt: 'Which revision eliminates wordiness without losing meaning? "Due to the fact that there was heavy rain, the match was postponed."',
    options: [
      'Because of heavy rain, the match was postponed.',
      'Owing to the fact of the rain being heavy, the match was postponed.',
      'Heavy rain happened and thusly postponement occurred.',
      'Because there existed heavy rainfall conditions, the match was postponed.'
    ],
    correctIndex: 0,
    explanation: '"Because of heavy rain" replaces the wordy phrase "Due to the fact that there was" concisely.'
  },
  {
    id: 'pl-24',
    skill: 'reading',
    questionType: 'context',
    topicTag: 'Critical Reading',
    targetLevel: 'B2',
    prompt: '"An 8-question quiz can suggest where to begin studying, yet it cannot certify official language proficiency." What is the writer emphasizing?',
    options: [
      'Short quizzes are completely useless.',
      'Informal diagnostics are helpful guides, not formal certification.',
      'Every online quiz is an official CEFR exam.',
      'Learners should avoid placement checks.'
    ],
    correctIndex: 1,
    explanation: 'The sentence balances practical usefulness ("suggest where to begin") against honest limits ("cannot certify official proficiency").'
  }
];
