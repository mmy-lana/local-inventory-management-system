import React, { useMemo } from 'react';
import { Table, Tag } from 'antd';
import type { TableColumnsType } from 'antd';
import type { StockTransaction } from '../types';
import { DenseCell } from '../../../components/atoms/DenseCell';
import { MoneyText } from '../../../components/atoms/MoneyText';
import { formatDateTime } from '../../../utils/formatters';

export interface TransactionHistoryTableProps {
  transactions: StockTransaction[];
  loading?: boolean;
}

export const TransactionHistoryTable: React.FC<TransactionHistoryTableProps> = ({
  transactions,
  loading = false,
}) => {
  const columns: TableColumnsType<StockTransaction> = useMemo(
    () => [
      {
        title: 'Date & Timestamp',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 140,
        render: (dateStr: string) => (
          <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#595959' }}>
            {formatDateTime(dateStr)}
          </span>
        ),
      },
      {
        title: 'Type',
        dataIndex: 'type',
        key: 'type',
        width: 100,
        render: (type: string) => {
          const colorMap: Record<string, string> = {
            INBOUND: 'green',
            OUTBOUND: 'volcano',
            ADJUSTMENT: 'blue',
            TRANSFER: 'purple',
          };
          return (
            <Tag color={colorMap[type] || 'default'} style={{ fontSize: 10, lineHeight: '18px' }}>
              {type}
            </Tag>
          );
        },
      },
      {
        title: 'SKU / Product',
        dataIndex: 'sku',
        key: 'sku',
        width: 200,
        render: (sku: string, record) => (
          <DenseCell
            value={sku}
            secondaryValue={record.productName}
            monospace
            bold
            maxWidth={190}
          />
        ),
      },
      {
        title: 'Delta Quantity',
        dataIndex: 'quantityChange',
        key: 'quantityChange',
        width: 110,
        align: 'right',
        render: (qty: number) => {
          const isPositive = qty > 0;
          return (
            <span
              style={{
                fontWeight: 600,
                fontSize: 12,
                color: isPositive ? '#389e0d' : '#cf1322',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {isPositive ? `+${qty.toLocaleString()}` : qty.toLocaleString()}
            </span>
          );
        },
      },
      {
        title: 'Balance After',
        dataIndex: 'quantityAfter',
        key: 'quantityAfter',
        width: 100,
        align: 'right',
        render: (qty: number) => (
          <span style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', color: '#1f1f1f' }}>
            {qty.toLocaleString()}
          </span>
        ),
      },
      {
        title: 'Valuation Impact',
        dataIndex: 'totalValue',
        key: 'totalValue',
        width: 110,
        align: 'right',
        render: (val: number, record) => (
          <MoneyText
            amount={record.type === 'OUTBOUND' ? -val : val}
            size="small"
            highlightSign
          />
        ),
      },
      {
        title: 'Reason / Ref',
        dataIndex: 'reason',
        key: 'reason',
        render: (reason: string, record) => (
          <DenseCell
            value={reason}
            secondaryValue={record.referenceNumber ? `Ref: ${record.referenceNumber}` : undefined}
            maxWidth={260}
          />
        ),
      },
      {
        title: 'Operator',
        dataIndex: 'performedBy',
        key: 'performedBy',
        width: 130,
        render: (op: string) => <span style={{ fontSize: 11, color: '#8c8c8c' }}>{op}</span>,
      },
    ],
    []
  );

  return (
    <Table<StockTransaction>
      rowKey="id"
      size="small"
      columns={columns}
      dataSource={transactions}
      loading={loading}
      pagination={{
        size: 'small',
        defaultPageSize: 25,
        pageSizeOptions: ['15', '25', '50', '100'],
        showSizeChanger: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} entries`,
      }}
      bordered
    />
  );
};