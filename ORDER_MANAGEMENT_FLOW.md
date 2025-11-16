# Order Management Flow

## Complete Order Workflow

### 1. Customer Places Order
- Customer adds items to cart
- Customer clicks "Proceed to Checkout"
- Customer enters shipping address
- Order is created with status: **"pending"**
- **Stock is NOT deducted at this point**
- Cart is cleared

### 2. Admin Views Orders
- Admin logs in and navigates to "Orders" page
- Admin can see all orders with:
  - Order ID
  - Customer name and email
  - Shipping address
  - Order items with quantities and prices
  - Total price
  - Current status
- Admin can filter orders by status

### 3. Admin Accepts Order
- Admin clicks "Accept Order" button on pending orders
- System checks stock availability
- If stock is sufficient:
  - Order status changes to **"accepted"**
  - **Stock is deducted from products**
  - Customer sees status update (auto-refreshes every 5 seconds)
- If stock is insufficient:
  - Error message shown to admin
  - Order remains "pending"

### 4. Order Status Flow
- **pending** → Customer placed order, waiting for admin approval
- **accepted** → Admin accepted the order, stock deducted
- **processing** → Order is being prepared
- **shipped** → Order has been shipped
- **delivered** → Order has been delivered
- **cancelled** → Order was cancelled (stock restored if was accepted)

### 5. Customer Views Order Status
- Customer can see all their orders on "My Orders" page
- Status updates automatically every 5 seconds
- Status badges show:
  - Yellow: Pending
  - Green: Accepted/Delivered
  - Blue: Processing
  - Purple: Shipped
  - Red: Cancelled

## API Endpoints

### Customer Endpoints
- `POST /api/customer/order` - Create order (requires shipping address)
- `GET /api/customer/orders` - Get customer's orders
- `GET /api/customer/order/:id` - Get specific order

### Admin Endpoints
- `GET /api/admin/orders` - Get all orders (with optional status filter)
- `GET /api/admin/order/:id` - Get specific order details
- `PUT /api/admin/order/:id/status` - Update order status

## Key Features

1. **Stock Management**
   - Stock is checked when order is created
   - Stock is deducted only when admin accepts order
   - Stock is restored if accepted order is cancelled

2. **Real-time Updates**
   - Customer orders page auto-refreshes every 5 seconds
   - Status changes are immediately visible

3. **Error Handling**
   - Insufficient stock errors are shown clearly
   - Network errors are handled gracefully

4. **Status Workflow**
   - Admin can progress orders through: pending → accepted → processing → shipped → delivered
   - Admin can cancel orders at any stage

## Testing the Flow

1. **As Customer:**
   - Add products to cart
   - Go to cart and click "Proceed to Checkout"
   - Enter shipping address and confirm order
   - Check "My Orders" - should show status as "PENDING"

2. **As Admin:**
   - Login as admin
   - Go to "Orders" page
   - Find the pending order
   - Click "Accept Order"
   - Verify stock was deducted

3. **Verify Status Update:**
   - As customer, refresh "My Orders" page
   - Status should now show "ACCEPTED" (updates automatically)

