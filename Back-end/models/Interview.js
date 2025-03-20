const mongoose = require('mongoose');

const InterviewSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  interviewer: { type: String, required: true },
  schedule: { type: Date, required: true },
  result: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Interview', InterviewSchema);
