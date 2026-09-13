/**
 * Utility for robust localStorage management of API responses.
 * Provides typesafe access and expiration logic.
 */

const CACHE_PREFIX = 'saasnav_cache_'

export const CACHE_KEYS = {
  MARKET_DATA: `${CACHE_PREFIX}market_data`,
  COIN_DETAILS: (id: string) => `${CACHE_PREFIX}coin_details_${id}`,
} as const

interface CachedData<T> {
  data: T
  timestamp: number
  version: string // Useful for invalidating old schemas
}

const CURRENT_CACHE_VERSION = '1.0.0'

/**
 * Persist generic data to localStorage
 */
export function setCachedData<T>(key: string, data: T): void {
  try {
    const cacheEntry: CachedData<T> = {
      data,
      timestamp: Date.now(),
      version: CURRENT_CACHE_VERSION,
    }
    localStorage.setItem(key, JSON.stringify(cacheEntry))
  } catch (error) {
    console.warn(`[Cache] Failed to set localStorage for key "${key}":`, error)
  }
}

/**
 * Retrieve generic data from localStorage
 */
export function getCachedData<T>(key: string, maxAgeMs?: number): T | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null

    const parsed = JSON.parse(raw) as CachedData<T>

    // Version check
    if (parsed.version !== CURRENT_CACHE_VERSION) {
      localStorage.removeItem(key)
      return null
    }

    // Expiration check (optional)
    if (maxAgeMs && Date.now() - parsed.timestamp > maxAgeMs) {
      localStorage.removeItem(key)
      return null
    }

    return parsed.data
  } catch (error) {
    console.warn(`[Cache] Failed to get localStorage for key "${key}":`, error)
    return null
  }
}

/**
 * Clear specific or all app-related cache
 */
export function clearCache(key?: string): void {
  if (key) {
    localStorage.removeItem(key)
  } else {
    // Clear all keys with our prefix
    Object.keys(localStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => localStorage.removeItem(k))
  }
}
