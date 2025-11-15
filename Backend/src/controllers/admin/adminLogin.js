import jwt from 'jsonwebtoken';
import User from '../../models/user.Schema.js';
import Product from '../../models/productSchema.js';
import dotenv from 'dotenv';  
dotenv.config();



export async function adminLogin(req, res) {
    try {
        const { email, password } = req.body;
        console.log("Admin login email:", email);
        console.log("Admin login password:", password);
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password required" });
        }

        // Static admin credentials from .env
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminPassword = process.env.ADMIN_PASSWORD;
        const adminId = process.env.ADMIN_ID;
        const SECRET = process.env.JWT_SECRET;

        // Check email & password
        if (email !== adminEmail || password !== adminPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Create simple payload
        const payload = {
            role: "admin",
            email: adminEmail,
            id: adminId
        };

        const token = jwt.sign(payload, SECRET, { expiresIn: "8h" });
        console.log("Admin token:", token);
        // Set cookie
        res.cookie("tokenAuth", token, {
            httpOnly: true,
            maxAge: 8 * 60 * 60 * 1000
        });

        return res.json({ message: "Admin logged in successfully", admin: { email: adminEmail ,password: adminPassword,id: adminId } });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export async function addProduct(req, res) {
    try {

        const p = req.body;
        console.log(p);
        const product = new Product(p);
        await product.save();
        return res.status(201).json({ message: 'Product added', product });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ message: 'Validation failed', errors });
        }
        if (err.code === 11000) return res.status(409).json({ message: 'SKU already exists' });
        return res.status(500).json({ error: err.message });
    }
}

export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        return res.json({ message: 'Product deleted', product });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}