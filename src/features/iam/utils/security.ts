import { ValidationError } from '@/core/error/errors';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

/**
 * Basic in-memory rate limiter helper for server actions and routes.
 * Throws a ValidationError if the rate limit is exceeded.
 */
export function enforceRateLimit(key: string, limit = 5, windowMs = 60 * 1000): void {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record) {
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return;
  }

  if (now > record.resetTime) {
    // Window expired, reset
    record.count = 1;
    record.resetTime = now + windowMs;
    return;
  }

  record.count += 1;

  if (record.count > limit) {
    throw new ValidationError('Too many requests. Please try again later.');
  }
}
