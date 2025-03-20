const mongoose = require('mongoose');

const JobPositionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  department: { type: String, required: true },
  description: { type: String },
  requirements: { type: String },
  salaryRange: { type: String },
  status: { type: String, enum: ['open', 'closed'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model('JobPosition', JobPositionSchema);
