const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { protect } = require('../middlewares/authMiddleware');
const { handleUpload } = require('../middlewares/uploadMiddleware');

// Lấy danh sách ứng viên theo vị trí
router.get('/positions/:positionId/candidates', protect, candidateController.getCandidatesByPosition);

// Thêm ứng viên mới
router.post('/positions/:positionId/candidates', protect, handleUpload, candidateController.createCandidate);

// Cập nhật trạng thái ứng viên
router.patch('/candidates/:candidateId/status', protect, candidateController.updateCandidateStatus);

// Cập nhật thông tin ứng viên
router.patch('/candidates/:candidateId', protect, candidateController.updateCandidate);

// Xóa ứng viên
router.delete('/candidates/:candidateId', protect, candidateController.deleteCandidate);

module.exports = router; 