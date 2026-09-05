export const PATHS = {
  DASHBOARD: '/',
  INVENTORY: '/inventory',
  CATEGORIES: '/categories',
  TRANSACTIONS: '/transactions',
} as const;

export type AppPath = typeof PATHS[keyof typeof PATHS];