const express = require('express');
const router = express.Router();
const recruitmentNotificationController = require('../controllers/recruitmentNotificationController');
const { protect } = require('../middlewares/authMiddleware');

// Tạo thông báo mới
router.post('/', protect, recruitmentNotificationController.createNotification);

// Lấy danh sách thông báo
router.get('/', protect, recruitmentNotificationController.getNotifications);

// Đánh dấu thông báo đã đọc
router.put('/:recruitmentId/read', protect, recruitmentNotificationController.markAsRead);

// Xóa thông báo theo recruitmentId
router.delete('/by-recruitment/:recruitmentId', protect, recruitmentNotificationController.deleteNotificationByRecruitmentId);

module.exports = router; 