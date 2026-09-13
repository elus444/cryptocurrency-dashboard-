// ─── Crypto Types ──────────────────────────────────────────────────────────
// Strictly typed to match CoinGecko v3 API response shapes.
// No `any`. All optional fields are explicitly annotated.

// ─── /coins/markets ────────────────────────────────────────────────────────
export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: CoinROI | null;
  last_updated: string;
  sparkline_in_7d?: SparklineData;
  price_change_percentage_7d_in_currency?: number;
}

export interface CoinROI {
  times: number;
  currency: string;
  percentage: number;
}

export interface SparklineData {
  price: number[];
}

// ─── /coins/{id} ───────────────────────────────────────────────────────────
export interface CoinDetails {
  id: string;
  symbol: string;
  name: string;
  asset_platform_id: string | null;
  hashing_algorithm: string | null;
  description: LocalizedString;
  links: CoinLinks;
  image: CoinImage;
  country_origin: string;
  genesis_date: string | null;
  sentiment_votes_up_percentage: number | null;
  sentiment_votes_down_percentage: number | null;
  watchlist_portfolio_users: number;
  market_cap_rank: number;
  market_data: CoinMarketData;
  community_data: CoinCommunityData;
  developer_data: CoinDeveloperData;
  last_updated: string;
  categories: string[];
}

export interface LocalizedString {
  en: string;
  [locale: string]: string;
}

export interface CoinLinks {
  homepage: string[];
  blockchain_site: string[];
  official_forum_url: string[];
  chat_url: string[];
  announcement_url: string[];
  twitter_screen_name: string;
  facebook_username: string;
  telegram_channel_identifier: string;
  subreddit_url: string | null;
  repos_url: {
    github: string[];
    bitbucket: string[];
  };
}

export interface CoinImage {
  thumb: string;
  small: string;
  large: string;
}

export interface CoinMarketData {
  current_price: LocalizedNumber;
  ath: LocalizedNumber;
  ath_change_percentage: LocalizedNumber;
  ath_date: LocalizedString;
  atl: LocalizedNumber;
  atl_change_percentage: LocalizedNumber;
  atl_date: LocalizedString;
  market_cap: LocalizedNumber;
  market_cap_rank: number;
  fully_diluted_valuation: LocalizedNumber;
  total_volume: LocalizedNumber;
  high_24h: LocalizedNumber;
  low_24h: LocalizedNumber;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d: number;
  price_change_percentage_14d: number;
  price_change_percentage_30d: number;
  price_change_percentage_60d: number;
  price_change_percentage_200d: number;
  price_change_percentage_1y: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  last_updated: string;
}

/** Maps currency codes (e.g. "usd", "eur") to numeric values */
export type LocalizedNumber = Record<string, number>;

export interface CoinCommunityData {
  facebook_likes: number | null;
  twitter_followers: number | null;
  reddit_average_posts_48h: number;
  reddit_average_comments_48h: number;
  reddit_subscribers: number | null;
  reddit_accounts_active_48h: number;
}

export interface CoinDeveloperData {
  forks: number;
  stars: number;
  subscribers: number;
  total_issues: number;
  closed_issues: number;
  pull_requests_merged: number;
  pull_request_contributors: number;
  code_additions_deletions_4_weeks: {
    additions: number;
    deletions: number;
  };
  commit_count_4_weeks: number;
}

// ─── /coins/{id}/market_chart ──────────────────────────────────────────────
/**
 * Raw response from CoinGecko market chart endpoint.
 * Each entry is a [timestamp_ms, value] tuple.
 */
export interface RawChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

/**
 * Normalized chart data — easier to work with in chart libraries.
 */
export interface ChartDataPoint {
  timestamp: number; // Unix ms
  price: number;
  marketCap: number;
  volume: number;
}

export interface ChartData {
  coinId: string;
  currency: string;
  days: number | 'max';
  points: ChartDataPoint[];
}

// ─── API Query Parameters ──────────────────────────────────────────────────
export interface MarketDataParams {
  vs_currency?: string;
  order?: 'market_cap_desc' | 'market_cap_asc' | 'volume_desc' | 'volume_asc' | 'id_asc' | 'id_desc';
  per_page?: number;     // max 250
  page?: number;
  sparkline?: boolean;
  price_change_percentage?: string; // e.g. '1h,24h,7d'
}

export interface MarketChartParams {
  vs_currency?: string;
  days?: number | 'max';
  interval?: 'daily' | 'hourly';
}
