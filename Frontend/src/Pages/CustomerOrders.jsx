import React, { useState, useEffect } from 'react';
import { api } from '../Api';
import { useApp } from '../Context/AppContext';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Components/Spinner';
import Layout from '../Components/Layout';

const CustomerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { addNotification } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders(true); // Show loading on initial load
    // Refresh orders every 5 seconds to see status updates (without loading spinner)
    const interval = setInterval(() => {
      fetchOrders(false);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      const response = await api.get('/api/customer/orders');
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error('Fetch orders error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch orders';
      addNotification(errorMessage, 'error');
      
      // If unauthorized, redirect to login
      if (error.response?.status === 401 || error.response?.status === 403) {
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 mb-4">You have no orders yet</p>
            <button
              onClick={() => navigate('/customer/products')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-semibold">{order._id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Status</p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-1">Shipping Address</p>
                    <p className="text-gray-800">{order.shippingAddress}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Items:</p>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-gray-50 p-3 rounded"
                        >
                          <div className="flex items-center gap-3">
                            {item.productId?.image && (
                              <img
                                src={item.productId.image}
                                alt={item.productId.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium">
                                {item.productId?.name || 'Product'}
                              </p>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity} × ${item.price?.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <p className="font-semibold">
                            ${(item.quantity * item.price)?.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="text-gray-800">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${order.totalPrice?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CustomerOrders;

