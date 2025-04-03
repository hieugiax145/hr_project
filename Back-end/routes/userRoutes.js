const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  getAllUsers,
  forgotPassword,
  resetPassword
} = require('../controllers/userController');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/avatar', protect, upload.single('avatar'), uploadAvatar);
router.get('/all', protect, getAllUsers);

module.exports = router;
