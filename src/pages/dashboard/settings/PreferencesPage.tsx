import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { InlineErrorState, SectionSkeleton } from "@/components/app/AsyncState";
import { useSettings, useUpdateSettings } from "@/features/settings/hooks/useSettings";

export default function SettingsPreferencesPage() {
  const query = useSettings();
  const mutation = useUpdateSettings();

  if (query.isLoading) {
    return <SectionSkeleton rows={4} />;
  }

  if (query.isError || !query.data) {
    return <InlineErrorState description="Preference settings could not be loaded." onRetry={() => void query.refetch()} />;
  }

  const items = [
    { key: "emailReports", label: "Email reports" },
    { key: "weeklyDigest", label: "Weekly digest" },
    { key: "riskAlerts", label: "Risk alerts" },
  ] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Preferences</h1>
        <p className="text-muted-foreground">Control notification delivery and alert policies for your workspace.</p>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Notification Policies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item) => (
            <div key={item.key} className="flex items-center justify-between rounded-xl border border-border/60 p-4">
              <Label htmlFor={item.key}>{item.label}</Label>
              <Switch
                id={item.key}
                checked={query.data[item.key]}
                disabled={mutation.isPending}
                onCheckedChange={(checked) => mutation.mutate({ [item.key]: checked })}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
