const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { protect, authorizeAdminHR } = require('../middlewares/authMiddleware');

// Lấy danh sách sự kiện trong tháng
router.get('/events', protect, authorizeAdminHR('view'), calendarController.getMonthEvents);

// Lấy chi tiết một sự kiện
router.get('/events/:id', protect, authorizeAdminHR('view'), calendarController.getEventDetails);

// Tạo sự kiện mới
router.post('/events', protect, authorizeAdminHR('create'), calendarController.createEvent);

// Cập nhật sự kiện
router.put('/events/:id', protect, authorizeAdminHR('update'), calendarController.updateEvent);

// Xóa sự kiện
router.delete('/events/:id', protect, authorizeAdminHR('delete'), calendarController.deleteEvent);

// Đánh dấu thông báo đã đọc
router.patch('/events/:eventId/notifications/:notificationId/read', protect, authorizeAdminHR('update'), calendarController.markNotificationAsRead);

module.exports = router; 