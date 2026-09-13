import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InlineErrorState, SectionSkeleton } from "@/components/app/AsyncState";
import { useAnalyticsOverview, useAnalyticsTimeseries } from "@/features/analytics/hooks/useAnalytics";
import { usePortfolioAllocation, usePortfolioSummary } from "@/features/portfolio/hooks/usePortfolio";
import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notification.service";
import { teamService } from "@/services/team.service";
import { queryKeys } from "@/lib/query-keys";
import { formatCurrency, formatPercentage } from "@/utils/format";
import { PremiumTooltip } from "@/components/charts/PremiumTooltip";
import type { AllocationSlice, NotificationDto, TeamMemberDto } from "@/types/domain.types";

const statCards = [
  { key: "portfolioValue", label: "Portfolio Value", icon: Wallet, deltaKey: null as null | string },
  { key: "mrr", label: "Monthly Recurring Revenue", icon: CreditCard, deltaKey: "revenueDelta" },
  { key: "activeUsers", label: "Active Users", icon: Users, deltaKey: null },
  { key: "weeklyActiveTeams", label: "Weekly Active Teams", icon: Activity, deltaKey: null },
] as const;

// Stable formatter — instantiating Intl.NumberFormat inside a render loop
// allocates a new object on every render.
const intlNumber = new Intl.NumberFormat("en-US");

