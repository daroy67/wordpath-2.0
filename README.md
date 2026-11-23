# WordPath 2.0 — Interactive B1–B2 English Learning Platform

**Build your English, one focused session at a time.**

WordPath 2.0 is a full-stack interactive English learning studio built for CEFR B1–B2 learners with React 19, TypeScript, Vite, Tailwind CSS v4, Express, and server-side Gemini AI integration (`@google/genai`). Every core study module operates offline via validated browser LocalStorage (`wordpath_state_v2`), while live AI tutoring and structured writing feedback connect cleanly through `/api/*` proxy endpoints when `GEMINI_API_KEY` is configured.

---

## Key Features

### Learning & Practice Modules (Works 100% Without Any API Key)
- **Dashboard & Daily Learning Plan**: Personalized pacing (`10`, `15`, or `20` estimated minutes/day synchronized via `DAILY_PLAN_CONFIG`: `3+4+3`, `5+6+4`, `7+8+5`), 7-day study activity bar chart, streak counter, and direct quick launch into next steps.
- **Vocabulary Studio (120 Words · 10 Topics)**: CEFR B1–B2 vocabulary cards with IPA pronunciation, plain-English definitions, Russian translations, contextual sentences, synonyms, collocations, search, topic/level/status filters, Web Speech audio, active-recall translation reveal gating before mastery, and a 3-button interval review scheduler (`Again`, `Hard` 10m, `Got it` 1d → 3d → 7d → 14d).
- **Grammar Workshops (12 Modules · 48 Questions)**: Clear rules, core pattern formulas, natural examples, common mistake contrasts, and instant rationale-backed 4-item quizzes.
- **Reading Room (8 Original Passages · 40 Questions)**: Programmatically verified word counts, Focus Reader mode, clickable inline glossary chips, Web Speech playback, MCQ + True/False comprehension checks.
- **Writing & Speaking Studio (Local Drafts & Timer)**: 6 writing task templates with live word counts and local draft storage, plus a Speaking timer with Web Speech Recognition live capture and editable transcript fallback.
- **Informal Placement Check (24 Questions + 12-Item Quick Mode)**: Skill breakdown across Vocabulary, Grammar, and Reading with module recommendations and an explicit non-official CEFR disclaimer.
- **Adaptive Learning Path**: Data-driven Strong Areas, Areas to Improve, Recommended Next Lessons, and Curriculum progress map.
- **Progress & Analytics + Settings**: Weekly activity chart, skill performance bars, 10-topic vocabulary breakdown, Light/Dark theme persistence, JSON backup export, and partitioned resets (`Reset Learning Progress` vs. `RESET ALL`-guarded full wipe).
- **IB MYP Personal Project Hub**: Separated Project Documentation section covering Criteria A–C, APA 7 citations, editable personal reflections (isolated from AI requests and learning resets), Markdown dossier export, Evidence Checklist, and Viva Q&A.

### Server-Side AI Features (Requires Server `GEMINI_API_KEY`)
- **WordPath AI Mentor (`POST /api/ai-mentor`)**: 5 interactive tutoring modes (Conversation Partner with 9 topics, Grammar Tutor, Vocabulary Assistant, Writing Coach, Quiz Generator), CEFR B1/B2 target selector, English or English + Russian explanations, Copy/Retry controls, animated friendly robot mascot, and an explicitly labeled `[Sample Demo Preview — Not Live AI]` preview toggle when no API key is configured.
- **AI Writing & Speaking Transcript Coach (`POST /api/writing-feedback`)**: Structured JSON review highlighting strengths, sentence corrections (`Original → Corrected + explanation`), vocabulary upgrades, clarity tips, and recommended next steps. Speaking transcript review honestly evaluates grammar, vocabulary, and clarity of the written transcript without claiming acoustic accent or pronunciation scoring.

---

## Local Setup & Scripts

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables (optional for offline modules, required for live AI Mentor)**
   Copy `.env.example` to `.env` and add your server-side key:
   ```env
   GEMINI_API_KEY="your-gemini-api-key"
   GEMINI_MODEL="gemini-4-hydrogen"
   PORT=3000
   ```
   Never expose `GEMINI_API_KEY` with a `VITE_` prefix or in client code.

3. **Run development server (Express + Vite middleware on port 3000)**
   ```bash
   npm run dev
   ```

4. **Type-check, test, and build for production**
   ```bash
   npm run lint
   npm test
   npm run build
   ```

5. **Run production build**
   ```bash
   NODE_ENV=production npm start
   ```

---

## Deploying to Vercel

The repository includes Vercel Serverless Functions in `api/` (`health.ts`, `ai-mentor.ts`, `writing-feedback.ts`) that handle `/api/health`, `/api/ai-mentor`, and `/api/writing-feedback` directly on Vercel.

1. Set `GEMINI_API_KEY` (and optionally `GEMINI_MODEL`, e.g. `gemini-4-hydrogen`) in **Vercel Project Settings → Environment Variables**.
2. Framework Preset: **Vite** (`npm run build`, output directory `dist`).
3. Redeploy after configuring environment variables so the serverless functions receive `GEMINI_API_KEY`.

---

## Data Persistence & Privacy

- All learner progress, drafts, speaking logs, mentor chat history, preferences, and IB Project Hub notes stay in browser `localStorage` under `wordpath_state_v2` (automatically migrating legacy `wordpath_state_v1` saves).
- IB Project Hub reflections are never transmitted to `/api/ai-mentor` or `/api/writing-feedback`.
- `npm run dev` validates API inputs (`max 3000/4500 chars`), enforces per-IP rate limiting (25 req/min), and enforces a 25-second timeout on model requests.
