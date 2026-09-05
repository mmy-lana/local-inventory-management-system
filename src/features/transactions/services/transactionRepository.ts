import { db } from '../../../services/db/schema';
import type { StockTransaction, CreateTransactionDTO } from '../types';

export class TransactionRepository {
  async getAll(): Promise<StockTransaction[]> {
    return db.transactions.reverse().sortBy('createdAt');
  }

  async getByProductId(productId: string): Promise<StockTransaction[]> {
    return db.transactions.where('productId').equals(productId).reverse().sortBy('createdAt');
  }

  async record(dto: CreateTransactionDTO): Promise<StockTransaction> {
    const product = await db.products.get(dto.productId);
    if (!product) {
      throw new Error(`Product ${dto.productId} does not exist.`);
    }

    const quantityBefore = product.currentStock;
    const quantityAfter = Math.max(0, quantityBefore + dto.quantityChange);
    const timestamp = new Date().toISOString();

    const transaction: StockTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId: product.id,
      sku: product.sku,
      productName: product.name,
      type: dto.type,
      quantityChange: dto.quantityChange,
      quantityBefore,
      quantityAfter,
      unitPrice: product.unitCost,
      totalValue: Math.abs(dto.quantityChange) * product.unitCost,
      reason: dto.reason.trim(),
      referenceNumber: dto.referenceNumber?.trim(),
      performedBy: dto.performedBy?.trim() ?? 'System Operator',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await db.transactions.add(transaction);
    return transaction;
  }
}

export const transactionRepository = new TransactionRepository();