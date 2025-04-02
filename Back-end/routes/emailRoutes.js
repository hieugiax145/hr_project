const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const { protect } = require('../middlewares/authMiddleware');

// Lấy danh sách email
router.get('/', protect, emailController.getEmails);

module.exports = router; 