const mongoose = require('mongoose');

const interviewSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ['interview', 'meeting', 'presentation'],
      default: 'interview',
    },
    eventType: {
      type: String,
      enum: ['online', 'offline'],
      required: true,
    },
    location: {
      type: String,
    },
    description: {
      type: String,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Candidate',
      required: true,
    },
    attendees: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    beforeEvent: {
      type: Number,
      default: 5
    },
    notificationSent: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Interview', interviewSchema);
