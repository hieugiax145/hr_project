const express = require('express');
const router = express.Router();
const {
  createPosition,
  getPositions,
  getPosition,
  updatePosition,
  deletePosition
} = require('../controllers/positionController');
const { protect } = require('../middlewares/authMiddleware');
const { handleUpload } = require('../middlewares/uploadMiddleware');
const candidateController = require('../controllers/candidateController');

// Routes
router.post('/', protect, createPosition);
router.get('/', getPositions);
router.get('/:id', protect, getPosition);
router.put('/:id', protect, updatePosition);
router.delete('/:id', protect, deletePosition);

// Candidate routes
router.get('/:positionId/candidates', protect, candidateController.getCandidatesByPosition);
router.post('/:positionId/candidates', protect, handleUpload, candidateController.createCandidate);

module.exports = router; 