import { Link, useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { Bell, CreditCard, Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUIStore } from "@/stores/ui.store";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DASHBOARD_ROUTES } from "@/lib/constants";
import { useAuth } from "@/features/auth";
import { queryKeys } from "@/lib/query-keys";
import { notificationService } from "@/services/notification.service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { PaginatedResult, NotificationDto } from "@/types/domain.types";

const NOTIF_PAGE = 1;
const NOTIF_PAGE_SIZE = 6;
const NOTIF_TYPE = "all" as const;

export function DashboardTopbar() {
  const navigate = useNavigate();
  // Granular selector — only re-renders when sidebarCollapsed flips, not on
  // any other UIStore write (e.g. future fields).
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const { user, logout, isWorking } = useAuth();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  // select() narrows the subscription: this component only re-renders when the
  // unread *count* changes, not on any other notification field update.
  const { data: unreadCount = 0 } = useQuery({
    queryKey: queryKeys.notifications.list(NOTIF_PAGE, NOTIF_PAGE_SIZE, NOTIF_TYPE),
    queryFn: () => notificationService.getNotifications(NOTIF_PAGE, NOTIF_PAGE_SIZE, NOTIF_TYPE),
    staleTime: 20_000,
    refetchOnWindowFocus: true,
    select: (data) => data.items.filter((item) => !item.read).length,
  });

  // Read the full list from cache for the dropdown preview — no extra fetch.
  const cachedNotifications = queryClient.getQueryData<PaginatedResult<NotificationDto>>(
    queryKeys.notifications.list(NOTIF_PAGE, NOTIF_PAGE_SIZE, NOTIF_TYPE)
  );

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = searchQuery.trim();
      if (!q) return;
      navigate(`/dashboard/portfolio/assets?search=${encodeURIComponent(q)}`);
      setSearchQuery("");
    },
    [searchQuery, navigate]
  );

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-xl transition-all duration-200",
        isMobile ? "left-0" : sidebarCollapsed ? "left-[72px]" : "left-[260px]"
      )}
    >
      <form onSubmit={handleSearch} className="relative max-w-md flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search assets, invoices, activity logs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 w-full rounded-lg border border-border/50 bg-card/50 pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:bg-card"
        />
      </form>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 ? <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" /> : null}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {cachedNotifications?.items.slice(0, 3).map((notification) => (
              <DropdownMenuItem key={notification.id} asChild>
                <Link to={DASHBOARD_ROUTES.notifications} className="flex w-full flex-col items-start gap-1">
                  <span className="font-medium">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">{notification.message}</span>
                </Link>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={DASHBOARD_ROUTES.notifications} className="w-full cursor-pointer">
                View all notifications
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 text-primary transition-colors hover:bg-primary/30">
                <User className="h-5 w-5" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{user?.displayName ?? "Workspace User"}</span>
                <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to={DASHBOARD_ROUTES.profile} className="w-full cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={DASHBOARD_ROUTES.settings.general} className="w-full cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to={DASHBOARD_ROUTES.billing.history} className="w-full cursor-pointer">
                <CreditCard className="mr-2 h-4 w-4" />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-destructive" onClick={() => void logout()} disabled={isWorking}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

