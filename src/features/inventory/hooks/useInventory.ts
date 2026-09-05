import { useState, useCallback, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../services/db/schema';
import { inventoryRepository } from '../services/inventoryRepository';
import type {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  InventorySummaryMetrics,
} from '../types';
import type { StockStatus } from '../../../types/common';
import { message } from 'antd';

export function useInventory() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatuses, setSelectedStatuses] = useState<StockStatus[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [isMutating, setIsMutating] = useState<boolean>(false);

  const liveProducts = useLiveQuery<Product[]>(() => db.products.toArray(), []);
  const rawProducts = useMemo(() => liveProducts ?? [], [liveProducts]);

  const filteredProducts = useMemo<Product[]>(() => {
    let result = rawProducts;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.sku.toLowerCase().includes(term) ||
          p.name.toLowerCase().includes(term) ||
          (p.barcode && p.barcode.toLowerCase().includes(term)) ||
          (p.warehouseLocation && p.warehouseLocation.toLowerCase().includes(term))
      );
    }

    if (selectedCategoryId) {
      result = result.filter((p) => p.categoryId === selectedCategoryId);
    }

    if (selectedStatuses.length > 0) {
      const statusSet = new Set(selectedStatuses);
      result = result.filter((p) => statusSet.has(p.status));
    }

    return result;
  }, [rawProducts, searchTerm, selectedCategoryId, selectedStatuses]);

  const metrics = useMemo<InventorySummaryMetrics>(() => {
    let totalUnits = 0;
    let totalAssetVal = 0;
    let totalRetailVal = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const p of rawProducts) {
      totalUnits += p.currentStock;
      totalAssetVal += p.currentStock * p.unitCost;
      totalRetailVal += p.currentStock * p.unitPrice;

      if (p.status === 'OUT_OF_STOCK') {
        outOfStockCount++;
      } else if (p.status === 'LOW_STOCK') {
        lowStockCount++;
      }
    }

    return {
      totalSkus: rawProducts.length,
      totalUnitsInStock: totalUnits,
      totalAssetValuation: totalAssetVal,
      totalRetailValuation: totalRetailVal,
      lowStockAlertCount: lowStockCount,
      outOfStockCount,
    };
  }, [rawProducts]);

  const createProduct = useCallback(async (dto: CreateProductDTO) => {
    setIsMutating(true);
    try {
      const created = await inventoryRepository.create(dto);
      message.success(`Product ${created.sku} created successfully`);
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create product';
      message.error(msg);
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, dto: UpdateProductDTO) => {
    setIsMutating(true);
    try {
      const updated = await inventoryRepository.update(id, dto);
      message.success(`Product ${updated.sku} updated`);
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update product';
      message.error(msg);
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const adjustStock = useCallback(
    async (id: string, delta: number, reason: string, performedBy?: string) => {
      setIsMutating(true);
      try {
        const updated = await inventoryRepository.adjustStock(id, delta, reason, performedBy);
        message.success(`Stock level adjusted for ${updated.sku}`);
        return updated;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to adjust stock';
        message.error(msg);
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    []
  );

  const deleteProduct = useCallback(async (id: string) => {
    setIsMutating(true);
    try {
      await inventoryRepository.delete(id);
      message.success('Item removed from inventory');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete product';
      message.error(msg);
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedStatuses([]);
    setSelectedCategoryId(undefined);
  }, []);

  return {
    products: filteredProducts,
    allProducts: rawProducts,
    metrics,
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
  };
}