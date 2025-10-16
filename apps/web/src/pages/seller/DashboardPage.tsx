import { Card, Col, Row, Table, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import apiClient from '../../apiClient';
import StatCard from '../../components/StatCard';
import { useAuth } from '../../context/AuthContext';

interface SellerSummary {
  revenue: number;
  ordersToday: number;
  averageDelivery: number;
  topProducts: { name: string; orders: number }[];
}

interface OrderRow {
  id: string;
  customerId: string;
  totalPrice: number;
  status: string;
}

const columns: ColumnsType<OrderRow> = [
  { title: 'الطلب', dataIndex: 'id' },
  { title: 'العميل', dataIndex: 'customerId' },
  { title: 'الإجمالي', dataIndex: 'totalPrice', render: (value) => `${value.toFixed(2)} د.ك` },
  { title: 'الحالة', dataIndex: 'status' }
];

const DashboardPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<SellerSummary | null>(null);
  const [orders, setOrders] = useState<OrderRow[]>([]);

  useEffect(() => {
    if (!user) return;
    apiClient
      .get('/orders', { params: { storeId: user.id } })
      .then((response) => setOrders(response.data))
      .catch(() => setOrders([]));
  }, [user]);

  useEffect(() => {
    setSummary({
      revenue: orders.reduce((acc, order) => acc + order.totalPrice, 0),
      ordersToday: orders.length,
      averageDelivery: orders.length ? 32 : 0,
      topProducts: [
        { name: 'قائمة البرجر المميزة', orders: 42 },
        { name: 'سلطة فريش', orders: 27 },
        { name: 'سندويش دجاج', orders: 21 }
      ]
    });
  }, [orders]);

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <StatCard title="إيرادات اليوم" value={`${summary?.revenue.toFixed(2) ?? '0.00'} د.ك`} />
        </Col>
        <Col xs={24} md={8}>
          <StatCard title="الطلبات الجديدة" value={summary?.ordersToday ?? 0} />
        </Col>
        <Col xs={24} md={8}>
          <StatCard title="متوسط زمن التوصيل" value={`${summary?.averageDelivery ?? 0} دقيقة`} />
        </Col>
      </Row>

      <Card title="المنتجات الأكثر مبيعاً" style={{ borderRadius: 16, marginTop: 24 }}>
        {summary?.topProducts.map((product) => (
          <Typography.Paragraph key={product.name}>
            {product.name} - {product.orders} طلب
          </Typography.Paragraph>
        ))}
      </Card>

      <Card title="الطلبات المفتوحة" style={{ borderRadius: 16, marginTop: 24 }}>
        <Table columns={columns} dataSource={orders} rowKey="id" pagination={false} />
      </Card>
    </div>
  );
};

export default DashboardPage;
