import React, { useState, useMemo } from 'react';
import { Table, Button, Space, Popconfirm, Modal, InputNumber, Input, Typography } from 'antd';
import type { TableColumnsType } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from '@ant-design/icons';
import type { Product } from '../types';
import type { DensityMode } from '../../../types/common';
import { StatusBadge } from '../../../components/atoms/StatusBadge';
import { DenseCell } from '../../../components/atoms/DenseCell';
import { MoneyText } from '../../../components/atoms/MoneyText';
import { StockLevelIndicator } from '../../../components/atoms/StockLevelIndicator';

const { Text } = Typography;

export interface ProductTableProps {
  products: Product[];
  density: DensityMode;
  loading?: boolean;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onAdjustStock: (id: string, delta: number, reason: string) => Promise<void>;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  density,
  loading = false,
  onEdit,
  onDelete,
  onAdjustStock,
}) => {
  const [adjustTarget, setAdjustTarget] = useState<Product | null>(null);
  const [adjustType, setAdjustType] = useState<'IN' | 'OUT'>('IN');
  const [adjustDelta, setAdjustDelta] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('Routine floor stock adjustment');
  const [adjustSubmitting, setAdjustSubmitting] = useState<boolean>(false);

  const openAdjustModal = (product: Product, type: 'IN' | 'OUT') => {
    setAdjustTarget(product);
    setAdjustType(type);
    setAdjustDelta(10);
    setAdjustReason(type === 'IN' ? 'Stock replenishment' : 'Production floor disbursement');
  };

  const handleConfirmAdjust = async () => {
    if (!adjustTarget || adjustDelta <= 0) return;
    setAdjustSubmitting(true);
    try {
      const finalDelta = adjustType === 'IN' ? adjustDelta : -adjustDelta;
      await onAdjustStock(adjustTarget.id, finalDelta, adjustReason);
      setAdjustTarget(null);
    } finally {
      setAdjustSubmitting(false);
    }
  };

  const columns: TableColumnsType<Product> = useMemo(
    () => [
      {
        title: 'SKU / Code',
        dataIndex: 'sku',
        key: 'sku',
        width: 140,
        fixed: 'left',
        sorter: (a, b) => a.sku.localeCompare(b.sku),
        render: (sku: string, record) => (
          <DenseCell
            value={sku}
            secondaryValue={record.barcode}
            monospace
            copyable
            bold
          />
        ),
      },
      {
        title: 'Product Details',
        dataIndex: 'name',
        key: 'name',
        width: 240,
        sorter: (a, b) => a.name.localeCompare(b.name),
        render: (name: string, record) => (
          <DenseCell
            value={name}
            secondaryValue={record.categoryName}
            maxWidth={230}
          />
        ),
      },
      {
        title: 'Bin Location',
        dataIndex: 'warehouseLocation',
        key: 'warehouseLocation',
        width: 130,
        render: (loc: string) => (
          <Text code style={{ fontSize: 11 }}>
            {loc || 'Unassigned'}
          </Text>
        ),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 110,
        sorter: (a, b) => a.status.localeCompare(b.status),
        render: (status: string) => <StatusBadge status={status} size="small" />,
      },
      {
        title: 'Stock Level & Meter',
        key: 'stockMeter',
        width: 150,
        sorter: (a, b) => a.currentStock - b.currentStock,
        render: (_, record) => (
          <StockLevelIndicator
            currentStock={record.currentStock}
            reorderLevel={record.reorderLevel}
            safetyStock={record.safetyStock}
            maxCapacity={record.maxCapacity}
            width={95}
          />
        ),
      },
      {
        title: 'Unit Cost',
        dataIndex: 'unitCost',
        key: 'unitCost',
        width: 90,
        align: 'right',
        sorter: (a, b) => a.unitCost - b.unitCost,
        render: (cost: number) => <MoneyText amount={cost} size="small" />,
      },
      {
        title: 'Unit Price',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        width: 90,
        align: 'right',
        sorter: (a, b) => a.unitPrice - b.unitPrice,
        render: (price: number) => <MoneyText amount={price} size="small" bold />,
      },
      {
        title: 'Inventory Value',
        key: 'totalValue',
        width: 110,
        align: 'right',
        sorter: (a, b) => a.currentStock * a.unitCost - b.currentStock * b.unitCost,
        render: (_, record) => (
          <MoneyText amount={record.currentStock * record.unitCost} size="small" bold />
        ),
      },
      {
        title: 'Operations',
        key: 'actions',
        width: 130,
        fixed: 'right',
        align: 'center',
        render: (_, record) => (
          <Space size={2}>
            <Button
              type="text"
              size="small"
              icon={<PlusCircleOutlined style={{ color: '#389e0d', fontSize: 13 }} />}
              onClick={() => openAdjustModal(record, 'IN')}
              title="Stock Intake"
              style={{ width: 22, height: 22, padding: 0 }}
            />
            <Button
              type="text"
              size="small"
              icon={<MinusCircleOutlined style={{ color: '#d46b08', fontSize: 13 }} />}
              onClick={() => openAdjustModal(record, 'OUT')}
              disabled={record.currentStock <= 0}
              title="Stock Outtake"
              style={{ width: 22, height: 22, padding: 0 }}
            />
            <Button
              type="text"
              size="small"
              icon={<EditOutlined style={{ color: '#0958d9', fontSize: 12 }} />}
              onClick={() => onEdit(record)}
              title="Edit Product"
              style={{ width: 22, height: 22, padding: 0 }}
            />
            <Popconfirm
              title="Delete Item"
              description={`Delete ${record.sku}? This deletes transaction history for this item.`}
              onConfirm={() => onDelete(record.id)}
              okText="Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true, size: 'small' }}
              cancelButtonProps={{ size: 'small' }}
            >
              <Button
                type="text"
                danger
                size="small"
                icon={<DeleteOutlined style={{ fontSize: 12 }} />}
                style={{ width: 22, height: 22, padding: 0 }}
              />
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [onEdit, onDelete]
  );

  return (
    <>
      <Table<Product>
        rowKey="id"
        size={density === 'compact' ? 'small' : density === 'middle' ? 'middle' : 'large'}
        columns={columns}
        dataSource={products}
        loading={loading}
        scroll={{ x: 1100, y: 'calc(100vh - 250px)' }}
        pagination={{
          size: 'small',
          showSizeChanger: true,
          defaultPageSize: 20,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} records`,
        }}
        bordered
      />

      <Modal
        open={Boolean(adjustTarget)}
        title={`Adjust Stock: ${adjustTarget?.sku}`}
        onCancel={() => setAdjustTarget(null)}
        onOk={handleConfirmAdjust}
        confirmLoading={adjustSubmitting}
        okText={adjustType === 'IN' ? 'Confirm Inbound Intake' : 'Confirm Outbound Disbursement'}
        width={420}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>
          <div style={{ fontSize: 12, color: '#595959' }}>
            Item: <strong>{adjustTarget?.name}</strong>
            <br />
            Current On-Hand: <strong>{adjustTarget?.currentStock.toLocaleString()} units</strong>
          </div>

          <div>
            <div style={{ fontSize: 11, marginBottom: 4, fontWeight: 500 }}>
              {adjustType === 'IN' ? 'Intake Quantity (+)' : 'Disbursement Quantity (-)'}
            </div>
            <InputNumber
              min={1}
              max={adjustType === 'OUT' ? adjustTarget?.currentStock : 999999}
              value={adjustDelta}
              onChange={(val) => setAdjustDelta(val ?? 1)}
              style={{ width: '100%' }}
              size="small"
            />
          </div>

          <div>
            <div style={{ fontSize: 11, marginBottom: 4, fontWeight: 500 }}>Reason / Ref Note</div>
            <Input
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              placeholder="e.g. Purchase delivery, scrapped damaged, assembly"
              size="small"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};