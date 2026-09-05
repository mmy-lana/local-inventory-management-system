import React, { useState, useMemo } from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { DashboardLayoutTemplate } from '../../components/templates/DashboardLayoutTemplate';
import { DenseFilterBar } from '../../components/molecules/DenseFilterBar';
import { ProductTable } from '../../features/inventory/components/ProductTable';
import { ProductFormModal } from '../../features/inventory/components/ProductFormModal';
import { useInventory } from '../../features/inventory/hooks/useInventory';
import { useCategories } from '../../features/categories/hooks/useCategories';
import type { Product, CreateProductDTO } from '../../features/inventory/types';
import type { DensityMode } from '../../types/common';

export const InventoryPage: React.FC = () => {
  const {
    products,
    searchTerm,
    selectedStatuses,
    selectedCategoryId,
    isMutating,
    setSearchTerm,
    setSelectedStatuses,
    setSelectedCategoryId,
    resetFilters,
    createProduct,
    updateProduct,
    adjustStock,
    deleteProduct,
  } = useInventory();

  const { categories } = useCategories();

  const [density, setDensity] = useState<DensityMode>('compact');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ label: c.name, value: c.id })),
    [categories]
  );

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleModalSubmit = async (values: CreateProductDTO) => {
    if (editingProduct) {
      await updateProduct(editingProduct.id, values);
    } else {
      await createProduct(values);
    }
    setModalOpen(false);
  };

  const handleExportCSV = () => {
    if (products.length === 0) return;
    const header = ['SKU,Name,Category,Stock,UnitCost,UnitPrice,Status,Location'];
    const rows = products.map(
      (p) =>
        `"${p.sku}","${p.name}","${p.categoryName || ''}",${p.currentStock},${p.unitCost},${p.unitPrice},"${p.status}","${p.warehouseLocation || ''}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [header, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inventory_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayoutTemplate
      title="Master Inventory Ledger"
      subtitle="Complete list of raw components, assembled products, and physical assets"
      actions={
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={handleOpenCreate}
          style={{ borderRadius: 2, fontSize: 12 }}
        >
          Add Product SKU
        </Button>
      }
    >
      <DenseFilterBar
        searchValue={searchTerm}
        selectedStatuses={selectedStatuses}
        selectedCategoryId={selectedCategoryId}
        categoryOptions={categoryOptions}
        density={density}
        totalRecords={products.length}
        loading={isMutating}
        onSearchChange={setSearchTerm}
        onStatusChange={setSelectedStatuses}
        onCategoryChange={setSelectedCategoryId}
        onDensityChange={setDensity}
        onRefresh={() => {}}
        onResetFilters={resetFilters}
        onExport={handleExportCSV}
      />

      <ProductTable
        products={products}
        density={density}
        loading={isMutating}
        onEdit={handleOpenEdit}
        onDelete={deleteProduct}
        onAdjustStock={adjustStock}
      />

      <ProductFormModal
        open={modalOpen}
        productToEdit={editingProduct}
        categories={categories}
        confirmLoading={isMutating}
        onCancel={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </DashboardLayoutTemplate>
  );
};