const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
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
router.post('/', auth, createNotification);
router.get('/', auth, getNotifications);
router.get('/:id', auth, getNotificationById);
router.put('/:id', auth, updateNotification);
router.delete('/:id', auth, deleteNotification);

// Routes bổ sung
router.get('/candidates/eligible', auth, getEligibleCandidates);
router.get('/users/hr', auth, getHRList);

module.exports = router;
