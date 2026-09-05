import { useState, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../../services/db/schema';
import { categoryRepository } from '../services/categoryRepository';
import type { Category, CreateCategoryDTO, UpdateCategoryDTO } from '../types';
import { message } from 'antd';

export function useCategories() {
  const [isMutating, setIsMutating] = useState<boolean>(false);

  const categories = useLiveQuery<Category[]>(() => db.categories.orderBy('name').toArray(), []) ?? [];

  const createCategory = useCallback(async (dto: CreateCategoryDTO) => {
    setIsMutating(true);
    try {
      const created = await categoryRepository.create(dto);
      message.success(`Category "${created.name}" created`);
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create category';
      message.error(msg);
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const updateCategory = useCallback(async (id: string, dto: UpdateCategoryDTO) => {
    setIsMutating(true);
    try {
      const updated = await categoryRepository.update(id, dto);
      message.success(`Category "${updated.name}" updated`);
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update category';
      message.error(msg);
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    setIsMutating(true);
    try {
      await categoryRepository.delete(id);
      message.success('Category removed');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete category';
      message.error(msg);
      throw err;
    } finally {
      setIsMutating(false);
    }
  }, []);

  return {
    categories,
    isMutating,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}