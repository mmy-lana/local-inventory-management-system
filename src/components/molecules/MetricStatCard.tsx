import React from 'react';
import { Card, Typography, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { MoneyText } from '../atoms/MoneyText';

const { Text } = Typography;

export interface MetricStatCardProps {
  title: string;
  value: number | string;
  isCurrency?: boolean;
  prefix?: React.ReactNode;
  suffix?: string;
  trendPercentage?: number;
  trendPeriod?: string;
  tooltipText?: string;
  indicatorColor?: string;
  loading?: boolean;
  precision?: number;
  onClick?: () => void;
  className?: string;
}

export const MetricStatCard: React.FC<MetricStatCardProps> = ({
  title,
  value,
  isCurrency = false,
  prefix,
  suffix,
  trendPercentage,
  trendPeriod = 'vs last month',
  tooltipText,
  indicatorColor,
  loading = false,
  precision = 2,
  onClick,
  className = '',
}) => {
  const isPositiveTrend = typeof trendPercentage === 'number' && trendPercentage > 0;
  const isNegativeTrend = typeof trendPercentage === 'number' && trendPercentage < 0;

  return (
    <Card
      size="small"
      loading={loading}
      className={className}
      onClick={onClick}
      style={{
        borderRadius: 2,
        borderColor: '#f0f0f0',
        backgroundColor: '#ffffff',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
      styles={{
        body: {
          padding: '8px 12px',
        },
      }}
    >
      {indicatorColor && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: 3,
            backgroundColor: indicatorColor,
          }}
        />
      )}

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 4,
        }}
      >
        <Text
          type="secondary"
          style={{
            fontSize: 11,
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: '#8c8c8c',
          }}
        >
          {title}
        </Text>

        {tooltipText && (
          <Tooltip title={tooltipText} placement="top" mouseEnterDelay={0.3}>
            <InfoCircleOutlined style={{ fontSize: 12, color: '#bfbfbf', cursor: 'pointer' }} />
          </Tooltip>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 6,
          minHeight: 24,
        }}
      >
        {prefix && (
          <span style={{ fontSize: 13, color: '#8c8c8c', display: 'inline-flex' }}>{prefix}</span>
        )}

        {isCurrency && typeof value === 'number' ? (
          <MoneyText amount={value} bold size="large" precision={precision} />
        ) : (
          <span
            style={{
              fontSize: 18,
              fontWeight: 600,
              color: '#1f1f1f',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1.2,
            }}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
        )}

        {suffix && (
          <Text type="secondary" style={{ fontSize: 11, color: '#8c8c8c' }}>
            {suffix}
          </Text>
        )}
      </div>

      {trendPercentage !== undefined && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            marginTop: 4,
            fontSize: 11,
            lineHeight: 1.2,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 600,
              color: isPositiveTrend ? '#389e0d' : isNegativeTrend ? '#cf1322' : '#8c8c8c',
            }}
          >
            {isPositiveTrend && <ArrowUpOutlined style={{ fontSize: 10, marginRight: 2 }} />}
            {isNegativeTrend && <ArrowDownOutlined style={{ fontSize: 10, marginRight: 2 }} />}
            {Math.abs(trendPercentage)}%
          </span>
          <span style={{ color: '#bfbfbf' }}>{trendPeriod}</span>
        </div>
      )}
    </Card>
  );
};