const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  status: { type: String, enum: ['read', 'unread'], default: 'unread' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
