const express = require('express');
const { createOffer, getOffers, updateOffer, deleteOffer } = require('../controllers/offerController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('admin', 'recruiter'), createOffer);
router.get('/', protect, authorize('admin', 'recruiter'), getOffers);
router.put('/:id', protect, authorize('admin', 'recruiter'), updateOffer);
router.delete('/:id', protect, authorize('admin'), deleteOffer);

module.exports = router;
