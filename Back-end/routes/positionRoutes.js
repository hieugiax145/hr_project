const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/authMiddleware');
const {
  getPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
  downloadJD
} = require('../controllers/positionController');
const { handleCVUpload } = require('../middlewares/uploadMiddleware');
const candidateController = require('../controllers/candidateController');

// Public routes
router.get('/', protect, getPositions);
router.get('/:id', protect, getPositionById);
router.get('/:id/download-jd', protect, downloadJD);

// Protected routes
router.post('/', protect, authorize('admin', 'recruitment', 'hr'), createPosition);
router.put('/:id', protect, updatePosition);
router.delete('/:id', protect, deletePosition);

// Candidate routes
router.get('/:positionId/candidates', protect, candidateController.getCandidatesByPosition);
router.post('/:positionId/candidates', protect, handleCVUpload, candidateController.createCandidate);

module.exports = router; 