const express = require('express');
const { createApplication, getApplications, updateApplication, deleteApplication } = require('../controllers/applicationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('applicant'), createApplication);
router.get('/', protect, authorize('admin', 'recruiter'), getApplications);
router.put('/:id', protect, authorize('admin', 'recruiter'), updateApplication);
router.delete('/:id', protect, authorize('admin', 'recruiter'), deleteApplication);

module.exports = router;
