const Interview = require('../models/Interview');
const asyncHandler = require('express-async-handler');

// @desc    Get all interviews
// @route   GET /api/interviews
// @access  Private
const getInterviews = asyncHandler(async (req, res) => {
  const interviews = await Interview.find()
    .populate('candidate', 'name position')
    .populate('attendees', 'username email');
  res.json(interviews);
});

// @desc    Create new interview
// @route   POST /api/interviews
// @access  Private
const createInterview = asyncHandler(async (req, res) => {
  const {
    title,
    date,
    startTime,
    endTime,
    eventType,
    location,
    description,
    candidate,
    attendees
  } = req.body;

  const interview = await Interview.create({
    title,
    date,
    startTime,
    endTime,
    type: 'interview',
    eventType,
    location,
    description,
    candidate,
    attendees,
    createdBy: req.user._id
  });

  const populatedInterview = await Interview.findById(interview._id)
    .populate('candidate', 'name position')
    .populate('attendees', 'username email')
    .populate('createdBy', 'username');

  res.status(201).json(populatedInterview);
});

const updateInterview = async (req, res) => {
  try {
    const updatedInterview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedInterview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteInterview = async (req, res) => {
  try {
    await Interview.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Interview deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getInterviews,
  createInterview,
  updateInterview,
  deleteInterview
};
