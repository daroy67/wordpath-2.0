import React, { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  BookOpen,
  Check,
  Copy,
  HelpCircle,
  MessageSquare,
  PenTool,
  RefreshCw,
  Send,
  Sparkles,
  Trash2
} from 'lucide-react';
import {
  CONVERSATION_TOPICS,
  MENTOR_MODE_SUGGESTIONS,
  buildDemoPreviewExchange
} from '../data/studioPrompts';
import {
  CEFRLevel,
  ExplanationLanguage,
  MentorMessage,
  MentorMode
} from '../types/wordpath';
import { MascotState, MentorMascot } from './MentorMascot';

interface AIMentorViewProps {
  practiceLevel: CEFRLevel;
  explanationLanguage: ExplanationLanguage;
  history: MentorMessage[];
  onSetHistory: (updater: MentorMessage[] | ((prev: MentorMessage[]) => MentorMessage[])) => void;
  onLogPractice: (modeLabel: string) => void;
  onChangeLevel: (level: CEFRLevel) => void;
  onChangeExplanationLanguage: (lang: ExplanationLanguage) => void;
}

const MODES: Array<{
  id: MentorMode;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'conversation', label: 'Conversation', desc: 'Natural B1–B2 dialogue', icon: MessageSquare },
  { id: 'grammar', label: 'Grammar Tutor', desc: 'Clear rules & contrasts', icon: BookOpen },
  { id: 'vocabulary', label: 'Vocabulary Helper', desc: 'Collocations & usage', icon: Sparkles },
  { id: 'writing', label: 'Writing Coach', desc: 'Sentence clarity edits', icon: PenTool },
  { id: 'quiz', label: 'Quiz Generator', desc: 'Mini targeted practice', icon: HelpCircle }
];

