import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { portfolioService } from "@/services/portfolio.service";
import { queryKeys } from "@/lib/query-keys";

export const usePortfolioSummary = () =>
  useQuery({
    queryKey: queryKeys.portfolio.summary,
    queryFn: portfolioService.getSummary,
    staleTime: 60_000,
  });

export const usePortfolioAssets = (page: number, pageSize: number, search: string) =>
  useQuery({
    queryKey: queryKeys.portfolio.assets(page, pageSize, search),
    queryFn: () => portfolioService.getAssets(page, pageSize, search),
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });

export const usePortfolioAllocation = () =>
  useQuery({
    queryKey: queryKeys.portfolio.allocation,
    queryFn: portfolioService.getAllocation,
    staleTime: 5 * 60_000,
  });

export const usePortfolioTransactions = (page: number, pageSize: number, status: string) =>
  useQuery({
    queryKey: queryKeys.portfolio.transactions(page, pageSize, status),
    queryFn: () => portfolioService.getTransactions(page, pageSize, status),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
