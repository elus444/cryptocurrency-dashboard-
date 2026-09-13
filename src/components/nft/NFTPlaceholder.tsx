import { cn } from "@/lib/utils";

interface NFTPlaceholderProps {
  name: string;
  className?: string;
}

const gradients = [
  "from-purple-500/30 to-blue-500/30",
  "from-emerald-500/30 to-teal-500/30",
  "from-orange-500/30 to-red-500/30",
  "from-pink-500/30 to-rose-500/30",
  "from-cyan-500/30 to-blue-500/30",
  "from-amber-500/30 to-yellow-500/30",
];

export function NFTPlaceholder({ name, className }: NFTPlaceholderProps) {
  const gradientIndex = name.charCodeAt(0) % gradients.length;
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-gradient-to-br",
        gradients[gradientIndex],
        className
      )}
    >
      <span className="font-display text-2xl font-bold text-white/80">
        {initials}
      </span>
    </div>
  );
}
