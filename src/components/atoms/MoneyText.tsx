import React, { useMemo } from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

export interface MoneyTextProps {
  amount: number | null | undefined;
  currency?: string;
  locale?: string;
  precision?: number;
  highlightSign?: boolean;
  bold?: boolean;
  size?: 'small' | 'default' | 'large';
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const MoneyText: React.FC<MoneyTextProps> = ({
  amount,
  currency = 'USD',
  locale = 'en-US',
  precision = 2,
  highlightSign = false,
  bold = false,
  size = 'default',
  prefix,
  suffix,
  className = '',
}) => {
  const numericAmount = typeof amount === 'number' && !Number.isNaN(amount) ? amount : 0;

  const { formattedParts, isNegative, isPositive } = useMemo(() => {
    try {
      const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: precision,
        maximumFractionDigits: precision,
      });

      const parts = formatter.formatToParts(Math.abs(numericAmount));
      const currencySymbol = parts.find((p) => p.type === 'currency')?.value ?? currency;
      const integerPart = parts
        .filter((p) => p.type === 'integer' || p.type === 'group')
        .map((p) => p.value)
        .join('');
      const decimalSeparator = parts.find((p) => p.type === 'decimal')?.value ?? '.';
      const fractionPart = parts.find((p) => p.type === 'fraction')?.value ?? '00';

      return {
        formattedParts: {
          currencySymbol,
          integerPart,
          decimalSeparator,
          fractionPart,
        },
        isNegative: numericAmount < 0,
        isPositive: numericAmount > 0,
      };
    } catch {
      return {
        formattedParts: {
          currencySymbol: currency,
          integerPart: Math.abs(numericAmount).toFixed(0),
          decimalSeparator: '.',
          fractionPart: '00',
        },
        isNegative: numericAmount < 0,
        isPositive: numericAmount > 0,
      };
    }
  }, [numericAmount, currency, locale, precision]);

  const textColor = useMemo(() => {
    if (!highlightSign) return 'inherit';
    if (isNegative) return '#cf1322';
    if (isPositive) return '#389e0d';
    return '#8c8c8c';
  }, [highlightSign, isNegative, isPositive]);

  const fontSizeMap = {
    small: { base: 11, fraction: 10, symbol: 10 },
    default: { base: 12, fraction: 11, symbol: 11 },
    large: { base: 14, fraction: 12, symbol: 12 },
  };

  const selectedSize = fontSizeMap[size];

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '-0.01em',
        color: textColor,
        fontWeight: bold ? 600 : 400,
        whiteSpace: 'nowrap',
      }}
      aria-label={`${isNegative ? 'Minus ' : ''}${formattedParts.currencySymbol} ${numericAmount.toFixed(precision)}`}
    >
      {prefix && <span style={{ marginRight: 3, color: '#8c8c8c' }}>{prefix}</span>}

      {isNegative && <span style={{ marginRight: 1 }}>-</span>}
      {highlightSign && isPositive && <span style={{ marginRight: 1 }}>+</span>}

      <span
        style={{
          fontSize: selectedSize.symbol,
          marginRight: 2,
          color: highlightSign ? textColor : '#595959',
          fontWeight: 400,
        }}
      >
        {formattedParts.currencySymbol}
      </span>

      <Text
        style={{
          fontSize: selectedSize.base,
          fontWeight: bold ? 600 : 400,
          color: textColor,
        }}
      >
        {formattedParts.integerPart}
      </Text>

      {precision > 0 && (
        <span
          style={{
            fontSize: selectedSize.fraction,
            color: highlightSign ? textColor : '#595959',
          }}
        >
          {formattedParts.decimalSeparator}
          {formattedParts.fractionPart}
        </span>
      )}

      {suffix && <span style={{ marginLeft: 3, color: '#8c8c8c' }}>{suffix}</span>}
    </span>
  );
};