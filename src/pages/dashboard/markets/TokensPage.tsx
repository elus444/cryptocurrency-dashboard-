import { useState, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Star, ArrowUpRight, ArrowDownRight, TrendingUp, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { useMemoFilter } from "@/hooks/use-memo-filter"
import { VirtualTableRow } from "@/components/table/virtual-table-row"
import { useLocalStorage } from "@/hooks/use-local-storage"

import { useMarketData } from "@/features/crypto/hooks/useMarketData"
import { LazySparkline } from "@/features/crypto/components/LazySparkline"
import { TableSkeleton, StatCardsSkeleton, ErrorFallback, EmptyState, LiveIndicator } from "@/features/crypto/components/MarketDataStates"
import { formatCurrency, formatCompactCurrency, formatPercentage } from "@/utils/format"

export default function MarketsTokensPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [watchlist, setWatchlist] = useLocalStorage<string[]>("saasnav.watchlist", [])

  // Use 'lite' mode for fast initial payload
  const { coins, isLoading, isError, error, refetch, isRefetching, dataUpdatedAt } = useMarketData({
    mode: 'lite'
  })

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Stable reference — a new inline arrow function every render would defeat
  // the useMemo inside useMemoFilter, causing a filter pass on every keystroke.
  const tokenFilterFn = useCallback(
    (token: { name: string; symbol: string }, query: string) =>
      token.name.toLowerCase().includes(query) || token.symbol.toLowerCase().includes(query),
    []
  )

  const filteredData = useMemoFilter(coins, debouncedSearchQuery, tokenFilterFn)

  const toggleWatchlist = useCallback((id: string) => {
    setWatchlist((prev) => (prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]))
  }, [setWatchlist])

  // Calculate market stats from our fetched set
  const stats = useMemo(() => {
    if (!coins.length) return { totalVal: 0, totalVol: 0, btcDom: 0 }
    
    const totalVal = coins.reduce((acc, c) => acc + (c.market_cap || 0), 0)
    const totalVol = coins.reduce((acc, c) => acc + (c.total_volume || 0), 100)
    const btcNode = coins.find((c) => c.symbol.toLowerCase() === 'btc')
    const btcDom = btcNode && totalVal > 0 ? (btcNode.market_cap / totalVal) * 100 : 0
    
    return { totalVal, totalVol, btcDom }
  }, [coins])

  if (isError) {
    return <ErrorFallback error={error} onRetry={refetch} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="flex items-center gap-3">
             <h1 className="font-display text-2xl font-bold">Token Markets</h1>
             {dataUpdatedAt > 0 && <LiveIndicator isRefetching={isRefetching} dataUpdatedAt={dataUpdatedAt} />}
          </div>
          <p className="text-muted-foreground">Track prices across 50+ exchanges in real-time</p>
        </div>
      </motion.div>

      {/* Market Stats */}
      {isLoading && coins.length === 0 ? (
        <StatCardsSkeleton count={4} />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 sm:grid-cols-4"
        >
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Top Market Cap</p>
                <p className="font-display text-xl font-bold">{formatCompactCurrency(stats.totalVal)}</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/10 p-2.5">
                <ArrowUpRight className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">24h Volume</p>
                <p className="font-display text-xl font-bold">{formatCompactCurrency(stats.totalVol)}</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2.5">
                <Sparkles className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">BTC Dominance</p>
                <p className="font-display text-xl font-bold">{stats.btcDom.toFixed(1)}%</p>
              </div>
            </div>
          </Card>
          <Card variant="glass" className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-500/10 p-2.5">
                <Star className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Your Watchlist</p>
                <p className="font-display text-xl font-bold">{watchlist.length} tokens</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tokens..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading && coins.length === 0}
          />
        </div>
      </motion.div>

      {/* Market Table */}
      <Card variant="glass">
        <CardContent className="p-0">
          {isLoading && coins.length === 0 ? (
             <TableSkeleton rows={10} columns={9} />
          ) : filteredData.length === 0 ? (
             <EmptyState title="No tokens found matching search." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">#</th>
                    <th className="px-4 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Name</th>
                    <th className="px-4 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Price</th>
                    <th className="px-4 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">24h %</th>
                    <th className="px-4 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">7d %</th>
                    <th className="px-4 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Market Cap</th>
                    <th className="px-4 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Volume(24h)</th>
                    <th className="px-4 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Last 7 Days</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {filteredData.map((token, index) => {
                      const change24h = token.price_change_percentage_24h ?? 0;
                      const change7d = token.price_change_percentage_7d_in_currency ?? 0;

                      return (
                        <VirtualTableRow key={token.id} index={index} isEven={index % 2 === 0}>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleWatchlist(token.id)}
                                className="transition-transform hover:scale-110"
                              >
                                <Star
                                  className={`h-4 w-4 transition-colors ${
                                    watchlist.includes(token.id)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-muted-foreground hover:text-yellow-400"
                                  }`}
                                />
                              </button>
                              <span className="text-muted-foreground">{token.market_cap_rank}</span>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 overflow-hidden rounded-full p-0.5 bg-white">
                                <img src={token.image} alt={token.name} className="h-full w-full object-contain" />
                              </div>
                              <div>
                                <p className="font-medium">{token.name}</p>
                                <p className="text-sm text-muted-foreground">{token.symbol.toUpperCase()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-right font-medium">
                            {formatCurrency(token.current_price, 'usd')}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className={`flex items-center justify-end gap-1 ${change24h >= 0 ? "text-success" : "text-destructive"}`}>
                              {change24h >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                              {formatPercentage(change24h, 2, false).replace(/[+-]/, '')}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <span className={change7d >= 0 ? "text-success" : "text-destructive"}>
                              {formatPercentage(change7d, 2, false)}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right text-muted-foreground">
                            {formatCompactCurrency(token.market_cap)}
                          </td>
                          <td className="px-4 py-4 text-right text-muted-foreground">
                            {formatCompactCurrency(token.total_volume)}
                          </td>
                          <td className="px-4 py-4">
                            <LazySparkline id={token.id} change7d={change7d} />
                          </td>
                        </VirtualTableRow>
                      )
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
