import { Card, Col, Empty, Row, Skeleton, Tag, Typography } from 'antd';
import React from 'react';
import { Suggestion } from '../hooks/useNearbySuggestions';

interface SuggestionListProps {
  loading: boolean;
  suggestions: Suggestion[];
}

const SuggestionList: React.FC<SuggestionListProps> = ({ loading, suggestions }) => {
  if (loading) {
    return <Skeleton active paragraph={{ rows: 4 }} />;
  }

  if (!suggestions.length) {
    return <Empty description="لا توجد متاجر قريبة حالياً" />;
  }

  return (
    <Row gutter={[16, 16]}>
      {suggestions.map((suggestion) => (
        <Col xs={24} md={12} lg={8} key={suggestion.id}>
          <Card title={suggestion.name} bordered={false} style={{ borderRadius: 12 }}>
            <Typography.Paragraph>{suggestion.address}</Typography.Paragraph>
            <Tag color="green">المسافة: {suggestion.distance.toFixed(1)} كم</Tag>
            <Tag color="blue">الوقت المتوقع: {suggestion.eta} دقيقة</Tag>
            <Typography.Text style={{ display: 'block', marginTop: 8 }}>
              رسوم التوصيل: {suggestion.deliveryFee.toFixed(2)} د.ك
            </Typography.Text>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default SuggestionList;
