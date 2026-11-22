import { ReadingPassage } from '../types/wordpath';

export function computeWordCount(paragraphs: string[]): number {
  return paragraphs.join(' ').trim().split(/\s+/).filter(Boolean).length;
}

const PASSAGE_1_PARAGRAPHS = [
  'Open any smartphone on a morning commute, and you will notice a familiar pattern: fingers scrolling past dozens of short headlines, ten-second clips, and quick messages within a single minute. Digital platforms are built to capture attention rapidly, rewarding speed over depth. While this fast flow of information makes news and entertainment remarkably accessible, cognitive researchers and language teachers have begun asking a practical question: how do these habits affect the way we learn a second language?',
  'When students read only brief fragments online, they often become skilled at scanning for key words, yet struggle to follow a longer, coherent argument. Learning a language at the B1 to B2 level requires more than recognizing isolated words on a screen. To truly retain new vocabulary and understand how grammar shapes meaning, learners need sustained exposure to connected ideas—seeing how a word behaves inside a full paragraph, not just on a dictionary line.',
  'Fortunately, technology itself does not have to work against deep concentration. The same design features that pull our focus apart can be redesigned to support deliberate, calm study. For example, interactive reading tools that divide an article into manageable sections, offer unobtrusive word explanations in context, and end with short retrieval questions encourage active thinking instead of passive scrolling.',
  'In fact, pairing brief, consistent daily sessions with authentic reading creates a sustainable routine. Ten focused minutes spent reading one thoughtful text, checking unfamiliar phrases from surrounding clues, and testing comprehension builds far stronger language skills than an hour of distracted multitasking. Ultimately, improving your English in the digital age is less about abandoning screens and more about choosing environments designed for curiosity, clarity, and reflection.'
];

const PASSAGE_2_PARAGRAPHS = [
  'During summer heat waves, city sidewalks made of dark asphalt absorb sunlight all afternoon and release stored warmth long after sunset. Urban planners refer to this effect as the urban heat island, and it can make dense neighborhoods several degrees warmer than nearby parks or rural areas. Rather than relying solely on indoor air conditioning, many municipalities are now redesigning streets around shade, permeable pavement, and street trees.',
  'A single mature tree does more than cast a cool shadow across a bus stop. Through a natural process called transpiration, leaves release moisture into the air, gently lowering surrounding temperatures while filtering fine dust particles from passing traffic. When planners plant diverse native species instead of relying on a single tree type, streets also become more resilient against seasonal droughts and plant diseases.',
  'Public feedback plays an equally important role in shaping walkable neighborhoods. Residents often point out which crossings lack benches, where bicycle lanes feel exposed, and which routes students use on foot each morning. By combining local observations with temperature maps, city designers can prioritize shade trees along the busiest walking corridors first.',
  'Although planting trees requires patience—new saplings need regular watering during their first three summers—the long-term benefits are unmistakable. Cooler, greener streets encourage people to walk instead of driving short distances, cut energy demand inside nearby buildings, and transform ordinary errands into calmer daily experiences.'
];

const PASSAGE_3_PARAGRAPHS = [
  'When a desk lamp flickers out or a kitchen toaster stops heating, most households face an uninspiring choice: pay almost the price of a new appliance for a professional repair, or throw the broken item away. Over the past decade, however, volunteer-led Repair Cafés have offered a practical third option in towns and university neighborhoods around the world.',
  'Inside a typical Repair Café on a Saturday morning, tables are arranged with screwdrivers, multimeters, sewing needles, and hot tea. Retired electricians, hobbyist mechanics, and curious students sit side by side with neighbors who have brought torn jackets, wobbly chairs, or silent radios. Nothing is fixed behind a closed counter; instead, visitors watch and help while learning how everyday objects work.',
  'This shared model delivers benefits that reach far beyond saving money. Keeping small electronics and furniture in service reduces household waste and prevents useful metals and plastics from entering landfills prematurely. Equally valuable is the quiet sense of community created when generations exchange practical skills without commercial pressure.',
  'Of course, volunteer workshops cannot solve every manufacturing issue—some modern devices are glued shut so tightly that opening them without damage is nearly impossible. Even so, Repair Cafés remind consumers that durability and repairability are worth demanding, and that a single afternoon of patience can give an ordinary object several more years of reliable life.'
];

