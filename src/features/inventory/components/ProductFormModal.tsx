import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Col,
  Divider,
} from 'antd';
import type { Product, CreateProductDTO } from '../types';
import type { Category } from '../../categories/types';

export interface ProductFormModalProps {
  open: boolean;
  productToEdit?: Product | null;
  categories: Category[];
  confirmLoading?: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateProductDTO) => Promise<void>;
}

const UNIT_OPTIONS = [
  { label: 'Pieces (PCS)', value: 'PCS' },
  { label: 'Boxes (BOX)', value: 'BOX' },
  { label: 'Kilograms (KG)', value: 'KG' },
  { label: 'Liters (LITER)', value: 'LITER' },
  { label: 'Pallets (PALLET)', value: 'PALLET' },
];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  open,
  productToEdit,
  categories,
  confirmLoading = false,
  onCancel,
  onSubmit,
}) => {
  const [form] = Form.useForm<CreateProductDTO>();

  useEffect(() => {
    if (open) {
      if (productToEdit) {
        form.setFieldsValue({
          sku: productToEdit.sku,
          barcode: productToEdit.barcode,
          name: productToEdit.name,
          description: productToEdit.description,
          categoryId: productToEdit.categoryId,
          unitOfMeasure: productToEdit.unitOfMeasure,
          unitCost: productToEdit.unitCost,
          unitPrice: productToEdit.unitPrice,
          currentStock: productToEdit.currentStock,
          reorderLevel: productToEdit.reorderLevel,
          safetyStock: productToEdit.safetyStock,
          maxCapacity: productToEdit.maxCapacity,
          warehouseLocation: productToEdit.warehouseLocation,
          supplierName: productToEdit.supplierName,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          unitOfMeasure: 'PCS',
          currentStock: 0,
          reorderLevel: 10,
          safetyStock: 5,
          unitCost: 0,
          unitPrice: 0,
        });
      }
    }
  }, [open, productToEdit, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await onSubmit(values);
      form.resetFields();
    } catch {
      // Validation error caught by Ant Form
    }
  };

  return (
    <Modal
      open={open}
      title={
        <div style={{ fontSize: 14, fontWeight: 600 }}>
          {productToEdit ? `Edit SKU: ${productToEdit.sku}` : 'Register New Inventory Item'}
        </div>
      }
      okText={productToEdit ? 'Save Changes' : 'Create Item'}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      width={680}
      styles={{
        body: { paddingTop: 12, paddingBottom: 12 },
      }}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        size="small"
        requiredMark="optional"
      >
        <Row gutter={12}>
          <Col span={10}>
            <Form.Item
              name="sku"
              label="SKU Code"
              rules={[{ required: true, message: 'SKU is mandatory' }]}
            >
              <Input
                placeholder="e.g. SKU-ELC-00912"
                style={{ fontFamily: 'monospace', textTransform: 'uppercase' }}
                disabled={Boolean(productToEdit)}
              />
            </Form.Item>
          </Col>

          <Col span={14}>
            <Form.Item
              name="barcode"
              label="Barcode / GTIN / UPC"
            >
              <Input placeholder="e.g. 890123049199" style={{ fontFamily: 'monospace' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={16}>
            <Form.Item
              name="name"
              label="Product Title"
              rules={[{ required: true, message: 'Item name is required' }]}
            >
              <Input placeholder="Standard item description or model name" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="categoryId"
              label="Assigned Category"
              rules={[{ required: true, message: 'Category selection required' }]}
            >
              <Select
                placeholder="Select category"
                options={categories.map((c) => ({ label: c.name, value: c.id }))}
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientationMargin={0} style={{ margin: '8px 0 12px 0' }} />

        <Row gutter={12}>
          <Col span={6}>
            <Form.Item
              name="unitOfMeasure"
              label="Unit of Measure"
              rules={[{ required: true }]}
            >
              <Select options={UNIT_OPTIONS} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              name="unitCost"
              label="Unit Cost ($)"
              rules={[{ required: true, message: 'Cost is required' }]}
            >
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              name="unitPrice"
              label="Selling Price ($)"
              rules={[{ required: true, message: 'Price is required' }]}
            >
              <InputNumber min={0} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              name="currentStock"
              label="Opening Quantity"
              rules={[{ required: true, message: 'Quantity required' }]}
            >
              <InputNumber
                min={0}
                precision={0}
                style={{ width: '100%' }}
                disabled={Boolean(productToEdit)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={12}>
          <Col span={8}>
            <Form.Item
              name="reorderLevel"
              label="Reorder Alert Level"
              rules={[{ required: true, message: 'Reorder point required' }]}
            >
              <InputNumber min={0} precision={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="safetyStock"
              label="Safety Stock Floor"
              rules={[{ required: true, message: 'Safety floor required' }]}
            >
              <InputNumber min={0} precision={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="maxCapacity"
              label="Max Bin Capacity"
            >
              <InputNumber min={0} precision={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientationMargin={0} style={{ margin: '8px 0 12px 0' }} />

        <Row gutter={12}>
          <Col span={12}>
            <Form.Item
              name="warehouseLocation"
              label="Warehouse Bin / Location"
            >
              <Input placeholder="e.g. Zone B-R02-C1" />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="supplierName"
              label="Primary Supplier"
            >
              <Input placeholder="Supplier or vendor organization name" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="Technical Specifications / Notes"
          style={{ marginBottom: 0 }}
        >
          <Input.TextArea rows={2} placeholder="Optional technical or handling remarks" />
        </Form.Item>
      </Form>
    </Modal>
  );
};