import { Activity, BarChart3, CreditCard, Shield, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { env } from "@/config/env";

export const APP_NAME = env.appName;
export const APP_DESCRIPTION = "Enterprise-grade SaaS control center for portfolio, analytics, and operations.";

export const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Security", href: "/security" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
] as const;

export const TRUST_BADGES = [
  { name: "Kraken", icon: "kraken" },
  { name: "Coinbase", icon: "coinbase" },
  { name: "Stripe", icon: "stripe" },
  { name: "Plaid", icon: "plaid" },
  { name: "OpenAI", icon: "openai" },
] as const;

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FEATURES: Feature[] = [
  {
    icon: Activity,
    title: "Operational Visibility",
    description: "Portfolio performance, activity trails, and transactional health in one production dashboard.",
  },
  {
    icon: BarChart3,
    title: "Decision-Grade Analytics",
    description: "Typed analytics modules, React Query caching, and realistic API contracts clients can trust.",
  },
  {
    icon: Shield,
    title: "JWT Session Security",
    description: "Refresh-aware auth, route guards, and token persistence patterns that mirror real SaaS delivery.",
  },
  {
    icon: CreditCard,
    title: "Revenue Operations",
    description: "Billing history and settings sync turn the dashboard into a believable client admin panel.",
  },
  {
    icon: Users,
    title: "Team Permissions",
    description: "Role-based access examples show readiness for internal tools, fintech dashboards, and B2B SaaS.",
  },
];

export const DASHBOARD_ROUTES = {
  overview: "/dashboard",
  portfolio: {
    assets: "/dashboard/portfolio/assets",
    transactions: "/dashboard/portfolio/transactions",
    allocation: "/dashboard/portfolio/allocation",
  },
  analytics: {
    performance: "/dashboard/analytics/performance",
    history: "/dashboard/analytics/history",
  },
  notifications: "/dashboard/notifications",
  settings: {
    general: "/dashboard/settings/general",
    preferences: "/dashboard/settings/preferences",
    appearance: "/dashboard/settings/appearance",
  },
  billing: {
    history: "/dashboard/billing/history",
  },
  team: "/dashboard/team",
  activity: "/dashboard/activity",
  profile: "/dashboard/profile",
} as const;
