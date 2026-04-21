// Simple in-memory sliding-window rate limiter.
// Works within a single Vercel function instance.
// Good enough for a small site — replace with Upstash Redis for multi-instance accuracy.

declare global {
  // eslint-disable-next-line no-var
  var _rateLimitStore: Map<string, number[]> | undefined;
}

function getStore(): Map<string, number[]> {
  if (!globalThis._rateLimitStore) {
    globalThis._rateLimitStore = new Map();
  }
  return globalThis._rateLimitStore;
}

/**
 * Returns true if the request should be blocked.
 * @param key      Unique key (e.g. "trip-planner:1.2.3.4")
 * @param limit    Max allowed requests in the window
 * @param windowMs Window size in milliseconds
 */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const store = getStore();
  const now = Date.now();
  const cutoff = now - windowMs;

  const hits = (store.get(key) ?? []).filter((t) => t > cutoff);
  if (hits.length >= limit) return true;

  hits.push(now);
  store.set(key, hits);

  // Prune old keys every ~500 calls to prevent unbounded growth
  if (Math.random() < 0.002) {
    for (const [k, ts] of store) {
      if (ts.every((t) => t <= cutoff)) store.delete(k);
    }
  }

  return false;
}

/** Extract a best-effort client IP from a Next.js request */
export function getClientIp(req: Request): string {
  const headers = req instanceof Request ? req.headers : (req as { headers: Headers }).headers;
  return (
    headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    headers.get('x-real-ip') ??
    'unknown'
  );
}
