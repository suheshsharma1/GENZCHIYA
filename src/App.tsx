import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import PromoBanner from './components/PromoBanner';
import DemoSwitcher from './components/DemoSwitcher';

// Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import MenuPage from './pages/MenuPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import HistoryPage from './pages/HistoryPage';
import AdminLoginPage from './pages/AdminLoginPage';
import SplitDashboard from './pages/SplitDashboard';
import QRTablesPage from './pages/QRTablesPage';
import { CounterQRPage } from './pages/CounterQRPage';

// Protected Route Guard
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRole: 'cashier' | 'kitchen' | 'staff'
}> = ({ children, allowedRole }) => {
  const { userRole } = useApp();
  const localStorageRole = localStorage.getItem('gc_user_role');
  const effectiveRole = localStorageRole || userRole;

  if (allowedRole === 'staff') {
    if (effectiveRole !== 'cashier' && effectiveRole !== 'kitchen') {
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  }

  if (effectiveRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Promo banner only on customer-facing pages
const PROMO_BANNER_ROUTES = ['/', '/menu', '/tracking', '/history', '/about', '/qr-tables', '/counter-qr'];
const HIDDEN_BANNER_ROUTES_PREFIXES = ['/admin', '/kitchen', '/login', '/staff'];

const PromoBannerRoute: React.FC = () => {
  const location = useLocation();
  const isHidden = HIDDEN_BANNER_ROUTES_PREFIXES.some(r => 
    location.pathname === r || location.pathname.startsWith(r + '/')
  );
  const isCustomerRoute = PROMO_BANNER_ROUTES.some(r => location.pathname === r || location.pathname.startsWith(r + '/'));
  if (isHidden || !isCustomerRoute) return null;
  return <PromoBanner />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <PromoBannerRoute />
        <Routes>
        {/* Customer Facing Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/tracking" element={<OrderTrackingPage />} />
        <Route path="/tracking/:orderId" element={<OrderTrackingPage />} />
        <Route path="/history" element={<HistoryPage />} />

        {/* Staff Auth Portal */}
        <Route path="/login" element={<AdminLoginPage />} />
        <Route path="/staff/login" element={<AdminLoginPage />} />

        {/* Staff Protected Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRole="staff">
              <SplitDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/kitchen" 
          element={
            <ProtectedRoute allowedRole="staff">
              <SplitDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/qr-tables" 
          element={
            <ProtectedRoute allowedRole="cashier">
              <QRTablesPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/counter-qr" 
          element={
            <ProtectedRoute allowedRole="cashier">
              <CounterQRPage />
            </ProtectedRoute>
          } 
        />

        {/* Fallback redirect to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
        <DemoSwitcher />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App;
