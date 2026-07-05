import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let ratelimitInstance: Ratelimit | null = null;

function getRatelimit() {
  if (ratelimitInstance) return ratelimitInstance;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    // Rate limiting is soft-disabled if not configured (e.g. local dev)
    return null;
  }

  ratelimitInstance = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(10, "60 s"), // 10 requests per minute per identifier
    analytics: true,
    prefix: "mubixlabs:ratelimit",
  });
  return ratelimitInstance;
}

/**
 * Returns { success: true } if the request should proceed.
 * Fails open (allows request) if Upstash isn't configured, so local dev isn't blocked.
 */
export async function checkRateLimit(identifier: string) {
  const rl = getRatelimit();
  if (!rl) return { success: true, limit: 0, remaining: 0 };
  return rl.limit(identifier);
}
