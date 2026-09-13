import { useMutation, useQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";
import { queryKeys } from "@/lib/query-keys";
import { queryClient } from "@/lib/query-client";
import type { NotificationDto, NotificationType, PaginatedResult } from "@/types/domain.types";

export const useNotifications = (page: number, pageSize: number, type: NotificationType | "all") =>
  useQuery({
    queryKey: queryKeys.notifications.list(page, pageSize, type),
    queryFn: () => notificationService.getNotifications(page, pageSize, type),
    staleTime: 20_000,
    // Opt back into window focus refetch — unread badge in the topbar should reflect
    // actions taken in other tabs (e.g. marking read in a different window).
    refetchOnWindowFocus: true,
  });

export const useMarkNotificationRead = (page: number, pageSize: number, type: NotificationType | "all") =>
  useMutation({
    mutationFn: notificationService.markAsRead,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.list(page, pageSize, type) });
      const previous = queryClient.getQueryData<PaginatedResult<NotificationDto>>(
        queryKeys.notifications.list(page, pageSize, type)
      );

      if (previous) {
        queryClient.setQueryData<PaginatedResult<NotificationDto>>(queryKeys.notifications.list(page, pageSize, type), {
          ...previous,
          items: previous.items.map((item) => (item.id === id ? { ...item, read: true } : item)),
        });
      }

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.notifications.list(page, pageSize, type), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"], exact: false });
    },
  });

export const useDeleteNotification = (page: number, pageSize: number, type: NotificationType | "all") =>
  useMutation({
    mutationFn: notificationService.remove,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications.list(page, pageSize, type) });
      const previous = queryClient.getQueryData<PaginatedResult<NotificationDto>>(
        queryKeys.notifications.list(page, pageSize, type)
      );

      if (previous) {
        queryClient.setQueryData<PaginatedResult<NotificationDto>>(queryKeys.notifications.list(page, pageSize, type), {
          ...previous,
          items: previous.items.filter((item) => item.id !== id),
          total: Math.max(0, previous.total - 1),
        });
      }

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.notifications.list(page, pageSize, type), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"], exact: false });
    },
  });

export const useMarkAllNotificationsRead = () =>
  useMutation({
    mutationFn: notificationService.markAllAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"], exact: false });

      // Snapshot every cached notification list for rollback
      const keys = queryClient
        .getQueryCache()
        .findAll({ queryKey: ["notifications"], exact: false })
        .map((q) => q.queryKey);

      const snapshots = keys.map((key) => ({
        key,
        data: queryClient.getQueryData<PaginatedResult<NotificationDto>>(key),
      }));

      // Optimistically mark all items read in every cached page/filter
      keys.forEach((key) => {
        const cached = queryClient.getQueryData<PaginatedResult<NotificationDto>>(key);
        if (cached) {
          queryClient.setQueryData<PaginatedResult<NotificationDto>>(key, {
            ...cached,
            items: cached.items.map((item) => ({ ...item, read: true })),
          });
        }
      });

      return { snapshots };
    },
    onError: (_error, _variables, context) => {
      context?.snapshots.forEach(({ key, data }) => {
        if (data) queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"], exact: false });
    },
  });
