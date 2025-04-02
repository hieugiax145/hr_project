const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  getEligibleCandidates,
  getHRList
} = require('../controllers/notificationController');

// Routes cho thông báo
router.post('/', protect, createNotification);
router.get('/', protect, getNotifications);
router.get('/:id', protect, getNotificationById);
router.put('/:id', protect, updateNotification);
router.delete('/:id', protect, deleteNotification);

// Routes bổ sung
router.get('/candidates/eligible', protect, getEligibleCandidates);
router.get('/users/hr', protect, getHRList);

module.exports = router;
