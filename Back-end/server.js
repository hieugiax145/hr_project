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

//Error Handler
const errorHandler = require('./utils/errorHandler');
app.use(errorHandler);

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
app.use(express.json());
app.use(cors());

// Kết nối MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
};

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

app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/positions', positionRoutes);

// Khởi động server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));