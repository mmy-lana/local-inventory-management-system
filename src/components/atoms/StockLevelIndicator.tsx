import React, { useMemo } from 'react';
import { Tooltip } from 'antd';

export interface StockLevelIndicatorProps {
  currentStock: number;
  reorderLevel: number;
  safetyStock?: number;
  maxCapacity?: number;
  width?: number;
  height?: number;
  showRatioText?: boolean;
}

interface StockVisualState {
  percentage: number;
  barColor: string;
  statusLabel: string;
}

export const StockLevelIndicator: React.FC<StockLevelIndicatorProps> = ({
  currentStock,
  reorderLevel,
  safetyStock = 0,
  maxCapacity,
  width = 80,
  height = 5,
  showRatioText = true,
}) => {
  const calculatedMax = useMemo(() => {
    if (maxCapacity && maxCapacity > 0) {
      return maxCapacity;
    }
    const derivedMax = Math.max(currentStock, reorderLevel * 2, 50);
    return derivedMax;
  }, [currentStock, reorderLevel, maxCapacity]);

  const state = useMemo<StockVisualState>(() => {
    const rawRatio = calculatedMax > 0 ? (currentStock / calculatedMax) * 100 : 0;
    const clampedPercentage = Math.min(Math.max(rawRatio, 0), 100);

    if (currentStock <= 0) {
      return {
        percentage: 0,
        barColor: '#ff4d4f',
        statusLabel: 'Critical: Zero Stock',
      };
    }

    if (currentStock <= safetyStock) {
      return {
        percentage: clampedPercentage,
        barColor: '#cf1322',
        statusLabel: 'Hazard: Below Safety Stock Threshold',
      };
    }

    if (currentStock <= reorderLevel) {
      return {
        percentage: clampedPercentage,
        barColor: '#fa8c16',
        statusLabel: 'Warning: Reorder Threshold Reached',
      };
    }

    return {
      percentage: clampedPercentage,
      barColor: '#52c41a',
      statusLabel: 'Healthy: Sufficient Inventory',
    };
  }, [currentStock, reorderLevel, safetyStock, calculatedMax]);

  const reorderMarkerOffset = useMemo(() => {
    if (calculatedMax <= 0) return 0;
    const ratio = (reorderLevel / calculatedMax) * 100;
    return Math.min(Math.max(ratio, 0), 100);
  }, [reorderLevel, calculatedMax]);

  const tooltipTitle = (
    <div style={{ fontSize: 11, lineHeight: 1.4 }}>
      <div><strong>Status:</strong> {state.statusLabel}</div>
      <div><strong>Current:</strong> {currentStock.toLocaleString()} units</div>
      <div><strong>Reorder Level:</strong> {reorderLevel.toLocaleString()} units</div>
      {safetyStock > 0 && <div><strong>Safety Stock:</strong> {safetyStock.toLocaleString()} units</div>}
      <div><strong>Capacity Benchmark:</strong> {calculatedMax.toLocaleString()} units</div>
    </div>
  );

  return (
    <Tooltip title={tooltipTitle} placement="top" mouseEnterDelay={0.3}>
      <div
        style={{
          display: 'inline-flex',
          flexDirection: 'column',
          gap: 3,
          width,
          cursor: 'default',
        }}
        role="meter"
        aria-valuenow={currentStock}
        aria-valuemin={0}
        aria-valuemax={calculatedMax}
        aria-valuetext={`${currentStock} units in stock`}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height,
            backgroundColor: '#f0f0f0',
            borderRadius: height / 2,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: `${state.percentage}%`,
              height: '100%',
              backgroundColor: state.barColor,
              borderRadius: height / 2,
              transition: 'width 0.3s ease, background-color 0.3s ease',
            }}
          />

          {reorderMarkerOffset > 0 && reorderMarkerOffset < 100 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${reorderMarkerOffset}%`,
                width: 1.5,
                backgroundColor: '#8c8c8c',
                opacity: 0.8,
                zIndex: 2,
              }}
            />
          )}
        </div>

        {showRatioText && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: 10,
              lineHeight: 1,
              color: '#8c8c8c',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            <span style={{ fontWeight: 600, color: state.barColor }}>
              {currentStock.toLocaleString()}
            </span>
            <span style={{ color: '#bfbfbf' }}>/ {calculatedMax.toLocaleString()}</span>
          </div>
        )}
      </div>
    </Tooltip>
  );
};