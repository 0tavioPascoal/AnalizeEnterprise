import type { NextRequest } from "next/server";

interface RateLimitOptions {
  key: string;
  limit: number;
  windowMs: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetAt: number;
}

const buckets = new Map<string, { count: number; resetAt: number }>();

export function getRequestIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("cf-connecting-ip") ??
    "unknown"
  );
}

export function checkRateLimit({
  key,
  limit,
  windowMs,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    const resetAt = now + windowMs;
    buckets.set(key, {
      count: 1,
      resetAt,
    });

    return {
      success: true,
      remaining: Math.max(0, limit - 1),
      resetAt,
    };
  }

  if (current.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;

  return {
    success: true,
    remaining: Math.max(0, limit - current.count),
    resetAt: current.resetAt,
  };
}
