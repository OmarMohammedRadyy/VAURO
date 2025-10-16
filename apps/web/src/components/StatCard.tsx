import { Card, Typography } from 'antd';
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description }) => (
  <Card style={{ borderRadius: 12 }}>
    <Typography.Title level={5}>{title}</Typography.Title>
    <Typography.Title level={3} style={{ color: '#1C7C54', marginTop: 0 }}>
      {value}
    </Typography.Title>
    {description && <Typography.Paragraph>{description}</Typography.Paragraph>}
  </Card>
);

export default StatCard;
