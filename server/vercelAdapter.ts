import type { IncomingMessage } from 'node:http';
import { AIServiceError } from './aiMentorService.js';

export interface VercelRequestLike {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
  socket?: IncomingMessage['socket'];
  [Symbol.asyncIterator]?: () => AsyncIterator<Buffer | string>;
}

export interface VercelResponseLike {
  statusCode?: number;
  setHeader(name: string, value: string | number | readonly string[]): unknown;
  status?(code: number): VercelResponseLike;
  json?(body: unknown): unknown;
  end(chunk?: unknown): unknown;
}

const MAX_BODY_BYTES = 64 * 1024;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 25;

const ipBuckets = new Map<string, number[]>();

export function sendJson(res: VercelResponseLike, statusCode: number, payload: unknown): void {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.status(statusCode);
    res.json(payload);
    return;
  }
  res.statusCode = statusCode;
  res.end(JSON.stringify(payload));
}

export function sendEmpty(res: VercelResponseLike, statusCode: number): void {
  res.setHeader('Cache-Control', 'no-store');
  if (typeof res.status === 'function') {
    res.status(statusCode);
  } else {
    res.statusCode = statusCode;
  }
  res.end();
}

export function getClientIp(req: VercelRequestLike): string {
  const forwarded = req.headers?.['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim().length > 0) {
    return forwarded.split(',')[0].trim();
  }
  if (Array.isArray(forwarded) && forwarded.length > 0 && forwarded[0]) {
    return forwarded[0].split(',')[0].trim();
  }
  const realIp = req.headers?.['x-real-ip'];
  if (typeof realIp === 'string' && realIp.trim().length > 0) {
    return realIp.trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (ipBuckets.size > 1000) {
    for (const [key, list] of ipBuckets.entries()) {
      const fresh = list.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
      if (fresh.length === 0) {
        ipBuckets.delete(key);
      } else {
        ipBuckets.set(key, fresh);
      }
    }
  }

  const timestamps = (ipBuckets.get(ip) || []).filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    ipBuckets.set(ip, timestamps);
    return true;
  }
  timestamps.push(now);
  ipBuckets.set(ip, timestamps);
  return false;
}

async function readStreamBody(req: VercelRequestLike): Promise<string> {
  if (typeof req[Symbol.asyncIterator] !== 'function') {
    return '';
  }

  const chunks: Buffer[] = [];
  let totalBytes = 0;

  for await (const chunk of req as AsyncIterable<Buffer | string>) {
    const buf = typeof chunk === 'string' ? Buffer.from(chunk, 'utf8') : chunk;
    totalBytes += buf.byteLength;
    if (totalBytes > MAX_BODY_BYTES) {
      throw new AIServiceError('Request body is too large (max 64KB).', 413, 'PAYLOAD_TOO_LARGE');
    }
    chunks.push(buf);
  }

  return Buffer.concat(chunks).toString('utf8');
}

export async function parseJsonBody(req: VercelRequestLike): Promise<unknown> {
  const contentLengthHeader = req.headers?.['content-length'];
  const contentLength =
    typeof contentLengthHeader === 'string' ? Number(contentLengthHeader) : Number.NaN;
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    throw new AIServiceError('Request body is too large (max 64KB).', 413, 'PAYLOAD_TOO_LARGE');
  }

  let rawBody: unknown;
  try {
    rawBody = req.body;
  } catch {
    throw new AIServiceError('Request body must be valid JSON.', 400, 'INVALID_JSON');
  }

  if (rawBody === undefined) {
    const rawText = await readStreamBody(req);
    if (!rawText.trim()) return {};
    try {
      return JSON.parse(rawText);
    } catch {
      throw new AIServiceError('Request body must be valid JSON.', 400, 'INVALID_JSON');
    }
  }

  if (rawBody === null) {
    return {};
  }

  if (typeof rawBody === 'string') {
    if (Buffer.byteLength(rawBody, 'utf8') > MAX_BODY_BYTES) {
      throw new AIServiceError('Request body is too large (max 64KB).', 413, 'PAYLOAD_TOO_LARGE');
    }
    if (!rawBody.trim()) return {};
    try {
      return JSON.parse(rawBody);
    } catch {
      throw new AIServiceError('Request body must be valid JSON.', 400, 'INVALID_JSON');
    }
  }

  if (Buffer.isBuffer(rawBody)) {
    if (rawBody.byteLength > MAX_BODY_BYTES) {
      throw new AIServiceError('Request body is too large (max 64KB).', 413, 'PAYLOAD_TOO_LARGE');
    }
    const text = rawBody.toString('utf8');
    if (!text.trim()) return {};
    try {
      return JSON.parse(text);
    } catch {
      throw new AIServiceError('Request body must be valid JSON.', 400, 'INVALID_JSON');
    }
  }

  return rawBody;
}

export function handleEndpointError(
  res: VercelResponseLike,
  err: unknown,
  fallbackMessage: string
): void {
  if (err instanceof AIServiceError) {
    sendJson(res, err.statusCode, {
      errorCode: err.errorCode,
      message: err.message
    });
    return;
  }
  sendJson(res, 500, {
    errorCode: 'INTERNAL_ERROR',
    message: fallbackMessage
  });
}
