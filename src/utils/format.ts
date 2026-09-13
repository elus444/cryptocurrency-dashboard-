// ─── Format Utilities ──────────────────────────────────────────────────────
// All formatters use the native Intl API — locale-aware, zero dependencies.
// Functions are pure (no side effects) and memoize their Intl instances
// via module-level caches to avoid repetitive object construction.

// ─── Intl Instance Cache ───────────────────────────────────────────────────
// Constructing Intl formatters is expensive. Cache by key so each unique
// config is only built once per session.

const currencyFormatterCache = new Map<string, Intl.NumberFormat>()
const percentFormatterCache = new Map<string, Intl.NumberFormat>()
const compactFormatterCache = new Map<string, Intl.NumberFormat>()

function getCurrencyFormatter(currency: string, decimals: number): Intl.NumberFormat {
  const key = `${currency}-${decimals}`
  if (!currencyFormatterCache.has(key)) {
    currencyFormatterCache.set(
      key,
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })
    )
  }
  return currencyFormatterCache.get(key)!
}

function getPercentFormatter(decimals: number): Intl.NumberFormat {
  const key = String(decimals)
  if (!percentFormatterCache.has(key)) {
    percentFormatterCache.set(
      key,
      new Intl.NumberFormat('en-US', {
        style: 'percent',
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        signDisplay: 'exceptZero',
      })
    )
  }
  return percentFormatterCache.get(key)!
}

function getCompactFormatter(currency: string): Intl.NumberFormat {
  const key = currency
  if (!compactFormatterCache.has(key)) {
    compactFormatterCache.set(
      key,
      new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        notation: 'compact',
        compactDisplay: 'short',
        maximumFractionDigits: 2,
      })
    )
  }
  return compactFormatterCache.get(key)!
}

// ─── Currency Formatting ───────────────────────────────────────────────────

/**
 * Format a number as a currency string.
 *
 * Automatically selects decimal precision based on magnitude:
 *   ≥ 1      → 2 decimal places  ($1,234.56)
 *   ≥ 0.01   → 4 decimal places  ($0.0123)
 *   < 0.01   → 6 decimal places  ($0.000045)
 *
 * @param value    - Raw numeric value
 * @param currency - ISO 4217 currency code (default: "USD")
 *
 * @example
 * formatCurrency(42350.75)           // "$42,350.75"
 * formatCurrency(0.000812, 'EUR')    // "€0.000812"
 * formatCurrency(1_200_000_000)      // "$1,200,000,000.00"
 */
export function formatCurrency(value: number, currency = 'USD'): string {
  if (!isFinite(value)) return '—'

  const absValue = Math.abs(value)
  const decimals = absValue >= 1 ? 2 : absValue >= 0.01 ? 4 : 6

  return getCurrencyFormatter(currency.toUpperCase(), decimals).format(value)
}

/**
 * Format a large number compactly with a currency symbol.
 * Best used for market caps and volumes.
 *
 *   1_500_000_000  → "$1.5B"
 *   250_000        → "$250K"
 *
 * @param value    - Raw numeric value
 * @param currency - ISO 4217 currency code (default: "USD")
 *
 * @example
 * formatCompactCurrency(1_200_000_000)  // "$1.2B"
 * formatCompactCurrency(84_500)         // "$84.5K"
 */
export function formatCompactCurrency(value: number, currency = 'USD'): string {
  if (!isFinite(value)) return '—'
  return getCompactFormatter(currency.toUpperCase()).format(value)
}

// ─── Percentage Formatting ─────────────────────────────────────────────────

/**
 * Format a decimal or percentage value as a human-readable percent string.
 *
 * CoinGecko returns percentage change as plain numbers (e.g. 2.34 means 2.34%).
 * Pass `isDecimal: true` only if the value is already in 0–1 range.
 *
 * Always shows a sign for non-zero values (+2.34% / -1.20%).
 *
 * @param value      - The percentage value
 * @param decimals   - Number of decimal places (default: 2)
 * @param isDecimal  - If true, value is treated as a 0–1 fraction (default: false)
 *
 * @example
 * formatPercentage(2.34)         // "+2.34%"
 * formatPercentage(-0.87)        // "-0.87%"
 * formatPercentage(0.0234, 2, true) // "+2.34%"
 */
export function formatPercentage(
  value: number,
  decimals = 2,
  isDecimal = false
): string {
  if (!isFinite(value)) return '—'

  // Intl percent style multiplies by 100 internally, so only divide when NOT
  // already in 0–1 form.
  const normalized = isDecimal ? value : value / 100

  return getPercentFormatter(decimals).format(normalized)
}

// ─── Number Utilities ──────────────────────────────────────────────────────

/**
 * Format a raw supply number with thousands separators.
 * Useful for circulating/total supply display.
 *
 * @example
 * formatSupply(21_000_000)  // "21,000,000"
 */
export function formatSupply(value: number): string {
  if (!isFinite(value)) return '—'
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value)
}

/**
 * Determine the directional class name for a price change value.
 * Framework-agnostic — returns a plain string token.
 *
 * Intended to be mapped to Tailwind classes in components:
 *   const cls = CHANGE_CLASS_MAP[getPriceChangeDirection(change)]
 *
 * @example
 * getPriceChangeDirection(2.4)   // "positive"
 * getPriceChangeDirection(-1.1)  // "negative"
 * getPriceChangeDirection(0)     // "neutral"
 */
export type PriceChangeDirection = 'positive' | 'negative' | 'neutral'

export function getPriceChangeDirection(value: number): PriceChangeDirection {
  if (!isFinite(value) || value === 0) return 'neutral'
  return value > 0 ? 'positive' : 'negative'
}

/**
 * Format a Unix millisecond timestamp into a locale date string.
 *
 * @example
 * formatTimestamp(1712345678000)  // "Apr 5, 2024"
 */
export function formatTimestamp(ms: number, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat('en-US', options ?? { dateStyle: 'medium' }).format(new Date(ms))
}
