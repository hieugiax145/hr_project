const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const {
  getPositions,
  getPositionById,
  createPosition,
  updatePosition,
  deletePosition
} = require('../controllers/positionController');
const { handleUpload } = require('../middlewares/uploadMiddleware');
const candidateController = require('../controllers/candidateController');

// Public routes
router.get('/', protect, getPositions);
router.get('/:id', protect, getPositionById);

// Protected routes
router.post('/', protect, createPosition);
router.put('/:id', protect, updatePosition);
router.delete('/:id', protect, deletePosition);

// Candidate routes
router.get('/:positionId/candidates', protect, candidateController.getCandidatesByPosition);
router.post('/:positionId/candidates', protect, handleUpload, candidateController.createCandidate);

module.exports = router; 