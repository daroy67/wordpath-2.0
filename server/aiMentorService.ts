import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

export type MentorMode = 'conversation' | 'grammar' | 'vocabulary' | 'writing' | 'quiz';
export type TargetLevel = 'B1' | 'B2';
export type ExplanationLang = 'en' | 'ru';

export interface MentorChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface MentorReplyRequest {
  mode: MentorMode;
  level: TargetLevel;
  explanationLanguage: ExplanationLang;
  topic?: string;
  messages: MentorChatTurn[];
}

export interface MentorReplyResponse {
  reply: string;
  mode: MentorMode;
  model: string;
  timestamp: number;
}

export interface WritingFeedbackRequest {
  kind: 'writing' | 'speaking_transcript';
  taskType: string;
  promptTitle: string;
  level: TargetLevel;
  explanationLanguage: ExplanationLang;
  text: string;
}

export interface GrammarCorrectionItem {
  original: string;
  corrected: string;
  explanation: string;
}

export interface VocabularySuggestionItem {
  original: string;
  suggestion: string;
  reason: string;
}

export interface StructuredWritingFeedback {
  overallSummary: string;
  strengths: string[];
  grammarCorrections: GrammarCorrectionItem[];
  vocabularySuggestions: VocabularySuggestionItem[];
  clarityTips: string[];
  nextStep: string;
}

export interface WritingFeedbackResponse {
  feedback: StructuredWritingFeedback;
  model: string;
  timestamp: number;
}

export class AIServiceError extends Error {
  statusCode: number;
  errorCode: string;

