import axios from "axios";
import type { AxiosAdapter, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import type {
  ActivityLogDto,
  AllocationSlice,
  AnalyticsFunnelStep,
  AnalyticsOverview,
  AnalyticsPoint,
  ApiEnvelope,
  ApiErrorPayload,
  BillingInvoiceDto,
  NotificationDto,
  PaginatedResult,
  PortfolioAssetDto,
  PortfolioSummary,
  SettingsDto,
  TeamMemberDto,
  TransactionDto,
} from "@/types/domain.types";
import type { AuthSession, AuthUser, LoginCredentials, RegisterCredentials } from "@/types/auth.types";

type DbUser = AuthUser & { password: string };

interface MockDatabase {
  users: DbUser[];
  refreshTokens: Record<string, { userId: string; expiresAt: number }>;
  analyticsOverview: AnalyticsOverview;
  analyticsTimeseries: AnalyticsPoint[];
  analyticsFunnel: AnalyticsFunnelStep[];
  portfolioSummary: PortfolioSummary;
  portfolioAssets: PortfolioAssetDto[];
  allocation: AllocationSlice[];
  transactions: TransactionDto[];
  notifications: NotificationDto[];
  settings: SettingsDto;
  invoices: BillingInvoiceDto[];
  teamMembers: TeamMemberDto[];
  activityLogs: ActivityLogDto[];
}

const DB_KEY = "saasnav.mock.db";
const ACCESS_TOKEN_TTL = 15 * 60_000;
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60_000;

const nowIso = () => new Date().toISOString();
const randomId = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;

const createEnvelope = <T>(data: T, pagination?: ApiEnvelope<T>["meta"]["pagination"]): ApiEnvelope<T> => ({
  data,
  meta: {
    requestId: crypto.randomUUID(),
    timestamp: nowIso(),
    pagination,
  },
});

const createError = (status: number, code: string, message: string, details?: Record<string, unknown>): ApiErrorPayload => ({
  status,
  code,
  message,
  details,
});

const createAxiosResponse = <T>(config: InternalAxiosRequestConfig, status: number, data: T): AxiosResponse<T> => ({
  data,
  status,
  statusText: String(status),
  headers: {},
  config,
});

const rejectAxiosError = (config: InternalAxiosRequestConfig, payload: ApiErrorPayload) =>
  Promise.reject(
    new axios.AxiosError(payload.message, payload.code, config, undefined, createAxiosResponse(config, payload.status, payload))
  );

const paginate = <T>(items: T[], page: number, pageSize: number): PaginatedResult<T> => {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    page,
    pageSize,
    total,
    totalPages,
  };
};

