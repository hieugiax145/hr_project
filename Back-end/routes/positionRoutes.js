const express = require('express');
const router = express.Router();
const { protect, authorizeAdminHR } = require('../middlewares/authMiddleware');
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
router.get('/', protect, authorizeAdminHR('view'), getPositions);
router.get('/:id', protect, authorizeAdminHR('view'), getPositionById);
router.get('/:id/download-jd', protect, authorizeAdminHR('view'), downloadJD);

// Protected routes
router.post('/', protect, authorizeAdminHR('create'), createPosition);
router.put('/:id', protect, authorizeAdminHR('update'), updatePosition);
router.delete('/:id', protect, authorizeAdminHR('delete'), deletePosition);

// Candidate routes
router.get('/:positionId/candidates', protect, authorizeAdminHR('view'), candidateController.getCandidatesByPosition);
router.post('/:positionId/candidates', protect, authorizeAdminHR('create'), handleCVUpload, candidateController.createCandidate);

module.exports = router; 