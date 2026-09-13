import { useState } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, InlineErrorState, SectionSkeleton } from "@/components/app/AsyncState";
import {
  useDeleteNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/features/notifications/hooks/useNotifications";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import type { NotificationType, PaginatedResult, NotificationDto } from "@/types/domain.types";

const filters: Array<NotificationType | "all"> = ["all", "security", "billing", "transaction", "system"];

export default function NotificationsPage() {
  const [filter, setFilter] = useState<NotificationType | "all">("all");
  const query = useNotifications(1, 6, filter);
  const markRead = useMarkNotificationRead(1, 6, filter);
  const remove = useDeleteNotification(1, 6, filter);
  const markAll = useMarkAllNotificationsRead();
  const queryClient = useQueryClient();

  const unreadCount = query.data?.items.filter((item) => !item.read).length ?? 0;

  // Derive total unread from the already-cached topbar query (1, 6, "all") rather
  // than firing a separate 50-item fetch. Falls back to the current page count
  // so the "Mark All Read" button is never incorrectly enabled on a cold load.
  const cachedAll = queryClient.getQueryData<PaginatedResult<NotificationDto>>(
    queryKeys.notifications.list(1, 6, "all")
  );
  const totalUnreadCount = cachedAll
    ? cachedAll.items.filter((n) => !n.read).length
    : unreadCount;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Notification Center</h1>
          <p className="text-muted-foreground">Stay on top of security events, billing updates, and transaction activity.</p>
        </div>
        <Button variant="outline" onClick={() => void markAll.mutateAsync()} disabled={!totalUnreadCount}>
          <CheckCheck className="mr-2 h-4 w-4" />
          Mark All Read
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((item) => (
          <Button key={item} variant={filter === item ? "default" : "outline"} onClick={() => setFilter(item)}>
            {item}
          </Button>
        ))}
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
        </CardHeader>
        <CardContent>
          {query.isLoading ? (
            <SectionSkeleton rows={5} />
          ) : query.isError ? (
            <InlineErrorState description="Notifications failed to load." onRetry={() => void query.refetch()} />
          ) : !query.data?.items.length ? (
            <EmptyState title="No notifications for this filter" description="The empty state is intentional and ready for real backend conditions." />
          ) : (
            <div className="space-y-3">
              {query.data.items.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-xl border p-4 ${notification.read ? "border-border/60" : "border-primary/30 bg-primary/5"}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Bell className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{notification.title}</p>
                          <Badge variant={notification.read ? "outline" : "default"}>{notification.priority}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                        <p className="mt-2 text-xs text-muted-foreground">{new Date(notification.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!notification.read ? (
                        <Button variant="outline" size="sm" onClick={() => void markRead.mutateAsync(notification.id)}>
                          Read
                        </Button>
                      ) : null}
                      <Button variant="ghost" size="icon" onClick={() => void remove.mutateAsync(notification.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
