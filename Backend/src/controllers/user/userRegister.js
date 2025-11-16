import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/user.Schema.js';
import dotenv from 'dotenv';

dotenv.config();

const SECRET = process.env.JWT_SECRET;

export async function registerUser(req, res) {
    try {
        const { name, email, password} = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: 'name, email, password required' });
        
        console.log("Registering user with email:", email);
        console.log("Registering user with name:", name);

        const exists = await User.findOne({ email });
        if (exists) return res.status(409).json({ message: 'Email already exists' });

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashed, role: 'customer' });
        await user.save();

        return res.status(201).json({ message: 'User registered', user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ message: 'Validation failed', errors });
        }
        return res.status(500).json({ error: err.message });
    }
}

export async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: 'email and password required' });

        const user = await User.findOne({ email }).lean();
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, SECRET, { expiresIn: '8h' });
        res.cookie('tokenAuth', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 8 * 60 * 60 * 1000 
        });
        console.log("Customer token:", token);
        console.log("User logged in:", user.role);
        return res.json({ message: 'Logged in', user: { id: user._id, name: user.name, email: user.email, role: user.role, token } });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

export async function logoutUser(req, res) {
    res.clearCookie('tokenAuth');
    return res.json({ message: 'Logged out' });
}