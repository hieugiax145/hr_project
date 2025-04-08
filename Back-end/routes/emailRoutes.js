const express = require('express');
const router = express.Router();
const multer = require('multer');
const emailController = require('../controllers/emailController');
const { protect, authorizeAdminHR } = require('../middlewares/authMiddleware');

// Cấu hình multer để xử lý file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // Giới hạn 10MB
  }
});

// Lấy danh sách email
router.get('/', protect, authorizeAdminHR('view'), emailController.getEmails);

// Lấy danh sách email đã gửi
router.get('/sent', protect, authorizeAdminHR('view'), emailController.getSentEmails);

// Gửi email với file đính kèm
router.post('/send', protect, authorizeAdminHR('create'), upload.array('attachments'), emailController.sendEmail);

// Xóa email
router.delete('/:id', protect, authorizeAdminHR('delete'), emailController.deleteEmail);

module.exports = router; 