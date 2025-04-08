const express = require('express');
const router = express.Router();
const recruitmentNotificationController = require('../controllers/recruitmentNotificationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Tạo thông báo mới
router.post('/', protect, authorize('ceo'), recruitmentNotificationController.createNotification);

// Lấy danh sách thông báo
router.get('/', protect, recruitmentNotificationController.getNotifications);

// Đánh dấu thông báo đã đọc
router.put('/:recruitmentId/read', protect, recruitmentNotificationController.markAsRead);

// Xóa thông báo theo recruitmentId
router.delete('/by-recruitment/:recruitmentId', protect, authorize('ceo'), recruitmentNotificationController.deleteNotificationByRecruitmentId);

// Tạo thông báo khi CEO phê duyệt
router.post('/approval/:recruitmentId', protect, authorize('ceo'), recruitmentNotificationController.createApprovalNotification);

module.exports = router; 