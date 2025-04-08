const express = require('express');
const router = express.Router();
const { protect, authorizeAdminHR } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  getAllUsers,
  forgotPassword,
  resetPassword,
  deleteUser
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

// Admin và HR routes
router.get('/all', protect, authorizeAdminHR('view'), getAllUsers);
router.delete('/:id', protect, authorizeAdminHR('manage_accounts'), deleteUser);

module.exports = router;
