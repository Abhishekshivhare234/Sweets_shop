import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Context/AuthContext';
import { AppProvider } from './Context/AppContext';
import Layout from './Components/Layout';
import Notification from './Components/Notification';
import Spinner from './Components/Spinner';

// Pages
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import AdminDashboard from './Pages/AdminDashboard';
import AdminOrders from './Pages/AdminOrders';
import CustomerProducts from './Pages/CustomerProducts';
import CustomerCart from './Pages/CustomerCart';
import CustomerOrders from './Pages/CustomerOrders';

// Protected Route Component
const ProtectedRoute = ({ children, requireAdmin = false, requireCustomer = false }) => {
  const { isAuthenticated, isAdmin, isCustomer, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requireCustomer && !isCustomer) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute requireAdmin>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute requireAdmin>
            <AdminOrders />
          </ProtectedRoute>
        }
      />
      
      {/* Customer Routes */}
      <Route
        path="/customer/products"
        element={
          <ProtectedRoute requireCustomer>
            <CustomerProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/cart"
        element={
          <ProtectedRoute requireCustomer>
            <CustomerCart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customer/orders"
        element={
          <ProtectedRoute requireCustomer>
            <CustomerOrders />
          </ProtectedRoute>
        }
      />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
          <Notification />
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
