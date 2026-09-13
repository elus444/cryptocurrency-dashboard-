// Core application types

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Token {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  iconUrl?: string;
}

export interface NFT {
  id: string;
  name: string;
  collection: string;
  imageUrl: string;
  floorPrice: number;
  lastSale?: number;
}

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'swap' | 'buy' | 'sell';
  amount: number;
  token: string;
  timestamp: Date;
  status: 'pending' | 'completed' | 'failed';
  hash?: string;
}

export interface PortfolioAsset {
  id: string;
  token: Token;
  balance: number;
  value: number;
  allocation: number;
}

export interface PriceAlert {
  id: string;
  tokenId: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isActive: boolean;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
  status: 'success' | 'error';
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Form types
export interface FormFieldError {
  field: string;
  message: string;
}

// Theme types
export type Theme = 'light' | 'dark' | 'system';
export type Currency = 'USD' | 'EUR' | 'GBP' | 'BTC' | 'ETH';
