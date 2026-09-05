import React, { useMemo } from 'react';
import { Menu } from 'antd';
import type { MenuProps } from 'antd';
import {
  DashboardOutlined,
  InboxOutlined,
  AppstoreOutlined,
  SwapOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

export interface AppSidebarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  className?: string;
}

type MenuItem = Required<MenuProps>['items'][number];

const MENU_ITEMS: MenuItem[] = [
  {
    key: '/',
    icon: <DashboardOutlined style={{ fontSize: 13 }} />,
    label: 'Dashboard',
  },
  {
    key: '/inventory',
    icon: <InboxOutlined style={{ fontSize: 13 }} />,
    label: 'Inventory Master',
  },
  {
    key: '/categories',
    icon: <AppstoreOutlined style={{ fontSize: 13 }} />,
    label: 'Categories',
  },
  {
    key: '/transactions',
    icon: <SwapOutlined style={{ fontSize: 13 }} />,
    label: 'Stock Ledger',
  },
  {
    type: 'divider',
  },
  {
    key: '/audit-logs',
    icon: <FileTextOutlined style={{ fontSize: 13 }} />,
    label: 'Audit Trail',
  },
];

export const AppSidebar: React.FC<AppSidebarProps> = ({
  collapsed = false,
  className = '',
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKeys = useMemo(() => {
    const pathname = location.pathname;
    if (pathname === '/') return ['/'];
    const matchedItem = MENU_ITEMS.find((item) => item?.key && pathname.startsWith(String(item.key)));
    return matchedItem?.key ? [String(matchedItem.key)] : ['/'];
  }, [location.pathname]);

  const handleMenuClick: MenuProps['onClick'] = (info) => {
    navigate(info.key);
  };

  return (
    <aside
      className={className}
      style={{
        width: collapsed ? 56 : 200,
        minWidth: collapsed ? 56 : 200,
        height: 'calc(100vh - 44px)',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e8e8e8',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.2s cubic-bezier(0.2, 0, 0, 1)',
        userSelect: 'none',
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
        <div
          style={{
            padding: collapsed ? '10px 0' : '10px 14px 4px 14px',
            fontSize: 10,
            fontWeight: 600,
            textTransform: 'uppercase',
            color: '#8c8c8c',
            letterSpacing: '0.05em',
            textAlign: collapsed ? 'center' : 'left',
          }}
        >
          {collapsed ? 'NAV' : 'OPERATIONS'}
        </div>

        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          selectedKeys={selectedKeys}
          items={MENU_ITEMS}
          onClick={handleMenuClick}
          style={{
            borderRight: 'none',
            fontSize: 12,
            fontWeight: 400,
          }}
        />
      </div>

      <div
        style={{
          padding: '8px 12px',
          borderTop: '1px solid #f0f0f0',
          backgroundColor: '#fafafa',
          fontSize: 10,
          color: '#8c8c8c',
          textAlign: collapsed ? 'center' : 'left',
          lineHeight: 1.3,
        }}
      >
        {collapsed ? (
          <span>v1.0</span>
        ) : (
          <div>
            <div style={{ fontWeight: 600, color: '#595959' }}>Engine v1.0.0</div>
            <div>IndexedDB Offline Store</div>
          </div>
        )}
      </div>
    </aside>
  );
};