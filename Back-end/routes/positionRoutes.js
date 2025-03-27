const express = require('express');
const router = express.Router();
const {
  createPosition,
  getPositions,
  getPosition,
  updatePosition,
  deletePosition
} = require('../controllers/positionController');

// Routes
router.post('/', createPosition);
router.get('/', getPositions);
router.get('/:id', getPosition);
router.put('/:id', updatePosition);
router.delete('/:id', deletePosition);

module.exports = router; 