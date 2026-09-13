// Markets API layer
import type { Token, NFT } from '@/types';
import type { ApiResponse, PaginatedResponse } from '@/types';

export const marketsApi = {
  async getTokens(page = 1, pageSize = 50): Promise<ApiResponse<PaginatedResponse<Token>>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const tokens: Token[] = [
        { id: '1', symbol: 'BTC', name: 'Bitcoin', price: 67500, change24h: 2.5, volume24h: 28000000000, marketCap: 1320000000000 },
        { id: '2', symbol: 'ETH', name: 'Ethereum', price: 3450, change24h: 1.8, volume24h: 15000000000, marketCap: 415000000000 },
        { id: '3', symbol: 'SOL', name: 'Solana', price: 142, change24h: -0.5, volume24h: 2500000000, marketCap: 62000000000 },
        { id: '4', symbol: 'BNB', name: 'BNB', price: 584, change24h: 0.8, volume24h: 1500000000, marketCap: 87000000000 },
        { id: '5', symbol: 'XRP', name: 'XRP', price: 0.52, change24h: -1.2, volume24h: 1200000000, marketCap: 28000000000 },
      ];

      return {
        data: { data: tokens, total: tokens.length, page, pageSize, hasMore: false },
        error: null,
        status: 'success',
      };
    } catch (error) {
      return { data: null, error: { code: 'fetch_error', message: 'Failed to fetch tokens' }, status: 'error' };
    }
  },

  async getToken(id: string): Promise<ApiResponse<Token>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const token: Token = {
        id,
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 67500,
        change24h: 2.5,
        volume24h: 28000000000,
        marketCap: 1320000000000,
      };

      return { data: token, error: null, status: 'success' };
    } catch (error) {
      return { data: null, error: { code: 'fetch_error', message: 'Failed to fetch token' }, status: 'error' };
    }
  },

  async getTrending(): Promise<ApiResponse<Token[]>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const trending: Token[] = [
        { id: '1', symbol: 'PEPE', name: 'Pepe', price: 0.00001234, change24h: 25.5, volume24h: 500000000, marketCap: 5000000000 },
        { id: '2', symbol: 'WIF', name: 'dogwifhat', price: 2.45, change24h: 15.8, volume24h: 300000000, marketCap: 2400000000 },
        { id: '3', symbol: 'BONK', name: 'Bonk', price: 0.0000234, change24h: 12.2, volume24h: 200000000, marketCap: 1500000000 },
      ];

      return { data: trending, error: null, status: 'success' };
    } catch (error) {
      return { data: null, error: { code: 'fetch_error', message: 'Failed to fetch trending' }, status: 'error' };
    }
  },
};
