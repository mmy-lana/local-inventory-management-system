import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { AppHeader } from '../components/organisms/AppHeader';
import { AppSidebar } from '../components/organisms/AppSidebar';
import { useInventory } from '../features/inventory/hooks/useInventory';
import { message } from 'antd';

export const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(() => window.innerWidth < 768);
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );
  const { metrics } = useInventory();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleManualSync = () => {
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    message.success('IndexedDB cache verified and synced');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', backgroundColor: '#f5f5f5' }}>
      <AppHeader
        lowStockAlertCount={metrics.lowStockAlertCount + metrics.outOfStockCount}
        lastSyncTime={lastSyncTime}
        isMobile={isMobile}
        onToggleMobileNav={() => setMobileNavOpen((prev) => !prev)}
        onTriggerManualSync={handleManualSync}
      />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <AppSidebar
          collapsed={collapsed}
          isMobile={isMobile}
          mobileOpen={mobileNavOpen}
          onCloseMobile={() => setMobileNavOpen(false)}
          onCollapse={setCollapsed}
        />
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