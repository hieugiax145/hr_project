const mongoose = require('mongoose');

const recruitmentNotificationSchema = new mongoose.Schema({
  recruitmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    required: true
  },
  position: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'read'],
    default: 'pending'
  },
  message: {
    type: String,
    required: true,
    default: 'Phiếu YCTD của bạn đã được CEO phê duyệt'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RecruitmentNotification', recruitmentNotificationSchema); 