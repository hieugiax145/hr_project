const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('./utils/cronJobs');

// Load biến môi trường từ file .env
dotenv.config();

const app = express();

// Cài đặt giới hạn kích thước request
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cài đặt Helmet để bảo vệ HTTP headers
app.use(helmet());

// Cài đặt Rate Limiting để ngăn chặn tấn công DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn 100 yêu cầu trong 15 phút
  message: 'Too many requests, please try again later.'
});

app.use('/api/', limiter);

// Middleware
app.use(cors());

// Health check endpoint
app.get('/health', (req, res) => {
  const healthcheck = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  };
  res.status(200).json(healthcheck);
});

// Kết nối MongoDB với cơ chế tự động kết nối lại và retry
const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      w: 'majority'
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts left)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error('Failed to connect to MongoDB after multiple attempts');
      process.exit(1);
    }
  }
};

// Xử lý sự kiện mất kết nối MongoDB
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
  connectDB();
});

// Xử lý lỗi MongoDB
mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});

// Xử lý lỗi chung của ứng dụng
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Không thoát process ngay lập tức
  // Để cho phép graceful shutdown
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Không thoát process ngay lập tức
  // Để cho phép graceful shutdown
});

connectDB();

// Models
const User = require('./models/User');
const JobPosition = require('./models/JobPosition');
const Application = require('./models/Application');
const Interview = require('./models/Interview');
const Offer = require('./models/Offer');
const Notification = require('./models/Notification');
const Position = require('./models/Position');

// Routes
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const offerRoutes = require('./routes/offerRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const positionRoutes = require('./routes/positionRoutes');
const candidateRoutes = require('./routes/candidateRoutes');

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/positions', positionRoutes);
app.use('/api/candidates', candidateRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl
  });
});

//Error Handler - Đặt ở cuối middleware stack
const errorHandler = require('./utils/errorHandler');
app.use(errorHandler);

// Khởi động server
const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB Status: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
});

// Xử lý graceful shutdown
const gracefulShutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  // Đóng server HTTP
  server.close(() => {
    console.log('HTTP server closed');
  });

  // Đóng kết nối MongoDB
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
  }

  // Đợi tất cả các kết nối được đóng
  setTimeout(() => {
    console.log('Graceful shutdown completed');
    process.exit(0);
  }, 1000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));