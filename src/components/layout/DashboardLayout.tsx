import { memo, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { DashboardTopbar } from "@/components/layout/DashboardTopbar";
import { useUIStore } from "@/stores/ui.store";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Isolated component so sidebar-toggle re-renders never propagate into <main>.
// Granular selector means this only re-renders when sidebarCollapsed changes,
// not on any other UIStore write.
const DashboardMain = memo(function DashboardMain() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);
  const isMobile = useIsMobile();

  return (
    <main
      className={cn(
        "relative min-h-screen pt-28 transition-all duration-200",
        isMobile ? "pl-0" : sidebarCollapsed ? "pl-[72px]" : "pl-[260px]"
      )}
    >
      <div className="p-6">
        {/* Per-route Suspense: dashboard page transitions show a spinner without
            stalling the already-rendered sidebar, topbar, or background effects. */}
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </main>
  );
});

export function DashboardLayout() {
  return (
    <div className="dashboard-canvas relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-[8%] top-[12%] h-72 w-72 animate-pulse rounded-full bg-primary/15 blur-[100px]" />
        <div className="absolute right-[12%] top-[16%] h-80 w-80 rounded-full bg-chart-2/10 blur-[120px]" />
        <div className="absolute bottom-[8%] left-[36%] h-96 w-96 rounded-full bg-chart-3/10 blur-[130px]" />
      </div>
      <DashboardSidebar />
      <DashboardTopbar />
      <DashboardMain />
    </div>
  );
}
