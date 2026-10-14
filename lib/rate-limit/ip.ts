import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const memoryBuckets = new Map<string, { count: number; reset: number }>();

function isProduction(): boolean {
  return process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
}

function hasUpstash(): boolean {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

function getLimiter(prefix: string, limit: number, windowSec: number): Ratelimit | null {
  if (!hasUpstash()) return null;
  const redis = Redis.fromEnv();
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSec} s`),
    prefix: `crescent:${prefix}`,
  });
}

async function memoryLimit(key: string, limit: number, windowMs: number): Promise<boolean> {
  const now = Date.now();
  const row = memoryBuckets.get(key);
  if (!row || now > row.reset) {
    memoryBuckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  if (row.count >= limit) return false;
  row.count += 1;
  return true;
}

export async function checkIpRateLimit(
  prefix: "contact" | "ai",
  ip: string,
): Promise<{ ok: boolean; reason?: string }> {
  const limits = prefix === "ai" ? { limit: 20, windowSec: 3600 } : { limit: 5, windowSec: 3600 };

  const limiter = getLimiter(prefix, limits.limit, limits.windowSec);
  if (limiter) {
    const { success } = await limiter.limit(ip);
    return success ? { ok: true } : { ok: false, reason: "rate_limit" };
  }

  if (isProduction()) {
    return { ok: false, reason: "rate_limit_unconfigured" };
  }

  const ok = await memoryLimit(`${prefix}:${ip}`, limits.limit, limits.windowSec * 1000);
  return ok ? { ok: true } : { ok: false, reason: "rate_limit" };
}

export function getClientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  return "unknown";
}
