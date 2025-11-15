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
        const userId = req.user.id;
        const { productId, quantity = 1 } = req.body;
        if (!productId) return res.status(400).json({ message: 'productId required' });

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [{ productId, quantity }] });
        } else {
            const idx = cart.items.findIndex(i => i.productId.toString() === productId);
            if (idx > -1) cart.items[idx].quantity += Number(quantity);
            else cart.items.push({ productId, quantity });
        }
        await cart.save();
        return res.json({ message: 'Added to cart', cart });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export async function removeFromCart(req, res) {
    try {
        const userId = req.user.id;
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ message: 'productId required' });

        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(i => i.productId.toString() !== productId);
        await cart.save();
        return res.json({ message: 'Removed from cart', cart });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export async function viewCart(req, res) {
    try {
        const userId = req.user.id;
        const cart = await Cart.findOne({ userId }).populate('items.productId');
        if (!cart) return res.status(404).json({ message: 'Cart empty' });
        return res.json({ cart });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}