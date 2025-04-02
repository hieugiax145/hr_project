const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const { protect } = require('../middlewares/authMiddleware');

// Lấy danh sách email
router.get('/', protect, emailController.getEmails);

// Lấy danh sách email đã gửi
router.get('/sent', protect, emailController.getSentEmails);

// Gửi email
router.post('/send', protect, emailController.sendEmail);

// Xóa email
router.delete('/:id', protect, emailController.deleteEmail);

module.exports = router; 