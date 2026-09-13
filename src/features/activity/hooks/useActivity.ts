import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { activityService } from "@/services/activity.service";
import { queryKeys } from "@/lib/query-keys";

export const useActivityLogs = (page: number, pageSize: number) =>
  useQuery({
    queryKey: queryKeys.activity.logs(page, pageSize),
    queryFn: () => activityService.getLogs(page, pageSize),
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });
