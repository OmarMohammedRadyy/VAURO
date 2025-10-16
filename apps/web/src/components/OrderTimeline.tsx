import { Steps } from 'antd';
import React from 'react';
import { OrderStatus } from '../pages/customer/types';

const statusOrder: OrderStatus[] = ['pending', 'preparing', 'on_the_way', 'delivered'];

const statusLabels: Record<OrderStatus, string> = {
  pending: 'قيد الانتظار',
  preparing: 'قيد التجهيز',
  on_the_way: 'في الطريق',
  delivered: 'تم التسليم',
  failed: 'فشل'
};

interface OrderTimelineProps {
  status: OrderStatus;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ status }) => {
  const currentIndex = Math.max(statusOrder.indexOf(status), 0);
  return (
    <Steps
      current={currentIndex}
      items={statusOrder.map((item) => ({
        title: statusLabels[item],
        status: item === 'failed' ? 'error' : undefined
      }))}
    />
  );
};

export default OrderTimeline;
