export const PATHS = {
  DASHBOARD: '/',
  INVENTORY: '/inventory',
  CATEGORIES: '/categories',
  TRANSACTIONS: '/transactions',
  AUDIT_LOGS: '/audit-logs',
} as const;

export type AppPath = typeof PATHS[keyof typeof PATHS];