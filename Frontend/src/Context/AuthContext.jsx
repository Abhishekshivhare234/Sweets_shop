import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../Api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Try to verify token by making a test request
      // Since we use cookies, we can check if user is logged in
      // by trying to access a protected endpoint or checking localStorage
      const token = localStorage.getItem('userToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, isAdmin = false) => {
    try {
      setLoading(true);
      const endpoint = isAdmin ? '/api/admin/login' : '/api/users/login';
      const response = await api.post(endpoint, { email, password });
      
      if (response.data) {
        const userData = isAdmin 
          ? { email: response.data.admin.email, role: 'admin', id: response.data.admin.id }
          : { ...response.data.user, token: response.data.user.token };
        
        setUser(userData);
        localStorage.setItem('userData', JSON.stringify(userData));
        if (response.data.user?.token) {
          localStorage.setItem('userToken', response.data.user.token);
        }
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle network errors
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        return { 
          success: false, 
          message: 'Cannot connect to server. Please make sure the backend server is running on http://localhost:4000' 
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await api.post('/api/users/register', { name, email, password });
      
      if (response.status === 201) {
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle network errors
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        return { 
          success: false, 
          message: 'Cannot connect to server. Please make sure the backend server is running on http://localhost:4000' 
        };
      }
      
      return { 
        success: false, 
        message: error.response?.data?.message || error.message || 'Registration failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/users/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('userData');
      localStorage.removeItem('userToken');
      // Navigation will be handled by the component calling logout
      window.location.href = '/login';
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isCustomer: user?.role === 'customer',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