const seedDatabase = (): MockDatabase => ({
  users: [
    {
      id: "usr_owner_001",
      email: "owner@company.com",
      displayName: "Workspace Owner",
      avatarUrl: "",
      emailVerified: true,
      role: "owner",
      organizationId: "org_001",
      createdAt: "2025-10-10T14:00:00.000Z",
      lastLoginAt: nowIso(),
      password: "SecurePass1!", // MOCK ONLY — never store or compare plaintext passwords in production. Use bcrypt/argon2.
    },
  ],
  refreshTokens: {},
  analyticsOverview: {
    mrr: 148_500,
    arr: 1_782_000,
    activeUsers: 12_480,
    retentionRate: 94.2,
    conversionRate: 8.7,
    weeklyActiveTeams: 348,
    portfolioValue: 1_360_660,
    portfolioGrowth: 30.8,
    revenueDelta: 12.8,
  },
  analyticsTimeseries: [
    { date: "Jan", value: 780000,   revenue: 92000,  signups: 420 },
    { date: "Feb", value: 812000,   revenue: 98000,  signups: 460 },
    { date: "Mar", value: 860000,   revenue: 104000, signups: 500 },
    { date: "Apr", value: 905000,   revenue: 112000, signups: 530 },
    { date: "May", value: 968000,   revenue: 119000, signups: 560 },
    { date: "Jun", value: 1018000,  revenue: 124000, signups: 590 },
    { date: "Jul", value: 1080000,  revenue: 130000, signups: 620 },
    { date: "Aug", value: 1152000,  revenue: 136000, signups: 650 },
    { date: "Sep", value: 1204000,  revenue: 141000, signups: 690 },
    { date: "Oct", value: 1360660,  revenue: 148500, signups: 740 },
  ],
  analyticsFunnel: [
    { name: "Visitors", value: 21400, conversionRate: 100 },
    { name: "Trials", value: 4280, conversionRate: 20 },
    { name: "Activated", value: 1850, conversionRate: 8.6 },
    { name: "Paid", value: 932, conversionRate: 4.3 },
  ],
  portfolioSummary: {
    totalValue: 1_360_660,
    investedCapital: 1_040_000,
    totalPnl: 320_660,
    dailyPnl: 26_480,
    dailyPnlPercent: 2.16,
    activePositions: 6,
  },
  portfolioAssets: [
    { id: "btc",  symbol: "BTC",  name: "Bitcoin",   category: "L1",         quantity: 14.2, unitPrice: 67120, change24h:  4.2, allocation: 70.1, marketValue: 953104, avgCost: 59800 },
    { id: "eth",  symbol: "ETH",  name: "Ethereum",  category: "L1",         quantity: 61.4, unitPrice:  3180, change24h:  2.8, allocation: 14.3, marketValue: 195252, avgCost:  2840 },
    { id: "sol",  symbol: "SOL",  name: "Solana",    category: "L1",         quantity: 520,  unitPrice:   182, change24h:  5.6, allocation:  7.0, marketValue:  94640, avgCost:   146 },
    { id: "link", symbol: "LINK", name: "Chainlink", category: "DeFi",       quantity: 2200, unitPrice:  17.2, change24h:  1.4, allocation:  2.8, marketValue:  37840, avgCost:  14.6 },
    { id: "usdc", symbol: "USDC", name: "USD Coin",  category: "Stablecoin", quantity: 48000,unitPrice:     1, change24h:  0.0, allocation:  3.5, marketValue:  48000, avgCost:     1 },
    { id: "bnb",  symbol: "BNB",  name: "BNB",       category: "Exchange",   quantity: 52,   unitPrice:   612, change24h: -1.2, allocation:  2.3, marketValue:  31824, avgCost:   544 },
  ],
  allocation: [
    { name: "Bitcoin",  value: 70.1, amount: 953104, color: "#F59E0B" },
    { name: "Ethereum", value: 14.3, amount: 195252, color: "#3B82F6" },
    { name: "Solana",   value:  7.0, amount:  94640, color: "#14B8A6" },
    { name: "Chainlink",value:  2.8, amount:  37840, color: "#8B5CF6" },
    { name: "USDC",     value:  3.5, amount:  48000, color: "#10B981" },
    { name: "BNB",      value:  2.3, amount:  31824, color: "#EF4444" },
  ],
  transactions: [
    { id: "txn_001", type: "buy",       asset: "BTC",  amount: 2.1,   value: 140952, status: "completed", counterparty: "Binance Prime",  createdAt: "2026-04-08T09:00:00.000Z" },
    { id: "txn_002", type: "rebalance", asset: "SOL",  amount: 85,    value: 15470,  status: "pending",   counterparty: "Treasury Desk",   createdAt: "2026-04-07T18:00:00.000Z" },
    { id: "txn_003", type: "sell",      asset: "ETH",  amount: 8.5,   value: 27030,  status: "completed", counterparty: "Coinbase Prime",  createdAt: "2026-04-06T14:30:00.000Z" },
    { id: "txn_004", type: "transfer",  asset: "USDC", amount: 12000, value: 12000,  status: "failed",    counterparty: "Fireblocks",      createdAt: "2026-04-05T11:15:00.000Z" },
    { id: "txn_005", type: "buy",       asset: "LINK", amount: 450,   value: 7740,   status: "completed", counterparty: "Kraken OTC",      createdAt: "2026-04-03T15:45:00.000Z" },
    { id: "txn_006", type: "buy",       asset: "BNB",  amount: 12,    value: 7344,   status: "completed", counterparty: "Binance",         createdAt: "2026-04-02T10:20:00.000Z" },
  ],
  notifications: [
    { id: "ntf_001", type: "security", title: "New device approved", message: "MacBook Pro signed into the workspace from New York.", read: false, createdAt: "2026-04-08T08:45:00.000Z", priority: "high" },
    { id: "ntf_002", type: "billing", title: "Enterprise invoice paid", message: "March enterprise subscription was paid successfully.", read: false, createdAt: "2026-04-07T16:00:00.000Z", priority: "medium" },
    { id: "ntf_003", type: "transaction", title: "Rebalance queued", message: "Treasury rebalance is waiting for second approver.", read: true, createdAt: "2026-04-07T13:20:00.000Z", priority: "medium" },
    { id: "ntf_004", type: "system", title: "Daily snapshot ready", message: "Your portfolio analytics have been refreshed with today's market data.", read: true, createdAt: "2026-04-06T06:00:00.000Z", priority: "low" },
  ],
  settings: {
    locale: "en-US",
    currency: "USD",
    timezone: "America/New_York",
    theme: "system",
    emailReports: true,
    weeklyDigest: true,
    riskAlerts: true,
  },
  invoices: [
    { id: "inv_2026_03", plan: "Enterprise", amount: 2490, status: "paid", issuedAt: "2026-03-01T00:00:00.000Z", paidAt: "2026-03-02T09:10:00.000Z" },
    { id: "inv_2026_02", plan: "Enterprise", amount: 2490, status: "paid", issuedAt: "2026-02-01T00:00:00.000Z", paidAt: "2026-02-03T09:10:00.000Z" },
    { id: "inv_2026_01", plan: "Growth", amount: 1490, status: "paid", issuedAt: "2026-01-01T00:00:00.000Z", paidAt: "2026-01-02T09:10:00.000Z" },
  ],
  teamMembers: [
    { id: "team_001", name: "Workspace Owner", email: "owner@company.com", role: "owner", status: "active", lastActiveAt: "2026-04-08T08:50:00.000Z" },
    { id: "team_002", name: "Admin User", email: "admin@company.com", role: "admin", status: "active", lastActiveAt: "2026-04-08T07:14:00.000Z" },
    { id: "team_003", name: "Analyst User", email: "analyst@company.com", role: "analyst", status: "active", lastActiveAt: "2026-04-07T23:11:00.000Z" },
    { id: "team_004", name: "Viewer User", email: "viewer@company.com", role: "viewer", status: "invited", lastActiveAt: "2026-04-05T18:20:00.000Z" },
  ],
  activityLogs: [
    { id: "act_001", actor: "Workspace Owner", action: "Approved", target: "Treasury rebalance ticket", ipAddress: "10.0.1.42", createdAt: "2026-04-08T09:04:00.000Z", severity: "info" },
    { id: "act_002", actor: "Admin User", action: "Updated", target: "Workspace billing contact", ipAddress: "10.0.1.58", createdAt: "2026-04-08T07:20:00.000Z", severity: "warning" },
    { id: "act_003", actor: "Analyst User", action: "Exported", target: "Quarterly PnL report", ipAddress: "10.0.1.91", createdAt: "2026-04-07T22:40:00.000Z", severity: "info" },
    { id: "act_004", actor: "System", action: "Detected", target: "Anomalous API spike", ipAddress: "internal", createdAt: "2026-04-07T05:20:00.000Z", severity: "critical" },
    { id: "act_005", actor: "Admin User", action: "Invited", target: "Viewer User to workspace", ipAddress: "10.0.1.58", createdAt: "2026-04-05T18:18:00.000Z", severity: "info" },
  ],
});

