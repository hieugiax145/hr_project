const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getInterviews,
  createInterview,
  updateInterview,
  deleteInterview
} = require('../controllers/interviewController');

router.route('/')
  .get(protect, getInterviews)
  .post(protect, createInterview);

router.route('/:id')
  .put(protect, updateInterview)
  .delete(protect, deleteInterview);

module.exports = router;
