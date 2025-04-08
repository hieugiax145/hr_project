const express = require('express');
const router = express.Router();
const { protect, authorizeAdminHR } = require('../middlewares/authMiddleware');
const {
  getInterviews,
  getInterviewById,
  createInterview,
  updateInterview,
  deleteInterview,
  getUpcomingInterviewsByCandidate
} = require('../controllers/interviewController');

router.route('/')
  .get(protect, authorizeAdminHR('view'), getInterviews)
  .post(protect, authorizeAdminHR('create'), createInterview);

router.route('/:id')
  .get(protect, authorizeAdminHR('view'), getInterviewById)
  .put(protect, authorizeAdminHR('update'), updateInterview)
  .delete(protect, authorizeAdminHR('delete'), deleteInterview);

// Get upcoming interviews by candidate ID
router.get('/candidate/:candidateId', protect, authorizeAdminHR('view'), getUpcomingInterviewsByCandidate);

module.exports = router;