const getDb = () => {
  const existing = localStorage.getItem(DB_KEY);
  if (!existing) {
    const seeded = seedDatabase();
    localStorage.setItem(DB_KEY, JSON.stringify(seeded));
    return seeded;
  }
  return JSON.parse(existing) as MockDatabase;
};

const setDb = (db: MockDatabase) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

const issueTokens = (user: AuthUser, rememberMe: boolean, db: MockDatabase): AuthSession => {
  const accessExpiresAt = Date.now() + ACCESS_TOKEN_TTL;
  const refreshExpiresAt = Date.now() + REFRESH_TOKEN_TTL;
  const accessToken = `access.${user.id}.${accessExpiresAt}.${Math.random().toString(36).slice(2, 8)}`;
  const refreshToken = `refresh.${user.id}.${refreshExpiresAt}.${Math.random().toString(36).slice(2, 8)}`;

  db.refreshTokens[refreshToken] = { userId: user.id, expiresAt: refreshExpiresAt };
  setDb(db);

  return {
    user,
    accessToken,
    refreshToken,
    expiresAt: accessExpiresAt,
    refreshExpiresAt,
    rememberMe,
  };
};

const getHeader = (headers: AxiosRequestConfig["headers"], name: string): string | null => {
  if (!headers) {
    return null;
  }

  if (headers instanceof axios.AxiosHeaders) {
    const value = headers.get(name);
    return value == null ? null : String(value);
  }

  const normalizedName = name.toLowerCase();
  const entry = Object.entries(headers).find(([key]) => key.toLowerCase() === normalizedName);
  return entry?.[1] ? String(entry[1]) : null;
};

