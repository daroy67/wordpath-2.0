import React, { useState } from 'react';
import {
  CheckSquare,
  Download,
  ExternalLink,
  Square
} from 'lucide-react';
import {
  CRITERION_B_ATL_ROWS,
  CRITERION_C_EVALUATION,
  EVIDENCE_CHECKLIST,
  INITIAL_PROJECT_ANALYSIS,
  PRESENTATION_SLIDES,
  RESEARCH_SOURCES,
  SUCCESS_CRITERIA_SPECS,
  VIVA_QUESTIONS,
  WORDPATH_CONTENT_METRICS
} from '../data/ibProjectData';
import { IBReflections } from '../types/wordpath';

interface IBProjectHubViewProps {
  reflections: IBReflections;
  onUpdateReflections: (patch: Partial<IBReflections>) => void;
  onToggleEvidence: (id: string) => void;
}

type HubTab =
  | 'analysis'
  | 'criterion-a'
  | 'criterion-b'
  | 'criterion-c'
  | 'success-criteria'
  | 'research'
  | 'evidence-slides'
  | 'viva';

const TABS: { id: HubTab; label: string }[] = [
  { id: 'analysis', label: 'Analysis & Goals' },
  { id: 'criterion-a', label: 'Criterion A' },
  { id: 'criterion-b', label: 'Criterion B' },
  { id: 'criterion-c', label: 'Criterion C' },
  { id: 'success-criteria', label: 'Success Criteria' },
  { id: 'research', label: 'Research & APA 7' },
  { id: 'evidence-slides', label: 'Evidence & Slides' },
  { id: 'viva', label: 'Viva 15 Q&A' }
];

