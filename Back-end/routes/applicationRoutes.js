const express = require('express');
const { createApplication, getApplications, updateApplication, deleteApplication, getApplicationById } = require('../controllers/applicationController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// Cho phép các role liên quan đến tuyển dụng tạo yêu cầu
router.post('/', protect, authorize('department_head', 'business_director', 'ceo', 'recruitment', 'director'), createApplication);

// Lấy danh sách yêu cầu tuyển dụng
router.get('/', protect, getApplications);

// Lấy chi tiết một yêu cầu tuyển dụng
router.get('/:id', protect, getApplicationById);

// Cập nhật yêu cầu tuyển dụng
router.put('/:id', protect, updateApplication);

// Xóa yêu cầu tuyển dụng
router.delete('/:id', protect, deleteApplication);

module.exports = router;