  constructor(message: string, statusCode: number, errorCode: string) {
    super(message);
    this.name = 'AIServiceError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

const VALID_MODES = new Set<MentorMode>([
  'conversation',
  'grammar',
  'vocabulary',
  'writing',
  'quiz'
]);

const MAX_MESSAGE_CHARS = 3000;
const MAX_WRITING_CHARS = 4500;
const MAX_HISTORY_TURNS = 20;
const AI_TIMEOUT_MS = 25000;

export function getConfiguredModelName(): string {
  const envModel = process.env.GEMINI_MODEL?.trim();
  return envModel && envModel.length > 0 ? envModel : 'gemini-4-hydrogen';
}

function supportsThinkingLevel(model: string): boolean {
  return model.startsWith('gemini-3') || model.startsWith('gemini-4');
}

export function isAIConfigured(): boolean {
  const key = process.env.GEMINI_API_KEY?.trim();
  return Boolean(key && key.length > 0 && key !== 'MY_GEMINI_API_KEY');
}

function buildSystemInstruction(
  mode: MentorMode,
  level: TargetLevel,
  explanationLanguage: ExplanationLang,
  topic?: string
): string {
  const languageDirective =
    explanationLanguage === 'ru'
      ? 'Keep English as the main target language for examples, prompts, dialogues, and practice questions, and write meta-explanations or error clarifications in clear Russian when helpful.'
      : 'Conduct the entire tutoring session in clear, natural English appropriate for the learner level.';

  const levelDirective =
    level === 'B1'
      ? 'Target CEFR B1 (Intermediate): use clear everyday and academic English, avoid overly dense idioms without explaining them, and keep feedback encouraging and structured.'
      : 'Target CEFR B2 (Upper-Intermediate): use natural, precise vocabulary, challenge the learner to use complex clauses and collocations, and refine nuance.';

  const coreRules = [
    'You are WordPath AI Mentor, a friendly, professional English teacher.',
    levelDirective,
    languageDirective,
    'Be concise, practical, and encouraging. Avoid unnecessarily long essays.',
    'Encourage active learning: guide the learner with hints or follow-up questions rather than dumping everything passively.',
    'Distinguish clearly between grammatical errors and optional stylistic improvements.',
    'Stay strictly within English language learning (conversation, grammar, vocabulary, reading, writing, and study advice). If a request is unrelated or unsafe, politely decline and guide back to English practice.'
  ];

  const topicLine = topic ? `Selected topic focus: ${topic}.` : '';

  switch (mode) {
    case 'conversation':
      return [
        ...coreRules,
        'Mode: English Conversation Partner.',
        topicLine,
        'Maintain a realistic, natural dialogue. Ask one engaging follow-up question in each turn to encourage complete answers. If the learner makes a noticeable grammar or word-choice mistake, gently note a natural correction in 1–2 short lines before continuing the conversation.'
      ]
        .filter(Boolean)
        .join('\n');

    case 'grammar':
      return [
        ...coreRules,
        'Mode: Grammar Tutor.',
        'When explaining a grammar topic, organize your response clearly with: (1) Simple rule, (2) When to use it, (3) Clear examples, (4) Common mistake vs. correction, and (5) One short practice question for the learner to answer. If the learner answers an exercise, check it and explain why.'
      ].join('\n');

    case 'vocabulary':
      return [
        ...coreRules,
        'Mode: Vocabulary Assistant.',
        'When helping with a word or phrase, provide: clear definition, CEFR B1/B2 note, natural example sentence, 2–3 synonyms, 2–3 common collocations, key word forms (noun/verb/adj/adv where applicable), and one short fill-in-the-blank or usage prompt.'
      ].join('\n');

    case 'writing':
      return [
        ...coreRules,
        'Mode: Writing Coach.',
        'Review the learner text constructively: highlight strengths, list specific grammar or word-choice corrections showing Original -> Improved with brief explanations, suggest vocabulary or clarity upgrades, and preserve the learner’s original voice and meaning. Do not silently rewrite the whole text without explaining changes.'
      ].join('\n');

    case 'quiz':
      return [
        ...coreRules,
        'Mode: Interactive Quiz Generator.',
        'Create focused B1–B2 practice questions (default 3–5 items unless requested otherwise). Wait for the learner’s answers before revealing the answer key unless they ask for answers immediately; when they submit answers, grade each item, explain mistakes, and give a short summary.'
      ].join('\n');
  }
}

export function validateMentorRequest(raw: unknown): MentorReplyRequest {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new AIServiceError('Invalid request body.', 400, 'INVALID_INPUT');
  }
  const body = raw as Record<string, unknown>;

  const mode = body.mode;
  if (typeof mode !== 'string' || !VALID_MODES.has(mode as MentorMode)) {
    throw new AIServiceError('Unsupported mentor mode.', 400, 'INVALID_MODE');
  }

  const level: TargetLevel = body.level === 'B2' ? 'B2' : 'B1';
  const explanationLanguage: ExplanationLang = body.explanationLanguage === 'ru' ? 'ru' : 'en';
  const topic =
    typeof body.topic === 'string' && body.topic.trim().length > 0
      ? body.topic.trim().slice(0, 80)
      : undefined;

  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    throw new AIServiceError('At least one message is required.', 400, 'EMPTY_MESSAGES');
  }

  const trimmedMessages: MentorChatTurn[] = [];
  for (const item of body.messages.slice(-MAX_HISTORY_TURNS)) {
    if (typeof item !== 'object' || item === null) continue;
    const turn = item as Record<string, unknown>;
    const role = turn.role === 'assistant' ? 'assistant' : turn.role === 'user' ? 'user' : null;
    const content = typeof turn.content === 'string' ? turn.content.trim() : '';
    if (!role || !content) continue;
    if (content.length > MAX_MESSAGE_CHARS) {
      throw new AIServiceError(
        `Messages must be ${MAX_MESSAGE_CHARS} characters or fewer.`,
        400,
        'MESSAGE_TOO_LONG'
      );
    }
    trimmedMessages.push({ role, content });
  }

  if (trimmedMessages.length === 0 || trimmedMessages[trimmedMessages.length - 1].role !== 'user') {
    throw new AIServiceError('The latest turn must be a non-empty user message.', 400, 'INVALID_TURN');
  }

  return {
    mode: mode as MentorMode,
    level,
    explanationLanguage,
    topic,
    messages: trimmedMessages
  };
}

