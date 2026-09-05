import type { BaseEntity, StockStatus } from '../../../types/common';

export interface Product extends BaseEntity {
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  categoryId: string;
  categoryName?: string;
  unitOfMeasure: 'PCS' | 'BOX' | 'KG' | 'LITER' | 'PALLET';
  unitCost: number;
  unitPrice: number;
  currentStock: number;
  reorderLevel: number;
  safetyStock: number;
  maxCapacity?: number;
  status: StockStatus;
  warehouseLocation?: string;
  supplierName?: string;
}

export interface CreateProductDTO {
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  categoryId: string;
  unitOfMeasure: 'PCS' | 'BOX' | 'KG' | 'LITER' | 'PALLET';
  unitCost: number;
  unitPrice: number;
  currentStock: number;
  reorderLevel: number;
  safetyStock: number;
  maxCapacity?: number;
  warehouseLocation?: string;
  supplierName?: string;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
  status?: StockStatus;
}

export interface InventoryFilterCriteria {
  searchTerm?: string;
  categoryId?: string;
  statuses?: StockStatus[];
  lowStockOnly?: boolean;
}

export interface InventorySummaryMetrics {
  totalSkus: number;
  totalUnitsInStock: number;
  totalAssetValuation: number;
  totalRetailValuation: number;
  lowStockAlertCount: number;
  outOfStockCount: number;
}