const PASSAGE_4_PARAGRAPHS = [
  'Imagine learning fifteen new English collocations at five o’clock in the afternoon, then testing yourself twice: once before dinner and again the next morning. Many learners assume memory fades steadily with every passing hour, yet sleep researchers have repeatedly observed something surprising. After a night of normal rest, recall of newly studied vocabulary often feels clearer and faster than it did late the same evening.',
  'During deep sleep and dream-rich REM stages, the brain does not simply switch off. Instead, neural networks replay recent experiences, transferring fragile short-term traces from temporary storage into more stable long-term circuits—a process scientists call memory consolidation. At the same time, sleep clears unnecessary noise, helping related words and grammar patterns connect more cleanly.',
  'This biology helps explain why cramming all night before an exam is such an unreliable strategy. When students sacrifice sleep to reread notes for four straight hours, they lose both concentration the next day and the overnight consolidation cycle that cements new expressions. By contrast, a calm ten-minute evening review followed by seven to eight hours of rest works with the brain’s natural rhythm.',
  'No study app can replace good sleep, of course, nor does rest invent memories that were never practiced attentively while awake. Yet pairing active retrieval during the day with consistent sleep turns ordinary effort into lasting proficiency.'
];

const PASSAGE_5_PARAGRAPHS = [
  'Working on a software or design team across four time zones looks effortless in glossy brochures, yet real remote collaboration requires deliberate communication habits. When half a team starts its morning while colleagues elsewhere are closing their laptops for the evening, quick hallway conversations no longer exist. Every unclear message can cause a twenty-four-hour delay.',
  'Experienced distributed teams solve this friction by writing thoughtfully rather than chatting constantly. Instead of sending five vague fragments like "Did you check that file?", a colleague writes one concise update explaining what changed, which decision is needed, and by when. Good asynchronous writing respects other people’s focus time while leaving a clear record that anyone can read later.',
  'At the same time, purely text-based work can feel cold if teammates never hear one another’s voices. Weekly short video check-ins—kept strictly to thirty minutes with a shared agenda—help preserve trust, clarify subtle tone, and let newer members ask questions freely without worrying about interrupting.',
  'Ultimately, successful remote careers depend as much on clarity, empathy, and self-management as on technical talent. Learning how to write structured updates in English is therefore not just a language exercise; it is a practical professional skill in modern international workplaces.'
];

const PASSAGE_6_PARAGRAPHS = [
  'Travel guides often encourage visitors to race between famous landmarks, checking off six museums and three viewpoints before sunset. Yet many travelers return home remembering very little beyond crowded buses and hurried photographs. A growing alternative—sometimes called micro-habit travel—suggests slowing down and exploring one small neighborhood on foot.',
  'Start by leaving half a day completely unscheduled in your itinerary. Walk away from the main souvenir street until local bakeries, hardware stores, and neighborhood parks appear. Notice everyday signs, listen to how greetings sound in small shops, and practice simple, polite questions in English or the local language without rushing.',
  'Keeping a pocket notebook—or typing three short observations on your phone each evening—deepens what you notice. Recording the smell of fresh bread after rain, an unexpected conversation with a bookstore owner, or a street mural turns fleeting impressions into vivid memories that stay with you for years.',
  'Slowing down does not mean skipping major sights altogether; rather, it balances landmark visits with unhurried curiosity. When you give yourself permission to see fewer places more attentively, even a two-day weekend trip feels remarkably rich and restorative.'
];

const PASSAGE_7_PARAGRAPHS = [
  'Many intermediate English learners believe that academic or professional writing sounds more impressive when sentences are packed with long nouns and formal filler phrases. In reality, experienced editors look for the opposite quality: precision. A sentence filled with phrases like "due to the fact that" or "at this point in time" forces the reader to work harder for a simple idea.',
  'Clear writing starts with strong verbs and specific subjects. Compare "The team conducted an evaluation of the software interface" with "The team evaluated the software interface." Both sentences express the same fact, yet the second version uses four fewer words and immediately puts the action in focus.',
  'Cutting unnecessary clutter does not mean making every sentence tiny or childish. At the B2 level, strong writers still combine ideas with relative clauses, contrast linkers, and thoughtful examples. The difference is that every clause earns its place by adding meaning, nuance, or evidence—never decoration.',
  'One practical revision habit is reading your draft aloud before submitting it. Whenever you run out of breath mid-sentence or stumble over heavy phrasing, you have found a spot to tighten. Clarity respects your reader’s time and lets your genuine ideas stand out.'
];

