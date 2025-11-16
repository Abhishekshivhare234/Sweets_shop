# E-Commerce Application Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

## Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Backend directory with the following variables:
```env
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key_here_change_in_production
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ADMIN_ID=admin_123
PORT=4000
FRONTEND_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:4000`

## Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file in the Frontend directory:
```env
VITE_API_URL=http://localhost:4000
```

4. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or the next available port)

## Features

### Admin Features
- Login (static credentials from .env)
- Add Products
- Update Products (including price)
- Delete Products
- View all products in a table

### Customer Features
- Register (default role: customer)
- Login
- Browse Products (with search and filter)
- Add to Cart
- Update Cart Quantity
- Remove from Cart
- View Cart with calculated totals
- Place Orders
- View Order History

## Default Routes

### Public Routes
- `/` - Home page
- `/login` - Login page (with admin/customer toggle)
- `/register` - Customer registration

### Admin Routes (Protected)
- `/admin/dashboard` - Admin dashboard with product management

### Customer Routes (Protected)
- `/customer/products` - Browse products
- `/customer/cart` - Shopping cart
- `/customer/orders` - Order history

## API Endpoints

See `Backend/API_DOCUMENTATION.md` for complete API documentation.

## Troubleshooting

1. **Backend won't start**: 
   - Check if MongoDB is running
   - Verify `.env` file exists and has correct values
   - Check if port 4000 is available

2. **Frontend won't start**:
   - Check if port 5173 is available
   - Verify all dependencies are installed
   - Check browser console for errors

3. **CORS errors**:
   - Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
   - Check that `withCredentials: true` is set in API calls

4. **Authentication issues**:
   - Clear browser cookies
   - Check localStorage for user data
   - Verify JWT_SECRET is set in backend `.env`

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs for password hashing

### Frontend
- React 19
- React Router DOM
- Axios
- Tailwind CSS
- Context API for state management