const parseAccessToken = (value: string | null) => {
  if (!value?.startsWith("Bearer ")) {
    return null;
  }

  const token = value.slice("Bearer ".length);
  const [, userId, expiresAt] = token.split(".");

  if (!userId || !expiresAt) {
    return null;
  }

  return {
    userId,
    expiresAt: Number(expiresAt),
  };
};

const authorize = (config: InternalAxiosRequestConfig) => {
  const parsed = parseAccessToken(getHeader(config.headers, "Authorization"));

  if (!parsed) {
    return { error: createError(401, "unauthorized", "Missing access token.") };
  }

  if (Date.now() > parsed.expiresAt) {
    return { error: createError(401, "session_expired", "Your session expired. Refresh required.") };
  }

  const db = getDb();
  const user = db.users.find((candidate) => candidate.id === parsed.userId);

  if (!user) {
    return { error: createError(401, "unauthorized", "The session user no longer exists.") };
  }

  return { db, user };
};

const readBody = <T>(config: InternalAxiosRequestConfig) => {
  if (!config.data) {
    return {} as T;
  }

  if (typeof config.data === "string") {
    return JSON.parse(config.data) as T;
  }

  return config.data as T;
};

const handleAuthRoutes = async (pathname: string, config: InternalAxiosRequestConfig) => {
  const db = getDb();

  if (pathname === "/auth/login" && config.method === "post") {
    const credentials = readBody<LoginCredentials>(config);
    const user = db.users.find((candidate) => candidate.email === credentials.email);

    if (!user || user.password !== credentials.password) { // MOCK ONLY — use constant-time comparison (e.g. bcrypt.compare) in production
      return rejectAxiosError(config, createError(401, "invalid_credentials", "Email or password is incorrect."));
    }

    const { password: _password, ...safeUser } = user;
    safeUser.lastLoginAt = nowIso();
    return createAxiosResponse(config, 200, createEnvelope(issueTokens(safeUser, Boolean(credentials.rememberMe), db)));
  }

  if (pathname === "/auth/register" && config.method === "post") {
    const payload = readBody<RegisterCredentials>(config);

    if (db.users.some((candidate) => candidate.email === payload.email)) {
      return rejectAxiosError(config, createError(409, "email_in_use", "An account already exists for this email."));
    }

    // Each new workspace gets its own org — prevents new signups from seeing
    // the seeded demo account's portfolio, billing, and team data.
    const user: DbUser = {
      id: randomId("usr"),
      email: payload.email,
      displayName: payload.name,
      avatarUrl: "",
      emailVerified: false,
      role: "owner",
      organizationId: randomId("org"),
      createdAt: nowIso(),
      lastLoginAt: nowIso(),
      password: payload.password,
    };

    db.users.push(user);
    setDb(db);
    const { password: _password, ...safeUser } = user;
    return createAxiosResponse(config, 201, createEnvelope(issueTokens(safeUser, true, db)));
  }

  if (pathname === "/auth/refresh" && config.method === "post") {
    const body = readBody<{ refreshToken: string }>(config);
    const refreshRecord = db.refreshTokens[body.refreshToken];

    if (!refreshRecord || refreshRecord.expiresAt < Date.now()) {
      return rejectAxiosError(config, createError(401, "session_expired", "Refresh token expired."));
    }

    const user = db.users.find((candidate) => candidate.id === refreshRecord.userId);
    if (!user) {
      return rejectAxiosError(config, createError(401, "unauthorized", "Account not found."));
    }

    const { password: _password, ...safeUser } = user;
    return createAxiosResponse(config, 200, createEnvelope(issueTokens(safeUser, true, db)));
  }

  if (pathname === "/auth/logout" && config.method === "post") {
    const body = readBody<{ refreshToken?: string }>(config);
    if (body.refreshToken) {
      delete db.refreshTokens[body.refreshToken];
      setDb(db);
    }
    return createAxiosResponse(config, 200, createEnvelope({ success: true }));
  }

  if (pathname === "/auth/me" && config.method === "get") {
    const authorization = authorize(config);
    if ("error" in authorization && authorization.error) {
      return rejectAxiosError(config, authorization.error);
    }
    return createAxiosResponse(config, 200, createEnvelope(authorization.user));
  }

  return null;
};

