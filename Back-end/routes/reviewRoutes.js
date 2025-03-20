const express = require('express');
const { createReview, getReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('recruiter', 'admin'), createReview);
router.get('/:id', protect, getReviews);

module.exports = router;