const PASSAGE_8_PARAGRAPHS = [
  'Professional biologists cannot stand in every forest, city park, and riverbank at once to count migrating birds or blooming wildflowers. To fill that gap, universities and conservation groups increasingly partner with citizen scientists—everyday volunteers who record local nature observations using simple checklists or smartphone photos.',
  'When thousands of observers note the first spring swallow in their town or photograph unfamiliar beetles on backyard leaves, researchers gain a detailed seasonal map spanning entire continents. Patterns that would remain invisible to a small lab team—such as flowers blooming ten days earlier than thirty years ago—emerge clearly from aggregated community records.',
  'Data quality still matters, of course. Reliable citizen science platforms train volunteers with clear photo guides and ask experienced reviewers to verify unusual sightings before adding them to public datasets. In this way, curiosity and scientific rigor work together rather than competing.',
  'Participating in a local nature survey also changes how people view ordinary walks. A familiar park path stops feeling routine when you begin recognizing bird calls, leaf shapes, and seasonal rhythms—proving that meaningful science begins with careful attention.'
];

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: 'attention-and-language-habits',
    title: 'Attention in the Age of Short Feeds: How Digital Habits Shape Language Learning',
    subtitle: 'An original B1–B2 article exploring why calm, structured reading tools outperform passive scrolling.',
    level: 'B2',
    topic: 'Technology & Learning Science',
    estimatedMinutes: 4,
    wordCount: computeWordCount(PASSAGE_1_PARAGRAPHS),
    paragraphs: PASSAGE_1_PARAGRAPHS,
    glossary: [
      { term: 'accessible', definition: 'Easy to reach, obtain, or use.', russian: 'доступный' },
      { term: 'coherent', definition: 'Clear, logical, and smoothly connected.', russian: 'связный, логичный' },
      { term: 'retain', definition: 'Keep information in memory over time.', russian: 'удерживать в памяти' },
      { term: 'unobtrusive', definition: 'Not attracting unnecessary attention or interrupting your focus.', russian: 'ненавязчивый' },
      { term: 'sustainable', definition: 'Able to be maintained steadily without burning out.', russian: 'устойчивый, долгосрочный' }
    ],
    questions: [
      {
        id: 'read-q1',
        type: 'mcq',
        prompt: 'According to the first paragraph, what is the main goal of most fast-moving digital feeds?',
        options: [
          'To help commuters memorize grammar rules',
          'To capture user attention quickly by rewarding speed',
          'To replace printed newspapers in schools',
          'To encourage slow, careful reading of long essays'
        ],
        correctIndex: 1,
        explanation: 'Paragraph 1 states that digital platforms are built to capture attention rapidly, rewarding speed over depth.'
      },
      {
        id: 'read-q2',
        type: 'mcq',
        prompt: 'What difficulty do learners often face if they only read brief online fragments?',
        options: [
          'They forget how to use dictionaries',
          'They cannot scan pages for key words',
          'They struggle to follow longer, logically connected arguments',
          'They lose interest in using smartphones'
        ],
        correctIndex: 2,
        explanation: 'Paragraph 2 explains that while scanning improves, learners often struggle to follow a longer, coherent argument.'
      },
      {
        id: 'read-q3',
        type: 'mcq',
        prompt: 'Why is seeing a word inside a full paragraph helpful at the B1–B2 level?',
        options: [
          'It shows how the word behaves in real context alongside grammar',
          'It guarantees you will never need to review the word again',
          'It removes the need to practice reading comprehension',
          'It allows learners to memorize whole articles word for word'
        ],
        correctIndex: 0,
        explanation: 'Paragraph 2 highlights that learners need to see how a word behaves inside a full paragraph, not just on a dictionary line.'
      },
      {
        id: 'read-q4',
        type: 'tf',
        prompt: 'True or False: The author argues that learners must completely abandon digital screens to improve their English.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. Paragraph 4 states it is less about abandoning screens and more about choosing well-designed environments.'
      },
      {
        id: 'read-q5',
        type: 'mcq',
        prompt: 'What is the main conclusion of the final paragraph?',
        options: [
          'Learners should stop checking surrounding clues',
          'One hour of multitasking equals ten minutes of reading',
          'Consistent, focused ten-minute reading sessions build stronger skills than distracted multitasking',
          'Interactive apps should remove comprehension questions'
        ],
        correctIndex: 2,
        explanation: 'Paragraph 4 concludes that consistent 10-minute focused reading sessions build stronger skills than distracted multitasking.'
      }
    ]
  },
  {
    id: 'urban-shade-and-trees',
    title: 'Designing Cooler Cities: Why Streets Need Shade and Living Trees',
    subtitle: 'How urban planners and local residents work together to calm summer street heat.',
    level: 'B1',
    topic: 'Environment',
    estimatedMinutes: 3,
    wordCount: computeWordCount(PASSAGE_2_PARAGRAPHS),
    paragraphs: PASSAGE_2_PARAGRAPHS,
    glossary: [
      { term: 'urban', definition: 'Relating to towns and cities.', russian: 'городской' },
      { term: 'transpiration', definition: 'The release of water vapor from plant leaves into the air.', russian: 'транспирация (испарение влаги листьями)' },
      { term: 'resilient', definition: 'Able to recover quickly from difficult conditions or stress.', russian: 'устойчивый, выносливый' },
      { term: 'prioritize', definition: 'Treat something as more important and deal with it first.', russian: 'расставлять приоритеты' }
    ],
    questions: [
      {
        id: 'read2-q1',
        type: 'mcq',
        prompt: 'Why do dense city neighborhoods stay warmer at night than nearby parks?',
        options: [
          'Street trees release heat after sunset',
          'Dark asphalt absorbs sunlight and releases stored warmth later',
          'Parks use outdoor air conditioning units',
          'Bus stops block evening winds'
        ],
        correctIndex: 1,
        explanation: 'Paragraph 1 explains that dark asphalt absorbs sunlight during the afternoon and releases warmth after sunset.'
      },
      {
        id: 'read2-q2',
        type: 'tf',
        prompt: 'True or False: Planting only one single species of tree along every street makes the urban forest safer from disease.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. Paragraph 2 notes that diverse native species make streets more resilient against droughts and diseases.'
      },
      {
        id: 'read2-q3',
        type: 'mcq',
        prompt: 'How do local residents help city designers improve walking routes?',
        options: [
          'By installing permeable pavement themselves',
          'By sharing feedback about missing benches, exposed lanes, and busy school routes',
          'By turning off indoor air conditioners',
          'By measuring leaf transpiration in labs'
        ],
        correctIndex: 1,
        explanation: 'Paragraph 3 describes residents pointing out lacking benches, exposed bike lanes, and busy morning walking routes.'
      },
      {
        id: 'read2-q4',
        type: 'mcq',
        prompt: 'What care do young saplings need during their first three summers?',
        options: ['Extra shade cloth', 'Regular watering', 'Monthly pruning by residents', 'Indoor storage'],
        correctIndex: 1,
        explanation: 'Paragraph 4 mentions that new saplings need regular watering during their first three summers.'
      },
      {
        id: 'read2-q5',
        type: 'tf',
        prompt: 'True or False: Greener, shaded streets can lower energy demand inside nearby buildings.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True. The final sentence states that cooler, greener streets cut energy demand inside nearby buildings.'
      }
    ]
  },
  {
    id: 'repair-cafes-economics',
    title: 'The Quiet Economics of Repair Cafés',
    subtitle: 'Inside volunteer workshops where broken lamps, radios, and community skills come back to life.',
    level: 'B1',
    topic: 'Society',
    estimatedMinutes: 3,
    wordCount: computeWordCount(PASSAGE_3_PARAGRAPHS),
    paragraphs: PASSAGE_3_PARAGRAPHS,
    glossary: [
      { term: 'volunteer', definition: 'A person who offers helpful work willingly without payment.', russian: 'волонтёр, доброволец' },
      { term: 'community', definition: 'People living in the same area or sharing common interests.', russian: 'сообщество' },
      { term: 'prematurely', definition: 'Happening too early, before the expected or useful time.', russian: 'преждевременно' },
      { term: 'reliable', definition: 'Able to be trusted to work consistently well.', russian: 'надёжный' }
    ],
    questions: [
      {
        id: 'read3-q1',
        type: 'mcq',
        prompt: 'Why do many households throw away small broken appliances instead of repairing them?',
        options: [
          'Repairing them often costs nearly as much as buying a new one',
          'Stores forbid customers from fixing lamps',
          'Toasters cannot work after one year',
          'Volunteers charge high hourly fees'
        ],
        correctIndex: 0,
        explanation: 'Paragraph 1 notes that professional repairs can cost almost the price of a new appliance.'
      },
      {
        id: 'read3-q2',
        type: 'tf',
        prompt: 'True or False: At a Repair Café, visitors hand over their broken items behind a closed counter and wait outside.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. Paragraph 2 explicitly says nothing is fixed behind a closed counter; visitors watch, help, and learn.'
      },
      {
        id: 'read3-q3',
        type: 'mcq',
        prompt: 'Which two broader benefits of Repair Cafés are highlighted in Paragraph 3?',
        options: [
          'Faster shipping and lower taxes',
          'Reducing landfill waste and strengthening community connections',
          'Replacing local schools and selling spare parts',
          'Testing new battery chemistry and creating jobs'
        ],
        correctIndex: 1,
        explanation: 'Paragraph 3 highlights keeping waste out of landfills and building community through skill sharing.'
      },
      {
        id: 'read3-q4',
        type: 'mcq',
        prompt: 'What limitation makes some modern devices difficult for volunteers to repair?',
        options: [
          'They require rare foreign batteries',
          'They are glued shut so tightly that opening them causes damage',
          'Volunteers lack screwdrivers',
          'Visitors refuse to sit together'
        ],
        correctIndex: 1,
        explanation: 'Paragraph 4 points out that some modern devices are glued shut tightly.'
      },
      {
        id: 'read3-q5',
        type: 'tf',
        prompt: 'True or False: Repair Cafés encourage consumers to value durability and repairability.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True. Paragraph 4 concludes that Repair Cafés remind consumers that durability and repairability are worth demanding.'
      }
    ]
  },
  {
    id: 'sleep-and-memory-consolidation',
    title: 'How Sleep Consolidates New Vocabulary Overnight',
    subtitle: 'Why a ten-minute evening review plus rest outperforms late-night cramming.',
    level: 'B2',
    topic: 'Psychology & Science',
    estimatedMinutes: 3,
    wordCount: computeWordCount(PASSAGE_4_PARAGRAPHS),
    paragraphs: PASSAGE_4_PARAGRAPHS,
    glossary: [
      { term: 'consolidate', definition: 'Make memories or skills stronger and more stable.', russian: 'закреплять (в памяти)' },
      { term: 'fragile', definition: 'Easily broken, forgotten, or disturbed.', russian: 'хрупкий, нестойкий' },
      { term: 'consistent', definition: 'Happening steadily and regularly over time.', russian: 'последовательный, регулярный' },
      { term: 'proficiency', definition: 'High level of competence or skill in a language.', russian: 'уровень владения навыком' }
    ],
    questions: [
      {
        id: 'read4-q1',
        type: 'mcq',
        prompt: 'What surprising pattern have sleep researchers noticed about newly studied vocabulary?',
        options: [
          'Recall can feel clearer the morning after rest than late the same evening',
          'Sleep erases all words learned after five o’clock',
          'Learners only remember words studied at dawn',
          'Evening practice is useless without coffee'
        ],
        correctIndex: 0,
        explanation: 'Paragraph 1 states that after normal rest, recall often feels clearer and faster than late the same evening.'
      },
      {
        id: 'read4-q2',
        type: 'mcq',
        prompt: 'What happens during memory consolidation in sleep?',
        options: [
          'The brain completely shuts down neural activity',
          'Neural networks replay experiences and move traces into more stable long-term circuits',
          'New English words are invented automatically',
          'Short-term memories replace long-term skills'
        ],
        correctIndex: 1,
        explanation: 'Paragraph 2 explains that neural networks replay recent experiences and move fragile traces into long-term circuits.'
      },
      {
        id: 'read4-q3',
        type: 'tf',
        prompt: 'True or False: Staying awake all night to reread notes improves memory consolidation.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. Paragraph 3 explains that sacrificing sleep removes the consolidation cycle and harms next-day focus.'
      },
      {
        id: 'read4-q4',
        type: 'tf',
        prompt: 'True or False: Sleep alone can create memories of words you never practiced attentively while awake.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. Paragraph 4 clearly notes rest does not invent memories that were never practiced attentively.'
      },
      {
        id: 'read4-q5',
        type: 'mcq',
        prompt: 'Which daily routine does the article recommend?',
        options: [
          'Four hours of passive rereading before midnight',
          'Active retrieval practice paired with consistent sleep',
          'Avoiding tests until the end of the semester',
          'Studying only on weekends'
        ],
        correctIndex: 1,
        explanation: 'Paragraph 4 recommends pairing active retrieval during the day with consistent sleep.'
      }
    ]
  },
  {
    id: 'remote-collaboration-timezones',
    title: 'Remote Collaboration Across Four Time Zones',
    subtitle: 'Why clear asynchronous writing is a core career skill in distributed teams.',
    level: 'B2',
    topic: 'Work & Careers',
    estimatedMinutes: 3,
    wordCount: computeWordCount(PASSAGE_5_PARAGRAPHS),
    paragraphs: PASSAGE_5_PARAGRAPHS,
    glossary: [
      { term: 'collaborate', definition: 'Work jointly with others toward a shared goal.', russian: 'сотрудничать' },
      { term: 'concise', definition: 'Expressing clear information in a few well-chosen words.', russian: 'лаконичный, краткий' },
      { term: 'asynchronous', definition: 'Not happening at the same time; allowing people to reply later.', russian: 'асинхронный' },
      { term: 'clarify', definition: 'Make a message or tone easier to understand.', russian: 'прояснять, уточнять' }
    ],
    questions: [
      {
        id: 'read5-q1',
        type: 'mcq',
        prompt: 'Why can a single unclear message cause a twenty-four-hour delay on a distributed team?',
        options: [
          'Colleagues in other time zones may be offline until the next day',
          'Remote software deletes messages after one hour',
          'Teams are forbidden from writing emails',
          'Video calls take a full day to connect'
        ],
        correctIndex: 0,
        explanation: 'Paragraph 1 notes that when teammates work across time zones, quick hallway checks disappear and unclear messages stall work until the next workday.'
      },
      {
        id: 'read5-q2',
        type: 'mcq',
        prompt: 'What should a concise asynchronous update include according to Paragraph 2?',
        options: [
          'Five short chat fragments sent one by one',
          'What changed, which decision is needed, and by when',
          'Only a greeting and a file link',
          'A complete transcript of last week’s meeting'
        ],
        correctIndex: 1,
        explanation: 'Paragraph 2 specifies explaining what changed, which decision is needed, and the deadline.'
      },
      {
        id: 'read5-q3',
        type: 'tf',
        prompt: 'True or False: Experienced distributed teams eliminate all video calls completely.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. Paragraph 3 explains that short weekly video check-ins help preserve trust and clarify tone.'
      },
      {
        id: 'read5-q4',
        type: 'mcq',
        prompt: 'How do weekly 30-minute video check-ins help newer team members?',
        options: [
          'They replace all written documentation',
          'They build trust and allow questions without fear of interrupting',
          'They test typing speed in English',
          'They eliminate time zones'
        ],
        correctIndex: 1,
        explanation: 'Paragraph 3 highlights preserving trust, clarifying tone, and letting newer members ask questions freely.'
      },
      {
        id: 'read5-q5',
        type: 'tf',
        prompt: 'True or False: Writing structured updates in English is both a language skill and a professional workplace skill.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True. Paragraph 4 states this directly.'
      }
    ]
  },
  {
    id: 'micro-habit-travel',
    title: 'Micro-Habit Travel: Exploring Local Neighborhoods on Foot',
    subtitle: 'Why unscheduled walking and a three-line travel notebook create richer memories.',
    level: 'B1',
    topic: 'Travel',
    estimatedMinutes: 3,
    wordCount: computeWordCount(PASSAGE_6_PARAGRAPHS),
    paragraphs: PASSAGE_6_PARAGRAPHS,
    glossary: [
      { term: 'itinerary', definition: 'A planned schedule or route for a trip.', russian: 'маршрут поездки' },
      { term: 'explore', definition: 'Travel through a place to learn and discover.', russian: 'исследовать, изучать' },
      { term: 'fleeting', definition: 'Lasting for only a very short time.', russian: 'мимолётный' },
      { term: 'restorative', definition: 'Helping you feel refreshed and energized again.', russian: 'восстанавливающий силы' }
    ],
    questions: [
      {
        id: 'read6-q1',
        type: 'mcq',
        prompt: 'Why do some travelers forget details after rushing between many landmarks?',
        options: [
          'Landmarks forbid taking notes',
          'Crowded transit and hurried schedules leave little room for real attention',
          'Museums close before afternoon',
          'They never use maps'
        ],
        correctIndex: 1,
        explanation: 'Paragraph 1 explains that racing between sights leaves travelers with little beyond crowded buses and hurried photos.'
      },
      {
        id: 'read6-q2',
        type: 'mcq',
        prompt: 'What is the first practical step suggested in Paragraph 2?',
        options: [
          'Book six museums in one day',
          'Leave half a day unscheduled and walk beyond the main souvenir street',
          'Avoid speaking with shopkeepers',
          'Take a guided tour bus across town'
        ],
        correctIndex: 1,
        explanation: 'Paragraph 2 suggests leaving half a day unscheduled and walking away from souvenir streets.'
      },
      {
        id: 'read6-q3',
        type: 'tf',
        prompt: 'True or False: Writing down three short observations each evening helps turn fleeting impressions into lasting memories.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True. Paragraph 3 explains that recording brief sensory details preserves vivid memories.'
      },
      {
        id: 'read6-q4',
        type: 'tf',
        prompt: 'True or False: Micro-habit travel forbids visiting famous museums or landmarks.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. Paragraph 4 states slowing down does not mean skipping major sights altogether, but balancing them.'
      },
      {
        id: 'read6-q5',
        type: 'mcq',
        prompt: 'According to the author, what happens when you visit fewer places more attentively?',
        options: [
          'Trips become much more expensive',
          'Even a short weekend trip feels rich and restorative',
          'You forget how to use a notebook',
          'Neighborhood shops close earlier'
        ],
        correctIndex: 1,
        explanation: 'Paragraph 4 concludes that attentive travel makes even a two-day trip feel rich and restorative.'
      }
    ]
  },
  {
    id: 'clear-writing-precision',
    title: 'Why Clear Writing Starts With Cutting Unnecessary Words',
    subtitle: 'Practical B2 editing techniques to replace heavy filler with active, precise English.',
    level: 'B2',
    topic: 'Communication',
    estimatedMinutes: 3,
    wordCount: computeWordCount(PASSAGE_7_PARAGRAPHS),
    paragraphs: PASSAGE_7_PARAGRAPHS,
    glossary: [
      { term: 'precision', definition: 'Exactness and clarity in expressing ideas.', russian: 'точность' },
      { term: 'nuance', definition: 'A subtle shade of meaning or tone.', russian: 'нюанс, тонкий оттенок' },
      { term: 'evidence', definition: 'Facts or examples that support a claim.', russian: 'доказательство, факты' },
      { term: 'clutter', definition: 'Extra words or details that hide the main message.', russian: 'нагромождение, лишние слова' }
    ],
    questions: [
      {
        id: 'read7-q1',
        type: 'mcq',
        prompt: 'What common misconception do many intermediate writers hold according to Paragraph 1?',
        options: [
          'That short sentences are forbidden in essays',
          'That packing sentences with long nouns and filler phrases sounds more impressive',
          'That editors prefer spelling errors over short words',
          'That reading drafts aloud wastes time'
        ],
        correctIndex: 1,
        explanation: 'Paragraph 1 notes learners often assume long nouns and formal filler make writing sound more impressive.'
      },
      {
        id: 'read7-q2',
        type: 'mcq',
        prompt: 'Why is "The team evaluated the software interface" stronger than "The team conducted an evaluation of the software interface"?',
        options: [
          'It removes the subject of the sentence',
          'It uses fewer words and puts the action in focus with a strong verb',
          'It changes the tense to future',
          'It adds more formal nouns'
        ],
        correctIndex: 1,
        explanation: 'Paragraph 2 explains that strong verbs cut four words and bring the action into direct focus.'
      },
      {
        id: 'read7-q3',
        type: 'tf',
        prompt: 'True or False: Cutting unnecessary words means B2 writers should avoid relative clauses and contrast linkers.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. Paragraph 3 states B2 writers still combine ideas with relative clauses and linkers—provided each clause adds meaning.'
      },
      {
        id: 'read7-q4',
        type: 'mcq',
        prompt: 'How does reading a draft aloud help during revision?',
        options: [
          'It increases total word count',
          'Running out of breath or stumbling highlights heavy phrasing that needs tightening',
          'It automatically corrects punctuation',
          'It replaces peer feedback'
        ],
        correctIndex: 1,
        explanation: 'Paragraph 4 explains that stumbling or running out of breath signals spots to tighten.'
      },
      {
        id: 'read7-q5',
        type: 'tf',
        prompt: 'True or False: Concise writing respects the reader’s time and makes main ideas clearer.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True. The final sentence explicitly makes this point.'
      }
    ]
  },
  {
    id: 'citizen-science-biodiversity',
    title: 'Citizen Science: How Everyday Observers Help Map Biodiversity',
    subtitle: 'Connecting local curiosity with scientific observation across parks and neighborhoods.',
    level: 'B1',
    topic: 'Science',
    estimatedMinutes: 3,
    wordCount: computeWordCount(PASSAGE_8_PARAGRAPHS),
    paragraphs: PASSAGE_8_PARAGRAPHS,
    glossary: [
      { term: 'biodiversity', definition: 'Variety of living plants, animals, and organisms in an area.', russian: 'биоразнообразие' },
      { term: 'observe', definition: 'Watch carefully to collect accurate information.', russian: 'наблюдать' },
      { term: 'pattern', definition: 'A repeated trend or regularity in data or nature.', russian: 'закономерность' },
      { term: 'verify', definition: 'Check and confirm that information is accurate.', russian: 'проверять, подтверждать' }
    ],
    questions: [
      {
        id: 'read8-q1',
        type: 'mcq',
        prompt: 'Why do biologists partner with citizen scientists?',
        options: [
          'Professional scientists cannot observe every park and riverbank at the same time',
          'Volunteers replace all university laboratories',
          'Smartphones automatically identify every species without help',
          'Wildflowers only grow in private gardens'
        ],
        correctIndex: 0,
        explanation: 'Paragraph 1 notes professional biologists cannot be in every forest, park, and riverbank simultaneously.'
      },
      {
        id: 'read8-q2',
        type: 'mcq',
        prompt: 'What large-scale trend can aggregated community records reveal?',
        options: [
          'How fast laptops charge outdoors',
          'Shifts in seasonal timing, such as flowers blooming earlier than decades ago',
          'Which city has the tallest buildings',
          'How many photos are uploaded each night'
        ],
        correctIndex: 1,
        explanation: 'Paragraph 2 gives the example of flowers blooming ten days earlier than thirty years ago.'
      },
      {
        id: 'read8-q3',
        type: 'tf',
        prompt: 'True or False: Citizen science platforms publish unusual sightings immediately without any verification.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. Paragraph 3 states platforms provide photo guides and ask experienced reviewers to verify unusual sightings.'
      },
      {
        id: 'read8-q4',
        type: 'tf',
        prompt: 'True or False: Joining a local nature survey can make everyday park walks feel more engaging.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True. Paragraph 4 describes familiar paths feeling richer when you notice bird calls and seasonal rhythms.'
      },
      {
        id: 'read8-q5',
        type: 'mcq',
        prompt: 'Which combination makes citizen science successful according to Paragraph 3?',
        options: [
          'Curiosity paired with scientific rigor',
          'Speed paired with secrecy',
          'Expensive telescopes and private clubs',
          'Guessing species names without photos'
        ],
        correctIndex: 0,
        explanation: 'Paragraph 3 states that curiosity and scientific rigor work together rather than competing.'
      }
    ]
  }
];

// Backward-compatible primary passage export for legacy references
export const READING_PASSAGE = READING_PASSAGES[0];