export default function DashboardOverview() {
  const analyticsOverview = useAnalyticsOverview();
  const analyticsTimeseries = useAnalyticsTimeseries();
  const portfolioSummary = usePortfolioSummary();
  const allocation = usePortfolioAllocation();

  // select() scopes re-renders: this component only re-renders when items[]
  // changes identity, not when unrelated notification fields (e.g. updatedAt) tick.
  const { data: notificationsList = [], isLoading: notificationsLoading } = useQuery({
    queryKey: queryKeys.notifications.list(1, 6, "all"),
    queryFn: () => notificationService.getNotifications(1, 6, "all"),
    staleTime: 20_000,
    refetchOnWindowFocus: true,
    select: (data): NotificationDto[] => data.items,
  });

  const { data: teamMembersList = [], isLoading: teamLoading } = useQuery({
    queryKey: queryKeys.team.members,
    queryFn: teamService.getMembers,
    staleTime: 60_000,
    select: (data): TeamMemberDto[] => data,
  });

  // Stabilise with useMemo — `allocation.data ?? []` produces a new array
  // reference every render when data is undefined, which breaks the two
  // downstream useMemos that depend on allocationData.
  const allocationData = useMemo<AllocationSlice[]>(
    () => allocation.data ?? [],
    [allocation.data]
  );

  const allocationChartData = useMemo(
    () =>
      allocationData.map((slice) => ({
        name: slice.name,
        amount: slice.amount,
        value: slice.value,
        color: slice.color,
      })),
    [allocationData]
  );

  const allocationTotal = useMemo(
    () => allocationData.reduce((total, slice) => total + slice.amount, 0),
    [allocationData]
  );

  if (analyticsOverview.isError) {
    return (
      <InlineErrorState
        description="The analytics overview endpoint failed. Retry to verify the API layer, auth injection, and refresh handling."
        onRetry={() => void analyticsOverview.refetch()}
      />
    );
  }

  const overview = analyticsOverview.data;
  const summary = portfolioSummary.data;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-card/40 p-6 backdrop-blur-2xl"
      >
        <div className="chart-halo" />
        <div className="relative z-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs tracking-[0.2em] text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              LIVE OVERVIEW
            </p>
            <h1 className="font-display text-3xl font-bold md:text-4xl">Portfolio Overview</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Your consolidated view of portfolio performance, revenue metrics, and team activity.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-background/50 p-3 text-xs">
            <span className="text-muted-foreground">Retention</span>
            <span className="text-right font-semibold">{overview ? `${overview.retentionRate}%` : "--"}</span>
            <span className="text-muted-foreground">Revenue Δ</span>
            <span className="text-right font-semibold text-emerald-400">
              {overview ? `+${overview.revenueDelta}%` : "--"}
            </span>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {!overview || !summary ? (
          <SectionSkeleton rows={4} />
        ) : (
          statCards.map((item, index) => {
            const Icon = item.icon;
            const value =
              item.key === "portfolioValue"
                ? formatCurrency(overview.portfolioValue)
                : item.key === "mrr"
                  ? formatCurrency(overview.mrr)
                  : intlNumber.format(overview[item.key]);

            return (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 * index }}
                className="metric-prism"
              >
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-2xl font-bold">{value}</p>
                    {(item.key === "portfolioValue" || item.deltaKey) && (
                      <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-400">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                        {item.key === "portfolioValue"
                          ? formatPercentage(summary.dailyPnlPercent, 2, false)
                          : `${overview[item.deltaKey as keyof typeof overview]}%`}
                      </div>
                    )}
                  </div>
                  <div className="rounded-lg border border-primary/20 bg-primary/10 p-2.5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          className="chart-card xl:col-span-2"
        >
          <div className="chart-halo" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-xl">
              <TrendingUp className="h-5 w-5 text-primary" />
              Revenue and Portfolio Momentum
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Portfolio value and revenue tracked over the past 10 months.
            </p>
          </CardHeader>
          <CardContent className="relative z-10 h-[360px] pt-2">
            {analyticsTimeseries.isLoading ? (
              <SectionSkeleton rows={5} />
            ) : analyticsTimeseries.isError ? (
              <InlineErrorState
                title="Timeseries unavailable"
                description="Historical analytics failed to load."
                onRetry={() => void analyticsTimeseries.refetch()}
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsTimeseries.data}>
                  <defs>
                    <linearGradient id="portfolioAreaStrong" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.6} />
                      <stop offset="70%" stopColor="hsl(var(--chart-2))" stopOpacity={0.14} />
                      <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.01} />
                    </linearGradient>
                    <linearGradient id="revenueAreaSoft" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="hsl(var(--chart-3))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 6" stroke="hsl(var(--border) / 0.45)" vertical={false} />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    tickFormatter={(value: number) => `$${Math.round(value / 1000)}k`}
                  />
                  <Tooltip content={<PremiumTooltip valueMode="currency" />} cursor={{ stroke: "hsl(var(--primary) / 0.3)", strokeWidth: 1.5 }} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    fill="url(#portfolioAreaStrong)"
                    activeDot={{ r: 6, stroke: "hsl(var(--background))", strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                    fill="url(#revenueAreaSoft)"
                    activeDot={{ r: 5, stroke: "hsl(var(--background))", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.22 }}
          className="chart-card"
        >
          <div className="chart-halo" />
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Target className="h-5 w-5 text-chart-2" />
              Allocation Mix
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 h-[360px]">
            {allocation.isLoading ? (
              <SectionSkeleton rows={5} />
            ) : allocation.isError ? (
              <InlineErrorState description="Allocation breakdown could not be loaded." onRetry={() => void allocation.refetch()} />
            ) : (
              <div className="h-full">
                <ResponsiveContainer width="100%" height="74%">
                  <PieChart>
                    <Pie
                      data={allocationChartData}
                      dataKey="amount"
                      nameKey="name"
                      innerRadius={75}
                      outerRadius={112}
                      paddingAngle={3}
                    >
                      {allocationData.map((slice) => (
                        <Cell key={slice.name} fill={slice.color} stroke="hsl(var(--background) / 0.8)" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip content={<PremiumTooltip valueMode="currency" />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-2 rounded-xl border border-white/10 bg-background/40 p-3 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total Allocation</p>
                  <p className="mt-1 text-xl font-bold">{formatCurrency(allocationTotal)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </motion.div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card variant="glass" className="border-white/10 bg-card/35 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl">Unread Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notificationsLoading ? (
              <SectionSkeleton rows={4} />
            ) : (
              notificationsList.map((notification) => (
                <div key={notification.id} className="rounded-xl border border-white/10 bg-background/40 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{notification.title}</p>
                    <Badge variant={notification.read ? "outline" : "default"}>{notification.priority}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card variant="glass" className="border-white/10 bg-card/35 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl">Team Snapshot</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {teamLoading ? (
              <SectionSkeleton rows={4} />
            ) : (
              teamMembersList.map((member) => (
                <div key={member.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-background/40 p-4">
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.email} · {member.role}
                    </p>
                  </div>
                  <Badge variant={member.status === "active" ? "default" : "outline"}>{member.status}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
