import {
  getConfiguredModelName,
  isAIConfigured
} from '../server/aiMentorService.js';
import {
  type VercelRequestLike,
  type VercelResponseLike,
  sendEmpty,
  sendJson
} from '../server/vercelAdapter.js';

export default async function handler(
  req: VercelRequestLike,
  res: VercelResponseLike
): Promise<void> {
  const method = req.method?.toUpperCase() || 'GET';

  if (method === 'OPTIONS') {
    sendEmpty(res, 204);
    return;
  }

  if (method !== 'GET' && method !== 'HEAD') {
    sendJson(res, 405, {
      errorCode: 'METHOD_NOT_ALLOWED',
      message: 'Use GET.'
    });
    return;
  }

  if (method === 'HEAD') {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    sendEmpty(res, 200);
    return;
  }

  sendJson(res, 200, {
    ok: true,
    aiConfigured: isAIConfigured(),
    model: getConfiguredModelName()
  });
}
