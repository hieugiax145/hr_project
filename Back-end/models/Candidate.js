const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  positionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Position',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Tiếp nhận hồ sơ', 'Hồ sơ đề xuất', 'Phỏng vấn lần 1', 'Phỏng vấn lần 2', 'Offer', 'Tuyển', 'Từ chối'],
    default: 'Tiếp nhận hồ sơ'
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  cv: {
    type: String,
    required: true
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Candidate', candidateSchema); 