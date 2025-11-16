import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import Layout from '../Components/Layout';

const Home = () => {
  const { isAuthenticated, isAdmin, isCustomer } = useAuth();

  return (
    <Layout>
      <div className="max-w-6xl mx-auto text-center py-16">
        <h1 className="text-5xl font-bold text-gray-800 mb-6">
          Welcome to E-Commerce
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your one-stop shop for all your needs
        </p>

        {!isAuthenticated ? (
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-medium"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition text-lg font-medium"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="flex gap-4 justify-center">
            {isAdmin && (
              <Link
                to="/admin/dashboard"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-medium"
              >
                Go to Admin Dashboard
              </Link>
            )}
            {isCustomer && (
              <>
                <Link
                  to="/customer/products"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition text-lg font-medium"
                >
                  Browse Products
                </Link>
                <Link
                  to="/customer/cart"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition text-lg font-medium"
                >
                  View Cart
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;

