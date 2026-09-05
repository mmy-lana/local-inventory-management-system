import React from 'react';
import { DashboardLayoutTemplate } from '../../components/templates/DashboardLayoutTemplate';
import { TransactionHistoryTable } from '../../features/transactions/components/TransactionHistoryTable';
import { useTransactions } from '../../features/transactions/hooks/useTransactions';

export const TransactionsPage: React.FC = () => {
  const { transactions, loading } = useTransactions();

  return (
    <DashboardLayoutTemplate
      title="Stock Audit Ledger"
      subtitle="Immutable record of material intake, disbursements, and quantity adjustments"
    >
      <TransactionHistoryTable transactions={transactions} loading={loading} />
    </DashboardLayoutTemplate>
  );
};