const Offer = require('../models/Offer');

const createOffer = async (req, res) => {
  try {
    const { applicationId, position, salary } = req.body;
    const newOffer = new Offer({
      applicationId,
      position,
      salary
    });

    await newOffer.save();
    res.status(201).json(newOffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getOffers = async (req, res) => {
  try {
    const offers = await Offer.find().populate('applicationId');
    res.status(200).json(offers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateOffer = async (req, res) => {
  try {
    const updatedOffer = await Offer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedOffer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteOffer = async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Offer deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createOffer, getOffers, updateOffer, deleteOffer };
