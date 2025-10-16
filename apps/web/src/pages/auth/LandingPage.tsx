import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Tabs,
  Typography,
  message
} from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../apiClient';
import { useAuth, UserRole } from '../../context/AuthContext';

const roleOptions = [
  { label: 'عميل', value: 'customer' },
  { label: 'صاحب متجر', value: 'seller' },
  { label: 'سائق', value: 'driver' },
  { label: 'مدير', value: 'admin' }
];

const LandingPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/users/login', values);
      login({ ...response.data.user, token: response.data.token });
      message.success('تم تسجيل الدخول بنجاح');
      navigate(`/${response.data.user.role}`);
    } catch (err: unknown) {
      setError('فشل تسجيل الدخول. الرجاء التحقق من البيانات.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: any) => {
    setLoading(true);
    setError(null);
    const payload: Record<string, unknown> = {
      name: values.name,
      email: values.email,
      password: values.password,
      phone: values.phone,
      role: selectedRole
    };

    if (selectedRole === 'customer') {
      payload.customerProfile = {
        address: values.address,
        preferences: values.preferences?.split(',')?.map((item: string) => item.trim())
      };
    }

    if (selectedRole === 'seller') {
      payload.sellerProfile = {
        storeName: values.storeName,
        categoryId: values.categoryId,
        taxId: values.taxId,
        address: values.address
      };
    }

    if (selectedRole === 'driver') {
      payload.driverProfile = {
        licenseNumber: values.licenseNumber,
        vehicleInfo: values.vehicleInfo,
        address: values.address
      };
    }

    try {
      await apiClient.post('/users', payload);
      message.success('تم إنشاء الحساب بنجاح. الرجاء تسجيل الدخول.');
    } catch (err: unknown) {
      setError('فشل إنشاء الحساب. الرجاء المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3rem 1rem' }}>
      <Row justify="center" gutter={[24, 24]}>
        <Col xs={24} md={10}>
          <Typography.Title level={2} style={{ color: '#1C7C54' }}>
            مرحباً بك في اقربلك
          </Typography.Title>
          <Typography.Paragraph style={{ fontSize: 16 }}>
            منصة موحدة لربط العملاء وأصحاب المتاجر والسائقين مع تجربة توصيل ذكية وسريعة.
            استخدم النظام الذكي لاقتراح أقرب المتاجر وعروضها خلال لحظات.
          </Typography.Paragraph>
        </Col>
        <Col xs={24} md={10}>
          <Card>
            <Tabs
              defaultActiveKey="login"
              items={[
                {
                  key: 'login',
                  label: 'تسجيل الدخول',
                  children: (
                    <Form layout="vertical" onFinish={handleLogin}>
                      <Form.Item name="email" label="البريد الإلكتروني" rules={[{ required: true }]}> 
                        <Input type="email" placeholder="example@mail.com" />
                      </Form.Item>
                      <Form.Item name="password" label="كلمة المرور" rules={[{ required: true }]}> 
                        <Input.Password placeholder="********" />
                      </Form.Item>
                      <Button type="primary" htmlType="submit" loading={loading} block>
                        دخول
                      </Button>
                    </Form>
                  )
                },
                {
                  key: 'register',
                  label: 'إنشاء حساب',
                  children: (
                    <Form layout="vertical" onFinish={handleRegister}>
                      <Form.Item name="name" label="الاسم الكامل" rules={[{ required: true }]}>
                        <Input />
                      </Form.Item>
                      <Form.Item name="email" label="البريد الإلكتروني" rules={[{ required: true }]}> 
                        <Input type="email" />
                      </Form.Item>
                      <Form.Item name="password" label="كلمة المرور" rules={[{ required: true, min: 8 }]}> 
                        <Input.Password />
                      </Form.Item>
                      <Form.Item name="phone" label="رقم الجوال" rules={[{ required: true }]}> 
                        <Input />
                      </Form.Item>
                      <Form.Item label="اختر الدور" name="role" initialValue={selectedRole}>
                        <Select options={roleOptions} onChange={(value) => setSelectedRole(value)} />
                      </Form.Item>

                      {selectedRole === 'customer' && (
                        <>
                          <Form.Item name="address" label="العنوان الرئيسي">
                            <Input />
                          </Form.Item>
                          <Form.Item name="preferences" label="تفضيلات البحث (افصل بينها بفاصلة)">
                            <Input placeholder="مطاعم، بقالة" />
                          </Form.Item>
                        </>
                      )}

                      {selectedRole === 'seller' && (
                        <>
                          <Form.Item name="storeName" label="اسم المتجر" rules={[{ required: true }]}> 
                            <Input />
                          </Form.Item>
                          <Form.Item name="categoryId" label="فئة المتجر" rules={[{ required: true }]}> 
                            <Input placeholder="مطاعم، صيدلية..." />
                          </Form.Item>
                          <Form.Item name="taxId" label="الرقم الضريبي" rules={[{ required: true }]}> 
                            <Input />
                          </Form.Item>
                          <Form.Item name="address" label="عنوان المتجر" rules={[{ required: true }]}> 
                            <Input />
                          </Form.Item>
                        </>
                      )}

                      {selectedRole === 'driver' && (
                        <>
                          <Form.Item name="licenseNumber" label="رقم الرخصة" rules={[{ required: true }]}> 
                            <Input />
                          </Form.Item>
                          <Form.Item name="vehicleInfo" label="معلومات المركبة" rules={[{ required: true }]}> 
                            <Input />
                          </Form.Item>
                          <Form.Item name="address" label="عنوان السكن">
                            <Input />
                          </Form.Item>
                        </>
                      )}

                      <Button type="primary" htmlType="submit" loading={loading} block>
                        إنشاء الحساب
                      </Button>
                    </Form>
                  )
                }
              ]}
            />
            {error && (
              <Alert style={{ marginTop: 16 }} type="error" message={error} showIcon closable onClose={() => setError(null)} />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LandingPage;
