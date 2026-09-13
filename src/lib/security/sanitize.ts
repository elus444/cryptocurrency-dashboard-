// Security utility functions for input sanitization and validation

/**
 * Sanitizes a string to prevent XSS attacks
 * Removes HTML tags and encodes special characters
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Strips all HTML tags from a string
 */
export function stripHtmlTags(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Safely encodes a string for use in URLs
 */
export function safeUrlEncode(input: string): string {
  if (!input || typeof input !== 'string') return '';
  return encodeURIComponent(input.trim());
}

/**
 * Validates and sanitizes an email address
 */
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  return email.toLowerCase().trim();
}

/**
 * Truncates a string to a maximum length safely
 */
export function truncateString(input: string, maxLength: number): string {
  if (!input || typeof input !== 'string') return '';
  if (input.length <= maxLength) return input;
  return input.slice(0, maxLength);
}

/**
 * Checks if a string contains potentially dangerous content
 */
export function containsSuspiciousContent(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onclick, onerror, etc.
    /data:/i,
    /vbscript:/i,
    /expression\s*\(/i,
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(input));
}

/**
 * Sanitizes an object recursively
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = stripHtmlTags(value);
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map(item => 
        typeof item === 'string' ? stripHtmlTags(item) : item
      );
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
}

/**
 * Rate limiting helper - returns true if action should be blocked
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function isRateLimited(
  key: string, 
  maxAttempts: number = 5, 
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);
  
  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }
  
  record.count++;
  
  if (record.count > maxAttempts) {
    return true;
  }
  
  return false;
}

/**
 * Clears rate limit for a key (e.g., after successful auth)
 */
export function clearRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

/**
 * Generates a cryptographically secure random string
 */
export function generateSecureToken(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Validates that a value is a safe redirect URL (same origin)
 */
export function isSafeRedirectUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    const parsedUrl = new URL(url, window.location.origin);
    return parsedUrl.origin === window.location.origin;
  } catch {
    return false;
  }
}

/**
 * Masks sensitive data for logging (e.g., email: j***@example.com)
 */
export function maskSensitiveData(data: string, type: 'email' | 'phone' | 'card' = 'email'): string {
  if (!data || typeof data !== 'string') return '***';
  
  switch (type) {
    case 'email': {
      const [local, domain] = data.split('@');
      if (!domain) return '***';
      return `${local[0]}***@${domain}`;
    }
    case 'phone':
      return data.slice(0, 3) + '****' + data.slice(-2);
    case 'card':
      return '**** **** **** ' + data.slice(-4);
    default:
      return '***';
  }
}
