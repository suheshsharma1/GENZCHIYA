import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';

// Pages
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import MenuPage from './pages/MenuPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import HistoryPage from './pages/HistoryPage';
import AdminLoginPage from './pages/AdminLoginPage';
import SplitDashboard from './pages/SplitDashboard';
import QRTablesPage from './pages/QRTablesPage';
import { DemoSwitcher } from './components/DemoSwitcher';

// Protected Route Guard
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode; 
  allowedRole: 'cashier' | 'kitchen' | 'staff'
}> = ({ children, allowedRole }) => {
  const { userRole } = useApp();
  const effectiveRole = userRole || localStorage.getItem('gc_user_role');

  if (allowedRole === 'staff') {
    if (effectiveRole !== 'cashier' && effectiveRole !== 'kitchen') {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
  }

  if (effectiveRole !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <DemoSwitcher />
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

        {/* Fallback redirect to homepage */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
