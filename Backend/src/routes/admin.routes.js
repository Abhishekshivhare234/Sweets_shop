import express from 'express';
import { adminLogin, addProduct, deleteProduct } from '../controllers/admin/adminLogin.js';
import { requireAdmin } from '../Middleware/Auth.js';

const router = express.Router();
router.post('/login', adminLogin);
router.post('/product', requireAdmin, addProduct);
router.delete('/product/:id', requireAdmin, deleteProduct);
export default router;