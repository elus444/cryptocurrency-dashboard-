import { motion } from "framer-motion";
import {
  Area,
  Bar,
  ComposedChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InlineErrorState, SectionSkeleton } from "@/components/app/AsyncState";
import { useAnalyticsOverview, useAnalyticsTimeseries } from "@/features/analytics/hooks/useAnalytics";
import { formatCurrency } from "@/utils/format";
import { PremiumTooltip } from "@/components/charts/PremiumTooltip";

export default function AnalyticsPerformancePage() {
  const overview = useAnalyticsOverview();
  const timeseries = useAnalyticsTimeseries();
  const metrics = overview.data;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold">Performance Analytics</h1>
        <p className="text-muted-foreground">
          Revenue and portfolio performance across key growth metrics.
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {overview.isLoading ? (
          <SectionSkeleton rows={3} />
        ) : overview.isError ? (
          <InlineErrorState description="Overview metrics failed to load." onRetry={() => void overview.refetch()} />
        ) : metrics ? (
          <>
            <div className="metric-prism">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">ARR</p>
              <p className="mt-2 text-3xl font-bold">{formatCurrency(metrics.arr)}</p>
              <p className="mt-2 text-xs text-emerald-400">+{metrics.revenueDelta}% quarter-over-quarter</p>
            </div>
            <div className="metric-prism">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Retention</p>
              <p className="mt-2 text-3xl font-bold">{metrics.retentionRate}%</p>
              <p className="mt-2 text-xs text-muted-foreground">Cohort health remains above enterprise baseline.</p>
            </div>
            <div className="metric-prism">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Conversion</p>
              <p className="mt-2 text-3xl font-bold">{metrics.conversionRate}%</p>
              <p className="mt-2 text-xs text-muted-foreground">Trial-to-paid ratio with growth-room signals.</p>
            </div>
          </>
        ) : null}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12 }}
        className="chart-card"
      >
        <div className="chart-halo" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-xl">Growth Composition</CardTitle>
          <p className="text-sm text-muted-foreground">
            Signups, revenue, and portfolio trajectory combined in one executive chart.
          </p>
        </CardHeader>
        <CardContent className="relative z-10 h-[390px] pt-2">
          {timeseries.isLoading ? (
            <SectionSkeleton rows={5} />
          ) : timeseries.isError ? (
            <InlineErrorState description="Timeseries endpoint failed." onRetry={() => void timeseries.refetch()} />
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={timeseries.data}>
                <defs>
                  <linearGradient id="signupBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--chart-2))" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="hsl(var(--chart-2))" stopOpacity={0.25} />
                  </linearGradient>
                  <linearGradient id="revenueAreaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 6" stroke="hsl(var(--border) / 0.45)" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip content={<PremiumTooltip valueMode="number" />} />
                <Bar dataKey="signups" fill="url(#signupBarGradient)" radius={[8, 8, 0, 0]} maxBarSize={28} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  fill="url(#revenueAreaGradient)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </motion.div>
    </div>
  );
}

