import { GrammarLesson } from '../types/wordpath';

export const GRAMMAR_LESSONS: GrammarLesson[] = [
  {
    id: 'present-perfect-vs-past-simple',
    title: 'Present Perfect vs. Past Simple',
    level: 'B1',
    estimatedMinutes: 5,
    summary: 'Distinguish between finished past events tied to a specific time and past actions connected to the present.',
    explanation: [
      'Use Past Simple for actions that started and finished at a definite time in the past (yesterday, in 2022, two hours ago). The focus is on when the event happened.',
      'Use Present Perfect (have/has + past participle) when the exact time is not stated, when an experience remains part of your life up to now, or when a past action has a visible result right now.',
      'Signal words help, but meaning comes first: "since" and "for" with an ongoing state require Present Perfect, whereas finished time expressions like "last week" always require Past Simple.'
    ],
    formula: 'Past Simple: Subject + V2 (or did + V1)  |  Present Perfect: Subject + have/has + V3',
    examples: [
      {
        sentence: 'I completed three vocabulary sessions yesterday afternoon.',
        note: 'Past Simple — "yesterday afternoon" anchors the action in finished past time.'
      },
      {
        sentence: 'I have completed twelve vocabulary sessions this week.',
        note: 'Present Perfect — "this week" is an unfinished time period continuing up to now.'
      },
      {
        sentence: 'She has studied English since 2021, and she still practices daily.',
        note: 'Present Perfect — action started in 2021 and continues into the present.'
      }
    ],
    commonMistakes: [
      {
        incorrect: 'I have finished the reading quiz two hours ago.',
        correct: 'I finished the reading quiz two hours ago.',
        why: 'Time markers with "ago" point to a finished moment in the past, so Present Perfect cannot be used.'
      },
      {
        incorrect: 'How long do you live in this city?',
        correct: 'How long have you lived in this city?',
        why: 'Duration from the past up to the present moment uses Present Perfect, not Present Simple.'
      }
    ],
    questions: [
      {
        id: 'pp-q1',
        prompt: 'Daniel ______ his placement check ten minutes ago.',
        options: ['has taken', 'took', 'takes', 'had been taking'],
        correctIndex: 1,
        explanation: 'Use Past Simple ("took") because "ten minutes ago" specifies a finished time in the past.'
      },
      {
        id: 'pp-q2',
        prompt: 'We ______ twenty new B2 words so far this month.',
        options: ['learned', 'were learning', 'have learned', 'learn'],
        correctIndex: 2,
        explanation: '"So far this month" describes an unfinished period reaching up to the present, which takes Present Perfect ("have learned").'
      },
      {
        id: 'pp-q3',
        prompt: 'She ______ in London for three years before moving to Berlin in 2023.',
        options: ['has lived', 'lived', 'lives', 'has been living'],
        correctIndex: 1,
        explanation: 'Because she moved away in 2023, her time in London is completely finished. Finished past periods use Past Simple ("lived").'
      },
      {
        id: 'pp-q4',
        prompt: '______ you ever ______ an article about memory research?',
        options: ['Did / read', 'Have / read', 'Are / reading', 'Do / read'],
        correctIndex: 1,
        explanation: 'Life experience without a specific past date ("ever") requires Present Perfect ("Have you ever read").'
      }
    ]
  },
  {
    id: 'first-and-second-conditional',
    title: 'First and Second Conditionals',
    level: 'B1',
    estimatedMinutes: 5,
    summary: 'Express realistic future possibilities versus hypothetical or unlikely situations in the present and future.',
    explanation: [
      'The First Conditional describes real, likely future results when a realistic condition happens. Even though the meaning is future, the "if" clause uses Present Simple, and the main clause uses "will" (or can/might).',
      'The Second Conditional describes imaginary, unlikely, or counterfactual situations right now or in the future. The "if" clause uses Past Simple (a grammatical distance marker, not past time), and the main clause uses "would" (or could).',
      'In formal and academic English, "were" is often used instead of "was" after if + I/he/she/it ("If I were you...").'
    ],
    formula: '1st: If + Present Simple, ... will + V1  |  2nd: If + Past Simple, ... would + V1',
    examples: [
      {
        sentence: 'If you review five words before bed, you will remember them better tomorrow.',
        note: 'First Conditional — a realistic habit with a likely future result.'
      },
      {
        sentence: 'If I had two free hours every morning, I would read an entire novel in English.',
        note: 'Second Conditional — an imaginary situation because the speaker does not have two free hours.'
      },
      {
        sentence: 'If she were less nervous, she would speak much more fluently in class.',
        note: 'Second Conditional — hypothetical present state using "were".'
      }
    ],
    commonMistakes: [
      {
        incorrect: 'If I will have time tonight, I will practice grammar.',
        correct: 'If I have time tonight, I will practice grammar.',
        why: 'Do not put "will" inside the "if" clause of a First Conditional; use Present Simple ("have").'
      },
      {
        incorrect: 'If I would know the answer, I would tell you.',
        correct: 'If I knew the answer, I would tell you.',
        why: 'The "if" clause of a Second Conditional uses Past Simple ("knew"), while "would" belongs only in the result clause.'
      }
    ],
    questions: [
      {
        id: 'cond-q1',
        prompt: 'If the bus ______ in five minutes, we will arrive on time for the seminar.',
        options: ['arrives', 'will arrive', 'arrived', 'would arrive'],
        correctIndex: 0,
        explanation: 'This is a realistic future situation (First Conditional), so the "if" clause needs Present Simple: "arrives".'
      },
      {
        id: 'cond-q2',
        prompt: 'What would you change if you ______ the designer of this learning app?',
        options: ['are', 'will be', 'were', 'have been'],
        correctIndex: 2,
        explanation: 'Being the designer is a hypothetical scenario, so Second Conditional uses Past Simple ("were").'
      },
      {
        id: 'cond-q3',
        prompt: 'If learners ______ words in context, they usually retain them longer.',
        options: ['met', 'meet', 'would meet', 'had met'],
        correctIndex: 1,
        explanation: 'A general or likely real-world condition uses Present Simple ("meet") in the "if" clause.'
      },
      {
        id: 'cond-q4',
        prompt: 'He ______ much faster progress if he practiced for ten minutes every day instead of cramming.',
        options: ['will make', 'makes', 'would make', 'made'],
        correctIndex: 2,
        explanation: 'Notice "practiced" (Past Simple) in the "if" clause—this signals Second Conditional, requiring "would make" in the main clause.'
      }
    ]
  },
  {
    id: 'articles-a-an-the',
    title: 'Articles: A, An, The & Zero Article',
    level: 'B1',
    estimatedMinutes: 4,
    summary: 'Master when to introduce something new with a/an, refer to a specific noun with the, or leave plural/abstract nouns without an article.',
    explanation: [
      'Use "a" before consonant sounds and "an" before vowel sounds for singular countable nouns when mentioning something for the first time or as one of many ("a useful tool", "an honest answer"). Focus on sound, not spelling.',
      'Use "the" when both speaker and listener know exactly which person, object, or concept is meant—because it was already mentioned, is unique ("the internet"), or is clearly defined by context ("the button at the top").',
      'Use zero article (no article) before plural countable nouns or uncountable nouns when speaking generally ("Feedback helps students improve", "Languages evolve quickly").'
    ],
    formula: 'a/an = singular, non-specific (sound rule)  |  the = specific/known  |  ∅ = general plural/uncountable',
    examples: [
      {
        sentence: 'I read an interesting article today. The article discussed digital reading habits.',
        note: 'First mention takes "an" (vowel sound); second mention takes "the" because it is now known.'
      },
      {
        sentence: 'She chose a university known for its applied linguistics department.',
        note: '"University" starts with a /j/ consonant sound ("yoo-"), so it takes "a", not "an".'
      },
      {
        sentence: 'Consistent practice builds confidence over time.',
        note: 'Uncountable abstract nouns ("practice", "confidence") take no article when speaking generally.'
      }
    ],
    commonMistakes: [
      {
        incorrect: 'My brother wants to buy a honest car review guide.',
        correct: 'My brother wants to buy an honest car review guide.',
        why: 'The "h" in "honest" is silent, so the word begins with a vowel sound (/ɒ/) and requires "an".'
      },
      {
        incorrect: 'The education is essential for young people everywhere.',
        correct: 'Education is essential for young people everywhere.',
        why: 'When speaking about education in general, English omits "the" before abstract uncountable nouns.'
      }
    ],
    questions: [
      {
        id: 'art-q1',
        prompt: 'We spent ______ hour reviewing our project success criteria.',
        options: ['a', 'an', 'the', 'no article'],
        correctIndex: 1,
        explanation: '"Hour" starts with a silent "h" (/ˈaʊər/), which is a vowel sound, so it takes "an".'
      },
      {
        id: 'art-q2',
        prompt: 'Could you close ______ window on your left? The street is quite noisy.',
        options: ['a', 'an', 'the', 'no article'],
        correctIndex: 2,
        explanation: 'Both speakers know which specific window is meant ("on your left"), so use "the".'
      },
      {
        id: 'art-q3',
        prompt: '______ digital flashcards are popular among language learners.',
        options: ['A', 'An', 'The', 'no article'],
        correctIndex: 3,
        explanation: 'We are talking about digital flashcards in general (plural countable noun), so no article is needed.'
      },
      {
        id: 'art-q4',
        prompt: 'He downloaded ______ useful app to track his daily reading.',
        options: ['a', 'an', 'the', 'no article'],
        correctIndex: 0,
        explanation: '"Useful" begins with a consonant /j/ sound ("yoo-"), so singular non-specific reference uses "a".'
      }
    ]
  },
  {
    id: 'gerunds-and-infinitives',
    title: 'Gerunds and Infinitives',
    level: 'B2',
    estimatedMinutes: 6,
    summary: 'Choose accurately between verb + -ing (gerund) and to + verb (infinitive) after main verbs, prepositions, and adjectives.',
    explanation: [
      'A gerund (verb + -ing) acts like a noun. Always use a gerund as a sentence subject ("Reading daily expands vocabulary"), after prepositions ("interested in learning"), and after verbs such as enjoy, avoid, finish, suggest, consider, and recommend.',
      'A full infinitive (to + base verb) commonly expresses purpose ("I opened the app to review") or follows adjectives ("easy to understand") and verbs like decide, plan, hope, promise, afford, and manage.',
      'Some verbs change meaning depending on the pattern: "Remember + -ing" looks back at a past memory, whereas "remember + to + verb" means not forgetting to do a necessary task.'
    ],
    formula: 'Preposition / enjoy / avoid + V-ing  |  decide / plan / adjective + to + V1',
    examples: [
      {
        sentence: 'I suggest practicing five words before you start reading the passage.',
        note: 'The verb "suggest" is followed by a gerund ("practicing"), never "to practice".'
      },
      {
        sentence: 'She decided to focus on conditional sentences this afternoon.',
        note: 'Verbs of decision or future intention ("decide", "plan") take "to + infinitive".'
      },
      {
        sentence: 'Please remember to save your reflection notes before closing the tab.',
        note: '"Remember + to + verb" refers to an action you need to do next.'
      }
    ],
    commonMistakes: [
      {
        incorrect: 'He is very good at to explain complex ideas simply.',
        correct: 'He is very good at explaining complex ideas simply.',
        why: 'After any preposition ("at", "in", "for", "without"), English requires a gerund (-ing), not "to + verb".'
      },
      {
        incorrect: 'I enjoy to listen to English podcasts during my walk.',
        correct: 'I enjoy listening to English podcasts during my walk.',
        why: '"Enjoy" always takes a gerund (-ing) object, never a to-infinitive.'
      }
    ],
    questions: [
      {
        id: 'gi-q1',
        prompt: 'You can improve your pronunciation by ______ aloud for five minutes a day.',
        options: ['to read', 'read', 'reading', 'have read'],
        correctIndex: 2,
        explanation: 'After the preposition "by", you must use the gerund form ("reading").'
      },
      {
        id: 'gi-q2',
        prompt: 'They hope ______ the website prototype before Friday evening.',
        options: ['finishing', 'to finish', 'finish', 'finished'],
        correctIndex: 1,
        explanation: 'The verb "hope" is followed by a full infinitive ("to finish").'
      },
      {
        id: 'gi-q3',
        prompt: 'She avoided ______ unfamiliar idioms during her presentation.',
        options: ['using', 'to use', 'use', 'used'],
        correctIndex: 0,
        explanation: '"Avoid" always requires a gerund (-ing): "avoided using".'
      },
      {
        id: 'gi-q4',
        prompt: 'I still remember ______ my very first book completely in English—it felt rewarding.',
        options: ['to finish', 'finish', 'finishing', 'to be finishing'],
        correctIndex: 2,
        explanation: 'Looking back on a past memory uses "remember + -ing" ("remember finishing").'
      }
    ]
  },
  {
    id: 'passive-voice',
    title: 'Passive Voice Across Tenses',
    level: 'B1',
    estimatedMinutes: 5,
    summary: 'Shift focus from the person doing an action to the object or result of the action across present, past, and modal tenses.',
    explanation: [
      'Use the passive voice when the action or receiver is more important than who performed it, or when the doer is unknown or obvious ("Progress is saved automatically").',
      'Form the passive with the appropriate tense of "be" plus the past participle (V3). Keep the tense of "be" matched to the active sentence.',
      'Only include "by + agent" when naming who performed the action adds necessary information.'
    ],
    formula: 'Subject + be (conjugated) + Past Participle (V3) [+ by agent]',
    examples: [
      {
        sentence: 'Over 100 new trees were planted along the avenue last spring.',
        note: 'Past Simple passive — focuses on the trees rather than the planting crew.'
      },
      {
        sentence: 'Your vocabulary intervals are calculated automatically after each review.',
        note: 'Present Simple passive — describes how a system works regularly.'
      },
      {
        sentence: 'The new museum wing will be opened to students next month.',
        note: 'Future passive using "will be + V3".'
      }
    ],
    commonMistakes: [
      {
        incorrect: 'The article was wrote by a language teacher.',
        correct: 'The article was written by a language teacher.',
        why: 'Passive voice always requires the past participle ("written"), never the Past Simple form ("wrote").'
      },
      {
        incorrect: 'A decision will make tomorrow morning.',
        correct: 'A decision will be made tomorrow morning.',
        why: 'A decision cannot make itself; include "be + past participle" ("will be made").'
      }
    ],
    questions: [
      {
        id: 'pas-q1',
        prompt: 'All quiz results ______ locally in your browser unless you reset them.',
        options: ['store', 'are stored', 'are storing', 'were store'],
        correctIndex: 1,
        explanation: 'Results receive the action regularly, so Present Simple passive ("are stored") is required.'
      },
      {
        id: 'pas-q2',
        prompt: 'The old bridge ______ during the heavy storm two years ago.',
        options: ['damaged', 'was damaging', 'was damaged', 'has damaged'],
        correctIndex: 2,
        explanation: 'Past Simple passive ("was damaged") fits a finished past event affecting the bridge.'
      },
      {
        id: 'pas-q3',
        prompt: 'This essay must ______ before Friday afternoon.',
        options: ['submit', 'be submitted', 'submitted', 'be submitting'],
        correctIndex: 1,
        explanation: 'Modal passive uses "modal + be + V3": "must be submitted".'
      },
      {
        id: 'pas-q4',
        prompt: 'Hundreds of volunteers ______ by the city council last weekend.',
        options: ['were thanked', 'thanked', 'are thanked', 'have thanked'],
        correctIndex: 0,
        explanation: 'Notice "by the city council" and "last weekend": Past Simple passive ("were thanked") is correct.'
      }
    ]
  },
  {
    id: 'reported-speech',
    title: 'Reported Speech & Tense Backshift',
    level: 'B2',
    estimatedMinutes: 6,
    summary: 'Report statements, questions, and requests accurately by shifting tenses, pronouns, and time expressions.',
    explanation: [
      'When reporting what someone said in the past ("She said that..."), verbs normally shift one step back in time: Present Simple → Past Simple, Present Continuous → Past Continuous, Present Perfect / Past Simple → Past Perfect, will → would, can → could.',
      'Use "say" without a personal object ("He said that...") and "tell" with a personal object ("He told me that...").',
      'In reported questions, drop auxiliary "do/does/did" and return the clause to statement word order (Subject + Verb), without a question mark.'
    ],
    formula: 'Reporting verb (said / told me / asked) + (that / if / wh-word) + Subject + backshifted Verb',
    examples: [
      {
        sentence: 'Direct: "I am revising for the exam." → Reported: She said she was revising for the exam.',
        note: 'Present Continuous backshifts to Past Continuous; "I" changes to "she".'
      },
      {
        sentence: 'Direct: "Where did you learn that idiom?" → Reported: He asked me where I had learned that idiom.',
        note: 'Reported question uses statement word order ("I had learned") without "did".'
      },
      {
        sentence: 'She told us that regular ten-minute sessions helped her retain vocabulary.',
        note: '"Tell" requires an object ("us"); "say" does not.'
      }
    ],
    commonMistakes: [
      {
        incorrect: 'He said me that the reading passage was helpful.',
        correct: 'He told me that the reading passage was helpful.',
        why: 'Use "told + person" ("told me") or "said + (that)" without an indirect object.'
      },
      {
        incorrect: 'She asked where did I buy my notebook.',
        correct: 'She asked where I had bought my notebook.',
        why: 'Reported questions use statement word order (Subject + Verb), not inverted question order.'
      }
    ],
    questions: [
      {
        id: 'rep-q1',
        prompt: 'Maya said, "I will send the summary tonight." → Maya said that she ______ the summary that night.',
        options: ['will send', 'would send', 'sends', 'had sent'],
        correctIndex: 1,
        explanation: 'In reported speech after a past reporting verb ("said"), "will" backshifts to "would".'
      },
      {
        id: 'rep-q2',
        prompt: 'The mentor ______ me that my paragraph structure had improved.',
        options: ['said', 'spoke', 'told', 'talked'],
        correctIndex: 2,
        explanation: 'Because the personal object "me" follows directly, use "told" ("told me that...").'
      },
      {
        id: 'rep-q3',
        prompt: 'Tom asked me ______ I preferred studying in the morning or at night.',
        options: ['that', 'whether', 'what', 'did'],
        correctIndex: 1,
        explanation: 'Yes/no reported questions are introduced by "if" or "whether".'
      },
      {
        id: 'rep-q4',
        prompt: 'She asked us where ______ during the summer exchange.',
        options: ['had we stayed', 'did we stay', 'we had stayed', 'were we staying'],
        correctIndex: 2,
        explanation: 'Indirect questions keep subject-before-verb order: "where we had stayed".'
      }
    ]
  },
  {
    id: 'relative-clauses',
    title: 'Defining & Non-Defining Relative Clauses',
    level: 'B1',
    estimatedMinutes: 5,
    summary: 'Connect ideas cleanly using who, which, that, whose, and where—and know when commas are required.',
    explanation: [
      'A defining relative clause gives essential information needed to identify which person or thing you mean. No commas are used, and you can use "that" instead of "who" or "which".',
      'A non-defining relative clause adds extra, optional information about something already clear. Always set it off with commas, and NEVER use "that" inside a non-defining clause.',
      'Use "whose" for possession, "where" for places, and remember you can omit object pronouns ("the book [that] I read") only in defining clauses.'
    ],
    formula: 'Defining (no commas): noun + who/which/that/where  |  Non-defining (commas): noun, who/which/whose..., ',
    examples: [
      {
        sentence: 'The app that tracks spaced intervals helped me pass my exam.',
        note: 'Defining clause — identifies which app; no commas, "that" is allowed.'
      },
      {
        sentence: 'WordPath, which saves data locally in your browser, requires no subscription.',
        note: 'Non-defining clause — "WordPath" is already named; commas required, use "which" (not "that").'
      },
      {
        sentence: 'Students whose notes include example sentences remember collocations faster.',
        note: '"Whose" shows possession ("the students’ notes").'
      }
    ],
    commonMistakes: [
      {
        incorrect: 'Cambridge, that is famous for its university, has many bike paths.',
        correct: 'Cambridge, which is famous for its university, has many bike paths.',
        why: 'After a comma in a non-defining relative clause, "that" cannot be used; use "which" or "who".'
      },
      {
        incorrect: 'The teacher which explained conditionals was very clear.',
        correct: 'The teacher who explained conditionals was very clear.',
        why: 'Use "who" (or "that" in defining clauses) for people, not "which".'
      }
    ],
    questions: [
      {
        id: 'rel-q1',
        prompt: 'My sister lives in Prague, ______ is known for its historic architecture.',
        options: ['that', 'which', 'what', 'where'],
        correctIndex: 1,
        explanation: 'After the comma (non-defining clause acting as subject of "is known"), only "which" is correct.'
      },
      {
        id: 'rel-q2',
        prompt: 'We visited the quiet library ______ our study group meets every Thursday.',
        options: ['which', 'whose', 'where', 'whom'],
        correctIndex: 2,
        explanation: 'Use "where" (= in which) to refer to an action happening inside a place.'
      },
      {
        id: 'rel-q3',
        prompt: 'The colleague ______ presentation won the award spent weeks rehearsing.',
        options: ['who', 'which', 'whose', 'that'],
        correctIndex: 2,
        explanation: '"Whose presentation" shows possession (= the colleague’s presentation).'
      },
      {
        id: 'rel-q4',
        prompt: 'Is this the podcast ______ you recommended yesterday?',
        options: ['what', 'whose', 'that', 'where'],
        correctIndex: 2,
        explanation: 'In a defining clause referring to a thing ("the podcast"), "that" or "which" fits.'
      }
    ]
  },
  {
    id: 'modal-verbs',
    title: 'Modal Verbs: Deduction, Obligation & Advice',
    level: 'B2',
    estimatedMinutes: 6,
    summary: 'Express certainty, possibility, necessity, and past regret accurately using modal verbs and modal perfects.',
    explanation: [
      'For present deduction (guessing based on evidence): use "must" when you are nearly 100% sure something is true, "might/could/may" when it is possible, and "can’t" (NOT "mustn’t") when you are sure it is impossible.',
      'For obligation: "must" often reflects the speaker’s personal rule or strong urgency, while "have to" expresses an external rule. In the negative, "mustn’t" means prohibition, whereas "don’t have to" means no obligation (optional).',
      'For past deduction or regret: use "modal + have + V3" ("She must have forgotten", "You should have checked the deadline").'
    ],
    formula: 'Present: modal + V1  |  Past deduction/regret: must / might / can’t / should + have + V3',
    examples: [
      {
        sentence: 'The lights are off and nobody answers—they must have left already.',
        note: 'Past deduction with strong evidence ("must have + V3").'
      },
      {
        sentence: 'You don’t have to memorize every word today; review five at a time.',
        note: '"Don’t have to" = it is not necessary (different from "mustn’t" = forbidden).'
      },
      {
        sentence: 'That answer can’t be right—the sentence clearly refers to yesterday.',
        note: 'Logical impossibility uses "can’t", never "mustn’t".'
      }
    ],
    commonMistakes: [
      {
        incorrect: 'He mustn’t be at home; his car is gone.',
        correct: 'He can’t be at home; his car is gone.',
        why: '"Mustn’t" means prohibition ("not allowed"). For logical impossibility, English uses "can’t".'
      },
      {
        incorrect: 'You mustn’t pay for the basic version—it is completely free.',
        correct: 'You don’t have to pay for the basic version—it is completely free.',
        why: 'When something is optional or unnecessary, use "don’t have to", not "mustn’t".'
      }
    ],
    questions: [
      {
        id: 'mod-q1',
        prompt: 'Her essay has zero spelling errors—she ______ it very carefully.',
        options: ['must check', 'must have checked', 'can’t have checked', 'should check'],
        correctIndex: 1,
        explanation: 'Strong deduction about a finished past action uses "must have + V3" ("must have checked").'
      },
      {
        id: 'mod-q2',
        prompt: 'You ______ bring a printed copy; a PDF on your tablet is completely fine.',
        options: ['mustn’t', 'can’t', 'don’t have to', 'shouldn’t have'],
        correctIndex: 2,
        explanation: '"Don’t have to" expresses lack of necessity (optional).'
      },
      {
        id: 'mod-q3',
        prompt: 'Look at the date on that ticket—the concert ______ be tonight; it’s next Saturday!',
        options: ['mustn’t', 'can’t', 'don’t have to', 'ought'],
        correctIndex: 1,
        explanation: 'Logical impossibility based on evidence uses "can’t".'
      },
      {
        id: 'mod-q4',
        prompt: 'I left my notebook on the train—I ______ it on the seat when I stood up.',
        options: ['might have left', 'must leave', 'can’t leave', 'should leave'],
        correctIndex: 0,
        explanation: 'Past possibility uses "might/could/may + have + V3" ("might have left").'
      }
    ]
  },
  {
    id: 'past-perfect',
    title: 'Past Perfect: Sequencing Earlier Past Events',
    level: 'B1',
    estimatedMinutes: 4,
    summary: 'Clarify which past action happened earlier when telling stories or explaining cause and effect in the past.',
    explanation: [
      'When two events happened in the past, Past Simple describes the main storyline, while Past Perfect (had + V3) points back to an earlier event that happened BEFORE that past moment.',
      'Common time markers include "by the time", "before", "after", "already", "just", and "because".',
      'If events are told in chronological order with "and then", Past Simple alone is clear; use Past Perfect whenever you jump backward in time or want to emphasize completion prior to another past point.'
    ],
    formula: 'Earlier Past: Subject + had + V3  →  Later Past: Subject + V2',
    examples: [
      {
        sentence: 'By the time the workshop started, Lena had already reviewed the vocabulary list.',
        note: '"Had reviewed" occurred before "started".'
      },
      {
        sentence: 'He felt confident in the interview because he had practiced three sample answers.',
        note: 'Past Perfect explains the earlier preparation behind his past confidence.'
      }
    ],
    commonMistakes: [
      {
        incorrect: 'When I arrived at the station, the train already left.',
        correct: 'When I arrived at the station, the train had already left.',
        why: 'Leaving happened before arriving, so the earlier event requires Past Perfect ("had already left").'
      },
      {
        incorrect: 'She had went home before the rain began.',
        correct: 'She had gone home before the rain began.',
        why: 'Past Perfect uses the past participle ("gone"), not the Past Simple form ("went").'
      }
    ],
    questions: [
      {
        id: 'pperf-q1',
        prompt: 'By the time we opened the document, someone ______ all the typos.',
        options: ['corrects', 'has corrected', 'had corrected', 'was correcting'],
        correctIndex: 2,
        explanation: 'Correction happened earlier than "opened", requiring Past Perfect ("had corrected").'
      },
      {
        id: 'pperf-q2',
        prompt: 'I couldn’t log in at first because I ______ my new password.',
        options: ['had forgotten', 'have forgotten', 'forget', 'was forgetting'],
        correctIndex: 0,
        explanation: 'Forgetting happened before trying to log in ("couldn’t"), so use "had forgotten".'
      },
      {
        id: 'pperf-q3',
        prompt: 'Had you ever ______ an English essay before joining this course?',
        options: ['wrote', 'written', 'writing', 'write'],
        correctIndex: 1,
        explanation: 'Past Perfect questions follow "Had + Subject + V3" ("written").'
      },
      {
        id: 'pperf-q4',
        prompt: 'After the team ______ the prototype, they invited five students to try it.',
        options: ['has built', 'builds', 'had built', 'was build'],
        correctIndex: 2,
        explanation: 'Building finished before inviting students ("invited"), so "had built" clarifies the sequence.'
      }
    ]
  },
  {
    id: 'future-forms',
    title: 'Future Forms: Will, Going to & Present Continuous',
    level: 'B1',
    estimatedMinutes: 5,
    summary: 'Choose between spontaneous decisions, prior plans, predictions with evidence, and fixed personal arrangements.',
    explanation: [
      'Use "will + V1" for instant decisions made at the moment of speaking ("Oh, the phone is ringing—I’ll answer it"), promises, offers, and general opinions/predictions ("I think it will help").',
      'Use "be going to + V1" for intentions decided before speaking ("I’m going to study B2 idioms this week") and predictions backed by visible present evidence ("Look at those dark clouds—it’s going to rain").',
      'Use Present Continuous ("be + V-ing") for fixed personal arrangements with a set time or place ("We are meeting our tutor at 4 p.m. tomorrow").'
    ],
    formula: 'will + V1 (spontaneous / promise)  |  am/is/are going to + V1 (plan / evidence)  |  am/is/are + V-ing (arrangement)',
    examples: [
      {
        sentence: 'Wait—you forgot your umbrella. I’ll lend you mine!',
        note: 'Spontaneous offer at the moment of speaking → "will".'
      },
      {
        sentence: 'Look at the traffic ahead; we’re going to miss the first train.',
        note: 'Prediction based on visible current evidence → "going to".'
      },
      {
        sentence: 'I’m taking my speaking practice session at 6:30 this evening.',
        note: 'Fixed scheduled arrangement → Present Continuous.'
      }
    ],
    commonMistakes: [
      {
        incorrect: 'I have a ticket—I will fly to Madrid tomorrow morning.',
        correct: 'I have a ticket—I’m flying to Madrid tomorrow morning.',
        why: 'When an arrangement is already booked with a time, Present Continuous (or "going to") sounds far more natural than "will".'
      },
      {
        incorrect: 'Don’t carry that heavy box alone—I am going to help you right now.',
        correct: 'Don’t carry that heavy box alone—I’ll help you right now.',
        why: 'Spontaneous offers made on the spot always use "will" ("I’ll help").'
      }
    ],
    questions: [
      {
        id: 'fut-q1',
        prompt: '"Your suitcase looks heavy!" — "Thanks, ______ carry it up the stairs for you?" (Wait: Choose the natural spontaneous offer)',
        options: ['I’ll carry it for you.', 'I carry it for you.', 'I’m carrying it yesterday.', 'I’m going to carried it.'],
        correctIndex: 0,
        explanation: 'An immediate offer made at the moment of speaking uses "will" ("I’ll carry it for you.").'
      },
      {
        id: 'fut-q2',
        prompt: 'Look at the dark clouds and wind—it ______ rain in a few minutes.',
        options: ['will be', 'is going to', 'rains', 'is raining'],
        correctIndex: 1,
        explanation: 'Predictions based on clear present evidence use "be going to".'
      },
      {
        id: 'fut-q3',
        prompt: 'Everything is confirmed: we ______ the design team on Thursday at 10 a.m.',
        options: ['are meeting', 'will be meet', 'met', 'are meet'],
        correctIndex: 0,
        explanation: 'Confirmed calendar arrangements with other people use Present Continuous ("are meeting").'
      },
      {
        id: 'fut-q4',
        prompt: 'I’ve already decided: next term I ______ fifteen minutes of reading every morning.',
        options: ['am going to do', 'did', 'will doing', 'am do'],
        correctIndex: 0,
        explanation: 'A prior personal intention uses "be going to" ("am going to do").'
      }
    ]
  },
  {
    id: 'comparatives-and-superlatives',
    title: 'Comparatives, Superlatives & Nuanced Modifiers',
    level: 'B1',
    estimatedMinutes: 4,
    summary: 'Compare ideas smoothly with accurate adjective/adverb forms, "as ... as", and B2 degree modifiers.',
    explanation: [
      'Short one-syllable adjectives (and two-syllable adjectives ending in -y) add -er / -est ("clearer", "easier", "the clearest"). Longer adjectives of two or more syllables use "more / most" ("more sustainable", "the most coherent").',
      'Use "(not) as + adjective/adverb + as" to express equality or difference without -er ("Passive rereading is not as effective as self-testing").',
      'At B2, upgrade basic comparisons with modifiers: "much / far / significantly" for big differences, and "slightly / a bit" for small differences.'
    ],
    formula: 'Comparative: adj-er / more + adj + than  |  Equality: (not) as + adj + as  |  Modifier: far / slightly + comparative',
    examples: [
      {
        sentence: 'Spaced review is significantly more reliable than last-minute cramming.',
        note: 'Long adjective uses "more"; "significantly" strengthens the comparison.'
      },
      {
        sentence: 'Ten minutes a day is much easier to sustain than two hours on Sunday.',
        note: 'Two-syllable "-y" adjective changes to "-ier" ("easier").'
      }
    ],
    commonMistakes: [
      {
        incorrect: 'This explanation is more clearer than the first draft.',
        correct: 'This explanation is much clearer than the first draft.',
        why: 'Never combine "more" with an "-er" ending; use "much/far clearer".'
      },
      {
        incorrect: 'Speaking in pairs is more effective as memorizing lists alone.',
        correct: 'Speaking in pairs is more effective than memorizing lists alone.',
        why: 'Comparatives with "more / -er" always pair with "than", while "as ... as" pairs with "as".'
      }
    ],
    questions: [
      {
        id: 'comp-q1',
        prompt: 'Testing yourself is ______ effective than simply highlighting a textbook.',
        options: ['more', 'much more', 'most', 'as'],
        correctIndex: 1,
        explanation: 'Both "more" and "much more" pair with "than", and "much more" accurately emphasizes the difference.'
      },
      {
        id: 'comp-q2',
        prompt: 'The revised guide isn’t ______ confusing as the previous version.',
        options: ['so much', 'more', 'as', 'than'],
        correctIndex: 2,
        explanation: 'Negative equality follows the pattern "not as + adjective + as".'
      },
      {
        id: 'comp-q3',
        prompt: 'Of all the habits we tested, daily reading produced ______ vocabulary growth.',
        options: ['the steadier', 'more steady', 'the steadiest', 'most steady'],
        correctIndex: 2,
        explanation: 'Comparing one option against a whole group ("of all") uses the superlative "the steadiest".'
      },
      {
        id: 'comp-q4',
        prompt: 'Her second essay was ______ concise than her first.',
        options: ['far more', 'more much', 'very more', 'most'],
        correctIndex: 0,
        explanation: 'Use "far / much / slightly" before "more concise", never "very more".'
      }
    ]
  },
  {
    id: 'advanced-sentence-structures',
    title: 'Advanced Sentence Structures (Clefts, Inversion & Participles)',
    level: 'B2',
    estimatedMinutes: 6,
    summary: 'Add emphasis, elegance, and cohesion to B2 essays and discussions using cleft sentences, negative inversion, and participle clauses.',
    explanation: [
      'Cleft sentences ("It is X that..." or "What I appreciate most is...") spotlight one key piece of information in an argument.',
      'Negative inversion puts a negative or restrictive adverbial at the start of a sentence for formal emphasis, inverting the auxiliary verb and subject ("Not only does reading expand vocabulary, it also models natural grammar").',
      'Participle clauses ("Having finished the quiz, she checked her mistakes") smoothly combine two actions with the same subject into one concise sentence.'
    ],
    formula: 'Cleft: What + clause + is ...  |  Inversion: Not only / Seldom + aux + Subject + V1  |  Participle: V-ing / Having + V3, Subject...',
    examples: [
      {
        sentence: 'Not only did the workshop clarify articles, but it also improved my writing confidence.',
        note: 'Negative inversion after "Not only" requires auxiliary "did" before subject "the workshop".'
      },
      {
        sentence: 'What makes spaced repetition practical is that sessions take only ten minutes.',
        note: '"What-cleft" focuses attention on the main reason.'
      },
      {
        sentence: 'Having read the article twice, he answered all five questions accurately.',
        note: 'Past participle clause ("Having + V3") shows an earlier completed action by the same subject.'
      }
    ],
    commonMistakes: [
      {
        incorrect: 'Not only she speaks English well, she also writes clear essays.',
        correct: 'Not only does she speak English well, but she also writes clear essays.',
        why: 'When "Not only" opens the sentence, subject-auxiliary inversion ("does she speak") is mandatory.'
      },
      {
        incorrect: 'Walking through the park, the library appeared on the left.',
        correct: 'Walking through the park, I saw the library appear on the left.',
        why: 'The subject after the comma must match who is performing the "-ing" participle ("I", not "the library").'
      }
    ],
    questions: [
      {
        id: 'adv-q1',
        prompt: 'Not only ______ the deadline, but the team also delivered extra test coverage.',
        options: ['they met', 'did they meet', 'met they', 'they did meet'],
        correctIndex: 1,
        explanation: 'Starting a sentence with "Not only" triggers inversion: "did they meet".'
      },
      {
        id: 'adv-q2',
        prompt: '______ learners need most at the B2 level is regular feedback on real writing.',
        options: ['Which', 'That', 'What', 'How'],
        correctIndex: 2,
        explanation: 'A wh-cleft sentence highlighting "the thing that" begins with "What".'
      },
      {
        id: 'adv-q3',
        prompt: '______ all the flashcards in the deck, Maya switched to the reading passage.',
        options: ['Have reviewed', 'Having reviewed', 'Reviewed to', 'Was reviewing'],
        correctIndex: 1,
        explanation: '"Having reviewed" expresses an action Maya completed just before switching.'
      },
      {
        id: 'adv-q4',
        prompt: 'Seldom ______ such a clear explanation of modal verbs.',
        options: ['I have read', 'have I read', 'I read', 'did I have read'],
        correctIndex: 1,
        explanation: 'Restrictive adverbs at the front ("Seldom", "Rarely", "Never") require inversion: "have I read".'
      }
    ]
  }
];
