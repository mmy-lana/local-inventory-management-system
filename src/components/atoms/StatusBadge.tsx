import React, { useMemo } from 'react';
import { Tag, Tooltip } from 'antd';
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  StopOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import type { StockStatus } from '../../types/common';

export interface StatusBadgeProps {
  status: StockStatus | string;
  customLabel?: string;
  showIcon?: boolean;
  tooltipText?: string;
  size?: 'small' | 'default';
  className?: string;
}

interface StatusVisualConfig {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  defaultLabel: string;
}

const STATUS_CONFIG_MAP: Record<StockStatus, StatusVisualConfig> = {
  IN_STOCK: {
    color: '#389e0d',
    bgColor: '#f6ffed',
    borderColor: '#b7eb8f',
    icon: <CheckCircleOutlined />,
    defaultLabel: 'In Stock',
  },
  LOW_STOCK: {
    color: '#d46b08',
    bgColor: '#fff7e6',
    borderColor: '#ffd591',
    icon: <ExclamationCircleOutlined />,
    defaultLabel: 'Low Stock',
  },
  OUT_OF_STOCK: {
    color: '#cf1322',
    bgColor: '#fff1f0',
    borderColor: '#ffa39e',
    icon: <CloseCircleOutlined />,
    defaultLabel: 'Out of Stock',
  },
  DISCONTINUED: {
    color: '#595959',
    bgColor: '#f5f5f5',
    borderColor: '#d9d9d9',
    icon: <StopOutlined />,
    defaultLabel: 'Discontinued',
  },
};

const FALLBACK_CONFIG: StatusVisualConfig = {
  color: '#0958d9',
  bgColor: '#e6f4ff',
  borderColor: '#91caff',
  icon: <SyncOutlined />,
  defaultLabel: 'Unknown',
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  customLabel,
  showIcon = true,
  tooltipText,
  size = 'small',
  className = '',
}) => {
  const config = useMemo<StatusVisualConfig>(() => {
    const normalizedKey = status.toUpperCase() as StockStatus;
    return STATUS_CONFIG_MAP[normalizedKey] ?? {
      ...FALLBACK_CONFIG,
      defaultLabel: status,
    };
  }, [status]);

  const displayLabel = customLabel ?? config.defaultLabel;

  const badgeContent = (
    <Tag
      icon={showIcon ? config.icon : undefined}
      style={{
        color: config.color,
        backgroundColor: config.bgColor,
        borderColor: config.borderColor,
        fontSize: size === 'small' ? 11 : 12,
        padding: size === 'small' ? '0px 5px' : '2px 8px',
        lineHeight: size === 'small' ? '18px' : '22px',
        marginInlineEnd: 0,
        fontWeight: 500,
        borderRadius: 2,
        letterSpacing: '0.02em',
        userSelect: 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
      }}
      className={className}
      aria-label={`Status: ${displayLabel}`}
      role="status"
    >
      {displayLabel}
    </Tag>
  );

  if (tooltipText) {
    return (
      <Tooltip title={tooltipText} placement="top" mouseEnterDelay={0.3}>
        <span>{badgeContent}</span>
      </Tooltip>
    );
  }

  return badgeContent;
};