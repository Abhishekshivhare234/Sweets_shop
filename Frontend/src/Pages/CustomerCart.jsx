import React, { useState, useEffect } from 'react';
import { api } from '../Api';
import { useApp } from '../Context/AppContext';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Components/Spinner';
import Layout from '../Components/Layout';

const CustomerCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const { addNotification, setCartCount } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/customer/cart');
      if (response.data.cart) {
        setCart(response.data.cart);
        setCartCount(response.data.cart.items?.length || 0);
      }
    } catch (error) {
      console.error('Fetch cart error:', error);
      if (error.response?.status === 404) {
        setCart(null);
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch cart';
        addNotification(errorMessage, 'error');
        
        // If unauthorized, redirect to login
        if (error.response?.status === 401 || error.response?.status === 403) {
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      setUpdating(true);
      await api.put('/api/customer/cart', { productId, quantity: newQuantity });
      addNotification('Cart updated', 'success');
      fetchCart();
    } catch (error) {
      addNotification('Failed to update cart', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await api.delete('/api/customer/cart', { data: { productId } });
      addNotification('Item removed from cart', 'success');
      fetchCart();
    } catch (error) {
      addNotification('Failed to remove item', 'error');
    }
  };

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      addNotification('Please enter shipping address', 'error');
      return;
    }

    try {
      setUpdating(true);
      const response = await api.post('/api/customer/order', {
        shippingAddress,
      });
      addNotification('Order placed successfully!', 'success');
      setCart(null);
      setCartCount(0);
      setShowOrderForm(false);
      navigate('/customer/orders');
    } catch (error) {
      addNotification(
        error.response?.data?.message || 'Failed to place order',
        'error'
      );
    } finally {
      setUpdating(false);
    }
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

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto text-center py-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart</h1>
          <p className="text-gray-500 mb-6">Your cart is empty</p>
          <button
            onClick={() => navigate('/customer/products')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Browse Products
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {cart.items.map((item, index) => (
              <div key={index} className="p-6 flex items-center gap-4">
                {item.productId?.image && (
                  <img
                    src={item.productId.image}
                    alt={item.productId.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{item.productId?.name}</h3>
                  <p className="text-gray-500">${item.productId?.price?.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.productId._id,
                          item.quantity - 1
                        )
                      }
                      disabled={updating || item.quantity <= 1}
                      className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(
                          item.productId._id,
                          item.quantity + 1
                        )
                      }
                      disabled={updating}
                      className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right min-w-[100px]">
                    <p className="font-semibold">
                      ${item.itemTotal?.toFixed(2) || (item.productId?.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(item.productId._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="p-6 bg-gray-50 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="text-xl font-semibold">Total:</span>
              <span className="text-2xl font-bold text-blue-600">
                ${cart.totalPrice?.toFixed(2) || '0.00'}
              </span>
            </div>
            <button
              onClick={() => setShowOrderForm(true)}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-medium"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>

        {showOrderForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Place Order</h2>
              <form onSubmit={handleOrder}>
                <div className="mb-4">
                  <label className="block mb-2 font-medium">
                    Shipping Address *
                  </label>
                  <textarea
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg"
                    rows="4"
                    required
                    placeholder="Enter your complete shipping address"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {updating ? 'Placing Order...' : 'Confirm Order'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowOrderForm(false)}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CustomerCart;

