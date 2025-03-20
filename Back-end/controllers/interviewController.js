const Interview = require('../models/Interview');

const createInterview = async (req, res) => {
  try {
    const { applicationId, interviewer, schedule } = req.body;
    const newInterview = new Interview({
      applicationId,
      interviewer,
      schedule
    });

    await newInterview.save();
    res.status(201).json(newInterview);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().populate('applicationId');
    res.status(200).json(interviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

module.exports = { createInterview, getInterviews, updateInterview, deleteInterview };
