import Order from '../../models/orderSchema.js';
import Cart from '../../models/cartSchema.js';
import Product from '../../models/productSchema.js';

export async function createOrder(req, res) {
    try {
        const userId = req.user.id;
        const { shippingAddress } = req.body;
        
        if (!shippingAddress) return res.status(400).json({ message: 'shippingAddress required' });

        // Get cart with populated products
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        // Check stock availability and calculate total
        let totalPrice = 0;
        const orderItems = [];

        for (const item of cart.items) {
            const product = item.productId;
            if (product.stock < item.quantity) {
                return res.status(400).json({ 
                    message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
                });
            }

            const itemPrice = product.price * item.quantity;
            totalPrice += itemPrice;

            orderItems.push({
                productId: product._id,
                quantity: item.quantity,
                price: product.price
            });
        }

        // Create order (stock will be deducted when admin accepts)
        const order = new Order({
            userId,
            items: orderItems,
            totalPrice,
            shippingAddress,
            status: 'pending'
        });
        await order.save();

        // Clear cart
        cart.items = [];
        cart.updatedAt = new Date();
        await cart.save();

        const populatedOrder = await Order.findById(order._id)
            .populate('items.productId')
            .populate('userId', 'name email');

        return res.status(201).json({ message: 'Order created successfully', order: populatedOrder });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export async function getMyOrders(req, res) {
    try {
        console.log('Get my orders - user:', req.user);
        const userId = req.user.id;
        const orders = await Order.find({ userId })
            .populate('items.productId')
            .sort({ createdAt: -1 });
        
        console.log(`Found ${orders.length} orders for user ${userId}`);
        return res.json({ orders, count: orders.length });
    } catch (err) {
        console.error('Get my orders error:', err);
        return res.status(500).json({ error: err.message });
    }
}

export async function getOrderById(req, res) {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const order = await Order.findOne({ _id: id, userId })
            .populate('items.productId')
            .populate('userId', 'name email');
        
        if (!order) return res.status(404).json({ message: 'Order not found' });
        
        return res.json({ order });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

