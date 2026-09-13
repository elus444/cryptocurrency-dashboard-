import { httpClient } from "@/services/api/http-client";
import type { AnalyticsFunnelStep, AnalyticsOverview, AnalyticsPoint } from "@/types/domain.types";

export const analyticsService = {
  async getOverview() {
    return httpClient.get<AnalyticsOverview>("/analytics/overview");
  },

  async getTimeseries(range = "12m") {
    return httpClient.get<AnalyticsPoint[]>("/analytics/timeseries", {
      params: { range },
    });
  },

  async getFunnel() {
    return httpClient.get<AnalyticsFunnelStep[]>("/analytics/funnel");
  },
};
