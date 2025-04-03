const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  task: String,
  details: String,
  results: String,
  completion: {
    type: String,
    enum: ['Chưa hoàn thành', 'Hoàn thiện', 'Hoàn thành trước thời hạn', '']
  },
  comments: String,
  notes: String
});

const selfEvaluationSchema = new mongoose.Schema({
  advantages: String,
  disadvantages: String,
  improvements: String,
  overall: String
});

const managerEvaluationSchema = new mongoose.Schema({
  overall: String,
  futurePlan: String
});

const evaluationSchema = new mongoose.Schema({
  notificationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notification',
    required: true,
    unique: true // Đảm bảo 1 thông báo chỉ có 1 đánh giá
  },
  tasks: [taskSchema],
  selfEvaluation: {
    type: selfEvaluationSchema,
    default: () => ({})
  },
  managerEvaluation: {
    type: managerEvaluationSchema,
    default: () => ({})
  },
  result: String,
  note: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware để tự động cập nhật updatedAt
evaluationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Evaluation = mongoose.model('Evaluation', evaluationSchema);

module.exports = Evaluation; 