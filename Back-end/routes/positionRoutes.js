const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition,
  getAvailablePositions
} = require('../controllers/positionController');
const { handleCVUpload } = require('../middlewares/uploadMiddleware');
const candidateController = require('../controllers/candidateController');

// Public routes
router.get('/', protect, getPositions);
router.get('/available', protect, getAvailablePositions);
router.get('/:id', protect, getPositionById);

// Protected routes
router.post('/', protect, createPosition);
router.put('/:id', protect, updatePosition);
router.delete('/:id', protect, deletePosition);

// Candidate routes
router.get('/:positionId/candidates', protect, candidateController.getCandidatesByPosition);
router.post('/:positionId/candidates', protect, handleCVUpload, candidateController.createCandidate);
router.patch('/:positionId/candidates/:candidateId', protect, handleCVUpload, candidateController.updateCandidate);
router.delete('/:positionId/candidates/:candidateId', protect, candidateController.deleteCandidate);

module.exports = router; 