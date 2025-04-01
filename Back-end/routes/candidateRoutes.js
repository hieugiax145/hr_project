const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const { protect } = require('../middlewares/authMiddleware');
const { handleUpload } = require('../middlewares/uploadMiddleware');

// Lấy tất cả ứng viên
router.get('/', protect, candidateController.getAllCandidates);

// Lấy danh sách ứng viên cho calendar
router.get('/calendar/candidates', protect, candidateController.getCandidatesForCalendar);

// Lấy danh sách ứng viên theo vị trí
router.get('/position/:positionId', protect, candidateController.getCandidatesByPosition);

// Thêm ứng viên mới
router.post('/position/:positionId', protect, handleUpload, candidateController.createCandidate);

// Cập nhật trạng thái ứng viên
router.patch('/:candidateId/status', protect, candidateController.updateCandidateStatus);

// Cập nhật thông tin ứng viên
router.put('/:candidateId', protect, candidateController.updateCandidate);

// Lấy chi tiết ứng viên
router.get('/:candidateId', protect, candidateController.getCandidateById);

// Xóa ứng viên
router.delete('/:candidateId', protect, candidateController.deleteCandidate);

module.exports = router; 