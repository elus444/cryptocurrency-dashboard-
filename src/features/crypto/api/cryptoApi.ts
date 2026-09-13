import type {
  CoinMarket,
  CoinDetails,
  ChartData,
  ChartDataPoint,
  MarketDataParams,
  MarketChartParams,
  RawChartData,
} from '@/types/crypto'

// ─── Types ─────────────────────────────────────────────────────────────────

/**
 * API Data Modes:
 * - lite: Smallest payload (20 tokens, no sparklines, 24h change only)
 * - full: Complete payload (100 tokens, sparklines, multiple timeframes)
 * - custom: User-defined parameters
 */
export type DataMode = 'lite' | 'full' | 'custom'

// ─── Constants ─────────────────────────────────────────────────────────────

const BASE_URL = 'https://api.coingecko.com/api/v3'

/**
 * Default request timeout in milliseconds.
 * CoinGecko free tier can be slow — 10s is a safe ceiling.
 */
const REQUEST_TIMEOUT_MS = 10_000

// ─── Internal Helpers ──────────────────────────────────────────────────────

/**
 * Builds a query string from a plain object, omitting undefined values.
 */
function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== null
  ) as [string, string | number | boolean][]

  if (entries.length === 0) return ''

  const qs = entries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')

  return `?${qs}`
}

/**
 * Core fetch wrapper with timeout, status validation, and structured errors.
 * Supports external AbortSignal for request deduplication.
 */
async function apiFetch<T>(endpoint: string, signal?: AbortSignal): Promise<T> {
  const internalController = new AbortController()
  const timeoutId = setTimeout(() => internalController.abort(), REQUEST_TIMEOUT_MS)

  // If external signal is provided, listen for its abort event too
  if (signal) {
    signal.addEventListener('abort', () => internalController.abort(), { once: true })
  }

  let response: Response

  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      signal: internalController.signal,
      headers: {
        Accept: 'application/json',
      },
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`[CryptoAPI] Request timed out or cancelled — ${endpoint}`)
    }
    throw new Error(`[CryptoAPI] Network error — ${endpoint}: ${String(error)}`)
  } finally {
    clearTimeout(timeoutId)
  }

  if (response.status === 429) {
    throw new Error('[CryptoAPI] Rate limit exceeded (429). Retry after a short delay.')
  }

  if (response.status === 404) {
    throw new Error(`[CryptoAPI] Resource not found (404) — ${endpoint}`)
  }

  if (!response.ok) {
    throw new Error(
      `[CryptoAPI] Unexpected HTTP ${response.status} — ${endpoint}`
    )
  }

  try {
    return (await response.json()) as T
  } catch {
    throw new Error(`[CryptoAPI] Failed to parse JSON response — ${endpoint}`)
  }
}

/**
 * Normalize raw [timestamp, value] tuples into typed ChartDataPoint objects.
 */
function normalizeChartData(
  raw: RawChartData,
  coinId: string,
  currency: string,
  days: number | 'max'
): ChartData {
  const points: ChartDataPoint[] = raw.prices.map(([timestamp, price], i) => ({
    timestamp,
    price,
    marketCap: raw.market_caps[i]?.[1] ?? 0,
    volume: raw.total_volumes[i]?.[1] ?? 0,
  }))

  return { coinId, currency, days, points }
}

// ─── Public API Functions ──────────────────────────────────────────────────

/**
 * Fetch a paginated list of coins with market data.
 * 
 * Optimized with modes:
 * - lite: Default. 20 items, no sparklines. Fast load.
 * - full: 100 items with sparklines. Heavy load.
 */
export async function getMarketData(
  params?: MarketDataParams & { mode?: DataMode; signal?: AbortSignal }
): Promise<CoinMarket[]> {
  const mode = params?.mode ?? 'lite'
  
  // Lite mode overrides to minimize payload
  const defaults = mode === 'lite' 
    ? {
        per_page: 20,
        sparkline: false,
        price_change_percentage: '24h',
      }
    : {
        per_page: 100,
        sparkline: true,
        price_change_percentage: '1h,24h,7d',
      }

  const query = buildQueryString({
    vs_currency: params?.vs_currency ?? 'usd',
    order: params?.order ?? 'market_cap_desc',
    per_page: params?.per_page ?? defaults.per_page,
    page: params?.page ?? 1,
    sparkline: params?.sparkline ?? defaults.sparkline,
    price_change_percentage: params?.price_change_percentage ?? defaults.price_change_percentage,
  })

  return apiFetch<CoinMarket[]>(`/coins/markets${query}`, params?.signal)
}

/**
 * Fetch full details for a single coin.
 */
export async function getCoinDetails(id: string, signal?: AbortSignal): Promise<CoinDetails> {
  if (!id || !id.trim()) {
    throw new Error('[CryptoAPI] getCoinDetails: coin ID must be a non-empty string.')
  }

  const query = buildQueryString({
    localization: false,
    tickers: false,
    market_data: true,
    community_data: true,
    developer_data: true,
    sparkline: true,
  })

  return apiFetch<CoinDetails>(`/coins/${encodeURIComponent(id)}${query}`, signal)
}

/**
 * Fetch historical data for charting.
 */
export async function getMarketChart(
  id: string,
  params?: MarketChartParams & { signal?: AbortSignal }
): Promise<ChartData> {
  if (!id || !id.trim()) {
    throw new Error('[CryptoAPI] getMarketChart: coin ID must be a non-empty string.')
  }

  const currency = params?.vs_currency ?? 'usd'
  const days = params?.days ?? 7

  const query = buildQueryString({
    vs_currency: currency,
    days: String(days),
    ...(params?.interval ? { interval: params.interval } : {}),
  })

  const raw = await apiFetch<RawChartData>(
    `/coins/${encodeURIComponent(id)}/market_chart${query}`,
    params?.signal
  )

  return normalizeChartData(raw, id, currency, days)
}
