import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InlineErrorState, SectionSkeleton } from "@/components/app/AsyncState";
import { usePortfolioAssets } from "@/features/portfolio/hooks/usePortfolio";
import { useDebounce } from "@/hooks/use-debounce";
import { getCryptoIcon } from "@/utils/getCryptoIcon";
import { formatCurrency, formatPercentage } from "@/utils/format";

export default function PortfolioAssetsPage() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  // Debounce so the query key only updates 300 ms after the user stops typing,
  // preventing a cache entry + network request per keystroke.
  const debouncedSearch = useDebounce(search, 300);
  const query = usePortfolioAssets(page, 5, debouncedSearch);

  const rows = useMemo(() => query.data?.items ?? [], [query.data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold">Portfolio Assets</h1>
        <p className="text-muted-foreground">Your current holdings across all tracked assets.</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(event) => { setSearch(event.target.value); setPage(1); }}
          placeholder="Search by symbol, name, category"
          className="pl-9"
        />
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Asset Registry</CardTitle>
        </CardHeader>
        <CardContent>
          {query.isLoading ? (
            <SectionSkeleton rows={5} />
          ) : query.isError ? (
            <InlineErrorState description="Portfolio assets failed to load." onRetry={() => void query.refetch()} />
          ) : (
            <>
              <div className="space-y-3">
                {rows.map((asset) => (
                  <div key={asset.id} className="grid gap-3 rounded-xl border border-border/60 p-4 md:grid-cols-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <img
                          src={getCryptoIcon(asset.symbol)}
                          alt={asset.symbol}
                          width={24}
                          height={24}
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                        <p className="font-medium">{asset.name}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{asset.symbol}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <Badge variant="outline">{asset.category}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Quantity</p>
                      <p>{asset.quantity.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Unit Price</p>
                      <p>{formatCurrency(asset.unitPrice)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">24h Change</p>
                      <p className={asset.change24h >= 0 ? "text-emerald-600" : "text-red-600"}>
                        {formatPercentage(asset.change24h, 2, false)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Market Value</p>
                      <p>{formatCurrency(asset.marketValue)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {query.data?.page} of {query.data?.totalPages} · {query.data?.total} total assets
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page === 1}>
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setPage((current) => current + 1)}
                    disabled={page >= (query.data?.totalPages ?? 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
