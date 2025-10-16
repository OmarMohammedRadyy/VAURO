import { Card, Col, Progress, Row, Table, Typography } from 'antd';
import { useEffect, useState } from 'react';

interface MetricRow {
  label: string;
  value: number;
  change: number;
}

interface CouponRow {
  code: string;
  discount: string;
  usage: number;
}

const AnalyticsPage = () => {
  const [metrics, setMetrics] = useState<MetricRow[]>([]);
  const [coupons, setCoupons] = useState<CouponRow[]>([]);

  useEffect(() => {
    setMetrics([
      { label: 'معدل التسليم في الوقت المحدد', value: 92, change: 5 },
      { label: 'رضا العملاء', value: 88, change: 2 },
      { label: 'نمو المتاجر الجديدة', value: 65, change: 8 }
    ]);
    setCoupons([
      { code: 'EQREBALK10', discount: '10%', usage: 120 },
      { code: 'FASTDEL20', discount: '20%', usage: 75 }
    ]);
  }, []);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={12}>
        <Card title="مؤشرات الأداء" style={{ borderRadius: 16 }}>
          {metrics.map((metric) => (
            <div key={metric.label} style={{ marginBottom: 16 }}>
              <Typography.Text strong>{metric.label}</Typography.Text>
              <Progress percent={metric.value} status="active" />
              <Typography.Text type={metric.change >= 0 ? 'success' : 'danger'}>
                {metric.change >= 0 ? '+' : ''}
                {metric.change}% مقارنة بالشهر الماضي
              </Typography.Text>
            </div>
          ))}
        </Card>
      </Col>
      <Col xs={24} md={12}>
        <Card title="العروض والكوبونات" style={{ borderRadius: 16 }}>
          <Table
            dataSource={coupons}
            columns={[
              { title: 'الكود', dataIndex: 'code' },
              { title: 'الخصم', dataIndex: 'discount' },
              { title: 'عدد الاستخدامات', dataIndex: 'usage' }
            ]}
            rowKey="code"
            pagination={false}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default AnalyticsPage;
