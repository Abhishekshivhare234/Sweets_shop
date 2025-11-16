import express from 'express';
import { adminLogin, addProduct, updateProduct, deleteProduct } from '../controllers/admin/adminLogin.js';
import { getAllOrders, getOrderById, updateOrderStatus } from '../controllers/admin/Order.controller.js';
import { requireAdmin } from '../Middleware/Auth.js';

const router = express.Router();
router.post('/login', adminLogin);
router.post('/product', requireAdmin, addProduct);
router.put('/product/:id', requireAdmin, updateProduct);
router.delete('/product/:id', requireAdmin, deleteProduct);
router.get('/orders', requireAdmin, getAllOrders);
router.get('/order/:id', requireAdmin, getOrderById);
router.put('/order/:id/status', requireAdmin, updateOrderStatus);
export default router;