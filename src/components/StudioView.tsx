import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Mic,
  MicOff,
  PenTool,
  Save,
  Sparkles,
  Square,
  Trash2,
  Volume2
} from 'lucide-react';
import { SPEAKING_PROMPTS, WRITING_PROMPTS } from '../data/studioPrompts';
import {
  CEFRLevel,
  ExplanationLanguage,
  SpeakingSessionRecord,
  StructuredWritingFeedback,
  WritingDraft,
  WritingTaskType
} from '../types/wordpath';
import { speakEnglish } from '../utils/speech';

interface StudioViewProps {
  practiceLevel: CEFRLevel;
  explanationLanguage: ExplanationLanguage;
  writingDrafts: WritingDraft[];
  speakingSessions: SpeakingSessionRecord[];
  onSaveWritingDraft: (draft: WritingDraft, logActivity?: boolean) => void;
  onDeleteWritingDraft: (draftId: string) => void;
  onSaveSpeakingSession: (session: SpeakingSessionRecord) => void;
}

const TASK_TYPES: WritingTaskType[] = [
  'Opinion paragraph',
  'Email',
  'Short essay',
  'Argumentative writing',
  'Description',
  'Summary'
];

interface BrowserSpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

function getSpeechRecognitionCtor(): (new () => BrowserSpeechRecognition) | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => BrowserSpeechRecognition;
    webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
  };
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

