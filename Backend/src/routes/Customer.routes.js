import express from 'express';
import { getAllProducts, addToCart, removeFromCart, updateCartQuantity, viewCart } from '../controllers/customer/Customer.controller.js';
import { createOrder, getMyOrders, getOrderById } from '../controllers/customer/Order.controller.js';
import { requireCustomer } from '../Middleware/Auth.js';

const router = express.Router();
router.get('/products', getAllProducts);
router.post('/cart', requireCustomer, addToCart);
router.put('/cart', requireCustomer, updateCartQuantity);
router.delete('/cart', requireCustomer, removeFromCart);
router.get('/cart', requireCustomer, viewCart);
router.post('/order', requireCustomer, createOrder);
router.get('/orders', requireCustomer, getMyOrders);
router.get('/order/:id', requireCustomer, getOrderById);
export default router;