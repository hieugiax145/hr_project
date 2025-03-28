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

// Routes
router.post('/', protect, createPosition);
router.get('/', getPositions);
router.get('/:id', protect, getPosition);
router.put('/:id', protect, updatePosition);
router.delete('/:id', protect, deletePosition);

module.exports = router; 