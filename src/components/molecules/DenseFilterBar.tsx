import React, { useCallback } from 'react';
import { Select, Button, Space, Divider, Tooltip } from 'antd';
import {
  ReloadOutlined,
  DownloadOutlined,
  ColumnWidthOutlined,
} from '@ant-design/icons';
import { SearchBar } from './SearchBar';
import type { StockStatus, DensityMode } from '../../types/common';

export interface CategoryOption {
  label: string;
  value: string;
}

export interface DenseFilterBarProps {
  searchValue: string;
  selectedStatuses: StockStatus[];
  selectedCategoryId?: string;
  categoryOptions: CategoryOption[];
  density: DensityMode;
  totalRecords: number;
  loading?: boolean;
  onSearchChange: (val: string) => void;
  onStatusChange: (statuses: StockStatus[]) => void;
  onCategoryChange: (categoryId: string | undefined) => void;
  onDensityChange: (density: DensityMode) => void;
  onRefresh: () => void;
  onExport?: () => void;
  onResetFilters: () => void;
  extraActions?: React.ReactNode;
}

const STATUS_FILTER_OPTIONS = [
  { label: 'In Stock', value: 'IN_STOCK' },
  { label: 'Low Stock', value: 'LOW_STOCK' },
  { label: 'Out of Stock', value: 'OUT_OF_STOCK' },
  { label: 'Discontinued', value: 'DISCONTINUED' },
];

export const DenseFilterBar: React.FC<DenseFilterBarProps> = ({
  searchValue,
  selectedStatuses,
  selectedCategoryId,
  categoryOptions,
  density,
  totalRecords,
  loading = false,
  onSearchChange,
  onStatusChange,
  onCategoryChange,
  onDensityChange,
  onRefresh,
  onExport,
  onResetFilters,
  extraActions,
}) => {
  const hasActiveFilters =
    Boolean(searchValue) || selectedStatuses.length > 0 || Boolean(selectedCategoryId);

  const cycleDensity = useCallback(() => {
    const nextDensity: Record<DensityMode, DensityMode> = {
      compact: 'middle',
      middle: 'default',
      default: 'compact',
    };
    onDensityChange(nextDensity[density]);
  }, [density, onDensityChange]);

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
        padding: '6px 12px',
        backgroundColor: '#fafafa',
        border: '1px solid #f0f0f0',
        borderRadius: 2,
        marginBottom: 8,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <SearchBar
          value={searchValue}
          onSearch={onSearchChange}
          placeholder="Filter SKU or item..."
          width={220}
          size="small"
        />

        <Select
          mode="multiple"
          maxTagCount="responsive"
          allowClear
          placeholder="Filter status"
          value={selectedStatuses}
          onChange={onStatusChange}
          options={STATUS_FILTER_OPTIONS}
          size="small"
          style={{ minWidth: 150, maxWidth: 220, fontSize: 12 }}
        />

        <Select
          allowClear
          placeholder="All Categories"
          value={selectedCategoryId}
          onChange={onCategoryChange}
          options={categoryOptions}
          size="small"
          style={{ minWidth: 140, maxWidth: 200, fontSize: 12 }}
        />

        {hasActiveFilters && (
          <Button
            type="link"
            size="small"
            onClick={onResetFilters}
            style={{
              padding: '0 4px',
              fontSize: 12,
              color: '#d46b08',
              height: 24,
            }}
          >
            Reset Filters
          </Button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span
          style={{
            fontSize: 11,
            color: '#8c8c8c',
            fontVariantNumeric: 'tabular-nums',
            marginRight: 4,
          }}
        >
          Records: <strong>{totalRecords.toLocaleString()}</strong>
        </span>

        <Divider orientationMargin={0} type="vertical" style={{ height: 14, margin: '0 4px' }} />

        <Tooltip title={`Row Density: ${density}`} mouseEnterDelay={0.3}>
          <Button
            size="small"
            icon={<ColumnWidthOutlined />}
            onClick={cycleDensity}
            style={{ borderRadius: 2, fontSize: 12 }}
            aria-label="Toggle row density"
          />
        </Tooltip>

        <Tooltip title="Refresh Table Data" mouseEnterDelay={0.3}>
          <Button
            size="small"
            icon={<ReloadOutlined spin={loading} />}
            onClick={onRefresh}
            disabled={loading}
            style={{ borderRadius: 2, fontSize: 12 }}
            aria-label="Refresh table data"
          />
        </Tooltip>

        {onExport && (
          <Tooltip title="Export to CSV" mouseEnterDelay={0.3}>
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={onExport}
              style={{ borderRadius: 2, fontSize: 12 }}
              aria-label="Export data to CSV"
            >
              Export
            </Button>
          </Tooltip>
        )}

        {extraActions && (
          <Space size={6} style={{ marginLeft: 4 }}>
            {extraActions}
          </Space>
        )}
      </div>
    </div>
  );
};