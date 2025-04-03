const express = require('express');
const router = express.Router();
const evaluationController = require('../controllers/evaluationController');
const { protect } = require('../middlewares/authMiddleware');

// Lấy đánh giá theo notification ID
router.get('/:notificationId', protect, evaluationController.getEvaluationByNotificationId);

// Tạo hoặc cập nhật đánh giá
router.post('/:notificationId', protect, evaluationController.createOrUpdateEvaluation);

module.exports = router; 