const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const authMiddleware = require('../middleware/authMiddleware');

// Áp dụng middleware xác thực cho tất cả các routes
router.use(authMiddleware);

// Lấy danh sách sự kiện trong tháng
router.get('/events', calendarController.getMonthEvents);

// Lấy chi tiết một sự kiện
router.get('/events/:id', calendarController.getEventDetails);

// Tạo sự kiện mới
router.post('/events', calendarController.createEvent);

// Cập nhật sự kiện
router.put('/events/:id', calendarController.updateEvent);

// Xóa sự kiện
router.delete('/events/:id', calendarController.deleteEvent);

// Đánh dấu thông báo đã đọc
router.patch('/events/:eventId/notifications/:notificationId/read', calendarController.markNotificationAsRead);

module.exports = router; 