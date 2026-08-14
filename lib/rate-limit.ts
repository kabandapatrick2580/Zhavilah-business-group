// A small fixed-window limiter held in module memory.
//
// Serverless instances are per-region and recycled, so this is not a global
// guarantee — a determined flood spread across cold starts gets through. It is
// here to stop the ordinary case: one script hammering one endpoint on one warm
// instance. Combined with the honeypot that covers the traffic this site sees.
// Move to a shared store (Upstash, Vercel KV) only if abuse actually shows up.

type Window = { count: number; resetAt: number };

const windows = new Map<string, Window>();

// Bounds the map so a stream of unique IPs can't grow it without limit.
const MAX_TRACKED = 5000;

export type RateLimitResult = {
  allowed: boolean;
  /** Seconds until the caller may retry. Only meaningful when blocked. */
  retryAfter: number;
};

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const existing = windows.get(key);

  if (!existing || now >= existing.resetAt) {
    if (windows.size >= MAX_TRACKED) sweep(now);
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }

  if (existing.count >= limit) {
    return { allowed: false, retryAfter: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count += 1;
  return { allowed: true, retryAfter: 0 };
}

function sweep(now: number) {
  for (const [key, window] of windows) {
    if (now >= window.resetAt) windows.delete(key);
  }
  // Every window is still live: drop the oldest to keep the map bounded.
  if (windows.size >= MAX_TRACKED) {
    const oldest = windows.keys().next();
    if (!oldest.done) windows.delete(oldest.value);
  }
}

/**
 * Best-effort client identity. Behind Vercel's proxy `x-forwarded-for` is set
 * by the platform; running locally it is absent, so all callers share one
 * bucket, which is fine for a limiter that only needs to blunt bursts.
 */
export function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}
