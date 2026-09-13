import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InlineErrorState, SectionSkeleton } from "@/components/app/AsyncState";
import { useActivityLogs } from "@/features/activity/hooks/useActivity";

export default function ActivityLogsPage() {
  const [page, setPage] = useState(1);
  const query = useActivityLogs(page, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Activity Logs</h1>
        <p className="text-muted-foreground">A complete audit trail of all workspace actions, access events, and system alerts.</p>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Audit Trail</CardTitle>
        </CardHeader>
        <CardContent>
          {query.isLoading ? (
            <SectionSkeleton rows={5} />
          ) : query.isError ? (
            <InlineErrorState description="Activity logs failed to load." onRetry={() => void query.refetch()} />
          ) : (
            <>
              <div className="space-y-3">
                {query.data?.items.map((log) => (
                  <div key={log.id} className="grid gap-3 rounded-xl border border-border/60 p-4 md:grid-cols-[1fr_1fr_1.4fr_1fr_auto]">
                    <div>
                      <p className="font-medium">{log.actor}</p>
                      <p className="text-sm text-muted-foreground">{log.action}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Target</p>
                      <p>{log.target}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">IP Address</p>
                      <p>{log.ipAddress}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Created</p>
                      <p>{new Date(log.createdAt).toLocaleString()}</p>
                    </div>
                    <Badge variant={log.severity === "critical" ? "destructive" : log.severity === "warning" ? "outline" : "default"}>
                      {log.severity}
                    </Badge>
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
