import { Card, Col, Row, Table } from 'antd';
import { useEffect, useState } from 'react';
import apiClient from '../../apiClient';
import StatCard from '../../components/StatCard';

interface AdminSummary {
  stores: number;
  orders: number;
  drivers: number;
  revenue: number;
}

interface StoreRow {
  id: string;
  name: string;
  status: string;
  rating: number;
}

const DashboardPage = () => {
  const [summary, setSummary] = useState<AdminSummary>({ stores: 0, orders: 0, drivers: 0, revenue: 0 });
  const [stores, setStores] = useState<StoreRow[]>([]);

  useEffect(() => {
    apiClient
      .get('/stores')
      .then((response) => setStores(response.data))
      .catch(() => setStores([]));
    setSummary({ stores: stores.length, orders: 128, drivers: 34, revenue: 54200 });
  }, [stores.length]);

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={6}>
          <StatCard title="عدد المتاجر" value={summary.stores} />
        </Col>
        <Col xs={24} md={6}>
          <StatCard title="الطلبات النشطة" value={summary.orders} />
        </Col>
        <Col xs={24} md={6}>
          <StatCard title="عدد السائقين" value={summary.drivers} />
        </Col>
        <Col xs={24} md={6}>
          <StatCard title="إجمالي الإيرادات" value={`${summary.revenue.toLocaleString()} د.ك`} />
        </Col>
      </Row>

      <Card title="المتاجر" style={{ borderRadius: 16, marginTop: 24 }}>
        <Table
          dataSource={stores}
          columns={[
            { title: 'المتجر', dataIndex: 'name' },
            { title: 'الحالة', dataIndex: 'status' },
            { title: 'التقييم', dataIndex: 'rating' }
          ]}
          rowKey="id"
          pagination={{ pageSize: 6 }}
        />
      </Card>
    </div>
  );
};

export default DashboardPage;
