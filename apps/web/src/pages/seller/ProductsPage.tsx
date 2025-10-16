import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, InputNumber, Modal, Space, Switch, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import apiClient from '../../apiClient';
import { useAuth } from '../../context/AuthContext';

interface ProductRow {
  id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  categoryId: string;
}

const ProductsPage = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const fetchProducts = () => {
    if (!user) return;
    apiClient
      .get('/catalog/products', { params: { storeId: user.id } })
      .then((response) => setProducts(response.data))
      .catch(() => setProducts([]));
  };

  useEffect(() => {
    fetchProducts();
  }, [user]);

  const handleSubmit = async (values: any) => {
    if (!user) return;
    try {
      await apiClient.post('/catalog/products', { ...values, storeId: user.id });
      message.success('تم إضافة المنتج');
      setOpen(false);
      form.resetFields();
      fetchProducts();
    } catch (err) {
      message.error('تعذر إضافة المنتج');
    }
  };

  const columns: ColumnsType<ProductRow> = [
    { title: 'المنتج', dataIndex: 'name' },
    {
      title: 'السعر',
      dataIndex: 'price',
      render: (value: number) => `${value.toFixed(2)} د.ك`
    },
    { title: 'المخزون', dataIndex: 'stock' },
    {
      title: 'الحالة',
      dataIndex: 'isActive',
      render: (value: boolean) => (value ? <Tag color="green">متاح</Tag> : <Tag>موقوف</Tag>)
    }
  ];

  return (
    <Card
      title="إدارة المنتجات"
      extra={
        <Button type="primary" onClick={() => setOpen(true)}>
          منتج جديد
        </Button>
      }
      style={{ borderRadius: 16 }}
    >
      <Table columns={columns} dataSource={products} rowKey="id" pagination={{ pageSize: 8 }} />

      <Modal open={open} onCancel={() => setOpen(false)} title="إضافة منتج" footer={null}>
        <Form layout="vertical" onFinish={handleSubmit} form={form}>
          <Form.Item name="name" label="اسم المنتج" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="الوصف">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Space size="large">
            <Form.Item name="price" label="السعر" rules={[{ required: true }]}> 
              <InputNumber min={0} step={0.1} />
            </Form.Item>
            <Form.Item name="stock" label="المخزون" rules={[{ required: true }]}> 
              <InputNumber min={0} />
            </Form.Item>
          </Space>
          <Form.Item name="categoryId" label="الفئة" rules={[{ required: true }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="isActive" label="متاح؟" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            حفظ
          </Button>
        </Form>
      </Modal>
    </Card>
  );
};

export default ProductsPage;
