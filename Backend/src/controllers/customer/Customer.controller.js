import Product from '../../models/productSchema.js';
import Cart from '../../models/cartSchema.js';

export async function getAllProducts(req, res) {
    try {
        const { name, minPrice, maxPrice } = req.query;
        const filter = {};
        if (name) filter.name = { $regex: name, $options: 'i' };
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        const products = await Product.find(filter);
        return res.json({ products, count: products.length });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export async function addToCart(req, res) {
    try {
        console.log('Add to cart - user:', req.user);
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;
        if (!productId) return res.status(400).json({ message: 'productId required' });

        // Mongoose automatically converts string IDs to ObjectIds, but we'll ensure it's valid
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [{ productId, quantity }] });
        } else {
            const idx = cart.items.findIndex(i => i.productId.toString() === productId);
            if (idx > -1) cart.items[idx].quantity += Number(quantity);
            else cart.items.push({ productId, quantity });
        }
        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.productId');
        return res.json({ message: 'Added to cart', cart: populatedCart });
    } catch (err) {
        console.error('Add to cart error:', err);
        return res.status(500).json({ error: err.message });
    }
}

export async function removeFromCart(req, res) {
    try {
        const userId = req.user.id;
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ message: 'productId required' });

        const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
        const cart = await Cart.findOne({ userId: userObjectId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(i => i.productId.toString() !== productId);
        await cart.save();
        return res.json({ message: 'Removed from cart', cart });
    } catch (err) {
        console.error('Remove from cart error:', err);
        return res.status(500).json({ error: err.message });
    }
}

export async function updateCartQuantity(req, res) {
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;
        if (!productId || !quantity) return res.status(400).json({ message: 'productId and quantity required' });
        if (quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        const item = cart.items.find(i => i.productId.toString() === productId);
        if (!item) return res.status(404).json({ message: 'Product not in cart' });

        item.quantity = Number(quantity);
        cart.updatedAt = new Date();
        await cart.save();
        const populatedCart = await Cart.findById(cart._id).populate('items.productId');
        return res.json({ message: 'Cart quantity updated', cart: populatedCart });
    } catch (err) {
        console.error('Update cart quantity error:', err);
        return res.status(500).json({ error: err.message });
    }
}

export async function viewCart(req, res) {
    try {
        console.log('View cart - user:', req.user);
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart || cart.items.length === 0) {
            return res.status(404).json({ message: 'Cart empty' });
        }
        
        // Calculate total price for each item and overall total
        let totalPrice = 0;
        const itemsWithPrice = cart.items.map(item => {
            const itemTotal = item.productId.price * item.quantity;
            totalPrice += itemTotal;
            return {
                productId: item.productId,
                quantity: item.quantity,
                itemTotal: itemTotal
            };
        });

        return res.json({ 
            cart: {
                ...cart.toObject(),
                items: itemsWithPrice,
                totalPrice
            }
        });
    } catch (err) {
        console.error('View cart error:', err);
        return res.status(500).json({ error: err.message });
    }
}