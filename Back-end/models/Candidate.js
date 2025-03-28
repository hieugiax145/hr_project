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
  stage: {
    type: String,
    enum: ['new', 'reviewing', 'interview1', 'interview2', 'offer', 'hired', 'rejected'],
    default: 'new'
  },
  source: {
    type: String,
    enum: ['Facebook', 'Email', 'JobsGo', 'Khác'],
    required: true
  },
  customSource: {
    type: String,
    required: function() {
      return this.source === 'Khác';
    }
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