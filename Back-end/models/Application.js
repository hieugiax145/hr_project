const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobPositionId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPosition', required: true },
  department: { type: String, required: true }, 
  quantity: { type: Number, required: true },
  workLocation: { type: [String], required: true }, 
  reasonForHiring: { type: String, required: true },
  recruitmentBudget: { type: String, required: true }, 
  jobDescription: { type: String, required: true },
  requirements: { type: String, required: true },
  benefits: { type: String, required: true }, 
  approvers: [{
    name: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    approvedAt: { type: Date }
  }],
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  mainLocation: { type: String, required: true },
  otherLocations: { type: [String], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Application', ApplicationSchema);
