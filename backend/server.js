const dotenv = require('dotenv');
// Load environment variables immediately
dotenv.config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const socketService = require('./services/socketService');
const admin = require('./config/firebase'); // Init Firebase

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const garageRoutes = require('./routes/garageRoutes');
const jobRoutes = require('./routes/jobRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const Message = require('./models/Message');
const path = require('path');

// Swagger Config
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'GarageNow API',
      version: '1.0.0',
      description: 'Expert Vehicle Assistance Marketplace API'
    },
    servers: [{ url: 'https://road-garadge.onrender.com/api/v1' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Connect to MongoDB
connectDB();

const app = express();

// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.io
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Global Socket Tracking Map
const connectedUsers = new Map();

// Socket.io Connection Logic
io.on('connection', (socket) => {
  console.log('⚡ New Client Connected:', socket.id);

  // Register user and map to socket ID
  socket.on('register', ({ userId }) => {
    socketService.registerUser(userId, socket.id, connectedUsers);
  });

  // Handle Real-time Chat
  socket.on('send_message', async (data) => {
    try {
      const { senderId, recipientId, jobId, content } = data;
      
      // 1. Persist message to DB
      const newMessage = await Message.create({
        sender: senderId,
        recipient: recipientId,
        jobId,
        content
      });

      // 2. Emit to recipient if connected
      const recipientSocketId = connectedUsers.get(recipientId.toString());
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('receive_message', newMessage);
      }

      // 3. Optional: Emit back to sender for confirmation (or use callback)
      socket.emit('message_sent', newMessage);

    } catch (error) {
      console.error('Socket Chat Error:', error.message);
    }
  });

  socket.on('disconnect', () => {
    socketService.unregisterUser(socket.id, connectedUsers);
    console.log('👋 Client Disconnected:', socket.id);
  });
});

// Middleware
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Inject Socket.io and Map into Req
app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  next();
});

// Basic Health-Check Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 GarageNow Backend API is running smoothly',
    version: '1.0.0'
  });
});

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/garages', garageRoutes);
app.use('/api/v1/jobs', jobRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/vehicles', vehicleRoutes);

// Centralized Error Handling (Must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`📡 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
