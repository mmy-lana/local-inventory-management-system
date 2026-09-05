import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../services/db/schema';
import type { StockTransaction } from '../types';

export function useTransactions() {
  const transactions =
    useLiveQuery<StockTransaction[]>(() => db.transactions.reverse().sortBy('createdAt'), []) ?? [];

  return {
    transactions,
    loading: transactions === undefined,
  };
}