import type { BaseEntity } from '../../../types/common';

export interface Category extends BaseEntity {
  name: string;
  code: string;
  description?: string;
  color?: string;
  itemCount: number;
  isActive: boolean;
}

export interface CreateCategoryDTO {
  name: string;
  code: string;
  description?: string;
  color?: string;
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {
  isActive?: boolean;
}