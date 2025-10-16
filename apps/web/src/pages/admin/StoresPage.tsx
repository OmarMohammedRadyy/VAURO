import { useEffect, useState } from 'react';
import { Button, Card, Select, Space, Table, Tag, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import apiClient from '../../apiClient';

interface AdminStore {
  id: string;
  name: string;
  status: 'pending' | 'active' | 'suspended';
  sellerId: string;
  address: string;
}

const statusOptions = [
  { label: 'قيد المراجعة', value: 'pending' },
  { label: 'مفعل', value: 'active' },
  { label: 'موقوف', value: 'suspended' }
];

const StoresPage = () => {
  const [stores, setStores] = useState<AdminStore[]>([]);

  const fetchStores = () => {
    apiClient
      .get('/stores')
      .then((response) => setStores(response.data))
      .catch(() => setStores([]));
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const updateStatus = (id: string, status: AdminStore['status']) => {
    apiClient
      .patch(`/stores/${id}/status`, { status })
      .then(() => {
        message.success('تم تحديث حالة المتجر');
        fetchStores();
      })
      .catch(() => message.error('تعذر تحديث الحالة'));
  };

  const columns: ColumnsType<AdminStore> = [
    { title: 'المتجر', dataIndex: 'name' },
    { title: 'المالك', dataIndex: 'sellerId' },
    { title: 'العنوان', dataIndex: 'address' },
    {
      title: 'الحالة',
      dataIndex: 'status',
      render: (value, record) => (
        <Space>
          <Tag color={value === 'active' ? 'green' : value === 'pending' ? 'orange' : 'red'}>{value}</Tag>
          <Select
            value={value}
            options={statusOptions}
            style={{ minWidth: 140 }}
            onChange={(newStatus) => updateStatus(record.id, newStatus as AdminStore['status'])}
          />
        </Space>
      )
    }
  ];

  return (
    <Card
      title="إدارة المتاجر"
      extra={<Button onClick={fetchStores}>تحديث</Button>}
      style={{ borderRadius: 16 }}
    >
      <Table columns={columns} dataSource={stores} rowKey="id" pagination={{ pageSize: 10 }} />
    </Card>
  );
};

export default StoresPage;
