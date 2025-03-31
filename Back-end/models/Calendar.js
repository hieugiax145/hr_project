const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['online', 'offline'],
    default: 'offline'
  },
  room: {
    type: String,
    required: false
  },
  guests: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permissions: {
      canEdit: {
        type: Boolean,
        default: false
      },
      canInvite: {
        type: Boolean,
        default: false
      },
      canViewGuestList: {
        type: Boolean,
        default: true
      }
    }
  }],
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  isAllDay: {
    type: Boolean,
    default: false
  },
  reminderTime: {
    type: Number, // Số phút trước khi sự kiện bắt đầu
    default: 5
  },
  notifications: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['sent', 'read'],
      default: 'sent'
    },
    sentAt: {
      type: Date,
      default: Date.now
    }
  }],
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
calendarSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Phương thức để thêm guest vào sự kiện
calendarSchema.methods.addGuest = function(userId, permissions = {}) {
  if (!this.guests.some(guest => guest.userId.equals(userId))) {
    this.guests.push({
      userId,
      permissions: {
        canEdit: permissions.canEdit || false,
        canInvite: permissions.canInvite || false,
        canViewGuestList: permissions.canViewGuestList || true
      }
    });
  }
  return this.save();
};

// Phương thức để gửi thông báo cho guests
calendarSchema.methods.sendNotifications = async function() {
  const newNotifications = this.guests.map(guest => ({
    userId: guest.userId,
    status: 'sent'
  }));
  
  this.notifications.push(...newNotifications);
  return this.save();
};

const Calendar = mongoose.model('Calendar', calendarSchema);

module.exports = Calendar; 