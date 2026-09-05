import { db } from '../../../services/db/schema';
import type {
  Product,
  CreateProductDTO,
  UpdateProductDTO,
  InventoryFilterCriteria,
  InventorySummaryMetrics,
} from '../types';
import type { StockStatus } from '../../../types/common';
import { transactionRepository } from '../../transactions/services/transactionRepository';

export class InventoryRepository {
  private calculateStatus(stock: number, reorder: number): StockStatus {
    if (stock <= 0) return 'OUT_OF_STOCK';
    if (stock <= reorder) return 'LOW_STOCK';
    return 'IN_STOCK';
  }

  async getAll(): Promise<Product[]> {
    return db.products.orderBy('sku').toArray();
  }

  async getFiltered(criteria: InventoryFilterCriteria): Promise<Product[]> {
    const collection = db.products.toCollection();

    let items = await collection.toArray();

    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase().trim();
      items = items.filter(
        (p) =>
          p.sku.toLowerCase().includes(term) ||
          p.name.toLowerCase().includes(term) ||
          (p.barcode && p.barcode.toLowerCase().includes(term)) ||
          (p.warehouseLocation && p.warehouseLocation.toLowerCase().includes(term))
      );
    }

    if (criteria.categoryId) {
      items = items.filter((p) => p.categoryId === criteria.categoryId);
    }

    if (criteria.statuses && criteria.statuses.length > 0) {
      const statusSet = new Set(criteria.statuses);
      items = items.filter((p) => statusSet.has(p.status));
    }

    if (criteria.lowStockOnly) {
      items = items.filter((p) => p.status === 'LOW_STOCK' || p.status === 'OUT_OF_STOCK');
    }

    return items;
  }

  async getById(id: string): Promise<Product | undefined> {
    return db.products.get(id);
  }

  async create(dto: CreateProductDTO): Promise<Product> {
    const timestamp = new Date().toISOString();
    const status = this.calculateStatus(dto.currentStock, dto.reorderLevel);

    const category = await db.categories.get(dto.categoryId);

    const newProduct: Product = {
      id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      sku: dto.sku.trim().toUpperCase(),
      barcode: dto.barcode?.trim(),
      name: dto.name.trim(),
      description: dto.description?.trim(),
      categoryId: dto.categoryId,
      categoryName: category?.name ?? 'Uncategorized',
      unitOfMeasure: dto.unitOfMeasure,
      unitCost: Number(dto.unitCost) || 0,
      unitPrice: Number(dto.unitPrice) || 0,
      currentStock: Math.max(0, Number(dto.currentStock) || 0),
      reorderLevel: Math.max(0, Number(dto.reorderLevel) || 0),
      safetyStock: Math.max(0, Number(dto.safetyStock) || 0),
      maxCapacity: dto.maxCapacity ? Number(dto.maxCapacity) : undefined,
      status,
      warehouseLocation: dto.warehouseLocation?.trim(),
      supplierName: dto.supplierName?.trim(),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await db.products.add(newProduct);

    if (newProduct.currentStock > 0) {
      await transactionRepository.record({
        productId: newProduct.id,
        type: 'INBOUND',
        quantityChange: newProduct.currentStock,
        reason: 'Initial stock intake upon product creation',
        referenceNumber: 'INIT-INTAKE',
        performedBy: 'System Auto-Initializer',
      });
    }

    if (category) {
      const count = await db.products.where('categoryId').equals(category.id).count();
      await db.categories.update(category.id, { itemCount: count });
    }

    return newProduct;
  }

  async update(id: string, dto: UpdateProductDTO): Promise<Product> {
    const existing = await db.products.get(id);
    if (!existing) {
      throw new Error(`Product with id ${id} does not exist.`);
    }

    let categoryName = existing.categoryName;
    if (dto.categoryId && dto.categoryId !== existing.categoryId) {
      const cat = await db.categories.get(dto.categoryId);
      categoryName = cat?.name ?? 'Uncategorized';
    }

    const currentStock = dto.currentStock !== undefined ? Number(dto.currentStock) : existing.currentStock;
    const reorderLevel = dto.reorderLevel !== undefined ? Number(dto.reorderLevel) : existing.reorderLevel;
    const computedStatus = dto.status ?? this.calculateStatus(currentStock, reorderLevel);

    const updatedProduct: Product = {
      ...existing,
      ...dto,
      sku: dto.sku ? dto.sku.trim().toUpperCase() : existing.sku,
      categoryName,
      status: computedStatus,
      updatedAt: new Date().toISOString(),
    };

    await db.products.put(updatedProduct);
    return updatedProduct;
  }

  async adjustStock(
    id: string,
    quantityDelta: number,
    reason: string,
    performedBy: string = 'Inventory Operator'
  ): Promise<Product> {
    const existing = await db.products.get(id);
    if (!existing) {
      throw new Error(`Product ${id} not found.`);
    }

    const newQuantity = Math.max(0, existing.currentStock + quantityDelta);
    const newStatus = this.calculateStatus(newQuantity, existing.reorderLevel);

    const updated = await this.update(id, {
      currentStock: newQuantity,
      status: newStatus,
    });

    await transactionRepository.record({
      productId: existing.id,
      type: quantityDelta >= 0 ? 'INBOUND' : 'OUTBOUND',
      quantityChange: quantityDelta,
      reason,
      performedBy,
    });

    return updated;
  }

  async delete(id: string): Promise<void> {
    const existing = await db.products.get(id);
    if (!existing) return;

    await db.products.delete(id);
    await db.transactions.where('productId').equals(id).delete();

    const category = await db.categories.get(existing.categoryId);
    if (category) {
      const count = await db.products.where('categoryId').equals(category.id).count();
      await db.categories.update(category.id, { itemCount: count });
    }
  }

  async getSummaryMetrics(): Promise<InventorySummaryMetrics> {
    const products = await db.products.toArray();

    let totalUnits = 0;
    let totalAssetVal = 0;
    let totalRetailVal = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;

    for (const p of products) {
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
      totalSkus: products.length,
      totalUnitsInStock: totalUnits,
      totalAssetValuation: totalAssetVal,
      totalRetailValuation: totalRetailVal,
      lowStockAlertCount: lowStockCount,
      outOfStockCount,
    };
  }
}

export const inventoryRepository = new InventoryRepository();