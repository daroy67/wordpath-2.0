import { CEFRLevel, MentorMode, WritingTaskType } from '../types/wordpath';

export interface WritingPromptTemplate {
  id: string;
  taskType: WritingTaskType;
  level: CEFRLevel;
  title: string;
  prompt: string;
  targetWords: string;
  checklist: string[];
}

export const WRITING_PROMPTS: WritingPromptTemplate[] = [
  {
    id: 'wr-opinion-daily-study',
    taskType: 'Opinion paragraph',
    level: 'B1',
    title: 'Short Daily Sessions vs. Weekend Cramming',
    prompt:
      'Do you think studying English for 15 minutes every day is better than studying for two hours once a week? Explain your opinion with two clear reasons and one personal example.',
    targetWords: '90–140 words',
    checklist: [
      'State your opinion clearly in the first sentence',
      'Use linking words (First, Moreover, For example)',
      'Check Present Simple and First Conditional accuracy'
    ]
  },
  {
    id: 'wr-email-mentor',
    taskType: 'Email',
    level: 'B1',
    title: 'Polite Email Requesting Project Feedback',
    prompt:
      'Write a polite email to your English teacher or project supervisor asking for feedback on a draft essay before Friday’s deadline. Mention which section you feel unsure about.',
    targetWords: '100–150 words',
    checklist: [
      'Include a clear subject line and polite greeting',
      'Use indirect request forms (Could you please..., I would appreciate...)',
      'Close professionally'
    ]
  },
  {
    id: 'wr-essay-urban-green',
    taskType: 'Short essay',
    level: 'B2',
    title: 'How Cities Can Encourage Walking and Cycling',
    prompt:
      'Many modern cities face traffic congestion and summer heat. Discuss two practical changes—such as shaded sidewalks or protected bike lanes—that could make urban life healthier.',
    targetWords: '150–220 words',
    checklist: [
      'Include a short introduction, two body paragraphs, and a conclusion',
      'Use B2 topic vocabulary (urban, sustainable, emissions, prioritize)',
      'Keep verb tenses and relative clauses consistent'
    ]
  },
  {
    id: 'wr-arg-ai-learning',
    taskType: 'Argumentative writing',
    level: 'B2',
    title: 'Should AI Tutors Guide Learners With Hints Instead of Direct Answers?',
    prompt:
      'Some students want AI tools to immediately rewrite their essays, while teachers argue that guided hints build stronger skills. Present both perspectives and defend your own position.',
    targetWords: '160–240 words',
    checklist: [
      'Acknowledge the counterargument fairly before responding',
      'Use contrast connectors (While, Whereas, Nevertheless)',
      'Avoid vague filler phrases'
    ]
  },
  {
    id: 'wr-desc-neighborhood',
    taskType: 'Description',
    level: 'B1',
    title: 'A Place Where You Focus Best',
    prompt:
      'Describe a quiet café, library corner, or room where you enjoy reading or studying. Focus on sensory details (lighting, sounds, atmosphere) and explain why it helps you concentrate.',
    targetWords: '100–150 words',
    checklist: [
      'Use vivid adjectives and prepositions of place',
      'Check articles (a, an, the) on first vs. second mentions',
      'Keep descriptions coherent'
    ]
  },
  {
    id: 'wr-summary-sleep',
    taskType: 'Summary',
    level: 'B2',
    title: 'Summarize What Makes Spaced Learning Effective',
    prompt:
      'In your own words, summarize why testing yourself across spaced days and getting adequate sleep leads to stronger vocabulary retention than rereading notes all night.',
    targetWords: '110–160 words',
    checklist: [
      'Use your own phrasing rather than copying full sentences',
      'Include key mechanisms (retrieval, consolidation, spacing)',
      'Stay concise and objective'
    ]
  }
];

export interface SpeakingPromptTemplate {
  id: string;
  topic: string;
  level: CEFRLevel;
  title: string;
  prompt: string;
  followUps: string[];
  recommendedSeconds: number;
}

