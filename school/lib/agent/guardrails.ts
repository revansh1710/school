/**
 * Production Zero-Trust Guardrails for AI Agent
 * - In-memory Token-Bucket Rate Limiter per client IP
 * - Indirect Prompt Injection Sanitizer & Delimiter Enclosure
 * - Execution Budget Tracker
 * - Sanity Circuit Breaker with Stale Fallback
 */

// 1. Rate Limiting (Token Bucket per IP)
interface RateLimitRecord {
  tokens: number;
  lastRefill: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();
const MAX_TOKENS = 10; // Max 10 requests burst
const REFILL_RATE_MS = 60_000; // Refills every 60 seconds
const TOKENS_PER_REFILL = 10;

export function checkRateLimit(clientIp: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const record = rateLimitStore.get(clientIp) || {
    tokens: MAX_TOKENS,
    lastRefill: now,
  };

  // Refill tokens based on elapsed time
  const elapsed = now - record.lastRefill;
  if (elapsed >= REFILL_RATE_MS) {
    record.tokens = MAX_TOKENS;
    record.lastRefill = now;
  }

  if (record.tokens > 0) {
    record.tokens -= 1;
    rateLimitStore.set(clientIp, record);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  const retryAfterSeconds = Math.ceil((REFILL_RATE_MS - elapsed) / 1000);
  return { allowed: false, retryAfterSeconds: Math.max(1, retryAfterSeconds) };
}

// 2. Indirect Prompt Injection Defense
const SUSPICIOUS_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /you\s+are\s+now\s+(a|an)\s+/i,
  /system\s*prompt/i,
  /<\|im_start\|>/i,
  /<\|im_end\|>/i,
  /reveal\s+(the\s+)?(secret|token|api[_\s]?key|password)/i,
  /override\s+(all\s+)?rules/i,
];

export function sanitizeAndEncapsulateInput(rawInput: string): {
  sanitized: string;
  hasSuspiciousContent: boolean;
} {
  let hasSuspiciousContent = false;

  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(rawInput)) {
      hasSuspiciousContent = true;
      break;
    }
  }

  // Strip ASCII control characters and normalize
  const cleaned = rawInput
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .trim()
    .slice(0, 3000); // Enforce max input length to prevent token flood attacks

  // Wrap in strict untrusted delimiter boundary
  const encapsulated = `<untrusted_applicant_data>
${cleaned}
</untrusted_applicant_data>`;

  return { sanitized: encapsulated, hasSuspiciousContent };
}

// 3. Circuit Breaker for External CMS (Sanity)
export async function withCircuitBreaker<T>(
  action: () => Promise<T>,
  fallbackValue: T,
  timeoutMs = 4000
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const result = await Promise.race([
      action(),
      new Promise<T>((_, reject) => {
        controller.signal.addEventListener("abort", () =>
          reject(new Error(`Operation timed out after ${timeoutMs}ms`))
        );
      }),
    ]);
    clearTimeout(timer);
    return result;
  } catch (error) {
    clearTimeout(timer);
    console.warn("[CircuitBreaker] External service failed or timed out. Serving fallback.", error);
    return fallbackValue;
  }
}

// 4. Execution Budget Limiter
export const AGENT_BUDGET = {
  MAX_STEPS: 3, // Hard limit of 3 autonomous steps per query to save tokens
  MAX_INPUT_CHARS: 3000,
  REQUEST_TIMEOUT_MS: 9000, // 9 second hard ceiling for serverless functions
};
