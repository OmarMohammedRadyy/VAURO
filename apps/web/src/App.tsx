import { Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/auth/LandingPage';
import CustomerHomePage from './pages/customer/HomePage';
import CustomerOrdersPage from './pages/customer/OrdersPage';
import CustomerTrackingPage from './pages/customer/TrackingPage';
import SellerDashboardPage from './pages/seller/DashboardPage';
import SellerProductsPage from './pages/seller/ProductsPage';
import SellerOrdersPage from './pages/seller/OrdersPage';
import DriverTasksPage from './pages/driver/TasksPage';
import DriverHistoryPage from './pages/driver/HistoryPage';
import AdminDashboardPage from './pages/admin/DashboardPage';
import AdminStoresPage from './pages/admin/StoresPage';
import AdminAnalyticsPage from './pages/admin/AnalyticsPage';
import { useAuth, UserRole } from './context/AuthContext';

const RequireRole: React.FC<{ role: UserRole; children: React.ReactElement }> = ({ role, children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (user.role !== role) {
    return <Navigate to={`/${user.role}`} replace />;
  }

  return children;
};

const App = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to={`/${user.role}`} replace /> : <LandingPage />} />

      <Route
        path="/customer"
        element={
          <RequireRole role="customer">
            <DashboardLayout role="customer">
              <CustomerHomePage />
            </DashboardLayout>
          </RequireRole>
        }
      />
      <Route
        path="/customer/orders"
        element={
          <RequireRole role="customer">
            <DashboardLayout role="customer">
              <CustomerOrdersPage />
            </DashboardLayout>
          </RequireRole>
        }
      />
      <Route
        path="/customer/tracking"
        element={
          <RequireRole role="customer">
            <DashboardLayout role="customer">
              <CustomerTrackingPage />
            </DashboardLayout>
          </RequireRole>
        }
      />

      <Route
        path="/seller"
        element={
          <RequireRole role="seller">
            <DashboardLayout role="seller">
              <SellerDashboardPage />
            </DashboardLayout>
          </RequireRole>
        }
      />
      <Route
        path="/seller/products"
        element={
          <RequireRole role="seller">
            <DashboardLayout role="seller">
              <SellerProductsPage />
            </DashboardLayout>
          </RequireRole>
        }
      />
      <Route
        path="/seller/orders"
        element={
          <RequireRole role="seller">
            <DashboardLayout role="seller">
              <SellerOrdersPage />
            </DashboardLayout>
          </RequireRole>
        }
      />

      <Route
        path="/driver"
        element={
          <RequireRole role="driver">
            <DashboardLayout role="driver">
              <DriverTasksPage />
            </DashboardLayout>
          </RequireRole>
        }
      />
      <Route
        path="/driver/history"
        element={
          <RequireRole role="driver">
            <DashboardLayout role="driver">
              <DriverHistoryPage />
            </DashboardLayout>
          </RequireRole>
        }
      />

      <Route
        path="/admin"
        element={
          <RequireRole role="admin">
            <DashboardLayout role="admin">
              <AdminDashboardPage />
            </DashboardLayout>
          </RequireRole>
        }
      />
      <Route
        path="/admin/stores"
        element={
          <RequireRole role="admin">
            <DashboardLayout role="admin">
              <AdminStoresPage />
            </DashboardLayout>
          </RequireRole>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <RequireRole role="admin">
            <DashboardLayout role="admin">
              <AdminAnalyticsPage />
            </DashboardLayout>
          </RequireRole>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
