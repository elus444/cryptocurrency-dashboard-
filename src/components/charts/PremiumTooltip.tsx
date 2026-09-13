import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/format";

type TooltipValue = string | number;

type TooltipPayloadItem = {
  color?: string;
  name?: string;
  value?: TooltipValue;
};

interface PremiumTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
  className?: string;
  valueMode?: "currency" | "number";
}

const formatValue = (value: TooltipValue | undefined, mode: "currency" | "number") => {
  if (typeof value !== "number") {
    return value ?? "-";
  }

  if (mode === "currency") {
    return formatCurrency(value);
  }

  return new Intl.NumberFormat("en-US").format(value);
};

export function PremiumTooltip({
  active,
  payload,
  label,
  className,
  valueMode = "number",
}: PremiumTooltipProps) {
  const items = (payload ?? []) as TooltipPayloadItem[];

  if (!active || items.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "chart-tooltip min-w-[180px] rounded-xl border border-white/20 bg-background/95 p-3 shadow-2xl backdrop-blur-xl",
        className
      )}
    >
      <p className="mb-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{String(label)}</p>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={`${item.name}-${item.value}`} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color ?? "hsl(var(--primary))" }}
              />
              <span className="text-xs text-muted-foreground">{item.name ?? "Value"}</span>
            </div>
            <span className="text-sm font-semibold">{formatValue(item.value, valueMode)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
