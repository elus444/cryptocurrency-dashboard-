import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InlineErrorState, SectionSkeleton } from "@/components/app/AsyncState";
import { usePortfolioTransactions } from "@/features/portfolio/hooks/usePortfolio";
import { formatCurrency } from "@/utils/format";
import { getCryptoIcon } from "@/utils/getCryptoIcon";

const statuses = ["all", "completed", "pending", "failed"] as const;

export default function PortfolioTransactionsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<(typeof statuses)[number]>("all");
  const query = usePortfolioTransactions(page, 5, status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold">Transactions</h1>
        <p className="text-muted-foreground">Full transaction history with server-side status filtering and pagination.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {statuses.map((item) => (
          <Button key={item} variant={item === status ? "default" : "outline"} onClick={() => { setStatus(item); setPage(1); }}>
            {item}
          </Button>
        ))}
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Recent Treasury Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {query.isLoading ? (
            <SectionSkeleton rows={5} />
          ) : query.isError ? (
            <InlineErrorState description="Transaction feed failed to load." onRetry={() => void query.refetch()} />
          ) : (
            <>
              <div className="space-y-3">
                {query.data?.items.map((transaction) => (
                  <div key={transaction.id} className="grid gap-3 rounded-xl border border-border/60 p-4 md:grid-cols-6">
                    <div>
                      <div className="flex items-center gap-2">
                        <img
                          src={getCryptoIcon(transaction.asset)}
                          alt={transaction.asset}
                          width={24}
                          height={24}
                          onError={(e) => (e.currentTarget.style.display = "none")}
                        />
                        <p className="font-medium">{transaction.asset}</p>
                      </div>
                      <p className="text-sm capitalize text-muted-foreground">{transaction.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p>{transaction.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Value</p>
                      <p>{formatCurrency(transaction.value)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Counterparty</p>
                      <p>{transaction.counterparty}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p>{new Date(transaction.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      <Badge
                        variant={
                          transaction.status === "completed"
                            ? "default"
                            : transaction.status === "pending"
                              ? "outline"
                              : "destructive"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {query.data?.page} of {query.data?.totalPages}
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
