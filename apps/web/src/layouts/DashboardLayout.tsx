import { Layout, Menu, Typography, Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Header, Content, Sider } = Layout;

interface DashboardLayoutProps {
  role: 'customer' | 'seller' | 'driver' | 'admin';
  children: React.ReactNode;
}

const menuByRole: Record<DashboardLayoutProps['role'], { key: string; label: string; path: string }[]> = {
  customer: [
    { key: 'home', label: 'الرئيسية', path: '/customer' },
    { key: 'orders', label: 'طلباتي', path: '/customer/orders' },
    { key: 'tracking', label: 'تتبع الطلب', path: '/customer/tracking' }
  ],
  seller: [
    { key: 'dashboard', label: 'نظرة عامة', path: '/seller' },
    { key: 'catalog', label: 'إدارة المنتجات', path: '/seller/products' },
    { key: 'orders', label: 'إدارة الطلبات', path: '/seller/orders' }
  ],
  driver: [
    { key: 'tasks', label: 'مهامي', path: '/driver' },
    { key: 'history', label: 'السجل', path: '/driver/history' }
  ],
  admin: [
    { key: 'dashboard', label: 'لوحة التحكم', path: '/admin' },
    { key: 'stores', label: 'إدارة المتاجر', path: '/admin/stores' },
    { key: 'analytics', label: 'التحليلات', path: '/admin/analytics' }
  ]
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ role, children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <Layout>
      <Sider breakpoint="lg" collapsedWidth="0" theme="light">
        <div style={{ padding: '1rem', fontWeight: 700, textAlign: 'center' }}>اقربلك</div>
        <Menu
          mode="inline"
          selectedKeys={[menuByRole[role].find((item) => location.pathname.startsWith(item.path))?.key ?? '']}
          items={menuByRole[role].map((item) => ({
            key: item.key,
            label: <Link to={item.path}>{item.label}</Link>
          }))}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            paddingInline: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography.Title level={4} style={{ margin: 0 }}>
            {user ? `مرحباً ${user.name}` : 'اقربلك'}
          </Typography.Title>
          {user && (
            <Button type="text" icon={<LogoutOutlined />} onClick={logout}>
              تسجيل الخروج
            </Button>
          )}
        </Header>
        <Content style={{ margin: '1.5rem', background: '#fff', padding: '1.5rem', borderRadius: 12 }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
