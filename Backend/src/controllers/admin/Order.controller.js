import Order from '../../models/orderSchema.js';
import Product from '../../models/productSchema.js';

// Get all orders (Admin only)
export async function getAllOrders(req, res) {
    try {
        console.log('Admin fetching orders, user:', req.user);
        const { status } = req.query;
        const filter = {};
        if (status) filter.status = status;

        const orders = await Order.find(filter)
            .populate('items.productId')
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        
        console.log(`Found ${orders.length} orders`);
        return res.json({ orders, count: orders.length });
    } catch (err) {
        console.error('Error in getAllOrders:', err);
        return res.status(500).json({ error: err.message });
    }
}

// Get order by ID (Admin)
export async function getOrderById(req, res) {
    try {
        const { id } = req.params;
        
        const order = await Order.findById(id)
            .populate('items.productId')
            .populate('userId', 'name email');
        
        if (!order) return res.status(404).json({ message: 'Order not found' });
        
        return res.json({ order });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

// Update order status (Admin)
export async function updateOrderStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        const validStatuses = ['pending', 'accepted', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status. Valid statuses: ' + validStatuses.join(', ') });
        }

        // Get the order first to check current status
        const existingOrder = await Order.findById(id).populate('items.productId');
        if (!existingOrder) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // If accepting order (changing from pending to accepted), deduct stock
        if (status === 'accepted' && existingOrder.status === 'pending') {
            // Check stock availability before accepting
            for (const item of existingOrder.items) {
                const product = item.productId;
                if (product.stock < item.quantity) {
                    return res.status(400).json({ 
                        message: `Cannot accept order. Insufficient stock for ${product.name}. Available: ${product.stock}, Required: ${item.quantity}` 
                    });
                }
            }

            // Deduct stock for all items
            for (const item of existingOrder.items) {
                await Product.findByIdAndUpdate(item.productId._id, {
                    $inc: { stock: -item.quantity }
                });
            }
        }

        // If cancelling an accepted order, restore stock
        if (status === 'cancelled' && existingOrder.status === 'accepted') {
            for (const item of existingOrder.items) {
                await Product.findByIdAndUpdate(item.productId._id, {
                    $inc: { stock: item.quantity }
                });
            }
        }

        // Update order status
        const order = await Order.findByIdAndUpdate(
            id,
            { 
                status,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        )
        .populate('items.productId')
        .populate('userId', 'name email');

        return res.json({ message: 'Order status updated successfully', order });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

