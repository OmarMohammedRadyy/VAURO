import { useEffect, useState } from 'react';
import { Alert, Card, Descriptions, Skeleton, Typography } from 'antd';
import apiClient from '../../apiClient';
import { useAuth } from '../../context/AuthContext';
import OrderTimeline from '../../components/OrderTimeline';
import { OrderStatus } from './types';

interface TrackingData {
  id: string;
  storeId: string;
  status: OrderStatus;
  driverId?: string;
  updatedAt: string;
  deliveryAddress: string;
}

const TrackingPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    apiClient
      .get('/orders', { params: { customerId: user.id } })
      .then((response) => {
        const latest = response.data[0];
        if (latest) {
          setData({
            id: latest.id,
            storeId: latest.storeId,
            status: latest.status,
            deliveryAddress: latest.deliveryAddress,
            driverId: latest.driverId,
            updatedAt: latest.updatedAt ?? latest.createdAt
          });
        }
      })
      .catch(() => setError('تعذر تحميل بيانات التتبع'))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) {
    return <Skeleton active />;
  }

  if (error) {
    return <Alert type="error" message={error} showIcon />;
  }

  if (!data) {
    return <Alert message="لا يوجد طلب جارٍ تتبعه حالياً" type="info" showIcon />;
  }

  return (
    <Card title={`تتبع الطلب #${data.id}`} bordered={false} style={{ borderRadius: 16 }}>
      <Typography.Title level={4}>{data.storeId}</Typography.Title>
      <OrderTimeline status={data.status} />
      <Descriptions column={1} style={{ marginTop: 24 }}>
        <Descriptions.Item label="عنوان التوصيل">{data.deliveryAddress}</Descriptions.Item>
        <Descriptions.Item label="السائق">{data.driverId ?? 'لم يحدد بعد'}</Descriptions.Item>
        <Descriptions.Item label="آخر تحديث">{data.updatedAt}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default TrackingPage;
