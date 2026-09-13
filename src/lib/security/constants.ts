// Security-related constants

// Session configuration
export const SESSION_CONFIG = {
  // Token refresh threshold (5 minutes before expiry)
  REFRESH_THRESHOLD_MS: 5 * 60 * 1000,
  // Session timeout for inactive users (30 minutes)
  INACTIVITY_TIMEOUT_MS: 30 * 60 * 1000,
  // Maximum session duration (24 hours)
  MAX_SESSION_DURATION_MS: 24 * 60 * 60 * 1000,
  // Remember me duration (30 days)
  REMEMBER_ME_DURATION_MS: 30 * 24 * 60 * 60 * 1000,
} as const;

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  // Login attempts
  LOGIN: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 min
  // Registration attempts
  REGISTER: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  // Password reset requests
  PASSWORD_RESET: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  // API calls
  API_GENERAL: { maxAttempts: 100, windowMs: 60 * 1000 }, // 100 calls per minute
} as const;

// Password policy
export const PASSWORD_POLICY = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL: true,
  // Common passwords to reject (in production, use a proper list)
  BLOCKED_PASSWORDS: [
    'password', 'password123', '123456', '12345678', 'qwerty',
    'abc123', 'monkey', 'master', 'dragon', 'letmein',
  ],
} as const;

// Content Security
export const CONTENT_SECURITY = {
  // Maximum input lengths
  MAX_NAME_LENGTH: 100,
  MAX_EMAIL_LENGTH: 255,
  MAX_MESSAGE_LENGTH: 2000,
  MAX_URL_LENGTH: 2048,
  // Allowed file types for uploads
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
  // Maximum file sizes (in bytes)
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_DOCUMENT_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// Security headers (for reference - typically set server-side)
export const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
} as const;
