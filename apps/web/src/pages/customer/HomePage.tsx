import { useEffect, useState } from 'react';
import { Button, Card, Col, Input, Row, Space, Tag, Typography } from 'antd';
import { EnvironmentOutlined, SearchOutlined } from '@ant-design/icons';
import SuggestionList from '../../components/SuggestionList';
import { useNearbySuggestions } from '../../hooks/useNearbySuggestions';

interface LocationState {
  latitude?: number;
  longitude?: number;
  label: string;
}

const categories = ['مطاعم', 'بقالات', 'صيدليات', 'حلويات', 'مأكولات صحية', 'مأكولات سريعة'];

const HomePage = () => {
  const [location, setLocation] = useState<LocationState>({ label: 'جارٍ تحديد الموقع...' });
  const { data, loading } = useNearbySuggestions(location.latitude, location.longitude);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ label: 'حدد موقعك يدوياً' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          label: 'تم تحديد موقعك'
        });
      },
      () => setLocation({ label: 'تعذر تحديد الموقع' })
    );
  }, []);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card style={{ borderRadius: 16, background: '#1C7C54', color: '#fff' }}>
        <Row align="middle" justify="space-between">
          <Col span={16}>
            <Typography.Title level={3} style={{ color: '#fff' }}>
              اقتراحات أقرب لك
            </Typography.Title>
            <Typography.Paragraph style={{ color: '#e8f5f1' }}>
              نستعمل موقعك لنقترح أقرب المتاجر بأفضل عروض ووقت توصيل.
            </Typography.Paragraph>
            <Button type="default" icon={<EnvironmentOutlined />}>
              {location.label}
            </Button>
          </Col>
          <Col span={8} style={{ textAlign: 'left' }}>
            <Space direction="vertical">
              <Tag color="gold" style={{ fontSize: 14 }}>
                عروض حصرية للمستخدمين الجدد
              </Tag>
              <Tag color="green" style={{ fontSize: 14 }}>
                توصيل مجاني لأقرب 3 متاجر
              </Tag>
            </Space>
          </Col>
        </Row>
      </Card>

      <Input size="large" prefix={<SearchOutlined />} placeholder="ابحث عن متجر أو منتج" />

      <Row gutter={[16, 16]}>
        {categories.map((category) => (
          <Col xs={12} md={8} lg={4} key={category}>
            <Card hoverable style={{ textAlign: 'center', borderRadius: 12 }}>
              <Typography.Text strong>{category}</Typography.Text>
            </Card>
          </Col>
        ))}
      </Row>

      <Card title="الأقرب إليك" bordered={false} style={{ borderRadius: 16 }}>
        <SuggestionList loading={loading} suggestions={data} />
      </Card>
    </Space>
  );
};

export default HomePage;
