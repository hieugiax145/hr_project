const express = require('express');
const router = express.Router();
const { protect, authorizeAdminHR } = require('../middlewares/authMiddleware');
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
router.get('/eligible-candidates', protect, authorizeAdminHR('view'), getEligibleCandidates);
router.get('/hr-list', protect, authorizeAdminHR('view'), getHRList);

// Protected routes
router.post('/', protect, authorizeAdminHR('create'), handleUpload, createNotification);
router.get('/', protect, authorizeAdminHR('view'), getNotifications);
router.get('/:id', protect, authorizeAdminHR('view'), getNotificationById);
router.put('/:id', protect, authorizeAdminHR('update'), handleUpload, updateNotification);
router.delete('/:id', protect, authorizeAdminHR('delete'), deleteNotification);

module.exports = router;
