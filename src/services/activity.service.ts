import { httpClient } from "@/services/api/http-client";
import type { ActivityLogDto, PaginatedResult } from "@/types/domain.types";

export const activityService = {
  async getLogs(page: number, pageSize: number) {
    return httpClient.get<PaginatedResult<ActivityLogDto>>("/activity/logs", {
      params: { page, pageSize },
    });
  },
};
