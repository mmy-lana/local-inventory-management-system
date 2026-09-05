import { db } from '../../../services/db/schema';
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types';

export class CategoryRepository {
  async getAll(): Promise<Category[]> {
    return db.categories.orderBy('name').toArray();
  }

  async getActive(): Promise<Category[]> {
    return db.categories.filter((cat) => cat.isActive).toArray();
  }

  async getById(id: string): Promise<Category | undefined> {
    return db.categories.get(id);
  }

  async create(dto: CreateCategoryDTO): Promise<Category> {
    const timestamp = new Date().toISOString();
    const newCategory: Category = {
      id: `cat-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: dto.name.trim(),
      code: dto.code.trim().toUpperCase(),
      description: dto.description?.trim(),
      color: dto.color ?? '#1677ff',
      itemCount: 0,
      isActive: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    await db.categories.add(newCategory);
    return newCategory;
  }

  async update(id: string, dto: UpdateCategoryDTO): Promise<Category> {
    const existing = await db.categories.get(id);
    if (!existing) {
      throw new Error(`Category with id ${id} not found.`);
    }

    const updatedCategory: Category = {
      ...existing,
      ...dto,
      name: dto.name ? dto.name.trim() : existing.name,
      code: dto.code ? dto.code.trim().toUpperCase() : existing.code,
      updatedAt: new Date().toISOString(),
    };

    await db.categories.put(updatedCategory);
    return updatedCategory;
  }

  async delete(id: string): Promise<void> {
    const attachedProductsCount = await db.products.where('categoryId').equals(id).count();
    if (attachedProductsCount > 0) {
      throw new Error(
        `Cannot delete category. There are ${attachedProductsCount} active inventory items assigned to it.`
      );
    }
    await db.categories.delete(id);
  }

  async recalculateItemCounts(): Promise<void> {
    const categories = await db.categories.toArray();
    for (const cat of categories) {
      const count = await db.products.where('categoryId').equals(cat.id).count();
      if (cat.itemCount !== count) {
        await db.categories.update(cat.id, {
          itemCount: count,
          updatedAt: new Date().toISOString(),
        });
      }
    }
  }
}

export const categoryRepository = new CategoryRepository();