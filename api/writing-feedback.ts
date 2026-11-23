import {
  activeAIProvider,
  validateWritingFeedbackRequest
} from '../server/aiMentorService.js';
import {
  type VercelRequestLike,
  type VercelResponseLike,
  getClientIp,
  handleEndpointError,
  isRateLimited,
  parseJsonBody,
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

  if (method !== 'POST') {
    sendJson(res, 405, {
      errorCode: 'METHOD_NOT_ALLOWED',
      message: 'Use POST.'
    });
    return;
  }

  if (isRateLimited(getClientIp(req))) {
    sendJson(res, 429, {
      errorCode: 'RATE_LIMITED',
      message: 'Too many requests in one minute. Please pause briefly and try again.'
    });
    return;
  }

  try {
    const parsedBody = await parseJsonBody(req);
    const validated = validateWritingFeedbackRequest(parsedBody);
    const result = await activeAIProvider.generateWritingFeedback(validated);
    sendJson(res, 200, result);
  } catch (err) {
    handleEndpointError(res, err, 'Unexpected server error while generating feedback.');
  }
}
