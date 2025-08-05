require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./logger');
const http = require('http');
const { Server } = require("socket.io");

// --- Import Routes ---
const employeeRoutes = require('./routes/employeeRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const staffRoutes = require('./routes/staffRoutes');
const consolidationRoutes = require('./routes/consolidationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173", // Your frontend URL
    methods: ["GET", "POST"]
  }
});

// Make the io instance available to all routes
app.set('socketio', io);

// --- WebSocket Connection Logic ---
io.on('connection', (socket) => {
  logger.info(`A user connected: ${socket.id}`);

  // Logic for clients to join specific rooms
  socket.on('join_room', (roomName) => {
    socket.join(roomName);
    logger.info(`Socket ${socket.id} joined room: ${roomName}`);
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/api/employees', employeeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/consolidation', consolidationRoutes);
app.use('/api/admin', adminRoutes);

// --- Basic Test Route ---
app.get('/', (req, res) => {
  res.send('Orderly Backend is running!');
});

// --- Centralized Error Handler (MUST BE LAST) ---
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// --- Start the Server ---
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});