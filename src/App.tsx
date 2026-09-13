import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { PublicOnlyRoute, ProtectedRoute } from "@/components/ProtectedRoute";
import { OfflineBanner } from "@/components/app/OfflineBanner";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { queryClient } from "@/lib/query-client";
import { useAuthBootstrap } from "@/features/auth";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SecurityPage = lazy(() => import("./pages/SecurityPage"));
const PricingPage = lazy(() => import("./pages/PricingPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/auth/RegisterPage"));
const DashboardLayout = lazy(() =>
  import("./components/layout/DashboardLayout").then((module) => ({ default: module.DashboardLayout }))
);
const DashboardOverview = lazy(() => import("./pages/dashboard/DashboardOverview"));
const PortfolioAssetsPage = lazy(() => import("./pages/dashboard/portfolio/AssetsPage"));
const PortfolioTransactionsPage = lazy(() => import("./pages/dashboard/portfolio/TransactionsPage"));
const PortfolioAllocationPage = lazy(() => import("./pages/dashboard/portfolio/AllocationPage"));
const AnalyticsPerformancePage = lazy(() => import("./pages/dashboard/analytics/PerformancePage"));
const AnalyticsHistoryPage = lazy(() => import("./pages/dashboard/analytics/HistoryPage"));
const NotificationsPage = lazy(() => import("./pages/dashboard/notifications/NotificationsPage"));
const SettingsGeneralPage = lazy(() => import("./pages/dashboard/settings/GeneralPage"));
const SettingsPreferencesPage = lazy(() => import("./pages/dashboard/settings/PreferencesPage"));
const ProfilePage = lazy(() => import("./pages/dashboard/profile/ProfilePage"));
const BillingHistoryPage = lazy(() => import("./pages/dashboard/billing/BillingHistoryPage"));
const TeamMembersPage = lazy(() => import("./pages/dashboard/team/TeamMembersPage"));
const ActivityLogsPage = lazy(() => import("./pages/dashboard/activity/ActivityLogsPage"));
const SettingsAppearancePage = lazy(() => import("./pages/dashboard/settings/AppearancePage"));

// Stable component reference — avoids React recreating the fallback node
// on every AppRoutes render during Concurrent Mode transitions.
function AppShellFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

function AppRoutes() {
  useAuthBootstrap();

  return (
    <BrowserRouter>
      <OfflineBanner />
      <Suspense fallback={<AppShellFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/security" element={<SecurityPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/resources" element={<ResourcesPage />} />

            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicOnlyRoute>
                  <RegisterPage />
                </PublicOnlyRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardOverview />} />
              <Route path="portfolio/assets" element={<PortfolioAssetsPage />} />
              <Route path="portfolio/transactions" element={<PortfolioTransactionsPage />} />
              <Route path="portfolio/allocation" element={<PortfolioAllocationPage />} />
              <Route path="analytics/performance" element={<AnalyticsPerformancePage />} />
              <Route path="analytics/history" element={<AnalyticsHistoryPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="settings/general" element={<SettingsGeneralPage />} />
              <Route path="settings/preferences" element={<SettingsPreferencesPage />} />
              <Route path="settings/appearance" element={<SettingsAppearancePage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route
                path="billing/history"
                element={
                  <ProtectedRoute allowedRoles={["owner", "admin"]}>
                    <BillingHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="team"
                element={
                  <ProtectedRoute allowedRoles={["owner", "admin"]}>
                    <TeamMembersPage />
                  </ProtectedRoute>
                }
              />
              <Route path="activity" element={<ActivityLogsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </ThemeProvider>
);

export default App;
