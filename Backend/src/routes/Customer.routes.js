import express from 'express';
import { getAllProducts, addToCart, removeFromCart, viewCart } from '../controllers/customer/Customer.controller.js';
import { requireCustomer } from '../Middleware/Auth.js';

const router = express.Router();
router.get('/products', getAllProducts);
router.post('/cart', requireCustomer, addToCart);
router.delete('/cart', requireCustomer, removeFromCart);
router.get('/cart', requireCustomer, viewCart);
export default router;