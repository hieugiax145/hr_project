const express = require('express');
const { createOffer, getOffers, updateOffer, deleteOffer } = require('../controllers/offerController');
const { protect, authorizeAdminHR } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, authorizeAdminHR('create'), createOffer);
router.get('/', protect, authorizeAdminHR('view'), getOffers);
router.put('/:id', protect, authorizeAdminHR('update'), updateOffer);
router.delete('/:id', protect, authorizeAdminHR('delete'), deleteOffer);

module.exports = router;
