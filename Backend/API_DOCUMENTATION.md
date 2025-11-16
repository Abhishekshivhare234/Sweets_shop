# Backend API Documentation

## Overview
This is an e-commerce backend with:
- **Static Admin**: Hardcoded admin credentials from environment variables
- **Dynamic Customers**: User registration with default role "customer"
- **Product Management**: Admin can add, update, and delete products
- **Shopping Cart**: Customers can add, update quantity, and remove items
- **Order Management**: Customers can place orders and view their order history

---

## Base URL
```
http://localhost:4000/api
```

---

## Authentication
- Uses JWT tokens stored in HTTP-only cookies
- Token expires in 8 hours
- Middleware: `requireAuth`, `requireAdmin`, `requireCustomer`

---

## API Endpoints

### 1. User Routes (`/api/users`)

#### Register User
- **POST** `/api/users/register`
- **Auth**: None required
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "message": "User registered",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    }
  }
  ```

#### Login User (Customer)
- **POST** `/api/users/login`
- **Auth**: None required
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "message": "Logged in",
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer",
      "token": "..."
    }
  }
  ```

#### Logout User
- **POST** `/api/users/logout`
- **Auth**: None required
- **Response**: `200 OK`
  ```json
  {
    "message": "Logged out"
  }
  ```

---

### 2. Admin Routes (`/api/admin`)

#### Admin Login
- **POST** `/api/admin/login`
- **Auth**: None required
- **Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "admin123"
  }
  ```
- **Note**: Credentials come from `.env` (ADMIN_EMAIL, ADMIN_PASSWORD)
- **Response**: `200 OK`
  ```json
  {
    "message": "Admin logged in successfully",
    "admin": {
      "email": "admin@example.com",
      "id": "..."
    }
  }
  ```

#### Add Product
- **POST** `/api/admin/product`
- **Auth**: Admin required
- **Body**:
  ```json
  {
    "name": "Laptop",
    "price": 999.99,
    "description": "High-performance laptop",
    "stock": 50,
    "category": "Electronics",
    "image": "https://example.com/image.jpg"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "message": "Product added",
    "product": { ... }
  }
  ```

#### Update Product
- **PUT** `/api/admin/product/:id`
- **Auth**: Admin required
- **Body**: (any product fields to update)
  ```json
  {
    "price": 899.99,
    "stock": 45
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "message": "Product updated",
    "product": { ... }
  }
  ```

#### Delete Product
- **DELETE** `/api/admin/product/:id`
- **Auth**: Admin required
- **Response**: `200 OK`
  ```json
  {
    "message": "Product deleted",
    "product": { ... }
  }
  ```

---

### 3. Customer Routes (`/api/customer`)

#### Get All Products
- **GET** `/api/customer/products`
- **Auth**: None required
- **Query Params** (optional):
  - `name`: Search by product name (case-insensitive)
  - `minPrice`: Minimum price filter
  - `maxPrice`: Maximum price filter
- **Example**: `/api/customer/products?name=laptop&minPrice=500&maxPrice=1000`
- **Response**: `200 OK`
  ```json
  {
    "products": [...],
    "count": 10
  }
  ```

#### Add to Cart
- **POST** `/api/customer/cart`
- **Auth**: Customer required
- **Body**:
  ```json
  {
    "productId": "product_id_here",
    "quantity": 2
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "message": "Added to cart",
    "cart": { ... }
  }
  ```

#### Update Cart Quantity
- **PUT** `/api/customer/cart`
- **Auth**: Customer required
- **Body**:
  ```json
  {
    "productId": "product_id_here",
    "quantity": 5
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "message": "Cart quantity updated",
    "cart": { ... }
  }
  ```

#### Remove from Cart
- **DELETE** `/api/customer/cart`
- **Auth**: Customer required
- **Body**:
  ```json
  {
    "productId": "product_id_here"
  }
  ```
- **Response**: `200 OK`
  ```json
  {
    "message": "Removed from cart",
    "cart": { ... }
  }
  ```

#### View Cart
- **GET** `/api/customer/cart`
- **Auth**: Customer required
- **Response**: `200 OK`
  ```json
  {
    "cart": {
      "userId": "...",
      "items": [
        {
          "productId": { ... },
          "quantity": 2,
          "itemTotal": 1999.98
        }
      ],
      "totalPrice": 1999.98,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
  ```

#### Create Order
- **POST** `/api/customer/order`
- **Auth**: Customer required
- **Body**:
  ```json
  {
    "shippingAddress": "123 Main St, City, State, ZIP"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "message": "Order created successfully",
    "order": {
      "userId": "...",
      "items": [...],
      "totalPrice": 1999.98,
      "status": "pending",
      "shippingAddress": "...",
      "createdAt": "..."
    }
  }
  ```
- **Note**: 
  - Checks stock availability
  - Deducts stock from products
  - Clears cart after order creation

#### Get My Orders
- **GET** `/api/customer/orders`
- **Auth**: Customer required
- **Response**: `200 OK`
  ```json
  {
    "orders": [...],
    "count": 5
  }
  ```

#### Get Order by ID
- **GET** `/api/customer/order/:id`
- **Auth**: Customer required
- **Response**: `200 OK`
  ```json
  {
    "order": { ... }
  }
  ```

---

## Data Models

### User Schema
```javascript
{
  name: String (required, 3-30 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars),
  role: String (default: "customer"),
  createdAt: Date
}
```

### Product Schema
```javascript
{
  name: String (required, 3-50 chars),
  price: Number (required, min 0),
  description: String (max 500 chars),
  stock: Number (default: 0, min 0),
  category: String (required),
  image: String,
  addedby: String (default: "Admin"),
  createdAt: Date,
  updatedAt: Date
}
```

### Cart Schema
```javascript
{
  userId: ObjectId (ref: User, required, unique),
  items: [{
    productId: ObjectId (ref: Product, required),
    quantity: Number (default: 1, min 1)
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Order Schema
```javascript
{
  userId: ObjectId (ref: User, required),
  items: [{
    productId: ObjectId (ref: Product, required),
    quantity: Number (required, min 1),
    price: Number (required, min 0)
  }],
  totalPrice: Number (required, min 0),
  status: String (enum: ['pending','processing','shipped','delivered','cancelled'], default: 'pending'),
  shippingAddress: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

---

## Environment Variables Required
```env
MONGO_URI=mongodb://...
JWT_SECRET=your_secret_key
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ADMIN_ID=admin_id_here
PORT=4000
FRONTEND_URL=http://localhost:5173
```

---

## Fixed Issues
1. ✅ Fixed undefined `role` variable in user registration
2. ✅ Added `updateProduct` endpoint for admin
3. ✅ Added complete order functionality (create, view orders)
4. ✅ Added `updateCartQuantity` endpoint for customers
5. ✅ Enhanced cart view to calculate and return total price
6. ✅ Removed password from admin login response (security fix)

---

## Notes for Frontend Development
- All authenticated endpoints require the `tokenAuth` cookie
- Cart total price is calculated server-side and returned in the response
- Order creation automatically:
  - Validates stock availability
  - Deducts stock from products
  - Clears the cart
- Product filtering supports name search and price range
- All timestamps are automatically managed by the backend

