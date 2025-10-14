// Simple rate limiting implementation for Edge Runtime compatibility
type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

// Simple in-memory cache for rate limiting
const tokenCache = new Map<string, { count: number; resetTime: number }>();

export function rateLimit(options: Options = {}) {
  const interval = options.interval || 60000; // 1 minute default
  const maxTokens = options.uniqueTokenPerInterval || 500;

  return {
    check: (request: Request, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const now = Date.now();
        const cached = tokenCache.get(token);

        // Clean up expired entries
        if (cached && now > cached.resetTime) {
          tokenCache.delete(token);
        }

        const current = tokenCache.get(token) || { count: 0, resetTime: now + interval };
        
        if (current.count >= limit) {
          return reject(new Error('Rate limit exceeded'));
        }

        current.count += 1;
        tokenCache.set(token, current);

        // Clean up old entries periodically
        if (tokenCache.size > maxTokens) {
          const entries = Array.from(tokenCache.entries());
          const toDelete = entries
            .filter(([_, value]) => now > value.resetTime)
            .slice(0, Math.floor(maxTokens / 2));
          
          toDelete.forEach(([key]) => tokenCache.delete(key));
        }

        return resolve();
      }),
  };
}