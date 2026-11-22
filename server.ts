import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import {
  AIServiceError,
  activeAIProvider,
  getConfiguredModelName,
  isAIConfigured,
  validateMentorRequest,
  validateWritingFeedbackRequest
} from './server/aiMentorService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 25;

const ipBuckets = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (ipBuckets.get(ip) || []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    ipBuckets.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  ipBuckets.set(ip, timestamps);
  return false;
}

export async function startServer() {
  const app = express();
  app.set('trust proxy', 1);
  app.use(express.json({ limit: '64kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      aiConfigured: isAIConfigured(),
      model: getConfiguredModelName()
    });
  });

  app.post('/api/ai-mentor', async (req, res) => {
    const clientIp = req.ip || 'unknown';
    if (isRateLimited(clientIp)) {
      res.status(429).json({
        errorCode: 'RATE_LIMITED',
        message: 'Too many requests in one minute. Please pause briefly and try again.'
      });
      return;
    }

    try {
      const validated = validateMentorRequest(req.body);
      const result = await activeAIProvider.generateMentorReply(validated);
      res.json(result);
    } catch (err) {
      if (err instanceof AIServiceError) {
        res.status(err.statusCode).json({
          errorCode: err.errorCode,
          message: err.message
        });
        return;
      }
      res.status(500).json({
        errorCode: 'INTERNAL_ERROR',
        message: 'Unexpected server error while contacting AI Mentor.'
      });
    }
  });

  app.post('/api/writing-feedback', async (req, res) => {
    const clientIp = req.ip || 'unknown';
    if (isRateLimited(clientIp)) {
      res.status(429).json({
        errorCode: 'RATE_LIMITED',
        message: 'Too many requests in one minute. Please pause briefly and try again.'
      });
      return;
    }

    try {
      const validated = validateWritingFeedbackRequest(req.body);
      const result = await activeAIProvider.generateWritingFeedback(validated);
      res.json(result);
    } catch (err) {
      if (err instanceof AIServiceError) {
        res.status(err.statusCode).json({
          errorCode: err.errorCode,
          message: err.message
        });
        return;
      }
      res.status(500).json({
        errorCode: 'INTERNAL_ERROR',
        message: 'Unexpected server error while generating feedback.'
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WordPath server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start WordPath server:', err);
  process.exit(1);
});
