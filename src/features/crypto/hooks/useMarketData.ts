import { useQuery } from '@tanstack/react-query'
import { getMarketData, type DataMode } from '@/features/crypto/api/cryptoApi'
import { getCachedData, setCachedData, CACHE_KEYS } from '@/features/crypto/utils/cache'
import type { CoinMarket, MarketDataParams } from '@/types/crypto'

// ─── Query Keys ────────────────────────────────────────────────────────────

export const cryptoQueryKeys = {
  all: ['crypto'] as const,
  markets: (params?: MarketDataParams & { mode?: DataMode }) => 
    [...cryptoQueryKeys.all, 'markets', params ?? {}] as const,
} as const

// ─── Constants ─────────────────────────────────────────────────────────────

/** Auto-refresh interval: 30 seconds */
const REFETCH_INTERVAL_MS = 30_000

/** Data stays "fresh" for 60 seconds before a background refetch */
const STALE_TIME_MS = 60_000

/** Cache duration in memory: 5 minutes */
const GC_TIME_MS = 5 * 60_000

// ─── Hook ──────────────────────────────────────────────────────────────────

interface UseMarketDataOptions {
  /** Override default query params */
  params?: MarketDataParams
  /** API Data Mode (lite | full) */
  mode?: DataMode
  /** Disable auto-refetching (e.g. when tab is not visible) */
  autoRefetch?: boolean
  /** Enable / disable the query entirely */
  enabled?: boolean
}

interface UseMarketDataReturn {
  coins: CoinMarket[]
  isLoading: boolean
  isRefetching: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
  dataUpdatedAt: number
}

/**
 * React Query hook for fetching market data with optimized performance.
 * 
 * Features:
 * - Instant load via localStorage caching (initialData)
 * - Optimized payload via Lite/Full modes
 * - Aggressive caching (60s staleTime)
 * - Automatic background refetching
 */
export function useMarketData(options?: UseMarketDataOptions): UseMarketDataReturn {
  const { params, mode = 'lite', autoRefetch = true, enabled = true } = options ?? {}

  // Attempt to load from localStorage cache for "instant" feel
  const cachedData = getCachedData<CoinMarket[]>(CACHE_KEYS.MARKET_DATA)

  const query = useQuery<CoinMarket[], Error>({
    queryKey: cryptoQueryKeys.markets({ ...params, mode }),
    queryFn: async ({ signal }) => {
      const data = await getMarketData({
        ...params,
        mode,
        signal, // React Query's AbortSignal for request deduplication/cancellation
      })
      
      // Update cache on success (only for the main market list, usually vs_currency=usd)
      if (mode === 'lite' && (!params || params.vs_currency === 'usd')) {
        setCachedData(CACHE_KEYS.MARKET_DATA, data)
      }
      
      return data
    },
    initialData: mode === 'lite' && !params ? cachedData ?? undefined : undefined,
    staleTime: STALE_TIME_MS,
    gcTime: GC_TIME_MS,
    refetchInterval: autoRefetch ? REFETCH_INTERVAL_MS : false,
    refetchOnWindowFocus: false, // Per user plan: reduce re-fetch triggers
    enabled,
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10_000),
  })

  return {
    coins: query.data ?? [],
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    dataUpdatedAt: query.dataUpdatedAt,
  }
}
