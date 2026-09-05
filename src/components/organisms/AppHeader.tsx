import React from 'react';
import { Typography, Badge, Space, Button, Tooltip, Divider } from 'antd';
import {
  BellOutlined,
  DatabaseOutlined,
  CloudSyncOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

export interface AppHeaderProps {
  systemTitle?: string;
  activeEnvironment?: string;
  lowStockAlertCount?: number;
  lastSyncTime?: string;
  onTriggerManualSync?: () => void;
  onOpenSettings?: () => void;
  className?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  systemTitle = 'Local Inventory Engine',
  activeEnvironment = 'Local IndexedDB',
  lowStockAlertCount = 0,
  lastSyncTime = 'Just now',
  onTriggerManualSync,
  onOpenSettings,
  className = '',
}) => {
  return (
    <header
      className={className}
      style={{
        height: 44,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e8e8e8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'sticky',
        top: 0,
        zIndex: 99,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <DatabaseOutlined style={{ fontSize: 16, color: '#0958d9' }} />
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <Title
            level={5}
            style={{
              margin: 0,
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: '-0.02em',
              color: '#141414',
            }}
          >
            {systemTitle}
          </Title>
          <span
            style={{
              fontSize: 10,
              padding: '1px 6px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #d9d9d9',
              borderRadius: 2,
              color: '#595959',
              fontFamily: 'monospace',
              fontWeight: 500,
            }}
          >
            {activeEnvironment}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            color: '#8c8c8c',
          }}
        >
          <span>Last Indexed:</span>
          <Text code style={{ fontSize: 11, margin: 0, padding: '0 4px' }}>
            {lastSyncTime}
          </Text>
        </div>

        {onTriggerManualSync && (
          <Tooltip title="Synchronize local database" mouseEnterDelay={0.3}>
            <Button
              type="text"
              size="small"
              icon={<CloudSyncOutlined style={{ fontSize: 13, color: '#595959' }} />}
              onClick={onTriggerManualSync}
              style={{ width: 26, height: 26, padding: 0, borderRadius: 2 }}
              aria-label="Synchronize database"
            />
          </Tooltip>
        )}

        <Divider orientationMargin={0} type="vertical" style={{ height: 16, margin: '0 2px' }} />

        <Space size={8}>
          <Tooltip
            title={
              lowStockAlertCount > 0
                ? `${lowStockAlertCount} items reached threshold`
                : 'All stock levels optimal'
            }
            mouseEnterDelay={0.3}
          >
            <Badge
              count={lowStockAlertCount}
              overflowCount={99}
              size="small"
              offset={[-2, 2]}
              styles={{
                indicator: {
                  backgroundColor: lowStockAlertCount > 0 ? '#cf1322' : '#52c41a',
                  fontSize: 10,
                  height: 14,
                  minWidth: 14,
                  lineHeight: '14px',
                  borderRadius: 7,
                },
              }}
            >
              <Button
                type="text"
                size="small"
                icon={<BellOutlined style={{ fontSize: 14, color: '#595959' }} />}
                style={{ width: 26, height: 26, padding: 0, borderRadius: 2 }}
                aria-label={`Alerts: ${lowStockAlertCount}`}
              />
            </Badge>
          </Tooltip>

          {onOpenSettings && (
            <Tooltip title="System Configuration" mouseEnterDelay={0.3}>
              <Button
                type="text"
                size="small"
                icon={<SettingOutlined style={{ fontSize: 14, color: '#595959' }} />}
                onClick={onOpenSettings}
                style={{ width: 26, height: 26, padding: 0, borderRadius: 2 }}
                aria-label="Open settings"
              />
            </Tooltip>
          )}
        </Space>
      </div>
    </header>
  );
};