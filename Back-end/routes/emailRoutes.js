const express = require('express');
const router = express.Router();
const multer = require('multer');
const emailController = require('../controllers/emailController');
const { protect } = require('../middlewares/authMiddleware');

// Cấu hình multer để xử lý file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // Giới hạn 10MB
  }
});

// Lấy danh sách email
router.get('/', protect, emailController.getEmails);

// Lấy danh sách email đã gửi
router.get('/sent', protect, emailController.getSentEmails);

// Gửi email với file đính kèm
router.post('/send', protect, upload.array('attachments'), emailController.sendEmail);

// Xóa email
router.delete('/:id', protect, emailController.deleteEmail);

module.exports = router; 