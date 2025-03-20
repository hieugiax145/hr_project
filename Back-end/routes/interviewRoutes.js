const express = require('express');
const { createInterview, getInterviews, updateInterview, deleteInterview } = require('../controllers/interviewController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('admin', 'recruiter'), createInterview);
router.get('/', protect, authorize('admin', 'recruiter'), getInterviews);
router.put('/:id', protect, authorize('admin', 'recruiter'), updateInterview);
router.delete('/:id', protect, authorize('admin'), deleteInterview);

module.exports = router;
