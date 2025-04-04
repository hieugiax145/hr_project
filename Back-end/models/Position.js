const mongoose = require('mongoose');

const positionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  branch: {
    type: String,
    required: true,
    enum: ['Hồ Chí Minh', 'Đà Nẵng', 'Hà Nội'],
    default: 'Hà Nội'
  },
  level: {
    type: String,
    required: true,
    enum: ['Thực tập sinh', 'Junior', 'Middle', 'Senior', 'Leader']
  },
  experience: {
    type: String,
    required: true,
    enum: ['Dưới 1 năm', '1-2 năm', '2-3 năm', '3-5 năm', 'Trên 5 năm']
  },
  type: {
    type: String,
    required: true,
    enum: ['Full-time', 'Part-time', 'Contract']
  },
  mode: {
    type: String,
    required: true,
    enum: ['On-site', 'Remote', 'Hybrid']
  },
  salary: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  requirements: {
    type: String,
    required: true,
    trim: true
  },
  benefits: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['Còn tuyển', 'Tạm dừng', 'Đã đủ'],
    default: 'Còn tuyển'
  },
  requiredQuantity: {
    type: Number,
    required: true,
    default: 1
  },
  currentQuantity: {
    type: Number,
    default: 0
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Middleware để tự động cập nhật trạng thái dựa trên số lượng ứng viên
positionSchema.pre('save', function(next) {
  if (this.currentQuantity >= this.requiredQuantity) {
    this.status = 'Đã đủ';
  }
  next();
});

module.exports = mongoose.model('Position', positionSchema); 