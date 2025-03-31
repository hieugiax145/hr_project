const Calendar = require('../models/Calendar');
const User = require('../models/User');
const { startOfMonth, endOfMonth } = require('date-fns');

const calendarController = {
  // Lấy tất cả sự kiện trong tháng
  getMonthEvents: async (req, res) => {
    try {
      const { month, year } = req.query;
      const startDate = startOfMonth(new Date(year, month - 1));
      const endDate = endOfMonth(new Date(year, month - 1));

      const events = await Calendar.find({
        date: {
          $gte: startDate,
          $lte: endDate
        }
      })
      .populate('host', 'name email')
      .populate('guests.userId', 'name email')
      .sort({ date: 1, startTime: 1 });

      res.json({
        success: true,
        data: events
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy danh sách sự kiện',
        error: error.message
      });
    }
  },

  // Tạo sự kiện mới
  createEvent: async (req, res) => {
    try {
      const {
        title,
        date,
        startTime,
        endTime,
        type,
        room,
        guests,
        description,
        isAllDay,
        reminderTime
      } = req.body;

      const newEvent = new Calendar({
        title,
        date,
        startTime,
        endTime,
        type,
        room,
        host: req.user._id, // Lấy từ middleware xác thực
        description,
        isAllDay,
        reminderTime
      });

      // Thêm guests và quyền của họ
      if (guests && Array.isArray(guests)) {
        for (const guest of guests) {
          const user = await User.findOne({ email: guest.email });
          if (user) {
            await newEvent.addGuest(user._id, guest.permissions);
          }
        }
      }

      await newEvent.save();
      
      // Gửi thông báo cho tất cả guests
      await newEvent.sendNotifications();

      res.status(201).json({
        success: true,
        message: 'Tạo sự kiện thành công',
        data: newEvent
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi tạo sự kiện',
        error: error.message
      });
    }
  },

  // Cập nhật sự kiện
  updateEvent: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Kiểm tra quyền chỉnh sửa
      const event = await Calendar.findById(id);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sự kiện'
        });
      }

      const isHost = event.host.equals(req.user._id);
      const isGuest = event.guests.some(
        guest => guest.userId.equals(req.user._id) && guest.permissions.canEdit
      );

      if (!isHost && !isGuest) {
        return res.status(403).json({
          success: false,
          message: 'Không có quyền chỉnh sửa sự kiện này'
        });
      }

      // Cập nhật sự kiện
      const updatedEvent = await Calendar.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      )
      .populate('host', 'name email')
      .populate('guests.userId', 'name email');

      res.json({
        success: true,
        message: 'Cập nhật sự kiện thành công',
        data: updatedEvent
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật sự kiện',
        error: error.message
      });
    }
  },

  // Xóa sự kiện
  deleteEvent: async (req, res) => {
    try {
      const { id } = req.params;

      // Kiểm tra quyền xóa
      const event = await Calendar.findById(id);
      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sự kiện'
        });
      }

      if (!event.host.equals(req.user._id)) {
        return res.status(403).json({
          success: false,
          message: 'Chỉ host mới có quyền xóa sự kiện'
        });
      }

      await Calendar.findByIdAndDelete(id);

      res.json({
        success: true,
        message: 'Xóa sự kiện thành công'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi xóa sự kiện',
        error: error.message
      });
    }
  },

  // Lấy chi tiết một sự kiện
  getEventDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const event = await Calendar.findById(id)
        .populate('host', 'name email')
        .populate('guests.userId', 'name email');

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy sự kiện'
        });
      }

      res.json({
        success: true,
        data: event
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi lấy chi tiết sự kiện',
        error: error.message
      });
    }
  },

  // Đánh dấu thông báo đã đọc
  markNotificationAsRead: async (req, res) => {
    try {
      const { eventId, notificationId } = req.params;

      const event = await Calendar.findOneAndUpdate(
        {
          _id: eventId,
          'notifications._id': notificationId,
          'notifications.userId': req.user._id
        },
        {
          $set: {
            'notifications.$.status': 'read'
          }
        },
        { new: true }
      );

      if (!event) {
        return res.status(404).json({
          success: false,
          message: 'Không tìm thấy thông báo'
        });
      }

      res.json({
        success: true,
        message: 'Đã đánh dấu thông báo là đã đọc'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Lỗi khi cập nhật trạng thái thông báo',
        error: error.message
      });
    }
  }
};

module.exports = calendarController; 