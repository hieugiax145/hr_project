const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { handleUpload } = require('../middlewares/uploadMiddleware');
const {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
  getEligibleCandidates,
  getHRList
} = require('../controllers/notificationController');

// Public routes
router.get('/eligible-candidates', protect, getEligibleCandidates);
router.get('/hr-list', protect, getHRList);

// Protected routes
router.post('/', protect, handleUpload, createNotification);
router.get('/', protect, getNotifications);
router.get('/:id', protect, getNotificationById);
router.put('/:id', protect, handleUpload, updateNotification);
router.delete('/:id', protect, deleteNotification);

module.exports = router;
