export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'DISCONTINUED';

export type TransactionType = 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT' | 'TRANSFER';

export interface AuditMetadata {
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly createdBy?: string;
  readonly updatedBy?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  total?: number;
}

export interface SortParams<T = string> {
  field: T;
  order: 'ascend' | 'descend' | null;
}

export interface FilterParams {
  searchTerm?: string;
  status?: StockStatus[];
  categoryIds?: string[];
  dateRange?: [string, string];
}

export type DensityMode = 'compact' | 'middle' | 'default';

export interface BaseEntity extends AuditMetadata {
  id: string;
}