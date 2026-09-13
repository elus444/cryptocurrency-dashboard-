import { useQuery } from "@tanstack/react-query";
import { billingService } from "@/services/billing.service";
import { queryKeys } from "@/lib/query-keys";

export const useBillingHistory = () =>
  useQuery({
    queryKey: queryKeys.billing.history,
    queryFn: billingService.getHistory,
    staleTime: 5 * 60_000,
  });
