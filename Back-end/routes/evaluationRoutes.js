const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const { protect, authorizeAdminHR } = require('../middlewares/authMiddleware');

// Lấy đánh giá theo notification ID
router.get('/:notificationId', protect, authorizeAdminHR('view'), evaluationController.getEvaluationByNotificationId);

// Tạo hoặc cập nhật đánh giá
router.post('/:notificationId', protect, authorizeAdminHR('create'), evaluationController.createOrUpdateEvaluation);

module.exports = router; 