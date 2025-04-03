const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const commentController = require('../controllers/commentController');

// Get all comments for a candidate
router.get('/:candidateId/comments', protect, commentController.getComments);

// Add a new comment
router.post('/:candidateId/comments', protect, commentController.addComment);

module.exports = router; 