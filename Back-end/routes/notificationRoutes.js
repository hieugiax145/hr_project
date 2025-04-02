const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const notificationController = require('../controllers/notificationController');

// Lấy danh sách ứng viên và HR
router.get('/eligible-candidates', protect, notificationController.getEligibleCandidates);
router.get('/hr-list', protect, notificationController.getHRList);

// CRUD operations
router.get('/', protect, notificationController.getNotifications);
router.get('/:id', protect, notificationController.getNotificationById);
router.post('/', protect, notificationController.createNotification);
router.put('/:id', protect, notificationController.updateNotification);
router.delete('/:id', protect, notificationController.deleteNotification);

module.exports = router;
