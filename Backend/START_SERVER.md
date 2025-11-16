# How to Start the Backend Server

## Quick Start

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Make sure you have a `.env` file with the following variables:
```env
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_secret_key_here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ADMIN_ID=admin_123
PORT=4000
FRONTEND_URL=http://localhost:5173
```

3. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## Troubleshooting

### Server won't start
- Check if MongoDB is running
- Verify `.env` file exists and has correct values
- Check if port 4000 is available (use `netstat -ano | findstr :4000` on Windows)

### Connection Refused Error
- Make sure the backend server is running
- Check if the server is listening on port 4000
- Verify CORS settings in `server.js`
- Check firewall settings

### MongoDB Connection Error
- Ensure MongoDB is installed and running
- Verify MONGO_URI in `.env` is correct
- Check MongoDB service status

