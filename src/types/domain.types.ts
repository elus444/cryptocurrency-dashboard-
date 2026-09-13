import type { AuthRole } from "@/types/auth.types";

export interface ApiMeta {
  requestId: string;
  timestamp: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ApiEnvelope<T> {
  data: T;
  meta: ApiMeta;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  status: number;
  details?: Record<string, unknown>;
}

export interface AnalyticsOverview {
  mrr: number;
  arr: number;
  activeUsers: number;
  retentionRate: number;
  conversionRate: number;
  weeklyActiveTeams: number;
  portfolioValue: number;
  portfolioGrowth: number;
  revenueDelta: number;
}

export interface AnalyticsPoint {
  date: string;
  value: number;
  revenue: number;
  signups: number;
}

export interface AnalyticsFunnelStep {
  name: string;
  value: number;
  conversionRate: number;
}

export interface PortfolioSummary {
  totalValue: number;
  investedCapital: number;
  totalPnl: number;
  dailyPnl: number;
  dailyPnlPercent: number;
  activePositions: number;
}

export interface PortfolioAssetDto {
  id: string;
  symbol: string;
  name: string;
  category: "L1" | "DeFi" | "AI" | "Stablecoin" | "Exchange";
  quantity: number;
  unitPrice: number;
  change24h: number;
  allocation: number;
  marketValue: number;
  avgCost: number;
}

export interface AllocationSlice {
  name: string;
  value: number;
  amount: number;
  color: string;
}

export interface TransactionDto {
  id: string;
  type: "buy" | "sell" | "rebalance" | "transfer";
  asset: string;
  amount: number;
  value: number;
  status: "completed" | "pending" | "failed";
  counterparty: string;
  createdAt: string;
}

export type NotificationType = "system" | "billing" | "security" | "transaction";

export interface NotificationDto {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  priority: "low" | "medium" | "high";
}

export interface SettingsDto {
  locale: string;
  currency: "USD" | "EUR" | "GBP";
  timezone: string;
  theme: "light" | "dark" | "system";
  emailReports: boolean;
  weeklyDigest: boolean;
  riskAlerts: boolean;
}

export interface BillingInvoiceDto {
  id: string;
  plan: string;
  amount: number;
  status: "paid" | "pending" | "failed";
  issuedAt: string;
  paidAt?: string;
}

export interface TeamMemberDto {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  status: "active" | "invited";
  lastActiveAt: string;
}

export interface ActivityLogDto {
  id: string;
  actor: string;
  action: string;
  target: string;
  ipAddress: string;
  createdAt: string;
  severity: "info" | "warning" | "critical";
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