export const IBProjectHubView: React.FC<IBProjectHubViewProps> = ({
  reflections,
  onUpdateReflections,
  onToggleEvidence
}) => {
  const [activeTab, setActiveTab] = useState<HubTab>('analysis');

  const handleDownloadDossier = () => {
    const mdLines = [
      `# IB MYP Personal Project Dossier — WordPath`,
      ``,
      `**Student:** ${reflections.studentName}`,
      `**Level:** ${reflections.mypYear}`,
      `**Global Context:** Scientific and Technical Innovation`,
      `**Slogan:** Build your English, one focused session at a time.`,
      ``,
      `---`,
      ``,
      `## Criterion A — Planning`,
      `### Learning Goal`,
      `"To improve my ability to design and develop interactive web applications using modern web technologies, while researching how learning strategies such as retrieval practice, spaced repetition and contextual learning can be incorporated into a digital platform for B1–B2 English learners."`,
      ``,
      `### Product Goal`,
      `Create a fully functional responsive web platform for learning B1–B2 English with ${WORDPATH_CONTENT_METRICS.wordCount} interactive vocabulary flashcards across 10 topics, ${WORDPATH_CONTENT_METRICS.grammarLessonCount} grammar lessons (${WORDPATH_CONTENT_METRICS.grammarQuestionCount} questions), ${WORDPATH_CONTENT_METRICS.readingPassageCount} original contextual reading passages (${WORDPATH_CONTENT_METRICS.totalReadingWords} total words, ${WORDPATH_CONTENT_METRICS.readingQuestionCount} comprehension questions), a ${WORDPATH_CONTENT_METRICS.placementQuestionCount}-question informal diagnostic check, Writing & Speaking Studio, Adaptive Learning Path, dual Light/Dark themes, and server-side Gemini AI Mentor integration.`,
      ``,
      `### Research Question`,
      `"How can retrieval practice, spaced repetition and contextual learning be combined in a web-based platform to support English language learning for B1–B2 students?"`,
      ``,
      `### Personal Interest (Student Editable)`,
      reflections.personalInterestNote,
      ``,
      `### Prior Coding Skills (Student Editable)`,
      reflections.priorCodingNote,
      ``,
      `### Prior English Experience (Student Editable)`,
      reflections.priorEnglishNote,
      ``,
      `---`,
      ``,
      `## Criterion B — Applying ATL Skills`,
      ...CRITERION_B_ATL_ROWS.map(
        (row) =>
          `### ${row.skill}\n- **Planned action:** ${row.plannedAction}\n- **Implemented feature:** ${row.implementedFeature}\n- **Action actually performed by student:** ${row.studentPerformed}\n- **Action verified through testing:** ${row.verifiedTesting}\n- **Evidence still required:** ${row.evidenceRequired}\n- **Challenge & Solution:** ${row.challenge} → ${row.solution}\n`
      ),
      `### Personal Development Notes (Student Editable)`,
      reflections.criterionBReflection,
      ``,
      `---`,
      ``,
      `## Criterion C — Reflecting & Product Evaluation`,
      `| Criterion | Target | Actual Result | Evidence | Status | Explanation |`,
      `|---|---|---|---|---|---|`,
      ...CRITERION_C_EVALUATION.map(
        (row) =>
          `| **${row.id} (${row.criterion})** | ${row.target} | ${row.actualResult} | ${row.evidence} | ${row.status} | ${row.explanation} |`
      ),
      ``,
      `### Personal Reflection (Student Editable)`,
      reflections.criterionCReflection,
      ``,
      `---`,
      ``,
      `## APA 7 Bibliography`,
      ...RESEARCH_SOURCES.map((s) => `- ${s.apa7}`)
    ];

    const blob = new Blob([mdLines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'WordPath_IB_MYP_Dossier.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header & Download Markdown Action */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>IB MYP Personal Project</span>
            <span aria-hidden="true">·</span>
            <span>Global Context: Scientific and Technical Innovation</span>
          </div>
          <h2 className="font-display text-xl font-bold text-slate-900 dark:text-slate-100">
            Project Documentation, Criteria A–C & Viva Preparation
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Editable personal fields save automatically in LocalStorage and are preserved when you
            reset learning progress. Private IB notes are never sent to AI endpoints.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadDossier}
          className="inline-flex min-h-[44px] items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-xs sm:text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Dossier (.md)</span>
        </button>
      </div>

      {/* Sub-Navigation Tabs */}
      <div
        role="tablist"
        aria-label="IB Project Hub Sections"
        className="flex flex-wrap items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`min-h-[38px] px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'analysis' && (
        <div className="space-y-6">
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              Initial Project Feasibility & Engineering Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INITIAL_PROJECT_ANALYSIS.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-1.5"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.question}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              One-Day Development Sprint vs. IB Report Stages
            </h3>
            <p className="text-xs text-slate-500">
              Separates the real 8-hour execution schedule from the formal IB Personal Project
              methodology stages.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-500">
                    <th className="py-2 pr-4 font-medium">Sprint Block</th>
                    <th className="py-2 pr-4 font-medium">Execution Focus</th>
                    <th className="py-2 font-medium">IB Stage Alignment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 dark:text-slate-300">
                  <tr>
                    <td className="py-2.5 pr-4 font-mono tabular-nums text-xs">00:00–00:40</td>
                    <td className="py-2.5 pr-4">Research, concept & Success Criteria</td>
                    <td className="py-2.5">Criterion A (Planning & Research)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-mono tabular-nums text-xs">00:40–01:10</td>
                    <td className="py-2.5 pr-4">UI/UX editorial system & state architecture</td>
                    <td className="py-2.5">Criterion B (Thinking & Creative Design)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-mono tabular-nums text-xs">01:10–03:40</td>
                    <td className="py-2.5 pr-4">Core React modules & navigation</td>
                    <td className="py-2.5">Criterion B (Product Development)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-mono tabular-nums text-xs">03:40–04:40</td>
                    <td className="py-2.5 pr-4">
                      {WORDPATH_CONTENT_METRICS.wordCount} B1–B2 words,{' '}
                      {WORDPATH_CONTENT_METRICS.grammarLessonCount} grammar lessons,{' '}
                      {WORDPATH_CONTENT_METRICS.readingWordCount}-word reading & test
                    </td>
                    <td className="py-2.5">Criterion B (Communication & Content)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-mono tabular-nums text-xs">04:40–05:30</td>
                    <td className="py-2.5 pr-4">Validated LocalStorage & live Progress charts</td>
                    <td className="py-2.5">Criterion B (State Engineering)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-mono tabular-nums text-xs">05:30–06:30</td>
                    <td className="py-2.5 pr-4">Interactive QA, reload & 360/768/1366 px checks</td>
                    <td className="py-2.5">Criterion C (Evaluation & Testing)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 pr-4 font-mono tabular-nums text-xs">06:30–08:00</td>
                    <td className="py-2.5 pr-4">Build verification, QA report & IB documentation</td>
                    <td className="py-2.5">Criterion C (Reflection & Evidence)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'criterion-a' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
            <div>
              <label htmlFor="ib-student-name" className="block text-xs font-medium text-slate-500 mb-1">
                Student Name (Editable)
              </label>
              <input
                id="ib-student-name"
                type="text"
                value={reflections.studentName}
                onChange={(e) => onUpdateReflections({ studentName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <div>
              <label htmlFor="ib-myp-year" className="block text-xs font-medium text-slate-500 mb-1">
                MYP Year / Grade (Editable)
              </label>
              <input
                id="ib-myp-year"
                type="text"
                value={reflections.mypYear}
                onChange={(e) => onUpdateReflections({ mypYear: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <div>
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                1. Introduction & Product Goal
              </h3>
              <p className="mt-1">
                WordPath (“Build your English, one focused session at a time”) is a responsive
                interactive platform for CEFR B1–B2 learners built around the cycle{' '}
                <strong>Learn → Practice → Remember → Track Progress</strong> with selectable 10,
                15, or 20-minute daily pacing.
              </p>
            </div>

            <div>
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                2. Learning Goal & Why It Is Not Only a Product Goal
              </h3>
              <p className="mt-1 italic text-slate-800">
                “To improve my ability to design and develop interactive web applications using
                modern web technologies, while researching how learning strategies such as
                retrieval practice, spaced repetition and contextual learning can be incorporated
                into a digital platform for B1–B2 English learners.”
              </p>
              <p className="mt-2">
                A product goal asks <em>what</em> will be created (a web app). This learning goal
                focuses on <em>what skills and knowledge I develop</em>: front-end state
                engineering, WCAG accessibility, and pedagogical translation of memory research into
                software mechanics.
              </p>
            </div>

            <div>
              <h3 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
                3. Research Question & Global Context
              </h3>
              <p className="mt-1">
                <strong>Research Question:</strong> “How can retrieval practice, spaced repetition
                and contextual learning be combined in a web-based platform to support English
                language learning for B1–B2 students?”
              </p>
              <p className="mt-1">
                <strong>Global Context — Scientific and Technical Innovation:</strong> Demonstrates
                how software interfaces can operationalize cognitive science findings to address a
                real educational challenge without costly barriers.
              </p>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div>
                <label htmlFor="ib-personal-interest" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  4. Personal Interest (Verify & Adapt to Your Real Experience)
                </label>
                <textarea
                  id="ib-personal-interest"
                  rows={3}
                  value={reflections.personalInterestNote}
                  onChange={(e) =>
                    onUpdateReflections({ personalInterestNote: e.target.value })
                  }
                  className="w-full p-3 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="ib-prior-coding" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  5. Prior Programming Knowledge & Skills to Develop (Editable)
                </label>
                <textarea
                  id="ib-prior-coding"
                  rows={3}
                  value={reflections.priorCodingNote}
                  onChange={(e) => onUpdateReflections({ priorCodingNote: e.target.value })}
                  className="w-full p-3 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <div>
                <label htmlFor="ib-prior-english" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  6. Prior English Learning Context (Editable)
                </label>
                <textarea
                  id="ib-prior-english"
                  rows={2}
                  value={reflections.priorEnglishNote}
                  onChange={(e) => onUpdateReflections({ priorEnglishNote: e.target.value })}
                  className="w-full p-3 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'criterion-b' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                Criterion B — Applying ATL Skills (Transparent 5-Layer Separation)
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                Clearly distinguishes planned actions, implemented software features, actions the
                student must verify/perform personally, tested engineering behavior, and evidence
                still required for IB submission.
              </p>
            </div>

            <div className="space-y-4">
              {CRITERION_B_ATL_ROWS.map((row, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3 text-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <h4 className="font-display font-semibold text-slate-900 dark:text-slate-100">{row.skill}</h4>
                    <span className="text-xs text-slate-500">
                      Goal alignment: {row.learningGoalLink}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <p className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                      <strong className="block text-slate-900 dark:text-slate-100 mb-0.5">1. Planned action</strong>
                      {row.plannedAction}
                    </p>
                    <p className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                      <strong className="block text-slate-900 dark:text-slate-100 mb-0.5">2. Implemented feature</strong>
                      {row.implementedFeature}
                    </p>
                    <p className="bg-amber-50/60 border border-amber-200 rounded-lg p-3">
                      <strong className="block text-amber-900 mb-0.5">
                        3. Action actually performed by the student
                      </strong>
                      {row.studentPerformed}
                    </p>
                    <p className="bg-sky-50/60 border border-sky-200 rounded-lg p-3">
                      <strong className="block text-sky-900 mb-0.5">
                        4. Action verified through testing
                      </strong>
                      {row.verifiedTesting}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600 dark:text-slate-400 pt-1">
                    <p>
                      <strong className="text-slate-900 dark:text-slate-100">Challenge & Solution:</strong>{' '}
                      {row.challenge} → {row.solution}
                    </p>
                    <p className="text-sky-800">
                      <strong>5. Evidence still required:</strong> {row.evidenceRequired}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <label htmlFor="ib-crit-b-note" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                Personal ATL Reflection Log (Editable)
              </label>
              <textarea
                id="ib-crit-b-note"
                rows={3}
                value={reflections.criterionBReflection}
                onChange={(e) =>
                  onUpdateReflections({ criterionBReflection: e.target.value })
                }
                className="w-full p-3 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'criterion-c' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <div>
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              Criterion C — Evaluation & Reflecting on Learning and Product
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Honest evaluation table using explicit verification statuses alongside strengths,
              limitations, and editable student reflection fields.
            </p>
          </div>

          {/* 6-Column Criterion C Evaluation Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="py-2.5 pr-3 font-medium">Criterion</th>
                  <th className="py-2.5 pr-3 font-medium">Target</th>
                  <th className="py-2.5 pr-3 font-medium">Actual Result</th>
                  <th className="py-2.5 pr-3 font-medium">Evidence</th>
                  <th className="py-2.5 pr-3 font-medium">Status</th>
                  <th className="py-2.5 font-medium">Explanation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 dark:text-slate-300">
                {CRITERION_C_EVALUATION.map((row) => (
                  <tr key={row.id}>
                    <td className="py-3 pr-3 align-top font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {row.id} · {row.criterion}
                    </td>
                    <td className="py-3 pr-3 align-top text-xs text-slate-700 dark:text-slate-300">{row.target}</td>
                    <td className="py-3 pr-3 align-top text-xs text-slate-700 dark:text-slate-300">
                      {row.actualResult}
                    </td>
                    <td className="py-3 pr-3 align-top font-mono text-xs text-slate-600 dark:text-slate-400">
                      {row.evidence}
                    </td>
                    <td className="py-3 pr-3 align-top whitespace-nowrap">
                      <span
                        className={`text-xs font-medium ${
                          row.status === 'Verified through browser testing' ||
                          row.status === 'Tested by a real user'
                            ? 'text-emerald-700'
                            : row.status === 'Verified in source code'
                              ? 'text-sky-700'
                              : 'text-amber-700'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 align-top text-xs text-slate-600 dark:text-slate-400">{row.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-1.5">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">Strengths of the Product</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Unified Learn → Practice → Remember → Track Progress flow in one SPA.</li>
                <li>Zero paid APIs: client-side Web Speech API + defensive LocalStorage persistence.</li>
                <li>Active-recall translation guard prevents accidental vocabulary mastery.</li>
                <li>Separated Learning Reset preserves IB notes and learner preferences.</li>
              </ul>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-1.5">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100">Real Limitations</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>LocalStorage data does not sync across different browsers or devices.</li>
                <li>
                  Fixed starter bank ({WORDPATH_CONTENT_METRICS.wordCount} words,{' '}
                  {WORDPATH_CONTENT_METRICS.grammarLessonCount} grammar lessons, 1 reading article).
                </li>
                <li>Web Speech voice quality varies across operating systems and browsers.</li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1.5">
              Concrete Future Improvements
            </h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Add custom user-created vocabulary decks with JSON import/export.</li>
              <li>Expand the Reading Room with 4–6 additional B1 and B2 articles.</li>
              <li>Conduct longitudinal classroom testing to measure 7-day vocabulary retention.</li>
            </ul>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
              Guiding Questions for Your Personal Reflection
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>Which part of React/TypeScript state architecture gave you the greatest insight?</li>
              <li>What unexpected bug or UX friction surfaced when testing on a 360 px screen?</li>
              <li>How did researching cognitive psychology change what you built compared to your first sketch?</li>
            </ul>
          </div>

          <div>
            <label htmlFor="ib-crit-c-note" className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
              Your Genuine Personal Reflection (Editable)
            </label>
            <textarea
              id="ib-crit-c-note"
              rows={4}
              value={reflections.criterionCReflection}
              onChange={(e) =>
                onUpdateReflections({ criterionCReflection: e.target.value })
              }
              className="w-full p-3 text-sm border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:border-indigo-600 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
        </div>
      )}

      {activeTab === 'success-criteria' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              Product Success Criteria (SC1–SC10)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Every criterion specifies what the product must do, how it is measured, and how it is
              verified.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500">
                  <th className="py-2.5 pr-3 font-medium">ID</th>
                  <th className="py-2.5 pr-3 font-medium">Criterion</th>
                  <th className="py-2.5 pr-3 font-medium">Target</th>
                  <th className="py-2.5 font-medium">Verification Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 dark:text-slate-300">
                {SUCCESS_CRITERIA_SPECS.map((sc) => (
                  <tr key={sc.id}>
                    <td className="py-3 pr-3 font-mono font-semibold text-slate-900 dark:text-slate-100 align-top">
                      {sc.id}
                    </td>
                    <td className="py-3 pr-3 align-top">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 block">{sc.name}</span>
                      <span className="text-xs text-slate-600 dark:text-slate-400">{sc.requirement}</span>
                    </td>
                    <td className="py-3 pr-3 align-top font-mono text-xs text-slate-800">
                      {sc.target}
                    </td>
                    <td className="py-3 align-top text-xs text-slate-600 dark:text-slate-400">
                      {sc.verificationMethod}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'research' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              Verified Research Sources & APA 7 Bibliography
            </h3>
            <p className="text-xs text-slate-500">
              All six sources below are verified academic publications and official standards with
              checked DOIs/URLs used to ground WordPath’s learning strategies and accessibility design.
            </p>

            <div className="space-y-4">
              {RESEARCH_SOURCES.map((src) => (
                <article
                  key={src.id}
                  className="border border-slate-200 rounded-xl p-4 sm:p-5 space-y-2 text-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h4 className="font-display font-semibold text-slate-900 dark:text-slate-100">
                      {src.title} ({src.year})
                    </h4>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-sky-700 hover:text-sky-800 shrink-0"
                    >
                      <span>Source link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-500">
                    {src.author} · {src.publisherOrJournal}
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-slate-100">Main Findings:</strong> {src.mainFindings}
                  </p>
                  <p className="text-slate-700 dark:text-slate-300">
                    <strong className="text-slate-900 dark:text-slate-100">Relevance to WordPath:</strong>{' '}
                    {src.relevanceToWordPath}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    <strong>Limitations:</strong> {src.limitations}
                  </p>
                  <p className="text-xs font-mono bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded p-2.5 text-slate-700 dark:text-slate-300 break-words">
                    APA 7: {src.apa7}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'evidence-slides' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Evidence Checklist */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
                Evidence Checklist
              </h3>
              <span className="font-mono tabular-nums text-xs text-slate-600 dark:text-slate-400">
                {reflections.evidenceCheckedIds.length}/{EVIDENCE_CHECKLIST.length} collected
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {EVIDENCE_CHECKLIST.map((item) => {
                const checked = reflections.evidenceCheckedIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onToggleEvidence(item.id)}
                    className="w-full py-3 text-left flex items-start gap-3 hover:bg-slate-50 rounded-lg px-2 transition-colors"
                  >
                    {checked ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p
                        className={`text-sm font-medium ${
                          checked ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.category} · {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 6-Slide Presentation Outline */}
          <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              Presentation Structure (6 Slides)
            </h3>
            <div className="space-y-3">
              {PRESENTATION_SLIDES.map((slide) => (
                <div
                  key={slide.slideNumber}
                  className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono font-semibold text-sky-700">
                      Slide {slide.slideNumber}
                    </span>
                    <span className="font-mono tabular-nums">{slide.duration}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{slide.title}</p>
                  <ul className="list-disc pl-4 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    {slide.keyPoints.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-slate-500 pt-1">
                    Visual: {slide.visualToShow}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {activeTab === 'viva' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-4">
          <div>
            <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-slate-100">
              Viva / Defence Preparation (15 Questions & Answers)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Practice explaining your research, LocalStorage validation, active-recall guard, and
              product evaluation in your own words.
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {VIVA_QUESTIONS.map((item) => (
              <div key={item.id} className="py-4 space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-mono tabular-nums font-semibold text-sky-700">
                    Q{item.id}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{item.focusArea}</span>
                </div>
                <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-slate-100">
                  {item.question}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
