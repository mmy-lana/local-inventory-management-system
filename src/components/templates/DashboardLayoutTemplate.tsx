import React from 'react';
import { Breadcrumb, Typography, Space } from 'antd';
import type { ItemType } from 'antd/es/breadcrumb/Breadcrumb';

const { Title } = Typography;

export interface DashboardLayoutTemplateProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: ItemType[];
  actions?: React.ReactNode;
  metricsBar?: React.ReactNode;
  children: React.ReactNode;
}

export const DashboardLayoutTemplate: React.FC<DashboardLayoutTemplateProps> = ({
  title,
  subtitle,
  breadcrumbs,
  actions,
  metricsBar,
  children,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: '12px 16px',
        maxWidth: 1600,
        margin: '0 auto',
        width: '100%',
      }}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb items={breadcrumbs} style={{ fontSize: 11 }} />
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
            {title}
          </Title>
          {subtitle && (
            <span style={{ fontSize: 11, color: '#8c8c8c', lineHeight: 1.2 }}>
              {subtitle}
            </span>
          )}
        </div>

        {actions && <Space size={8}>{actions}</Space>}
      </div>

      {metricsBar && <div style={{ margin: '4px 0' }}>{metricsBar}</div>}

      <div style={{ width: '100%' }}>{children}</div>
    </div>
  );
};