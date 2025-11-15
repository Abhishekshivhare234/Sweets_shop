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
    requireAuth(req, res, () => {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Admin access only" });
        }
        next();
    });
}

// -----------------------
// CHECK CUSTOMER
// -----------------------
export function requireCustomer(req, res, next) {
    requireAuth(req, res, () => {
        if (req.user.role !== "customer") {
            return res.status(403).json({ message: "Customer access only" });
        }
        next();
    });
}
