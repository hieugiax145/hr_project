const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  interviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
