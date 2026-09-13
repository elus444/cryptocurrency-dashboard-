import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftRight,
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Hexagon,
  History,
  LayoutDashboard,
  LogOut,
  PieChart,
  ScrollText,
  Settings,
  User,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/stores/ui.store";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { APP_NAME, DASHBOARD_ROUTES } from "@/lib/constants";
import { useAuth } from "@/features/auth";

const mainNavItems = [
  { title: "Overview", href: DASHBOARD_ROUTES.overview, icon: LayoutDashboard },
  { title: "Portfolio Assets", href: DASHBOARD_ROUTES.portfolio.assets, icon: Wallet },
  { title: "Transactions", href: DASHBOARD_ROUTES.portfolio.transactions, icon: ArrowLeftRight },
  { title: "Allocation", href: DASHBOARD_ROUTES.portfolio.allocation, icon: PieChart },
  { title: "Performance", href: DASHBOARD_ROUTES.analytics.performance, icon: BarChart3 },
  { title: "Analytics History", href: DASHBOARD_ROUTES.analytics.history, icon: History },
  { title: "Notifications", href: DASHBOARD_ROUTES.notifications, icon: Bell },
  { title: "Billing", href: DASHBOARD_ROUTES.billing.history, icon: CreditCard },
  { title: "Team Members", href: DASHBOARD_ROUTES.team, icon: Users },
  { title: "Activity Logs", href: DASHBOARD_ROUTES.activity, icon: ScrollText },
];

const bottomNavItems = [
  { title: "Settings", href: DASHBOARD_ROUTES.settings.general, icon: Settings },
  { title: "Profile", href: DASHBOARD_ROUTES.profile, icon: User },
] as const;

function NavItem({
  title,
  href,
  icon: Icon,
  collapsed,
  pathname,
}: {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  collapsed: boolean;
  pathname: string;
}) {
  // Receive pathname from parent — avoids 12 separate useLocation() subscriptions
  const isActive = href === DASHBOARD_ROUTES.overview
    ? pathname === href
    : pathname.startsWith(href);

  return (
    <RouterNavLink
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
        isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {!collapsed ? <span>{title}</span> : null}
    </RouterNavLink>
  );
}

export function DashboardSidebar() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const setSidebarCollapsed = useUIStore((s) => s.setSidebarCollapsed);
  const { logout, isWorking } = useAuth();
  const isMobile = useIsMobile();
  const location = useLocation();

  // Auto-collapse sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [location.pathname, isMobile, setSidebarCollapsed]);

  return (
    <>
      {/* Mobile overlay — closes sidebar on outside click */}
      <AnimatePresence>
        {isMobile && !sidebarCollapsed && (
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm"
            onClick={() => setSidebarCollapsed(true)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isMobile ? (sidebarCollapsed ? 0 : 260) : (sidebarCollapsed ? 72 : 260) }}
        transition={{ duration: 0.2 }}
        className="fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border/50 bg-sidebar overflow-hidden"
      >
      <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
        <RouterNavLink to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Hexagon className="h-5 w-5 text-primary-foreground" />
          </div>
          {!sidebarCollapsed ? <span className="font-display text-lg font-bold">{APP_NAME}</span> : null}
        </RouterNavLink>
        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="h-8 w-8">
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItem key={item.href} {...item} collapsed={sidebarCollapsed} pathname={location.pathname} />
          ))}
        </div>
      </nav>

      <div className="border-t border-border/50 px-3 py-4">
        <div className="space-y-1">
          {bottomNavItems.map((item) => (
            <NavItem key={item.href} {...item} collapsed={sidebarCollapsed} pathname={location.pathname} />
          ))}
          <button
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            onClick={() => void logout()}
            disabled={isWorking}
            type="button"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!sidebarCollapsed ? <span>{isWorking ? "Signing Out..." : "Log Out"}</span> : null}
          </button>
        </div>
      </div>
    </motion.aside>
    </>
  );
}
