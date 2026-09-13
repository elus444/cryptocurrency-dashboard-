import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InlineErrorState, SectionSkeleton } from "@/components/app/AsyncState";
import { useBillingHistory } from "@/features/billing/hooks/useBilling";
import { formatCurrency } from "@/utils/format";

export default function BillingHistoryPage() {
  const query = useBillingHistory();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Billing History</h1>
        <p className="text-muted-foreground">Review past invoices and manage your subscription plan.</p>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {query.isLoading ? (
            <SectionSkeleton rows={4} />
          ) : query.isError ? (
            <InlineErrorState description="Billing history could not be loaded." onRetry={() => void query.refetch()} />
          ) : (
            query.data?.map((invoice) => (
              <div key={invoice.id} className="grid gap-3 rounded-xl border border-border/60 p-4 md:grid-cols-5">
                <div>
                  <p className="font-medium">{invoice.id}</p>
                  <p className="text-sm text-muted-foreground">{invoice.plan}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p>{formatCurrency(invoice.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Issued</p>
                  <p>{new Date(invoice.issuedAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Paid</p>
                  <p>{invoice.paidAt ? new Date(invoice.paidAt).toLocaleDateString() : "Pending"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={invoice.status === "paid" ? "default" : invoice.status === "pending" ? "outline" : "destructive"}>
                    {invoice.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
