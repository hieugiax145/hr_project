const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  responsible: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  position: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Chờ nộp', 'Đã nộp', 'Đang duyệt', 'Đã duyệt', 'Từ chối'],
    default: 'Chờ nộp'
  },
  date: {
    type: Date,
    default: Date.now
  },
  jobDescription: { type: String, required: true },
  requirements: { type: String, required: true },
  benefits: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
