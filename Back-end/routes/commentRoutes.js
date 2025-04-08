const express = require('express');
const router = express.Router();
const { protect, authorizeAdminHR } = require('../middlewares/authMiddleware');
const commentController = require('../controllers/commentController');

// Get all comments for a candidate
router.get('/:candidateId/comments', protect, authorizeAdminHR('view'), commentController.getComments);

// Add a new comment
router.post('/:candidateId/comments', protect, authorizeAdminHR('create'), commentController.addComment);

module.exports = router; 