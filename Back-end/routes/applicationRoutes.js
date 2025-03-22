const express = require('express');
const { createApplication, getApplications, updateApplication, deleteApplication } = require('../controllers/applicationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Cho phép các role liên quan đến tuyển dụng tạo yêu cầu
router.post('/', protect, authorize('department_head', 'business_director', 'ceo', 'recruitment', 'director'), createApplication);
router.get('/', protect, authorize('department_head', 'business_director', 'ceo', 'recruitment', 'director'), getApplications);
router.put('/:id', protect, authorize('department_head', 'business_director', 'ceo', 'recruitment', 'director'), updateApplication);
router.delete('/:id', protect, authorize('ceo', 'director'), deleteApplication);

module.exports = router;
