import { memo, useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { getMarketChart } from "@/features/crypto/api/cryptoApi"
import { AreaChart, Area, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"

interface LazySparklineProps {
  id: string
  change7d: number
  vs_currency?: string
}

export const LazySparkline = memo(({ id, change7d, vs_currency = "usd" }: LazySparklineProps) => {
  const [shouldFetch, setShouldFetch] = useState(false)

  // Use Intersection Observer or simply trigger on mount with a small delay
  // In this implementation, we'll fetch on mount but could be optimized to fetch on hover/scroll
  useEffect(() => {
    const timer = setTimeout(() => setShouldFetch(true), 500)
    return () => clearTimeout(timer)
  }, [])

  const { data, isLoading } = useQuery({
    queryKey: ["sparkline", id, vs_currency],
    queryFn: ({ signal }) => getMarketChart(id, { days: 7, vs_currency, signal }),
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000, // Charts can be staler
  })

  if (!shouldFetch || isLoading) {
    return <Skeleton className="h-10 w-24 ml-auto rounded" />
  }

  if (!data?.points || data.points.length === 0) return null

  return (
    <div className="h-10 w-24 ml-auto">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data.points}>
          <defs>
            <linearGradient id={`gradient-${id}`} x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor={change7d >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor={change7d >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"}
                stopOpacity={0}
              />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="price"
            stroke={change7d >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"}
            strokeWidth={1.5}
            fill={`url(#gradient-${id})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
})

LazySparkline.displayName = "LazySparkline"
