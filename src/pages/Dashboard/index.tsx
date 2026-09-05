import React from 'react';
import { Row, Col, Card, Table } from 'antd';
import type { TableColumnsType } from 'antd';
import { DashboardLayoutTemplate } from '../../components/templates/DashboardLayoutTemplate';
import { MetricStatCard } from '../../components/molecules/MetricStatCard';
import { StatusBadge } from '../../components/atoms/StatusBadge';
import { DenseCell } from '../../components/atoms/DenseCell';
import { MoneyText } from '../../components/atoms/MoneyText';
import { useInventory } from '../../features/inventory/hooks/useInventory';
import { useTransactions } from '../../features/transactions/hooks/useTransactions';
import { useCategories } from '../../features/categories/hooks/useCategories';
import type { Product } from '../../features/inventory/types';
import type { StockTransaction } from '../../features/transactions/types';
import { formatDateTime } from '../../utils/formatters';

export const DashboardPage: React.FC = () => {
  const { allProducts, metrics } = useInventory();
  const { transactions } = useTransactions();
  const { categories } = useCategories();

  const criticalItems = allProducts
    .filter((p) => p.status === 'LOW_STOCK' || p.status === 'OUT_OF_STOCK')
    .slice(0, 5);

  const recentTransactions = transactions.slice(0, 5);

  const alertColumns: TableColumnsType<Product> = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: 130,
      render: (sku: string) => <DenseCell value={sku} monospace bold />,
    },
    {
      title: 'Product Title',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      render: (name: string, r) => <DenseCell value={name} secondaryValue={r.categoryName} maxWidth={210} />,
    },
    {
      title: 'On-Hand',
      dataIndex: 'currentStock',
      key: 'currentStock',
      width: 85,
      align: 'right',
      render: (qty: number) => <strong>{qty.toLocaleString()}</strong>,
    },
    {
      title: 'Reorder',
      dataIndex: 'reorderLevel',
      key: 'reorderLevel',
      width: 80,
      align: 'right',
      render: (reorder: number) => <span style={{ color: '#8c8c8c' }}>{reorder.toLocaleString()}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 115,
      render: (status: string) => <StatusBadge status={status} />,
    },
  ];

  const recentTxColumns: TableColumnsType<StockTransaction> = [
    {
      title: 'Timestamp',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 145,
      render: (d: string) => (
        <span style={{ fontSize: 11, fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
          {formatDateTime(d)}
        </span>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 105,
      render: (type: string) => {
        const color = type === 'INBOUND' ? '#389e0d' : type === 'OUTBOUND' ? '#cf1322' : '#0958d9';
        return (
          <span style={{ fontSize: 11, fontWeight: 600, color, whiteSpace: 'nowrap' }}>
            {type}
          </span>
        );
      },
    },
    {
      title: 'Item',
      dataIndex: 'sku',
      key: 'sku',
      width: 180,
      render: (sku: string, r) => <DenseCell value={sku} secondaryValue={r.productName} monospace maxWidth={170} />,
    },
    {
      title: 'Qty',
      dataIndex: 'quantityChange',
      key: 'quantityChange',
      width: 75,
      align: 'right',
      render: (q: number) => (
        <span style={{ fontWeight: 600, color: q > 0 ? '#389e0d' : '#cf1322', fontVariantNumeric: 'tabular-nums' }}>
          {q > 0 ? `+${q}` : q}
        </span>
      ),
    },
    {
      title: 'Value',
      dataIndex: 'totalValue',
      key: 'totalValue',
      width: 95,
      align: 'right',
      render: (val: number, r) => (
        <MoneyText amount={r.type === 'OUTBOUND' ? -val : val} size="small" highlightSign />
      ),
    },
  ];

  return (
    <DashboardLayoutTemplate
      title="Inventory Command Center"
      subtitle="Real-time stock valuation, deficit warnings, and warehouse movements"
      metricsBar={
        <Row gutter={[8, 8]}>
          <Col xs={12} sm={8} lg={4}>
            <MetricStatCard title="Active SKUs" value={metrics.totalSkus} suffix="lines" />
          </Col>
          <Col xs={12} sm={8} lg={4}>
            <MetricStatCard title="Units On-Hand" value={metrics.totalUnitsInStock} suffix="units" />
          </Col>
          <Col xs={12} sm={8} lg={4}>
            <MetricStatCard
              title="Asset Valuation"
              value={metrics.totalAssetValuation}
              isCurrency
              indicatorColor="#0958d9"
            />
          </Col>
          <Col xs={12} sm={8} lg={4}>
            <MetricStatCard
              title="Retail Value"
              value={metrics.totalRetailValuation}
              isCurrency
              indicatorColor="#52c41a"
            />
          </Col>
          <Col xs={12} sm={8} lg={4}>
            <MetricStatCard
              title="Low Stock Alerts"
              value={metrics.lowStockAlertCount}
              indicatorColor="#fa8c16"
              suffix="items"
            />
          </Col>
          <Col xs={12} sm={8} lg={4}>
            <MetricStatCard
              title="Out of Stock"
              value={metrics.outOfStockCount}
              indicatorColor="#cf1322"
              suffix="items"
            />
          </Col>
        </Row>
      }
    >
      <Row gutter={[12, 12]} style={{ marginTop: 8 }}>
        <Col xs={24} lg={12}>
          <Card
            title={<span style={{ fontSize: 12, fontWeight: 600 }}>Action Required: Low & Exhausted Stock</span>}
            size="small"
            style={{ borderRadius: 2 }}
          >
            <Table<Product>
              columns={alertColumns}
              dataSource={criticalItems}
              rowKey="id"
              size="small"
              scroll={{ x: 550 }}
              pagination={false}
              locale={{ emptyText: 'No critical inventory shortages detected' }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title={<span style={{ fontSize: 12, fontWeight: 600 }}>Recent Ledger Movements</span>}
            size="small"
            style={{ borderRadius: 2 }}
          >
            <Table<StockTransaction>
              columns={recentTxColumns}
              dataSource={recentTransactions}
              rowKey="id"
              size="small"
              scroll={{ x: 580 }}
              pagination={false}
              locale={{ emptyText: 'No transaction entries on record' }}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginTop: 12 }}>
        <Card title={<span style={{ fontSize: 12, fontWeight: 600 }}>Category Stock Volume</span>} size="small">
          <Row gutter={[12, 8]}>
            {categories.map((c) => (
              <Col xs={12} sm={6} key={c.id}>
                <div style={{ padding: '6px 8px', border: '1px solid #f0f0f0', borderRadius: 2 }}>
                  <div style={{ fontSize: 11, color: '#8c8c8c' }}>{c.name}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, marginTop: 2 }}>{c.itemCount} SKUs</div>
                </div>
              </Col>
            ))}
          </Row>
        </Card>
      </div>
    </DashboardLayoutTemplate>
  );
};