const handleProtectedRoutes = async (pathname: string, config: InternalAxiosRequestConfig) => {
  const authorization = authorize(config);
  if ("error" in authorization && authorization.error) {
    return rejectAxiosError(config, authorization.error);
  }

  const { db, user } = authorization;
  const url = new URL(`${config.baseURL}${config.url}`, window.location.origin);

  // Only the seeded demo org sees the rich mock dataset.
  // New registrations get their own orgId and receive clean empty data,
  // preventing them from viewing another workspace's portfolio and billing.
  const isDemo = user.organizationId === "org_001";

  if (pathname === "/analytics/overview" && config.method === "get") {
    return createAxiosResponse(config, 200, createEnvelope(isDemo ? db.analyticsOverview : { mrr: 0, arr: 0, activeUsers: 0, retentionRate: 0, conversionRate: 0, weeklyActiveTeams: 0, portfolioValue: 0, portfolioGrowth: 0, revenueDelta: 0 }));
  }

  if (pathname === "/analytics/timeseries" && config.method === "get") {
    return createAxiosResponse(config, 200, createEnvelope(isDemo ? db.analyticsTimeseries : []));
  }

  if (pathname === "/analytics/funnel" && config.method === "get") {
    return createAxiosResponse(config, 200, createEnvelope(isDemo ? db.analyticsFunnel : []));
  }

  if (pathname === "/portfolio/summary" && config.method === "get") {
    return createAxiosResponse(config, 200, createEnvelope(isDemo ? db.portfolioSummary : { totalValue: 0, investedCapital: 0, totalPnl: 0, dailyPnl: 0, dailyPnlPercent: 0, activePositions: 0 }));
  }

  if (pathname === "/portfolio/assets" && config.method === "get") {
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "5");
    const search = (url.searchParams.get("search") ?? "").toLowerCase();
    const source = isDemo ? db.portfolioAssets : [];
    const filtered = source.filter((asset) =>
      [asset.name, asset.symbol, asset.category].some((value) => value.toLowerCase().includes(search))
    );
    const paginated = paginate(filtered, page, pageSize);
    return createAxiosResponse(config, 200, createEnvelope(paginated, paginated));
  }

  if (pathname === "/portfolio/allocation" && config.method === "get") {
    return createAxiosResponse(config, 200, createEnvelope(isDemo ? db.allocation : []));
  }

  if (pathname === "/portfolio/transactions" && config.method === "get") {
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "5");
    const status = url.searchParams.get("status") ?? "all";
    const source = isDemo ? db.transactions : [];
    const filtered =
      status === "all" ? source : source.filter((transaction) => transaction.status === status);
    const paginated = paginate(filtered, page, pageSize);
    return createAxiosResponse(config, 200, createEnvelope(paginated, paginated));
  }

  if (pathname === "/notifications" && config.method === "get") {
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "6");
    const type = url.searchParams.get("type") ?? "all";
    const source = isDemo ? db.notifications : [];
    const filtered =
      type === "all" ? source : source.filter((notification) => notification.type === type);
    const sorted = [...filtered].sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
    const paginated = paginate(sorted, page, pageSize);
    return createAxiosResponse(config, 200, createEnvelope(paginated, paginated));
  }

  if (pathname === "/notifications/mark-all-read" && config.method === "post") {
    db.notifications = db.notifications.map((notification) => ({ ...notification, read: true }));
    setDb(db);
    return createAxiosResponse(config, 200, createEnvelope({ success: true }));
  }

  if (pathname.startsWith("/notifications/") && pathname.endsWith("/read") && config.method === "patch") {
    const notificationId = pathname.split("/")[2];
    db.notifications = db.notifications.map((notification) =>
      notification.id === notificationId ? { ...notification, read: true } : notification
    );
    setDb(db);
    return createAxiosResponse(config, 200, createEnvelope({ success: true }));
  }

  if (pathname.startsWith("/notifications/") && config.method === "delete") {
    const notificationId = pathname.split("/")[2];
    db.notifications = db.notifications.filter((notification) => notification.id !== notificationId);
    setDb(db);
    return createAxiosResponse(config, 200, createEnvelope({ success: true }));
  }

  if (pathname === "/settings" && config.method === "get") {
    return createAxiosResponse(config, 200, createEnvelope(db.settings));
  }

  if (pathname === "/settings" && config.method === "patch") {
    const nextSettings = readBody<Partial<SettingsDto>>(config);
    db.settings = { ...db.settings, ...nextSettings };
    setDb(db);
    return createAxiosResponse(config, 200, createEnvelope(db.settings));
  }

  if (pathname === "/billing/history" && config.method === "get") {
    return createAxiosResponse(config, 200, createEnvelope(isDemo ? db.invoices : []));
  }

  if (pathname === "/team/members" && config.method === "get") {
    // New workspace: seed the registering user as the sole owner so the team page isn't empty
    if (!isDemo) {
      const selfMember = { id: user.id, name: user.displayName, email: user.email, role: user.role, status: "active" as const, lastActiveAt: user.lastLoginAt };
      return createAxiosResponse(config, 200, createEnvelope([selfMember]));
    }
    return createAxiosResponse(config, 200, createEnvelope(db.teamMembers));
  }

  if (pathname.startsWith("/team/members/") && config.method === "patch") {
    const memberId = pathname.split("/")[3];
    const body = readBody<Pick<TeamMemberDto, "role">>(config);
    db.teamMembers = db.teamMembers.map((member) =>
      member.id === memberId ? { ...member, role: body.role } : member
    );
    setDb(db);
    return createAxiosResponse(config, 200, createEnvelope(db.teamMembers));
  }

  if (pathname === "/activity/logs" && config.method === "get") {
    const page = Number(url.searchParams.get("page") ?? "1");
    const pageSize = Number(url.searchParams.get("pageSize") ?? "5");
    const paginated = paginate(isDemo ? db.activityLogs : [], page, pageSize);
    return createAxiosResponse(config, 200, createEnvelope(paginated, paginated));
  }

  return rejectAxiosError(config, createError(404, "not_found", `Unknown endpoint: ${pathname}`));
};

export const mockApiAdapter: AxiosAdapter = async (config) => {
  await new Promise((resolve) => window.setTimeout(resolve, 300 + Math.random() * 300));

  if (!navigator.onLine) {
    return rejectAxiosError(config, createError(503, "offline", "You appear to be offline."));
  }

  const requestUrl = config.url ?? "/";
  const url = new URL(requestUrl, window.location.origin);
  const pathname = url.pathname;

  const authResponse = await handleAuthRoutes(pathname, config);
  if (authResponse) {
    return authResponse;
  }

  return handleProtectedRoutes(pathname, config);
};
