import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET;

// -----------------------
// CHECK LOGIN
// -----------------------
export function requireAuth(req, res, next) {
    const token = req.cookies.tokenAuth;

    if (!token) {
        return res.status(401).json({ message: "Please login first" });
    }

    try {
        const userData = jwt.verify(token, process.env.JWT_SECRET); // decode token
        req.user = userData; // store payload
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

// -----------------------
// CHECK ADMIN
// -----------------------
export function requireAdmin(req, res, next) {
    const token = req.cookies.tokenAuth;

    if (!token) {
        return res.status(401).json({ message: "Please login first" });
    }

    try {
        const userData = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Admin check - userData:', userData);
        
        if (userData.role !== "admin") {
            return res.status(403).json({ message: "Admin access only" });
        }
        
        req.user = userData;
        next();
    } catch (err) {
        console.error('Admin auth error:', err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

// -----------------------
// CHECK CUSTOMER
// -----------------------
export function requireCustomer(req, res, next) {
    const token = req.cookies.tokenAuth;

    if (!token) {
        return res.status(401).json({ message: "Please login first" });
    }

    try {
        const userData = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Customer check - userData:', userData);
        
        if (userData.role !== "customer") {
            return res.status(403).json({ message: "Customer access only" });
        }
        
        req.user = userData;
        next();
    } catch (err) {
        console.error('Customer auth error:', err);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