export const StudioView: React.FC<StudioViewProps> = ({
  practiceLevel,
  explanationLanguage,
  writingDrafts,
  speakingSessions,
  onSaveWritingDraft,
  onDeleteWritingDraft,
  onSaveSpeakingSession
}) => {
  const [activeTab, setActiveTab] = useState<'writing' | 'speaking'>('writing');

  // Writing state
  const [selectedTaskType, setSelectedTaskType] = useState<WritingTaskType>('Opinion paragraph');
  const activePrompt = useMemo(
    () => WRITING_PROMPTS.find((p) => p.taskType === selectedTaskType) ?? WRITING_PROMPTS[0],
    [selectedTaskType]
  );
  const [draftId, setDraftId] = useState<string>(() => `draft-${Date.now()}`);
  const [draftText, setDraftText] = useState('');
  const [writingFeedback, setWritingFeedback] = useState<StructuredWritingFeedback | null>(null);
  const [writingLoading, setWritingLoading] = useState(false);
  const [writingError, setWritingError] = useState<string | null>(null);

  const wordCount = useMemo(
    () => draftText.trim().split(/\s+/).filter(Boolean).length,
    [draftText]
  );

  // Speaking state
  const [selectedSpeakingId, setSelectedSpeakingId] = useState<string>(SPEAKING_PROMPTS[0].id);
  const speakingPrompt = useMemo(
    () => SPEAKING_PROMPTS.find((s) => s.id === selectedSpeakingId) ?? SPEAKING_PROMPTS[0],
    [selectedSpeakingId]
  );
  const [transcript, setTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [speakingFeedback, setSpeakingFeedback] = useState<StructuredWritingFeedback | null>(null);
  const [speakingLoading, setSpeakingLoading] = useState(false);

  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);
  const timerRef = useRef<number | null>(null);
  const speechRecognitionSupported = Boolean(getSpeechRecognitionCtor());

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const handleSaveDraft = () => {
    if (!draftText.trim()) return;
    onSaveWritingDraft({
      id: draftId,
      taskType: selectedTaskType,
      promptTitle: activePrompt.title,
      level: activePrompt.level,
      content: draftText,
      wordCount,
      updatedAt: Date.now(),
      feedback: writingFeedback ?? undefined,
      feedbackGeneratedAt: writingFeedback ? Date.now() : undefined
    });
  };

  const handleRequestWritingFeedback = async () => {
    if (draftText.trim().length < 20) {
      setWritingError('Please write at least 20 characters before requesting AI Coach feedback.');
      return;
    }
    setWritingError(null);
    setWritingLoading(true);
    try {
      const res = await fetch('/api/writing-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'writing',
          taskType: selectedTaskType,
          level: practiceLevel,
          explanationLanguage,
          promptTitle: activePrompt.title,
          text: draftText.trim()
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data?.message === 'string'
            ? data.message
            : 'Unable to generate AI writing feedback.'
        );
      }
      const feedback = data.feedback as StructuredWritingFeedback;
      setWritingFeedback(feedback);
      onSaveWritingDraft({
        id: draftId,
        taskType: selectedTaskType,
        promptTitle: activePrompt.title,
        level: practiceLevel,
        content: draftText,
        wordCount,
        updatedAt: Date.now(),
        feedback,
        feedbackGeneratedAt: Date.now()
      });
    } catch (err) {
      setWritingError(err instanceof Error ? err.message : 'Error contacting AI Writing Coach.');
    } finally {
      setWritingLoading(false);
    }
  };

  const loadExistingDraft = (draft: WritingDraft) => {
    setDraftId(draft.id);
    setSelectedTaskType(draft.taskType);
    setDraftText(draft.content);
    setWritingFeedback(draft.feedback ?? null);
    setWritingError(null);
  };

  const startNewDraft = () => {
    setDraftId(`draft-${Date.now()}`);
    setDraftText('');
    setWritingFeedback(null);
    setWritingError(null);
  };

  const startSpeakingPractice = () => {
    setSpeechError(null);
    setElapsedSeconds(0);
    setIsRecording(true);

    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);

    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setSpeechError(
        'Live speech-to-text is unavailable in this browser. The timer is running — speak aloud and type or paste your transcript below when finished.'
      );
      return;
    }

    try {
      const rec = new Ctor();
      rec.lang = 'en-US';
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (event) => {
        const parts: string[] = [];
        for (let i = 0; i < event.results.length; i++) {
          const item = event.results[i]?.[0]?.transcript;
          if (item) parts.push(item);
        }
        setTranscript(parts.join(' ').trim());
      };
      rec.onerror = (event) => {
        setSpeechError(
          event.error === 'not-allowed'
            ? 'Microphone permission was denied. You can still type your spoken notes below.'
            : `Speech capture notice: ${event.error}. You can edit the transcript manually.`
        );
        stopSpeakingPractice();
      };
      rec.onend = () => {
        setIsRecording(false);
        if (timerRef.current) {
          window.clearInterval(timerRef.current);
          timerRef.current = null;
        }
      };
      recognitionRef.current = rec;
      rec.start();
    } catch {
      setSpeechError('Could not start browser speech recognition. You can practice with the timer and type your response.');
    }
  };

  const stopSpeakingPractice = () => {
    setIsRecording(false);
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
  };

  const handleSaveOrReviewSpeaking = async (withAI: boolean) => {
    if (transcript.trim().length < 20) {
      setSpeechError('Please capture or enter at least 20 characters in the transcript before saving or reviewing.');
      return;
    }
    setSpeechError(null);

    if (!withAI) {
      onSaveSpeakingSession({
        id: `sp-${Date.now()}`,
        topic: speakingPrompt.topic,
        level: practiceLevel,
        durationSeconds: Math.max(10, elapsedSeconds),
        transcript: transcript.trim(),
        createdAt: Date.now()
      });
      return;
    }

    setSpeakingLoading(true);
    try {
      const res = await fetch('/api/writing-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'speaking_transcript',
          taskType: 'Speaking response transcript',
          level: practiceLevel,
          explanationLanguage,
          promptTitle: speakingPrompt.title,
          text: transcript.trim()
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          typeof data?.message === 'string'
            ? data.message
            : 'Unable to evaluate speaking transcript.'
        );
      }
      const feedback = data.feedback as StructuredWritingFeedback;
      setSpeakingFeedback(feedback);
      onSaveSpeakingSession({
        id: `sp-${Date.now()}`,
        topic: speakingPrompt.topic,
        level: practiceLevel,
        durationSeconds: Math.max(10, elapsedSeconds),
        transcript: transcript.trim(),
        createdAt: Date.now(),
        feedback
      });
    } catch (err) {
      setSpeechError(err instanceof Error ? err.message : 'Error reviewing speaking transcript.');
    } finally {
      setSpeakingLoading(false);
    }
  };

  const renderFeedbackCard = (fb: StructuredWritingFeedback, isSpeaking = false) => (
    <div className="space-y-4 rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5 dark:border-indigo-900 dark:bg-indigo-950/30">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {isSpeaking ? 'Transcript Review' : 'AI Writing Coach Review'}
          </p>
          <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
            {fb.overallSummary}
          </p>
          {isSpeaking && (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Note: This review evaluates your written transcript’s grammar, phrasing, and structure. It does not score acoustic pronunciation or accent.
            </p>
          )}
        </div>
      </div>

      {fb.strengths.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            Strengths
          </p>
          <ul className="mt-1.5 space-y-1 text-sm text-slate-700 dark:text-slate-300">
            {fb.strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {fb.grammarCorrections.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
            Suggested Corrections
          </p>
          <div className="mt-2 space-y-2.5">
            {fb.grammarCorrections.map((c, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-3.5 text-sm dark:border-slate-800 dark:bg-slate-900"
              >
                <p className="text-rose-700 line-through dark:text-rose-400">{c.original}</p>
                <p className="mt-0.5 font-semibold text-teal-700 dark:text-teal-300">{c.corrected}</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{c.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {fb.vocabularySuggestions.length > 0 && (
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
            Vocabulary Upgrades
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {fb.vocabularySuggestions.map((v, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 bg-white p-3 text-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {v.original} → <span className="text-blue-600 dark:text-blue-400">{v.suggestion}</span>
                </p>
                <p className="mt-1 text-slate-600 dark:text-slate-400">{v.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
        <span className="font-bold text-slate-900 dark:text-slate-100">Recommended next step: </span>
        {fb.nextStep}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Studio Tab Header */}
      <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Writing &amp; Speaking Studio
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Save drafts offline in your browser and request structured AI feedback when ready.
          </p>
        </div>

        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('writing')}
            className={`inline-flex min-h-[40px] items-center gap-2 rounded-lg px-4 text-sm font-semibold transition whitespace-nowrap ${
              activeTab === 'writing'
                ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-900 dark:text-indigo-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
            }`}
          >
            <PenTool className="h-4 w-4" />
            <span>Writing Studio</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('speaking')}
            className={`inline-flex min-h-[40px] items-center gap-2 rounded-lg px-4 text-sm font-semibold transition whitespace-nowrap ${
              activeTab === 'speaking'
                ? 'bg-white text-teal-700 shadow-xs dark:bg-slate-900 dark:text-teal-300'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
            }`}
          >
            <Mic className="h-4 w-4" />
            <span>Speaking Studio</span>
          </button>
        </div>
      </section>

      {activeTab === 'writing' ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Writing Editor */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap gap-2">
                {TASK_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedTaskType(type)}
                    className={`min-h-[36px] rounded-xl px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
                      selectedTaskType === type
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="font-semibold text-indigo-700 dark:text-indigo-300">
                    {activePrompt.level} · {activePrompt.taskType}
                  </span>
                  <span>Target: {activePrompt.targetWords}</span>
                </div>
                <h3 className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">
                  {activePrompt.title}
                </h3>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                  {activePrompt.prompt}
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                  {activePrompt.checklist.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <label htmlFor="writing-editor" className="font-semibold">
                    Your Draft
                  </label>
                  <span className="font-mono tabular-nums">{wordCount} words</span>
                </div>
                <textarea
                  id="writing-editor"
                  rows={8}
                  maxLength={5000}
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  placeholder="Write your response here. Save locally anytime or request AI feedback..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              {writingError && (
                <div
                  role="alert"
                  className="mt-3 flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-xs font-medium text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{writingError}</span>
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={!draftText.trim()}
                    onClick={handleSaveDraft}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Draft</span>
                  </button>
                  <button
                    type="button"
                    onClick={startNewDraft}
                    className="min-h-[44px] rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    New Blank Draft
                  </button>
                </div>

                <button
                  type="button"
                  disabled={writingLoading || draftText.trim().length < 20}
                  onClick={() => void handleRequestWritingFeedback()}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{writingLoading ? 'Reviewing...' : 'Get AI Feedback'}</span>
                </button>
              </div>
            </div>

            {writingFeedback && renderFeedbackCard(writingFeedback, false)}
          </div>

          {/* Saved Drafts Sidebar */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Saved Drafts ({writingDrafts.length})
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Stored locally in your browser.
            </p>
            {writingDrafts.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                No drafts saved yet. Write a paragraph and click Save Draft.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                {writingDrafts.map((d) => (
                  <li key={d.id} className="py-3">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => loadExistingDraft(d)}
                        className="text-left hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {d.promptTitle}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                          {d.taskType} · {d.wordCount} words{d.feedback ? ' · Reviewed' : ''}
                        </p>
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete draft ${d.promptTitle}`}
                        onClick={() => onDeleteWritingDraft(d.id)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Speaking Recorder & Transcript Evaluation */}
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-wrap gap-2">
                {SPEAKING_PROMPTS.map((sp) => (
                  <button
                    key={sp.id}
                    type="button"
                    onClick={() => setSelectedSpeakingId(sp.id)}
                    className={`min-h-[36px] rounded-xl px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
                      selectedSpeakingId === sp.id
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    {sp.topic} ({sp.level})
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">
                    {speakingPrompt.level} · Recommended ~{speakingPrompt.recommendedSeconds}s
                  </span>
                  <button
                    type="button"
                    onClick={() => speakEnglish(speakingPrompt.prompt)}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>Listen to prompt</span>
                  </button>
                </div>
                <h3 className="mt-1.5 text-base font-bold text-slate-900 dark:text-slate-100">
                  {speakingPrompt.title}
                </h3>
                <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
                  {speakingPrompt.prompt}
                </p>
                <div className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                  <p className="font-semibold">Follow-up questions:</p>
                  <ul className="mt-1 space-y-0.5">
                    {speakingPrompt.followUps.map((f) => (
                      <li key={f}>• {f}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Controls & Timer */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  {isRecording ? (
                    <button
                      type="button"
                      onClick={stopSpeakingPractice}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
                    >
                      <Square className="h-4 w-4" />
                      <span>Stop</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={startSpeakingPractice}
                      className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
                    >
                      {speechRecognitionSupported ? (
                        <Mic className="h-4 w-4" />
                      ) : (
                        <MicOff className="h-4 w-4" />
                      )}
                      <span>
                        {speechRecognitionSupported ? 'Start Mic & Timer' : 'Start Practice Timer'}
                      </span>
                    </button>
                  )}
                  <span className="font-mono text-base font-bold text-slate-900 tabular-nums dark:text-slate-100">
                    {Math.floor(elapsedSeconds / 60)}:
                    {String(elapsedSeconds % 60).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {speechRecognitionSupported
                    ? 'Speech-to-text transcript review (does not score pronunciation)'
                    : 'Manual transcript mode supported'}
                </span>
              </div>

              {speechError && (
                <div
                  role="alert"
                  className="mt-3 flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2.5 text-xs font-medium text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{speechError}</span>
                </div>
              )}

              <div className="mt-4">
                <label
                  htmlFor="speaking-transcript"
                  className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400"
                >
                  Spoken Response Transcript (Editable)
                </label>
                <textarea
                  id="speaking-transcript"
                  rows={5}
                  maxLength={5000}
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  placeholder="Speak aloud using your microphone, or type/edit what you said here for grammar and vocabulary review..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5">
                <button
                  type="button"
                  disabled={transcript.trim().length < 20}
                  onClick={() => void handleSaveOrReviewSpeaking(false)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Session</span>
                </button>
                <button
                  type="button"
                  disabled={speakingLoading || transcript.trim().length < 20}
                  onClick={() => void handleSaveOrReviewSpeaking(true)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gradient-to-r from-teal-600 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-teal-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{speakingLoading ? 'Evaluating...' : 'Evaluate Transcript with AI'}</span>
                </button>
              </div>
            </div>

            {speakingFeedback && renderFeedbackCard(speakingFeedback, true)}
          </div>

          {/* Speaking History */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Speaking Log ({speakingSessions.length})
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Saved spoken transcripts and session timers.
            </p>
            {speakingSessions.length === 0 ? (
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                No speaking sessions saved yet.
              </p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                {speakingSessions.map((sp) => (
                  <li key={sp.id} className="py-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {sp.topic}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      {sp.level} · {sp.durationSeconds}s{sp.feedback ? ' · Transcript reviewed' : ''}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">
                      {sp.transcript}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      )}
    </div>
  );
};
