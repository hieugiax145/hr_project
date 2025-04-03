const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getInterviews,
  getInterviewById,
  createInterview,
  updateInterview,
  deleteInterview,
  getUpcomingInterviewsByCandidate
} = require('../controllers/interviewController');

router.route('/')
  .get(protect, getInterviews)
  .post(protect, createInterview);

router.route('/:id')
  .get(protect, getInterviewById)
  .put(protect, updateInterview)
  .delete(protect, deleteInterview);

// Get upcoming interviews by candidate ID
router.get('/candidate/:candidateId', protect, getUpcomingInterviewsByCandidate);

module.exports = router;
