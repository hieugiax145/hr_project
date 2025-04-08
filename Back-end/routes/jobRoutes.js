const express = require('express');
const { createJob, getJobs, updateJob, deleteJob } = require('../controllers/jobController');
const { protect, authorizeAdminHR } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorizeAdminHR('create'), createJob);
router.get('/', protect, authorizeAdminHR('view'), getJobs);
router.put('/:id', protect, authorizeAdminHR('update'), updateJob);
router.delete('/:id', protect, authorizeAdminHR('delete'), deleteJob);

module.exports = router;
