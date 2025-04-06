const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { protect } = require('../middlewares/authMiddleware');
const { handleCVUpload } = require('../middlewares/uploadMiddleware');

// Lấy danh sách ứng viên theo vị trí
router.get('/positions/:positionId/candidates', protect, candidateController.getCandidatesByPosition);

// Thêm ứng viên mới
router.post('/positions/:positionId/candidates', protect, handleCVUpload, candidateController.createCandidate);

// Cập nhật trạng thái ứng viên
router.patch('/:candidateId/status', protect, candidateController.updateCandidateStatus);

// Cập nhật thông tin ứng viên
router.patch('/:id', protect, handleCVUpload, candidateController.updateCandidate);

// Xóa ứng viên
router.delete('/:candidateId', protect, candidateController.deleteCandidate);

// Lấy tất cả ứng viên
router.get('/', protect, candidateController.getAllCandidates);

// Lấy chi tiết ứng viên
router.get('/:candidateId', protect, candidateController.getCandidateById);

// Lấy danh sách ứng viên cho calendar
router.get('/calendar/candidates', protect, candidateController.getCandidatesForCalendar);

module.exports = router; 