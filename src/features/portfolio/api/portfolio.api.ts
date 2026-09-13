// Portfolio API layer
import type { PortfolioAsset, Token, NFT, Transaction } from '@/types';
import type { ApiResponse, PaginatedResponse } from '@/types';

// Mock data
const mockTokens: Token[] = [
  { id: '1', symbol: 'BTC', name: 'Bitcoin', price: 67500, change24h: 2.5, volume24h: 28000000000, marketCap: 1320000000000 },
  { id: '2', symbol: 'ETH', name: 'Ethereum', price: 3450, change24h: 1.8, volume24h: 15000000000, marketCap: 415000000000 },
  { id: '3', symbol: 'SOL', name: 'Solana', price: 142, change24h: -0.5, volume24h: 2500000000, marketCap: 62000000000 },
];

export const portfolioApi = {
  async getAssets(): Promise<ApiResponse<PortfolioAsset[]>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const assets: PortfolioAsset[] = mockTokens.map((token, i) => ({
        id: `asset_${i}`,
        token,
        balance: Math.random() * 10,
        value: token.price * (Math.random() * 10),
        allocation: 100 / mockTokens.length,
      }));

      return { data: assets, error: null, status: 'success' };
    } catch (error) {
      return { data: null, error: { code: 'fetch_error', message: 'Failed to fetch assets' }, status: 'error' };
    }
  },

  async getTransactions(page = 1, pageSize = 20): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const transactions: Transaction[] = [
        { id: '1', type: 'receive', amount: 0.5, token: 'BTC', timestamp: new Date(), status: 'completed', hash: '0x123...' },
        { id: '2', type: 'send', amount: 100, token: 'USDT', timestamp: new Date(), status: 'completed', hash: '0x456...' },
        { id: '3', type: 'swap', amount: 1.5, token: 'ETH', timestamp: new Date(), status: 'pending' },
      ];

      return {
        data: { data: transactions, total: 3, page, pageSize, hasMore: false },
        error: null,
        status: 'success',
      };
    } catch (error) {
      return { data: null, error: { code: 'fetch_error', message: 'Failed to fetch transactions' }, status: 'error' };
    }
  },
};
