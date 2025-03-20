const Review = require('../models/Review');
const User = require('../models/User');

// Tạo đánh giá
const createReview = async (req, res) => {
  try {
    const { applicantId, comment, rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating value' });
    }

    const review = new Review({
      interviewerId: req.user.id,
      applicantId,
      comment,
      rating
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xem các đánh giá
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ applicantId: req.params.id }).populate('interviewerId', 'username');
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createReview, getReviews };
