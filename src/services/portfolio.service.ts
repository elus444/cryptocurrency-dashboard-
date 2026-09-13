import { httpClient } from "@/services/api/http-client";
import type { AllocationSlice, PaginatedResult, PortfolioAssetDto, PortfolioSummary, TransactionDto } from "@/types/domain.types";

export const portfolioService = {
  async getSummary() {
    return httpClient.get<PortfolioSummary>("/portfolio/summary");
  },

  async getAssets(page: number, pageSize: number, search: string) {
    return httpClient.get<PaginatedResult<PortfolioAssetDto>>("/portfolio/assets", {
      params: { page, pageSize, search },
    });
  },

  async getAllocation() {
    return httpClient.get<AllocationSlice[]>("/portfolio/allocation");
  },

  async getTransactions(page: number, pageSize: number, status: string) {
    return httpClient.get<PaginatedResult<TransactionDto>>("/portfolio/transactions", {
      params: { page, pageSize, status },
    });
  },
};
