import { z } from 'zod';

// Common validation schemas for reuse across the application

// Generic text input with XSS protection
export const sanitizedStringSchema = z
  .string()
  .trim()
  .transform((val) => val.replace(/<[^>]*>/g, '')); // Strip HTML tags

// URL validation
export const urlSchema = z
  .string()
  .url('Please enter a valid URL')
  .refine(
    (url) => url.startsWith('https://'),
    'URL must use HTTPS'
  );

// Optional URL
export const optionalUrlSchema = z
  .string()
  .url('Please enter a valid URL')
  .optional()
  .or(z.literal(''));

// Phone number (basic international format)
export const phoneSchema = z
  .string()
  .regex(
    /^\+?[1-9]\d{1,14}$/,
    'Please enter a valid phone number'
  );

// UUID validation
export const uuidSchema = z
  .string()
  .uuid('Invalid ID format');

// Positive number
export const positiveNumberSchema = z
  .number()
  .positive('Value must be greater than 0');

// Amount (for crypto/currency)
export const amountSchema = z
  .number()
  .nonnegative('Amount cannot be negative')
  .finite('Amount must be a valid number');

// Pagination
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

// Search query
export const searchQuerySchema = z
  .string()
  .trim()
  .max(200, 'Search query is too long')
  .transform((val) => val.replace(/[<>]/g, '')); // Remove angle brackets

// Date range
export const dateRangeSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
}).refine(
  (data) => data.startDate <= data.endDate,
  { message: 'Start date must be before end date' }
);

// Wallet address (Ethereum format)
export const ethAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address');

// Contact form
export const contactFormSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').max(100),
  email: z.string().trim().email('Valid email is required'),
  subject: z.string().trim().min(5, 'Subject is required').max(200),
  message: z.string().trim().min(10, 'Message must be at least 10 characters').max(2000),
});

// Settings update
export const settingsUpdateSchema = z.object({
  displayName: z.string().trim().min(2).max(100).optional(),
  email: z.string().email().optional(),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    priceAlerts: z.boolean(),
    weeklyReports: z.boolean(),
  }).optional(),
  preferences: z.object({
    currency: z.enum(['USD', 'EUR', 'GBP', 'BTC', 'ETH']),
    theme: z.enum(['light', 'dark', 'system']),
    language: z.string().length(2),
  }).optional(),
});

// Type exports
export type PaginationParams = z.infer<typeof paginationSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type SettingsUpdateData = z.infer<typeof settingsUpdateSchema>;