export function validateWritingFeedbackRequest(raw: unknown): WritingFeedbackRequest {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    throw new AIServiceError('Invalid request body.', 400, 'INVALID_INPUT');
  }
  const body = raw as Record<string, unknown>;

  const kind = body.kind === 'speaking_transcript' ? 'speaking_transcript' : 'writing';
  const level: TargetLevel = body.level === 'B2' ? 'B2' : 'B1';
  const explanationLanguage: ExplanationLang = body.explanationLanguage === 'ru' ? 'ru' : 'en';
  const taskType =
    typeof body.taskType === 'string' && body.taskType.trim()
      ? body.taskType.trim().slice(0, 80)
      : 'Paragraph';
  const promptTitle =
    typeof body.promptTitle === 'string' && body.promptTitle.trim()
      ? body.promptTitle.trim().slice(0, 160)
      : 'Free practice';
  const text = typeof body.text === 'string' ? body.text.trim() : '';

  if (text.length < 12) {
    throw new AIServiceError(
      'Please enter at least a couple of sentences (minimum 12 characters) for feedback.',
      400,
      'TEXT_TOO_SHORT'
    );
  }
  if (text.length > MAX_WRITING_CHARS) {
    throw new AIServiceError(
      `Text must be ${MAX_WRITING_CHARS} characters or fewer.`,
      400,
      'TEXT_TOO_LONG'
    );
  }

  return {
    kind,
    taskType,
    promptTitle,
    level,
    explanationLanguage,
    text
  };
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(new AIServiceError('AI Mentor request timed out. Please try again.', 504, 'AI_TIMEOUT'));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function createGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new AIServiceError(
      'GEMINI_API_KEY is not configured on the server.',
      503,
      'AI_NOT_CONFIGURED'
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

function mapGeminiError(err: unknown): AIServiceError {
  if (err instanceof AIServiceError) return err;
  const msg = err instanceof Error ? err.message : 'Unexpected AI provider error.';
  const lower = msg.toLowerCase();
  console.error('[WordPath AI Service]', msg.slice(0, 220));

  if (
    lower.includes('api_key_invalid') ||
    lower.includes('permission_denied') ||
    lower.includes('403') ||
    lower.includes('api key should be set')
  ) {
    return new AIServiceError(
      'AI provider rejected the configured server API key. Please verify GEMINI_API_KEY in your server environment variables.',
      502,
      'AI_KEY_INVALID'
    );
  }
  if (lower.includes('resource_exhausted') || lower.includes('429')) {
    return new AIServiceError(
      'AI service rate limit reached. Please wait a moment and try again.',
      429,
      'AI_RATE_LIMITED'
    );
  }
  if (lower.includes('not_found') || lower.includes('404')) {
    return new AIServiceError(
      `Configured AI model (${getConfiguredModelName()}) was not found by the provider.`,
      502,
      'AI_MODEL_NOT_FOUND'
    );
  }
  return new AIServiceError(
    'Unable to reach the AI Mentor right now. Please try again shortly.',
    502,
    'AI_UPSTREAM_ERROR'
  );
}

export interface AIProvider {
  generateMentorReply(req: MentorReplyRequest): Promise<MentorReplyResponse>;
  generateWritingFeedback(req: WritingFeedbackRequest): Promise<WritingFeedbackResponse>;
}

class GeminiAIProvider implements AIProvider {
  async generateMentorReply(req: MentorReplyRequest): Promise<MentorReplyResponse> {
    const ai = createGeminiClient();
    const model = getConfiguredModelName();
    const systemInstruction = buildSystemInstruction(
      req.mode,
      req.level,
      req.explanationLanguage,
      req.topic
    );

    const contents = req.messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            ...(supportsThinkingLevel(model)
              ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
              : {})
          }
        }),
        AI_TIMEOUT_MS
      );

      const replyText = response.text?.trim();
      if (!replyText) {
        throw new AIServiceError(
          'AI Mentor returned an empty response. Please retry.',
          502,
          'AI_EMPTY_RESPONSE'
        );
      }

      return {
        reply: replyText,
        mode: req.mode,
        model,
        timestamp: Date.now()
      };
    } catch (err) {
      throw mapGeminiError(err);
    }
  }

  async generateWritingFeedback(req: WritingFeedbackRequest): Promise<WritingFeedbackResponse> {
    const ai = createGeminiClient();
    const model = getConfiguredModelName();

    const langRule =
      req.explanationLanguage === 'ru'
        ? 'Write explanations, summary, and tips in clear Russian while keeping all corrected English sentences and vocabulary alternatives in English.'
        : 'Write all feedback in clear, encouraging English.';

    const kindNote =
      req.kind === 'speaking_transcript'
        ? 'Note: This is a speech-to-text transcript from spoken practice. Evaluate grammar, vocabulary, clarity, and phrasing in the transcript ONLY. Do not claim to evaluate acoustic pronunciation, accent, or intonation.'
        : 'Evaluate this written response for grammar accuracy, vocabulary range, sentence structure, and clarity while preserving the student’s original meaning and voice.';

    const systemInstruction = [
      'You are WordPath Writing & Speaking Coach.',
      `Target level: CEFR ${req.level}. Task type: ${req.taskType}. Topic: ${req.promptTitle}.`,
      kindNote,
      langRule,
      'Provide specific, actionable, honest feedback. If the text has no major grammar errors, keep grammarCorrections empty or offer subtle naturalness upgrades.'
    ].join('\n');

    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model,
          contents: `Student submission:\n\n${req.text}`,
          config: {
            systemInstruction,
            ...(supportsThinkingLevel(model)
              ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
              : {}),
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                overallSummary: {
                  type: Type.STRING,
                  description: '2-3 sentence constructive overall evaluation.'
                },
                strengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: '2-3 specific things the learner did well.'
                },
                grammarCorrections: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      original: { type: Type.STRING },
                      corrected: { type: Type.STRING },
                      explanation: { type: Type.STRING }
                    },
                    required: ['original', 'corrected', 'explanation']
                  }
                },
                vocabularySuggestions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      original: { type: Type.STRING },
                      suggestion: { type: Type.STRING },
                      reason: { type: Type.STRING }
                    },
                    required: ['original', 'suggestion', 'reason']
                  }
                },
                clarityTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                nextStep: {
                  type: Type.STRING,
                  description: 'One concrete next practice recommendation.'
                }
              },
              required: [
                'overallSummary',
                'strengths',
                'grammarCorrections',
                'vocabularySuggestions',
                'clarityTips',
                'nextStep'
              ]
            }
          }
        }),
        AI_TIMEOUT_MS
      );

      const jsonText = response.text?.trim();
      if (!jsonText) {
        throw new AIServiceError(
          'AI Coach returned an empty response. Please retry.',
          502,
          'AI_EMPTY_RESPONSE'
        );
      }

      const parsed = JSON.parse(jsonText) as StructuredWritingFeedback;
      if (!parsed || typeof parsed.overallSummary !== 'string') {
        throw new AIServiceError(
          'AI Coach returned an invalid feedback format. Please retry.',
          502,
          'AI_INVALID_JSON'
        );
      }

      return {
        feedback: {
          overallSummary: parsed.overallSummary,
          strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 5) : [],
          grammarCorrections: Array.isArray(parsed.grammarCorrections)
            ? parsed.grammarCorrections.slice(0, 8)
            : [],
          vocabularySuggestions: Array.isArray(parsed.vocabularySuggestions)
            ? parsed.vocabularySuggestions.slice(0, 6)
            : [],
          clarityTips: Array.isArray(parsed.clarityTips) ? parsed.clarityTips.slice(0, 5) : [],
          nextStep: typeof parsed.nextStep === 'string' ? parsed.nextStep : ''
        },
        model,
        timestamp: Date.now()
      };
    } catch (err) {
      throw mapGeminiError(err);
    }
  }
}

export const activeAIProvider: AIProvider = new GeminiAIProvider();
