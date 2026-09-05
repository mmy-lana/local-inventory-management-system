import React, { useState, useCallback } from 'react';
import { Typography, Tooltip, message } from 'antd';
import { CopyOutlined, CheckOutlined } from '@ant-design/icons';

const { Text } = Typography;

export interface DenseCellProps {
  value: string | number | null | undefined;
  maxWidth?: number | string;
  monospace?: boolean;
  copyable?: boolean;
  copyText?: string;
  secondaryValue?: string | number | null;
  bold?: boolean;
  color?: 'default' | 'secondary' | 'danger' | 'warning' | 'success';
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  emptyPlaceholder?: string;
  ariaLabel?: string;
}

const COLOR_STYLE_MAP: Record<NonNullable<DenseCellProps['color']>, string> = {
  default: '#262626',
  secondary: '#8c8c8c',
  danger: '#cf1322',
  warning: '#d46b08',
  success: '#389e0d',
};

export const DenseCell: React.FC<DenseCellProps> = ({
  value,
  maxWidth = 200,
  monospace = false,
  copyable = false,
  copyText,
  secondaryValue,
  bold = false,
  color = 'default',
  prefixIcon,
  suffixIcon,
  align = 'left',
  emptyPlaceholder = '--',
  ariaLabel,
}) => {
  const [copied, setCopied] = useState(false);

  const displayPrimary = value !== null && value !== undefined && String(value).trim() !== ''
    ? String(value)
    : emptyPlaceholder;

  const rawTextToCopy = copyText ?? String(value ?? '');

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!rawTextToCopy) return;

      try {
        await navigator.clipboard.writeText(rawTextToCopy);
        setCopied(true);
        message.open({
          type: 'success',
          content: `Copied "${rawTextToCopy}" to clipboard`,
          duration: 1.5,
        });
        setTimeout(() => setCopied(false), 2000);
      } catch {
        message.error('Failed to copy to clipboard');
      }
    },
    [rawTextToCopy]
  );

  return (
    <div
      style={{
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: align === 'right' ? 'flex-end' : align === 'center' ? 'center' : 'flex-start',
        maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
        overflow: 'hidden',
        verticalAlign: 'middle',
        lineHeight: 1.25,
      }}
      aria-label={ariaLabel ?? String(displayPrimary)}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          maxWidth: '100%',
        }}
      >
        {prefixIcon && (
          <span style={{ display: 'inline-flex', flexShrink: 0, fontSize: 12, color: '#8c8c8c' }}>
            {prefixIcon}
          </span>
        )}

        <Tooltip title={displayPrimary !== emptyPlaceholder ? displayPrimary : undefined} mouseEnterDelay={0.4}>
          <Text
            ellipsis
            style={{
              fontSize: 12,
              fontWeight: bold ? 600 : 400,
              fontFamily: monospace ? 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace' : 'inherit',
              color: COLOR_STYLE_MAP[color],
              letterSpacing: monospace ? '-0.02em' : 'normal',
              cursor: copyable ? 'pointer' : 'inherit',
            }}
          >
            {displayPrimary}
          </Text>
        </Tooltip>

        {copyable && displayPrimary !== emptyPlaceholder && (
          <Tooltip title={copied ? 'Copied' : 'Copy'} mouseEnterDelay={0.2}>
            <button
              type="button"
              onClick={handleCopy}
              aria-label={`Copy ${displayPrimary}`}
              style={{
                border: 'none',
                background: 'transparent',
                padding: '1px 2px',
                margin: 0,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                color: copied ? '#52c41a' : '#bfbfbf',
                fontSize: 11,
                lineHeight: 1,
                borderRadius: 2,
                transition: 'color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!copied) (e.currentTarget.style.color = '#1890ff');
              }}
              onMouseLeave={(e) => {
                if (!copied) (e.currentTarget.style.color = '#bfbfbf');
              }}
            >
              {copied ? <CheckOutlined /> : <CopyOutlined />}
            </button>
          </Tooltip>
        )}

        {suffixIcon && (
          <span style={{ display: 'inline-flex', flexShrink: 0, fontSize: 12, color: '#8c8c8c' }}>
            {suffixIcon}
          </span>
        )}
      </div>

      {secondaryValue && (
        <Text
          ellipsis
          type="secondary"
          style={{
            fontSize: 10,
            lineHeight: 1.2,
            marginTop: 1,
            color: '#8c8c8c',
            maxWidth: '100%',
          }}
        >
          {String(secondaryValue)}
        </Text>
      )}
    </div>
  );
};