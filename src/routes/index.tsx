import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { DashboardPage } from '../pages/Dashboard';
import { InventoryPage } from '../pages/Inventory';
import { CategoriesPage } from '../pages/Categories';
import { TransactionsPage } from '../pages/Transactions';
import { PATHS } from './paths';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: PATHS.DASHBOARD,
        element: <DashboardPage />,
      },
      {
        path: PATHS.INVENTORY,
        element: <InventoryPage />,
      },
      {
        path: PATHS.CATEGORIES,
        element: <CategoriesPage />,
      },
      {
        path: PATHS.TRANSACTIONS,
        element: <TransactionsPage />,
      },
      {
        path: PATHS.AUDIT_LOGS,
        element: <TransactionsPage />,
      },
      {
        path: '*',
        element: <Navigate to={PATHS.DASHBOARD} replace />,
      },
    ],
  },
]);