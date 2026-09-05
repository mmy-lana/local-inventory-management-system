import React, { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  Popconfirm,
  Badge,
} from 'antd';
import type { TableColumnsType } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Category, CreateCategoryDTO } from '../types';
import { formatDateOnly } from '../../../utils/formatters';

export interface CategoryListProps {
  categories: Category[];
  loading?: boolean;
  onCreate: (dto: CreateCategoryDTO) => Promise<Category>;
  onUpdate: (id: string, dto: Partial<CreateCategoryDTO>) => Promise<Category>;
  onDelete: (id: string) => Promise<void>;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  loading = false,
  onCreate,
  onUpdate,
  onDelete,
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm<CreateCategoryDTO>();

  const openCreateModal = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCategory(cat);
    form.setFieldsValue({
      name: cat.name,
      code: cat.code,
      description: cat.description,
      color: cat.color,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        await onUpdate(editingCategory.id, values);
      } else {
        await onCreate(values);
      }
      setModalOpen(false);
      form.resetFields();
    } catch {
      // Form validation error
    }
  };

  const columns: TableColumnsType<Category> = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (code: string, record) => (
        <Tag color={record.color || 'blue'} style={{ fontFamily: 'monospace', fontWeight: 600 }}>
          {code}
        </Tag>
      ),
    },
    {
      title: 'Category Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record) => (
        <div>
          <div style={{ fontWeight: 600, fontSize: 12 }}>{name}</div>
          {record.description && (
            <div style={{ fontSize: 11, color: '#8c8c8c' }}>{record.description}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Linked Items',
      dataIndex: 'itemCount',
      key: 'itemCount',
      width: 110,
      align: 'center',
      render: (count: number) => (
        <Badge
          count={count}
          showZero
          style={{
            backgroundColor: count > 0 ? '#f0f0f0' : '#fafafa',
            color: count > 0 ? '#1f1f1f' : '#bfbfbf',
            boxShadow: 'none',
            border: '1px solid #d9d9d9',
          }}
        />
      ),
    },
    {
      title: 'Date Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (dateStr: string) => (
        <span style={{ fontSize: 11, color: '#8c8c8c' }}>{formatDateOnly(dateStr)}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 90,
      align: 'center',
      render: (_, record) => (
        <Space size={2}>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined style={{ fontSize: 12, color: '#0958d9' }} />}
            onClick={() => openEditModal(record)}
            style={{ width: 22, height: 22, padding: 0 }}
          />
          <Popconfirm
            title="Delete Category"
            description="Only categories with zero attached inventory items can be removed."
            onConfirm={() => onDelete(record.id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, size: 'small' }}
            cancelButtonProps={{ size: 'small' }}
          >
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined style={{ fontSize: 12 }} />}
              disabled={record.itemCount > 0}
              style={{ width: 22, height: 22, padding: 0 }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #f0f0f0', borderRadius: 2 }}>
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600 }}>Product Categories</div>
        <Button
          type="primary"
          size="small"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
          style={{ borderRadius: 2, fontSize: 12 }}
        >
          Add Category
        </Button>
      </div>

      <Table<Category>
        rowKey="id"
        size="small"
        columns={columns}
        dataSource={categories}
        loading={loading}
        pagination={false}
      />

      <Modal
        open={modalOpen}
        title={editingCategory ? `Edit Category: ${editingCategory.name}` : 'New Category'}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okText="Save"
        width={420}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" size="small" requiredMark="optional" style={{ paddingTop: 8 }}>
          <Form.Item
            name="name"
            label="Category Name"
            rules={[{ required: true, message: 'Name is required' }]}
          >
            <Input placeholder="e.g. Semiconductor Components" />
          </Form.Item>

          <Form.Item
            name="code"
            label="Category Code (3-4 Chars)"
            rules={[{ required: true, message: 'Code is required' }]}
          >
            <Input placeholder="e.g. SEMI" maxLength={5} style={{ textTransform: 'uppercase' }} />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={2} placeholder="Optional category scope" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};