import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InlineErrorState, SectionSkeleton } from "@/components/app/AsyncState";
import { useSettings, useUpdateSettings } from "@/features/settings/hooks/useSettings";
import type { SettingsDto } from "@/types/domain.types";

export default function SettingsGeneralPage() {
  const query = useSettings();
  const mutation = useUpdateSettings();
  const form = useForm<SettingsDto>();
  const { setTheme } = useTheme();

  useEffect(() => {
    if (query.data && !mutation.isPending && !form.formState.isDirty) {
      form.reset(query.data);
    }
  }, [form, query.data, mutation.isPending]);

  if (query.isLoading) {
    return <SectionSkeleton rows={6} />;
  }

  if (query.isError) {
    return <InlineErrorState description="Settings failed to sync from the API." onRetry={() => void query.refetch()} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">General Settings</h1>
        <p className="text-muted-foreground">Configure locale, currency, timezone, and display preferences for your workspace.</p>
      </div>

      <Card variant="glass">
        <CardHeader>
          <CardTitle>Workspace Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={form.handleSubmit(async (values) => {
              await mutation.mutateAsync(values);
              form.reset(values); // clear dirty state after confirmed save
            })}
          >
            <div className="space-y-2">
              <Label htmlFor="locale">Locale</Label>
              <Input id="locale" {...form.register("locale")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Controller
                name="currency"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD — US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR — Euro</SelectItem>
                      <SelectItem value="GBP">GBP — British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" {...form.register("timezone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Controller
                name="theme"
                control={form.control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setTheme(value);
                    }}
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
