import {
  AIServiceError,
  activeAIProvider,
  validateMentorRequest
} from '../../server/aiMentorService.ts';

interface NetlifyEvent {
  httpMethod: string;
  body: string | null;
  isBase64Encoded?: boolean;
}

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store'
};

function parseEventBody(event: NetlifyEvent): unknown {
  if (!event.body) return {};
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;
  try {
    return JSON.parse(raw);
  } catch {
    throw new AIServiceError('Request body must be valid JSON.', 400, 'INVALID_JSON');
  }
}

export async function handler(event: NetlifyEvent) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: JSON_HEADERS, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: JSON_HEADERS,
      body: JSON.stringify({ errorCode: 'METHOD_NOT_ALLOWED', message: 'Use POST.' })
    };
  }

  try {
    const parsedBody = parseEventBody(event);
    const validated = validateMentorRequest(parsedBody);
    const result = await activeAIProvider.generateMentorReply(validated);
    return {
      statusCode: 200,
      headers: JSON_HEADERS,
      body: JSON.stringify(result)
    };
  } catch (err) {
    if (err instanceof AIServiceError) {
      return {
        statusCode: err.statusCode,
        headers: JSON_HEADERS,
        body: JSON.stringify({ errorCode: err.errorCode, message: err.message })
      };
    }
    return {
      statusCode: 500,
      headers: JSON_HEADERS,
      body: JSON.stringify({
        errorCode: 'INTERNAL_ERROR',
        message: 'Unexpected server error while contacting AI Mentor.'
      })
    };
  }
}
