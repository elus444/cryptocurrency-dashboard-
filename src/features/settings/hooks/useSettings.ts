import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { settingsService } from "@/services/settings.service";
import { queryKeys } from "@/lib/query-keys";
import { queryClient } from "@/lib/query-client";
import type { SettingsDto } from "@/types/domain.types";

export const useSettings = () =>
  useQuery({
    queryKey: queryKeys.settings.detail,
    queryFn: settingsService.getSettings,
    staleTime: 5 * 60_000,
  });

export const useUpdateSettings = () =>
  useMutation({
    mutationFn: settingsService.updateSettings,
    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.settings.detail });
      const previous = queryClient.getQueryData<SettingsDto>(queryKeys.settings.detail);

      if (previous) {
        queryClient.setQueryData<SettingsDto>(queryKeys.settings.detail, {
          ...previous,
          ...payload,
        });
      }

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.settings.detail, context.previous);
      }
    },
    onSuccess: () => {
      toast.success("Settings saved.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.detail });
    },
  });
