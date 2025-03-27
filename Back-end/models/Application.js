const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  department: { 
    type: String, 
    required: true,
    enum: ['Kế toán', 'Marketing', 'IT', 'Nhân sự', 'Kinh doanh']
  },
  position: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true,
    min: 1 
  },
  mainLocation: { 
    type: String, 
    required: true 
  },
  otherLocations: { 
    type: [String], 
    default: [] 
  },
  reason: { 
    type: String, 
    required: true,
    enum: ['Tuyển do thiếu nhân sự', 'Tuyển do mở rộng quy mô']
  },
  budget: { 
    type: String, 
    required: true,
    enum: ['Đạt chuẩn', 'Vượt quỹ']
  },
  jobDescription: { 
    type: String, 
    required: true 
  },
  requirements: { 
    type: String, 
    required: true 
  },
  benefits: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Chờ nộp', 'Đã nộp', 'Đang duyệt', 'Đã duyệt', 'Từ chối'],
    default: 'Chờ nộp'
  },
  approvers: [{
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected'], 
      default: 'pending' 
    },
    comment: String,
    approvedAt: Date
  }]
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Application', ApplicationSchema);
