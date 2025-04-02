const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
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
router.get('/', getPositions);
router.get('/:id', getPositionById);

// Protected routes
router.post('/', auth, createPosition);
router.put('/:id', auth, updatePosition);
router.delete('/:id', auth, deletePosition);

// Candidate routes
router.get('/:positionId/candidates', auth, candidateController.getCandidatesByPosition);
router.post('/:positionId/candidates', auth, handleUpload, candidateController.createCandidate);

module.exports = router; 