export const SPEAKING_PROMPTS: SpeakingPromptTemplate[] = [
  {
    id: 'sp-travel-foot',
    topic: 'Travel & Culture',
    level: 'B1',
    title: 'Exploring a New Place on Foot',
    prompt:
      'Describe a memorable trip or walk in a town or park. Where did you go, what surprised you, and why do you remember it?',
    followUps: [
      'Would you recommend visiting it during a particular season?',
      'What would you do differently if you went back?'
    ],
    recommendedSeconds: 60
  },
  {
    id: 'sp-tech-habits',
    topic: 'Technology & Focus',
    level: 'B2',
    title: 'Managing Digital Distractions While Studying',
    prompt:
      'How do smartphones help or interrupt your study routine? Explain two practical habits you use—or would like to adopt—to stay focused.',
    followUps: [
      'Do short educational apps help more than long video lectures?',
      'What role should notifications play in learning tools?'
    ],
    recommendedSeconds: 90
  },
  {
    id: 'sp-careers-remote',
    topic: 'Work & Careers',
    level: 'B2',
    title: 'Skills Needed for Future Careers',
    prompt:
      'Which communication or problem-solving skills do you think matter most in modern international workplaces, and how are you developing them now?',
    followUps: [
      'Do you prefer collaborating in person or remotely?',
      'Why is clear written feedback important in teams?'
    ],
    recommendedSeconds: 90
  },
  {
    id: 'sp-env-daily',
    topic: 'Environment',
    level: 'B1',
    title: 'Practical Sustainability in Your Neighborhood',
    prompt:
      'What small environmental improvement—such as more street trees, better recycling bins, or safer bike paths—would help your neighborhood most?',
    followUps: [
      'How could students or local residents support that change?',
      'What obstacle might slow it down?'
    ],
    recommendedSeconds: 60
  }
];

export const CONVERSATION_TOPICS = [
  'Everyday life',
  'Travel',
  'Education',
  'Technology',
  'Science',
  'Business',
  'Environment',
  'Culture',
  'Future careers'
] as const;

export const MENTOR_MODE_SUGGESTIONS: Record<MentorMode, string[]> = {
  conversation: [
    'Let’s role-play checking into a hotel and asking for quiet neighborhood restaurant tips.',
    'Can we discuss how technology is changing how students learn languages?',
    'Ask me three B2 interview questions about teamwork and give feedback on my answers.'
  ],
  grammar: [
    'Can you explain the difference between Present Perfect and Past Simple with a quick practice question?',
    'When do we use "would" vs "will" in conditionals? Test me with 2 examples.',
    'Explain why "can’t" is used instead of "mustn’t" for logical deduction.'
  ],
  vocabulary: [
    'Teach me the word "coherent" with synonyms, collocations, word forms, and a quick quiz question.',
    'What is the difference between "efficient" and "effective"? Give B2 examples.',
    'Give me 4 natural collocations with "evidence" and "retain".'
  ],
  writing: [
    'Please review this sentence for grammar and clarity: "I have finished my homework two hours ago because I wanted relax."',
    'How can I make this paragraph sound more concise and natural at a B2 level?',
    'Check my polite email to a teacher before I send it.'
  ],
  quiz: [
    'Give me 4 B2 vocabulary questions on Technology and Communication.',
    'Test my knowledge of Passive Voice and Reported Speech with 3 short items.',
    'Give me a 3-question conditional challenge—wait for my answers before grading!'
  ]
};

export function buildDemoPreviewExchange(mode: MentorMode, level: CEFRLevel): string {
  switch (mode) {
    case 'conversation':
      return `[Sample Demo Preview — Not Live AI]\n\nHello! Let’s practice at a ${level} level. Imagine we are discussing everyday study habits: what time of day do you feel sharpest for reading or speaking English, and why does that time work well for you?`;
    case 'grammar':
      return `[Sample Demo Preview — Not Live AI]\n\n1. Simple Rule: Past Simple describes finished actions tied to a specific past time ("yesterday", "two hours ago"). Present Perfect connects a past action to the present ("this week", "since 2022").\n2. Example: "I finished the quiz an hour ago." vs. "I have completed three quizzes this week."\n3. Quick check: Which fits better — "She ___ (visit) Madrid last summer"?`;
    case 'vocabulary':
      return `[Sample Demo Preview — Not Live AI]\n\nWord: coherent (${level})\nDefinition: Logical, clear, and well organized.\nCollocations: coherent argument · coherent essay · coherent explanation\nWord forms: coherence (noun), coherently (adverb)\nQuick check: Try writing one sentence about studying using "coherent".`;
    case 'writing':
      return `[Sample Demo Preview — Not Live AI]\n\nWhen live AI is connected via GEMINI_API_KEY, Writing Coach compares your original sentences with clear corrections, explains each change, and suggests stronger ${level} vocabulary without overwriting your voice.`;
    case 'quiz':
      return `[Sample Demo Preview — Not Live AI]\n\nSample ${level} Question:\n"If I ___ more free time this semester, I would join the debate club."\nA) have  B) will have  C) had  D) would have\n\nReply with your choice when live AI is active to receive instant grading and feedback.`;
  }
}
