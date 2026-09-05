import Dexie, { type Table } from 'dexie';
import type { Product } from '../../features/inventory/types';
import type { Category } from '../../features/categories/types';
import type { StockTransaction } from '../../features/transactions/types';

export class LocalInventoryDB extends Dexie {
  products!: Table<Product, string>;
  categories!: Table<Category, string>;
  transactions!: Table<StockTransaction, string>;

  constructor() {
    super('LocalInventoryEngineDB');

    this.version(1).stores({
      products: 'id, sku, barcode, categoryId, status, currentStock, reorderLevel, createdAt, updatedAt',
      categories: 'id, code, name, isActive, createdAt',
      transactions: 'id, productId, sku, type, createdAt, performedBy',
    });
  }
}

export const db = new LocalInventoryDB();