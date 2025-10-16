import { useEffect, useState } from 'react';
import { Avatar, Card, List, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import apiClient from '../../apiClient';
import { useAuth } from '../../context/AuthContext';
import { OrderSummary } from './types';

const statusColors: Record<OrderSummary['status'], string> = {
  pending: 'orange',
  preparing: 'blue',
  on_the_way: 'gold',
  delivered: 'green',
  failed: 'red'
};

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderSummary[]>([]);

  useEffect(() => {
    if (!user) return;
    apiClient
      .get('/orders', { params: { customerId: user.id } })
      .then((response) =>
        setOrders(
          response.data.map((item: any) => ({
            id: item.id,
            storeName: item.storeId,
            totalPrice: item.totalPrice,
            status: item.status,
            createdAt: item.createdAt
          }))
        )
      )
      .catch(() => setOrders([]));
  }, [user]);

  return (
    <Card title="طلباتي" bordered={false} style={{ borderRadius: 16 }}>
      <List
        itemLayout="horizontal"
        dataSource={orders}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar shape="square">{item.storeName[0]}</Avatar>}
              title={item.storeName}
              description={dayjs(item.createdAt).format('DD MMM YYYY - HH:mm')}
            />
            <div>
              <Typography.Text strong>{item.totalPrice.toFixed(2)} د.ك</Typography.Text>
              <Tag color={statusColors[item.status]} style={{ marginInlineStart: 12 }}>
                {item.status}
              </Tag>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default OrdersPage;
