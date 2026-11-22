import {
  getConfiguredModelName,
  isAIConfigured
} from '../../server/aiMentorService.ts';

interface NetlifyEvent {
  httpMethod?: string;
}

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-store'
};

export async function handler(event?: NetlifyEvent) {
  const method = event?.httpMethod ?? 'GET';
  if (method !== 'GET' && method !== 'HEAD') {
    return {
      statusCode: 405,
      headers: JSON_HEADERS,
      body: JSON.stringify({ errorCode: 'METHOD_NOT_ALLOWED', message: 'Use GET.' })
    };
  }

  return {
    statusCode: 200,
    headers: JSON_HEADERS,
    body: JSON.stringify({
      ok: true,
      aiConfigured: isAIConfigured(),
      model: getConfiguredModelName()
    })
  };
}