export const AIMentorView: React.FC<AIMentorViewProps> = ({
  practiceLevel,
  explanationLanguage,
  history,
  onSetHistory,
  onLogPractice,
  onChangeLevel,
  onChangeExplanationLanguage
}) => {
  const [mode, setMode] = useState<MentorMode>('conversation');
  const [topic, setTopic] = useState<string>(CONVERSATION_TOPICS[0]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);
  const [healthModel, setHealthModel] = useState<string>('');
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [demoModeEnabled, setDemoModeEnabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let active = true;
    fetch('/api/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data) return;
        setAiConfigured(Boolean(data.aiConfigured));
        if (typeof data.model === 'string') setHealthModel(data.model);
      })
      .catch(() => {
        if (active) setAiConfigured(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isSending]);

  const mascotState: MascotState = isSending
    ? 'thinking'
    : aiConfigured === false && !demoModeEnabled
      ? 'offline'
      : 'ready';

  const sendMessage = async (rawPrompt?: string, isRetry = false) => {
    const trimmed = (rawPrompt ?? input).trim();
    if (!trimmed || isSending) return;
    if (trimmed.length > 2000) {
      setErrorBanner('Please keep your message under 2,000 characters.');
      return;
    }

    setErrorBanner(null);
    const userMsg: MentorMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
      mode
    };

    const nextHistorySnapshot = isRetry ? history : [...history, userMsg];
    if (!isRetry) {
      onSetHistory((prev) => [...prev, userMsg]);
      setInput('');
    }

    // Explicitly labeled Sample Demo Preview when learner explicitly toggled demo preview
    if (demoModeEnabled) {
      const previewReply: MentorMessage = {
        id: `demo-${Date.now()}`,
        role: 'assistant',
        content: buildDemoPreviewExchange(mode, practiceLevel),
        timestamp: Date.now(),
        mode,
        isDemoPreview: true
      };
      onSetHistory((prev) => [...prev, previewReply]);
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/ai-mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          level: practiceLevel,
          explanationLanguage,
          topic: mode === 'conversation' ? topic : undefined,
          messages: nextHistorySnapshot.slice(-12).map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (payload?.errorCode === 'AI_NOT_CONFIGURED') {
          setAiConfigured(false);
        }
        throw new Error(
          typeof payload?.message === 'string'
            ? payload.message
            : 'Could not reach WordPath AI Mentor right now.'
        );
      }

      const replyText =
        typeof payload?.reply === 'string' && payload.reply.trim()
          ? payload.reply.trim()
          : 'No response text was returned. Please try again.';

      const assistantMsg: MentorMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: Date.now(),
        mode,
        isDemoPreview: false
      };

      onSetHistory((prev) => [...prev, assistantMsg]);
      const modeTitle = MODES.find((m) => m.id === mode)?.label ?? mode;
      onLogPractice(modeTitle);
      setAiConfigured(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Network error while contacting AI Mentor.';
      setErrorBanner(message);
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard blocked
    }
  };

  const handleRetryLast = () => {
    const lastUser = [...history].reverse().find((m) => m.role === 'user');
    if (lastUser) {
      void sendMessage(lastUser.content, true);
    }
  };

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-600 via-blue-600 to-teal-600 p-5 text-white shadow-sm sm:p-6 dark:border-indigo-800/70">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <MentorMascot state={mascotState} size="md" />
            <div>
              <h2 className="text-2xl font-bold tracking-tight">WordPath AI Mentor</h2>
              <p className="mt-0.5 text-sm text-indigo-100">
                Personalized {practiceLevel} practice across conversation, grammar, vocabulary, writing, and mini quizzes.
              </p>
              <p className="mt-1 text-xs text-indigo-100/90">
                {aiConfigured === true
                  ? `Live server tutor ready (${healthModel || 'Gemini'})`
                  : aiConfigured === false
                    ? 'Server AI key not configured — live requests disabled until GEMINI_API_KEY is set'
                    : 'Checking server AI status...'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl bg-white/15 p-1 backdrop-blur-sm">
              {(['B1', 'B2'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => onChangeLevel(lvl)}
                  className={`min-h-[36px] rounded-lg px-3 text-xs font-semibold transition whitespace-nowrap ${
                    practiceLevel === lvl
                      ? 'bg-white text-indigo-900 shadow-sm'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <div className="inline-flex rounded-xl bg-white/15 p-1 backdrop-blur-sm">
              {(
                [
                  { id: 'en', label: 'EN' },
                  { id: 'ru', label: 'EN + RU' }
                ] as const
              ).map((lang) => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => onChangeExplanationLanguage(lang.id)}
                  className={`min-h-[36px] rounded-lg px-3 text-xs font-semibold transition whitespace-nowrap ${
                    explanationLanguage === lang.id
                      ? 'bg-white text-teal-900 shadow-sm'
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Honest Offline / Missing Key / Upstream Error Demo Banner */}
      {(aiConfigured === false || errorBanner !== null || demoModeEnabled) && (
        <section className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-950 dark:border-amber-700/70 dark:bg-amber-950/40 dark:text-amber-100">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div className="text-sm">
                <p className="font-semibold">
                  {aiConfigured === false
                    ? 'Live AI Tutor requires a server-side GEMINI_API_KEY'
                    : 'AI Mentor live preview option'}
                </p>
                <p className="mt-0.5 text-xs text-amber-800 dark:text-amber-200/90">
                  Vocabulary, Grammar, Reading, Placement Check, Learning Path, and local Writing/Speaking drafts all work without any API key. To preview mentor dialogue formatting without live AI, you may toggle Sample Demo Preview below.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDemoModeEnabled((v) => !v)}
              className={`min-h-[44px] shrink-0 rounded-xl border px-4 py-2 text-xs font-semibold transition whitespace-nowrap ${
                demoModeEnabled
                  ? 'border-amber-700 bg-amber-700 text-white dark:border-amber-500 dark:bg-amber-600'
                  : 'border-amber-400 bg-white text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:bg-slate-900 dark:text-amber-100'
              }`}
            >
              {demoModeEnabled ? 'Disable Demo Preview' : 'Enable Sample Demo Preview'}
            </button>
          </div>
        </section>
      )}

      {/* Mode Selector */}
      <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        {MODES.map((m) => {
          const Icon = m.icon;
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`flex min-h-[44px] flex-col items-start rounded-2xl border p-3.5 text-left transition ${
                active
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-950 shadow-sm dark:border-indigo-400 dark:bg-indigo-950/60 dark:text-indigo-50'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={`h-4 w-4 ${
                    active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                  }`}
                />
                <span className="text-sm font-bold">{m.label}</span>
              </div>
              <span className="mt-1 text-xs text-slate-500 dark:text-slate-400">{m.desc}</span>
            </button>
          );
        })}
      </section>

      {/* Topic Selector for Conversation Mode */}
      {mode === 'conversation' && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Topic:
            </span>
            {CONVERSATION_TOPICS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTopic(t)}
                className={`min-h-[36px] rounded-xl px-3 py-1.5 text-xs font-semibold transition whitespace-nowrap ${
                  topic === t
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Main Conversation Container */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Active Mode: <span className="font-semibold text-slate-900 dark:text-slate-100">{MODES.find((m) => m.id === mode)?.label}</span>
            {' · '}
            Level <span className="font-semibold text-slate-900 dark:text-slate-100">{practiceLevel}</span>
            {' · '}
            {explanationLanguage === 'ru' ? 'EN + Russian notes' : 'English only'}
          </div>
          <div className="flex items-center gap-2">
            {history.some((m) => m.role === 'user') && (
              <button
                type="button"
                onClick={handleRetryLast}
                disabled={isSending}
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry last</span>
              </button>
            )}
            {history.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  onSetHistory([]);
                  setErrorBanner(null);
                }}
                className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 text-xs font-semibold text-slate-600 transition hover:bg-rose-50 hover:text-rose-700 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-rose-950/40 dark:hover:text-rose-300"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear chat</span>
              </button>
            )}
          </div>
        </div>

        {/* Message List */}
        <div
          ref={scrollRef}
          className="max-h-[430px] min-h-[280px] space-y-4 overflow-y-auto bg-slate-50/60 p-4 sm:p-5 dark:bg-slate-950/40"
        >
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MentorMascot state={mascotState} size="lg" />
              <h3 className="mt-3 text-base font-bold text-slate-900 dark:text-slate-100">
                Start a focused {practiceLevel} session
              </h3>
              <p className="mt-1 max-w-md text-sm text-slate-600 dark:text-slate-400">
                Ask a grammar question, practice real conversation on {topic.toLowerCase()}, check vocabulary collocations, or request a short quiz.
              </p>
              <div className="mt-5 flex max-w-2xl flex-wrap justify-center gap-2">
                {MENTOR_MODE_SUGGESTIONS[mode].map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void sendMessage(suggestion)}
                    className="min-h-[44px] rounded-xl border border-indigo-200 bg-white px-3.5 py-2 text-left text-xs font-medium text-slate-700 shadow-xs transition hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-slate-800"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            history.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && <MentorMascot state="ready" size="sm" className="mt-1" />}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
                      isUser
                        ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white shadow-xs'
                        : 'border border-slate-200 bg-white text-slate-800 shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100'
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between gap-4 text-[11px] opacity-75">
                      <span className="font-semibold">
                        {isUser
                          ? 'You'
                          : msg.isDemoPreview
                            ? 'AI Mentor (Sample Demo Preview)'
                            : 'WordPath AI Mentor'}
                      </span>
                      <span className="tabular-nums">{formatTime(msg.timestamp)}</span>
                    </div>
                    <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                    {!isUser && (
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => void handleCopy(msg.id, msg.content)}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="h-3 w-3 text-teal-600" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {isSending && (
            <div className="flex items-center gap-3">
              <MentorMascot state="thinking" size="sm" />
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                <span className="inline-flex items-center gap-1.5">
                  <span>WordPath Mentor is thinking</span>
                  <span className="tracking-widest">...</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Suggested follow-ups when conversation exists */}
        {history.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-200 bg-white px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900">
            <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Try:
            </span>
            {MENTOR_MODE_SUGGESTIONS[mode].map((s) => (
              <button
                key={s}
                type="button"
                disabled={isSending}
                onClick={() => setInput(s)}
                className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                {s.length > 52 ? `${s.slice(0, 52)}...` : s}
              </button>
            ))}
          </div>
        )}

        {/* Error Alert */}
        {errorBanner && (
          <div
            role="alert"
            className="flex items-center gap-2 border-t border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/50 dark:text-rose-200"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorBanner}</span>
          </div>
        )}

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void sendMessage();
          }}
          className="border-t border-slate-200 bg-white p-3 sm:p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <label htmlFor="ai-mentor-input" className="sr-only">
              Message WordPath AI Mentor
            </label>
            <textarea
              id="ai-mentor-input"
              rows={2}
              maxLength={2000}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void sendMessage();
                }
              }}
              placeholder={
                mode === 'conversation'
                  ? `Write a reply in English about ${topic}...`
                  : 'Ask your question or paste an English sentence for feedback...'
              }
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-400"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-blue-700 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
            >
              <Send className="h-4 w-4" />
              <span>{isSending ? 'Sending...' : 'Send'}</span>
            </button>
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">
            Press Enter to send · Shift+Enter for new line · Only tutoring messages are sent (private IB notes stay local).
          </p>
        </form>
      </section>
    </div>
  );
};
