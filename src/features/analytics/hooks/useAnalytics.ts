import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics.service";
import { queryKeys } from "@/lib/query-keys";

export const useAnalyticsOverview = () =>
  useQuery({
    queryKey: queryKeys.analytics.overview,
    queryFn: analyticsService.getOverview,
    staleTime: 2 * 60_000,
  });

export const useAnalyticsTimeseries = (range = "12m") =>
  useQuery({
    queryKey: queryKeys.analytics.timeseries(range),
    queryFn: () => analyticsService.getTimeseries(range),
    staleTime: 2 * 60_000,
  });

export const useAnalyticsFunnel = () =>
  useQuery({
    queryKey: queryKeys.analytics.funnel,
    queryFn: analyticsService.getFunnel,
    staleTime: 5 * 60_000,
  });
