import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  RotateCcw,
  Search,
  Volume2
} from 'lucide-react';
import { VOCAB_CATEGORIES, VOCABULARY_WORDS } from '../data/vocabulary';
import { formatIntervalLabel } from '../hooks/useWordPathState';
import {
  CEFRLevel,
  ReviewRating,
  VocabCategory,
  VocabWord,
  WordProgress
} from '../types/wordpath';
import { speakEnglish } from '../utils/speech';

interface VocabularyViewProps {
  wordProgress: Record<string, WordProgress>;
  onRateWord: (wordId: string, rating: ReviewRating) => void;
  onToggleLearned: (wordId: string) => void;
}

type StudyMode = 'flashcards' | 'due' | 'directory';
type StatusFilter = 'all' | 'due' | 'mastered' | 'learning' | 'new';

export const VocabularyView: React.FC<VocabularyViewProps> = ({
  wordProgress,
  onRateWord,
  onToggleLearned
}) => {
  const [studyMode, setStudyMode] = useState<StudyMode>('flashcards');
  const [selectedCategory, setSelectedCategory] = useState<'All' | VocabCategory>('All');
  const [levelFilter, setLevelFilter] = useState<'All' | CEFRLevel>('All');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cardIndex, setCardIndex] = useState(0);
  const [hasRevealedCurrent, setHasRevealedCurrent] = useState(false);
  const [revealedDirectoryIds, setRevealedDirectoryIds] = useState<Record<string, boolean>>({});

  const now = Date.now();

  const dueCount = useMemo(
    () =>
      VOCABULARY_WORDS.filter((w) => {
        const wp = wordProgress[w.id];
        return wp && wp.status !== 'new' && wp.nextReviewAt <= now;
      }).length,
    [wordProgress, now]
  );

  const filteredWords = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return VOCABULARY_WORDS.filter((word) => {
      const wp = wordProgress[word.id];
      const status = wp?.status ?? 'new';
      const isDue = Boolean(wp && wp.status !== 'new' && wp.nextReviewAt <= now);

      if (studyMode === 'due' && !isDue) return false;
      if (selectedCategory !== 'All' && word.category !== selectedCategory) return false;
      if (levelFilter !== 'All' && word.level !== levelFilter) return false;

      if (statusFilter === 'due' && !isDue) return false;
      if (statusFilter === 'mastered' && status !== 'mastered') return false;
      if (statusFilter === 'learning' && status !== 'learning') return false;
      if (statusFilter === 'new' && status !== 'new') return false;

      if (q) {
        const matches =
          word.term.toLowerCase().includes(q) ||
          word.definition.toLowerCase().includes(q) ||
          word.russianTranslation.toLowerCase().includes(q) ||
          word.category.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [studyMode, selectedCategory, levelFilter, statusFilter, searchQuery, wordProgress, now]);

  useEffect(() => {
    setCardIndex(0);
    setHasRevealedCurrent(false);
  }, [studyMode, selectedCategory, levelFilter, statusFilter, searchQuery]);

  const safeIndex =
    filteredWords.length > 0 ? Math.min(cardIndex, filteredWords.length - 1) : 0;
  const currentWord: VocabWord | undefined = filteredWords[safeIndex];
  const currentProgress = currentWord ? wordProgress[currentWord.id] : undefined;

  const goNext = useCallback(() => {
    if (filteredWords.length === 0) return;
    setCardIndex((prev) => (prev + 1) % filteredWords.length);
    setHasRevealedCurrent(false);
  }, [filteredWords.length]);

  const goPrev = useCallback(() => {
    if (filteredWords.length === 0) return;
    setCardIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
    setHasRevealedCurrent(false);
  }, [filteredWords.length]);

  const handleRate = useCallback(
    (rating: ReviewRating) => {
      if (!currentWord) return;
      if (rating === 'got_it' && !hasRevealedCurrent) return;
      onRateWord(currentWord.id, rating);
      setHasRevealedCurrent(false);
      if (filteredWords.length > 1) {
        setCardIndex((prev) => (prev + 1) % filteredWords.length);
      }
    },
    [currentWord, hasRevealedCurrent, onRateWord, filteredWords.length]
  );

  useEffect(() => {
    if (studyMode === 'directory') return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setHasRevealedCurrent((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
      } else if (e.key === '1') {
        handleRate('again');
      } else if (e.key === '2') {
        handleRate('hard');
      } else if (e.key === '3' && hasRevealedCurrent) {
        handleRate('got_it');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [studyMode, goNext, goPrev, handleRate, hasRevealedCurrent]);

  const toggleDirectoryReveal = (id: string) => {
    setRevealedDirectoryIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Header & Study Mode Tabs */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Vocabulary Studio
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {VOCABULARY_WORDS.length} curated B1–B2 words across {VOCAB_CATEGORIES.length} topics with active-recall gating, collocations, and spaced review.
            </p>
          </div>

          <div className="inline-flex flex-wrap rounded-xl border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
            {(
              [
                { id: 'flashcards', label: 'Flashcards' },
                { id: 'due', label: `Due (${dueCount})` },
                { id: 'directory', label: 'Word Directory' }
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStudyMode(tab.id)}
                className={`min-h-[40px] rounded-lg px-3.5 text-xs font-semibold transition whitespace-nowrap ${
                  studyMode === tab.id
                    ? 'bg-white text-indigo-700 shadow-xs dark:bg-slate-900 dark:text-indigo-300'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4 dark:border-slate-800">
          <div className="grid gap-3 md:grid-cols-3">
            <div className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search English word, definition, or Russian meaning..."
                className="min-h-[42px] w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center gap-2">
              {(['All', 'B1', 'B2'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setLevelFilter(lvl)}
                  className={`min-h-[42px] flex-1 rounded-xl border text-xs font-semibold transition ${
                    levelFilter === lvl
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-800 dark:border-indigo-400 dark:bg-indigo-950/60 dark:text-indigo-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(['All', ...VOCAB_CATEGORIES] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[34px] rounded-xl px-3 text-xs font-semibold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Status:</span>
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'new', label: 'New' },
                { id: 'learning', label: 'Learning' },
                { id: 'due', label: 'Due Now' },
                { id: 'mastered', label: 'Mastered' }
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStatusFilter(s.id)}
                className={`min-h-[32px] rounded-lg px-2.5 font-semibold transition ${
                  statusFilter === s.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {s.label}
              </button>
            ))}
            <span className="ml-auto text-slate-500 tabular-nums dark:text-slate-400">
              Showing {filteredWords.length} of {VOCABULARY_WORDS.length}
            </span>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      {filteredWords.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-800 dark:bg-slate-900">
          <p className="text-base font-bold text-slate-900 dark:text-slate-100">
            {studyMode === 'due'
              ? 'No vocabulary cards are due right now.'
              : 'No words match your current filter.'}
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {studyMode === 'due'
              ? 'Switch to Flashcards to study new B1–B2 words or review any category.'
              : 'Clear your search query or reset filters to see the full 120-word collection.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setStudyMode('flashcards');
              setSelectedCategory('All');
              setLevelFilter('All');
              setStatusFilter('all');
              setSearchQuery('');
            }}
            className="mt-4 min-h-[44px] rounded-xl bg-indigo-600 px-5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Reset Filters
          </button>
        </section>
      ) : studyMode === 'directory' ? (
        <section className="grid gap-4 md:grid-cols-2">
          {filteredWords.map((word) => {
            const wp = wordProgress[word.id];
            const isLearned = wp?.status === 'mastered';
            const isRevealed = Boolean(revealedDirectoryIds[word.id]);
            return (
              <div
                key={word.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        {word.category} · {word.level} · {word.partOfSpeech}
                      </p>
                      <h3 className="mt-0.5 text-lg font-bold text-slate-900 dark:text-slate-100">
                        {word.term}{' '}
                        <span className="font-mono text-xs font-normal text-slate-500 dark:text-slate-400">
                          {word.ipa}
                        </span>
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => speakEnglish(`${word.term}. ${word.exampleSentence}`)}
                      aria-label={`Pronounce ${word.term}`}
                      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                    {word.definition}
                  </p>
                  <p className="mt-1.5 text-xs italic text-slate-500 dark:text-slate-400">
                    &ldquo;{word.exampleSentence}&rdquo;
                  </p>

                  <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
                    <span>
                      <strong className="text-slate-800 dark:text-slate-200">Collocations:</strong>{' '}
                      {word.collocations.join(' · ')}
                    </span>
                  </div>

                  {isRevealed ? (
                    <div className="mt-3 rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-900 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-200">
                      Russian: {word.russianTranslation}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleDirectoryReveal(word.id)}
                      className="mt-3 inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Reveal translation to unlock mastery</span>
                    </button>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">
                    {formatIntervalLabel(wp)}
                  </span>
                  <button
                    type="button"
                    disabled={!isLearned && !isRevealed}
                    onClick={() => onToggleLearned(word.id)}
                    className={`min-h-[38px] rounded-lg px-3 font-semibold transition ${
                      isLearned
                        ? 'bg-teal-100 text-teal-900 hover:bg-teal-200 dark:bg-teal-950 dark:text-teal-200'
                        : isRevealed
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                    }`}
                  >
                    {isLearned ? 'Mastered ✓' : 'Mark learned'}
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        currentWord && (
          <section className="mx-auto max-w-2xl space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7 dark:border-slate-800 dark:bg-slate-900">
              {/* Top Meta & Audio */}
              <div className="flex items-center justify-between gap-3">
                <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {currentWord.category} · {currentWord.level} · {currentWord.partOfSpeech}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-500 tabular-nums dark:text-slate-400">
                    {safeIndex + 1} / {filteredWords.length}
                  </span>
                  <button
                    type="button"
                    onClick={() => speakEnglish(currentWord.term)}
                    aria-label={`Pronounce ${currentWord.term}`}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Word & Definition */}
              <div className="mt-5">
                <h3 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-100">
                  {currentWord.term}
                </h3>
                <p className="mt-1 font-mono text-sm text-slate-500 dark:text-slate-400">
                  {currentWord.ipa}
                </p>

                <p className="mt-4 text-base leading-relaxed text-slate-700 dark:text-slate-200">
                  {currentWord.definition}
                </p>

                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300">
                  <div className="flex items-start justify-between gap-2">
                    <p className="italic">&ldquo;{currentWord.exampleSentence}&rdquo;</p>
                    <button
                      type="button"
                      onClick={() => speakEnglish(currentWord.exampleSentence)}
                      aria-label="Listen to example sentence"
                      className="shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid gap-2 text-xs text-slate-600 sm:grid-cols-2 dark:text-slate-400">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Synonyms: </span>
                    {currentWord.synonyms.join(', ')}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">Collocations: </span>
                    {currentWord.collocations.join(' · ')}
                  </div>
                </div>
              </div>

              {/* Active Recall Translation Gate */}
              <div className="mt-6">
                {!hasRevealedCurrent ? (
                  <button
                    type="button"
                    onClick={() => setHasRevealedCurrent(true)}
                    className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50/70 px-4 text-sm font-semibold text-indigo-800 transition hover:bg-indigo-100 dark:border-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-200"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Recall meaning, then click to reveal translation (Space)</span>
                  </button>
                ) : (
                  <div className="rounded-xl border border-teal-200 bg-teal-50 p-4 dark:border-teal-800 dark:bg-teal-950/50">
                    <p className="text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-400">
                      Russian Translation
                    </p>
                    <p className="mt-1 text-lg font-bold text-teal-950 dark:text-teal-100">
                      {currentWord.russianTranslation}
                    </p>
                  </div>
                )}
              </div>

              {/* Spaced Review Heuristic Actions */}
              <div className="mt-5 grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleRate('again')}
                  className="flex min-h-[52px] flex-col items-center justify-center rounded-xl border border-rose-200 bg-rose-50 px-2 py-2 text-rose-800 transition hover:bg-rose-100 dark:border-rose-800/70 dark:bg-rose-950/40 dark:text-rose-200"
                >
                  <span className="inline-flex items-center gap-1 text-sm font-bold">
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Again</span>
                  </span>
                  <span className="text-[11px] opacity-80">This session</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRate('hard')}
                  className="flex min-h-[52px] flex-col items-center justify-center rounded-xl border border-amber-200 bg-amber-50 px-2 py-2 text-amber-900 transition hover:bg-amber-100 dark:border-amber-800/70 dark:bg-amber-950/40 dark:text-amber-200"
                >
                  <span className="inline-flex items-center gap-1 text-sm font-bold">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Hard</span>
                  </span>
                  <span className="text-[11px] opacity-80">10 min</span>
                </button>

                <button
                  type="button"
                  disabled={!hasRevealedCurrent}
                  onClick={() => handleRate('got_it')}
                  className={`flex min-h-[52px] flex-col items-center justify-center rounded-xl border px-2 py-2 transition ${
                    hasRevealedCurrent
                      ? 'border-teal-600 bg-teal-600 text-white hover:bg-teal-700'
                      : 'cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-500'
                  }`}
                >
                  <span className="inline-flex items-center gap-1 text-sm font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Got it</span>
                  </span>
                  <span className="text-[11px] opacity-85">
                    {hasRevealedCurrent ? 'Advance 1d–14d' : 'Reveal first'}
                  </span>
                </button>
              </div>

              {/* Navigation & Schedule Label */}
              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs dark:border-slate-800">
                <button
                  type="button"
                  onClick={goPrev}
                  className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-slate-200 px-3 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Prev</span>
                </button>

                <span className="text-slate-500 dark:text-slate-400">
                  {formatIntervalLabel(currentProgress)}
                </span>

                <button
                  type="button"
                  onClick={goNext}
                  className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-slate-200 px-3 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              Keyboard: Space = Reveal translation · ←/→ = Navigate · 1/2/3 = Rate (interval heuristic: 10m → 1d → 3d → 7d → 14d).
            </p>
          </section>
        )
      )}
    </div>
  );
};
