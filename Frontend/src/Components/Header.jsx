import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { useApp } from '../Context/AppContext';

const Header = () => {
  const { user, logout, isAdmin, isCustomer } = useAuth();
  const { cartCount } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            E-Commerce
          </Link>

          <nav className="flex items-center gap-6">
            {user ? (
              <>
                {isAdmin && (
                  <>
                    <Link
                      to="/admin/dashboard"
                      className="text-gray-700 hover:text-blue-600 transition"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/admin/orders"
                      className="text-gray-700 hover:text-blue-600 transition"
                    >
                      Orders
                    </Link>
                  </>
                )}

                {isCustomer && (
                  <>
                    <Link
                      to="/customer/products"
                      className="text-gray-700 hover:text-blue-600 transition"
                    >
                      Products
                    </Link>
                    <Link
                      to="/customer/cart"
                      className="text-gray-700 hover:text-blue-600 transition relative"
                    >
                      Cart
                      {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {cartCount}
                        </span>
                      )}
                    </Link>
                    <Link
                      to="/customer/orders"
                      className="text-gray-700 hover:text-blue-600 transition"
                    >
                      Orders
                    </Link>
                  </>
                )}

                <div className="flex items-center gap-4">
                  <span className="text-gray-700">
                    {user.name || user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

