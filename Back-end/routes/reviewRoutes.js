const express = require('express');
const { createReview, getReviews } = require('../controllers/reviewController');
const { protect, authorizeAdminHR } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorizeAdminHR('create'), createReview);
router.get('/:id', protect, authorizeAdminHR('view'), getReviews);

module.exports = router;
