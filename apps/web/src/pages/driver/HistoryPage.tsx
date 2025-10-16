import { useEffect, useState } from 'react';
import { Card, List, Tag } from 'antd';
import apiClient from '../../apiClient';
import { useAuth } from '../../context/AuthContext';

interface HistoryItem {
  id: string;
  storeId: string;
  totalPrice: number;
  status: string;
}

const HistoryPage = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (!user) return;
    apiClient
      .get('/orders', { params: { driverId: user.id } })
      .then((response) => setItems(response.data))
      .catch(() => setItems([]));
  }, [user]);

  return (
    <Card title="سجل التوصيلات" style={{ borderRadius: 16 }}>
      <List
        dataSource={items}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta title={`طلب #${item.id}`} description={`المتجر: ${item.storeId}`} />
            <div>
              {item.totalPrice.toFixed(2)} د.ك <Tag color="green">{item.status}</Tag>
            </div>
          </List.Item>
        )}
      />
    </Card>
  );
};

export default HistoryPage;
