import React from 'react';
import { DashboardLayoutTemplate } from '../../components/templates/DashboardLayoutTemplate';
import { CategoryList } from '../../features/categories/components/CategoryList';
import { useCategories } from '../../features/categories/hooks/useCategories';

export const CategoriesPage: React.FC = () => {
  const { categories, isMutating, createCategory, updateCategory, deleteCategory } =
    useCategories();

  return (
    <DashboardLayoutTemplate
      title="Inventory Classification"
      subtitle="Manage product taxonomy, category hierarchy, and asset assignment"
    >
      <CategoryList
        categories={categories}
        loading={isMutating}
        onCreate={createCategory}
        onUpdate={updateCategory}
        onDelete={deleteCategory}
      />
    </DashboardLayoutTemplate>
  );
};