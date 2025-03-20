const express = require('express');
const { createJob, getJobs, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('admin', 'recruiter'), createJob);
router.get('/', protect, getJobs);
router.put('/:id', protect, authorize('admin', 'recruiter'), updateJob);
router.delete('/:id', protect, authorize('admin'), deleteJob);

module.exports = router;
