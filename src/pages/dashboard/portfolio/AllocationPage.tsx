import { useMemo } from "react";
import { motion } from "framer-motion";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InlineErrorState, SectionSkeleton } from "@/components/app/AsyncState";
import { usePortfolioAllocation } from "@/features/portfolio/hooks/usePortfolio";
import { formatCurrency } from "@/utils/format";
import { getCryptoIcon } from "@/utils/getCryptoIcon";
import { PremiumTooltip } from "@/components/charts/PremiumTooltip";
import type { AllocationSlice } from "@/types/domain.types";

export default function PortfolioAllocationPage() {
  const query = usePortfolioAllocation();

  // Stabilise — `query.data ?? []` is a new array ref every render when undefined,
  // which would re-trigger all downstream derived computations unnecessarily.
  const chartData = useMemo<AllocationSlice[]>(
    () => query.data ?? [],
    [query.data]
  );

  const chartInput = useMemo(
    () =>
      chartData.map((entry) => ({
        name: entry.name,
        amount: entry.amount,
        value: entry.value,
        color: entry.color,
      })),
    [chartData]
  );

  const totalValue = useMemo(
    () => chartData.reduce((total, entry) => total + entry.amount, 0),
    [chartData]
  );

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold">Allocation</h1>
        <p className="text-muted-foreground">
          Visualize how your capital is distributed across asset classes and positions.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="chart-card"
        >
          <div className="chart-halo" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-xl">Allocation Orbital View</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 h-[430px]">
            {query.isLoading ? (
              <SectionSkeleton rows={6} />
            ) : query.isError ? (
              <InlineErrorState description="Allocation endpoint failed." onRetry={() => void query.refetch()} />
            ) : (
              <div className="h-full">
                <ResponsiveContainer width="100%" height="80%">
                  <PieChart>
                    <defs>
                      <radialGradient id="allocationCoreGlow" cx="50%" cy="50%" r="58%">
                        <stop offset="0%" stopColor="hsl(var(--primary) / 0.35)" />
                        <stop offset="100%" stopColor="hsl(var(--primary) / 0)" />
                      </radialGradient>
                    </defs>
                    <Pie
                      data={chartInput}
                      dataKey="amount"
                      nameKey="name"
                      innerRadius={90}
                      outerRadius={145}
                      paddingAngle={2}
                      stroke="hsl(var(--background) / 0.85)"
                      strokeWidth={2}
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<PremiumTooltip valueMode="currency" />} />
                    <circle cx="50%" cy="50%" r="62" fill="url(#allocationCoreGlow)" />
                  </PieChart>
                </ResponsiveContainer>

                <div className="mx-auto max-w-sm rounded-xl border border-white/10 bg-background/45 p-3 text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total Managed Value</p>
                  <p className="mt-1 text-2xl font-bold">{formatCurrency(totalValue)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </motion.div>

        <Card variant="glass" className="border-white/10 bg-card/35 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-xl">Allocation Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {query.isLoading ? (
              <SectionSkeleton rows={5} />
            ) : (
              chartData.map((entry) => (
                <div
                  key={entry.name}
                  className="rounded-xl border border-white/10 bg-background/45 p-4 transition-colors hover:border-primary/30"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <img
                        src={getCryptoIcon(entry.name)}
                        alt={entry.name}
                        width={24}
                        height={24}
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                      <p className="font-medium">{entry.name}</p>
                    </div>
                    <p className="text-sm font-semibold">{entry.value}%</p>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${entry.value}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{formatCurrency(entry.amount)}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
