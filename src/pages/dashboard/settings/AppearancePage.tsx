import { motion } from 'framer-motion';
import { Palette, Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SectionSkeleton } from '@/components/app/AsyncState';
import { useSettings, useUpdateSettings } from '@/features/settings/hooks/useSettings';

export default function SettingsAppearancePage() {
  const query = useSettings();
  const mutation = useUpdateSettings();
  const { setTheme } = useTheme();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ] as const;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-2xl font-bold">Appearance</h1>
        <p className="text-muted-foreground">Customize how the app looks</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card variant="glass" className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" /> Theme
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {query.isLoading ? (
              <SectionSkeleton rows={2} />
            ) : (
              <RadioGroup
                value={query.data?.theme ?? 'system'}
                onValueChange={(value) => {
                  setTheme(value);
                  mutation.mutate({ theme: value as 'light' | 'dark' | 'system' });
                }}
                className="grid grid-cols-3 gap-4"
              >
                {themes.map((t) => (
                  <Label
                    key={t.value}
                    className="flex flex-col items-center gap-2 rounded-lg border border-border/50 p-4 cursor-pointer hover:bg-accent/50 transition-colors [&:has([data-state=checked])]:border-primary [&:has([data-state=checked])]:bg-primary/10"
                  >
                    <RadioGroupItem value={t.value} className="sr-only" />
                    <t.icon className="h-6 w-6" />
                    <span>{t.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
