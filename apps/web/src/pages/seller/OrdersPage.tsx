import { useEffect, useState } from 'react';
import { Button, Card, Select, Space, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import apiClient from '../../apiClient';
import { useAuth } from '../../context/AuthContext';

interface SellerOrder {
  id: string;
  customerId: string;
  status: 'pending' | 'preparing' | 'on_the_way' | 'delivered' | 'failed';
  totalPrice: number;
}

const statusOptions = [
  { label: 'قيد الانتظار', value: 'pending' },
  { label: 'قيد التجهيز', value: 'preparing' },
  { label: 'في الطريق', value: 'on_the_way' },
  { label: 'تم التسليم', value: 'delivered' },
  { label: 'فشل', value: 'failed' }
];

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<SellerOrder[]>([]);

  const fetchOrders = () => {
    if (!user) return;
    apiClient
      .get('/orders', { params: { storeId: user.id } })
      .then((response) => setOrders(response.data))
      .catch(() => setOrders([]));
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const updateStatus = (id: string, status: SellerOrder['status']) => {
    apiClient
      .patch(`/orders/${id}/status`, { status })
      .then(() => {
        message.success('تم تحديث حالة الطلب');
        fetchOrders();
      })
      .catch(() => message.error('تعذر تحديث حالة الطلب'));
  };

  const columns: ColumnsType<SellerOrder> = [
    { title: 'رقم الطلب', dataIndex: 'id' },
    { title: 'العميل', dataIndex: 'customerId' },
    {
      title: 'الإجمالي',
      dataIndex: 'totalPrice',
      render: (value: number) => `${value.toFixed(2)} د.ك`
    },
    {
      title: 'الحالة',
      dataIndex: 'status',
      render: (value, record) => (
        <Space>
          <Tag color="blue">{value}</Tag>
          <Select
            value={value}
            options={statusOptions}
            onChange={(newStatus) => updateStatus(record.id, newStatus as SellerOrder['status'])}
            style={{ minWidth: 140 }}
          />
        </Space>
      )
    }
  ];

  return (
    <Card
      title="إدارة الطلبات"
      extra={
        <Button onClick={fetchOrders}>
          تحديث
        </Button>
      }
      style={{ borderRadius: 16 }}
    >
      <Table columns={columns} dataSource={orders} rowKey="id" pagination={{ pageSize: 8 }} />
    </Card>
  );
};

export default OrdersPage;
