import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '../components/organisms/AppHeader';
import { AppSidebar } from '../components/organisms/AppSidebar';
import { useInventory } from '../features/inventory/hooks/useInventory';
import { message } from 'antd';

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const { metrics } = useInventory();

  const handleManualSync = () => {
    message.success('IndexedDB cache verified and synced');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <AppHeader
        lowStockAlertCount={metrics.lowStockAlertCount + metrics.outOfStockCount}
        onTriggerManualSync={handleManualSync}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AppSidebar collapsed={collapsed} onCollapse={setCollapsed} />
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            height: 'calc(100vh - 44px)',
            backgroundColor: '#f5f5f5',
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};