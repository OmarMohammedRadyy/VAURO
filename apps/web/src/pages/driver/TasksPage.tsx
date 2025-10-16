import { useEffect, useState } from 'react';
import { Button, Card, List, Space, Tag, Typography, message } from 'antd';
import apiClient from '../../apiClient';
import { useAuth } from '../../context/AuthContext';

interface DriverTask {
  id: string;
  storeId: string;
  deliveryAddress: string;
  status: 'pending' | 'on_the_way' | 'delivered';
}

const statusLabel: Record<DriverTask['status'], string> = {
  pending: 'في انتظار الاستلام',
  on_the_way: 'في الطريق',
  delivered: 'تم التسليم'
};

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<DriverTask[]>([]);

  const fetchTasks = () => {
    if (!user) return;
    apiClient
      .get('/orders', { params: { driverId: user.id } })
      .then((response) => setTasks(response.data))
      .catch(() => setTasks([]));
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  const markDelivered = (id: string) => {
    apiClient
      .patch(`/orders/${id}/status`, { status: 'delivered' })
      .then(() => {
        message.success('تم تأكيد التسليم');
        fetchTasks();
      })
      .catch(() => message.error('تعذر تحديث الحالة'));
  };

  return (
    <Card title="مهام التوصيل" style={{ borderRadius: 16 }}>
      <List
        dataSource={tasks}
        renderItem={(task) => (
          <List.Item
            actions={[
              task.status !== 'delivered' ? (
                <Button type="link" onClick={() => markDelivered(task.id)}>
                  تم التسليم
                </Button>
              ) : null
            ]}
          >
            <List.Item.Meta
              title={task.storeId}
              description={
                <Space direction="vertical">
                  <Typography.Text>العنوان: {task.deliveryAddress}</Typography.Text>
                  <Tag color={task.status === 'delivered' ? 'green' : 'blue'}>
                    {statusLabel[task.status]}
                  </Tag>
                </Space>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default TasksPage;
