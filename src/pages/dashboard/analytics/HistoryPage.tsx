import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InlineErrorState, SectionSkeleton } from "@/components/app/AsyncState";
import { useAnalyticsFunnel } from "@/features/analytics/hooks/useAnalytics";

export default function AnalyticsHistoryPage() {
  const query = useAnalyticsFunnel();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold">Analytics Funnel</h1>
        <p className="text-muted-foreground">Track user progression through key conversion stages from acquisition to paid.</p>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Conversion Funnel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {query.isLoading ? (
            <SectionSkeleton rows={4} />
          ) : query.isError ? (
            <InlineErrorState description="Funnel metrics failed to load." onRetry={() => void query.refetch()} />
          ) : (
            query.data?.map((step) => (
              <div key={step.name} className="rounded-xl border border-border/60 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{step.name}</p>
                  <Badge variant="outline">{step.conversionRate}%</Badge>
                </div>
                <div className="mt-3 h-3 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${step.conversionRate}%` }} />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{step.value.toLocaleString()} users in this stage</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
