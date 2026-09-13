export const queryKeys = {
  auth: {
    me: ["auth", "me"] as const,
  },
  analytics: {
    overview: ["analytics", "overview"] as const,
    timeseries: (range: string) => ["analytics", "timeseries", range] as const,
    funnel: ["analytics", "funnel"] as const,
  },
  portfolio: {
    summary: ["portfolio", "summary"] as const,
    assets: (page: number, pageSize: number, search: string) =>
      ["portfolio", "assets", page, pageSize, search] as const,
    allocation: ["portfolio", "allocation"] as const,
    transactions: (page: number, pageSize: number, status: string) =>
      ["portfolio", "transactions", page, pageSize, status] as const,
  },
  notifications: {
    list: (page: number, pageSize: number, type: string) =>
      ["notifications", page, pageSize, type] as const,
  },
  settings: {
    detail: ["settings"] as const,
  },
  billing: {
    history: ["billing", "history"] as const,
  },
  team: {
    members: ["team", "members"] as const,
  },
  activity: {
    logs: (page: number, pageSize: number) => ["activity", "logs", page, pageSize] as const,
  },
};
