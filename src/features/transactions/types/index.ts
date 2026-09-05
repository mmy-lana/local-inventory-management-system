import type { BaseEntity, TransactionType } from '../../../types/common';

export interface StockTransaction extends BaseEntity {
  productId: string;
  sku: string;
  productName: string;
  type: TransactionType;
  quantityChange: number;
  quantityBefore: number;
  quantityAfter: number;
  unitPrice: number;
  totalValue: number;
  reason: string;
  referenceNumber?: string;
  performedBy: string;
}

export interface CreateTransactionDTO {
  productId: string;
  type: TransactionType;
  quantityChange: number;
  reason: string;
  referenceNumber?: string;
  performedBy?: string;
}