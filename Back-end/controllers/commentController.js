const Comment = require('../models/Comment');

// Get all comments for a candidate
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ candidateId: req.params.candidateId })
      .populate('user', 'fullName')
      .sort({ createdAt: -1 });

    res.status(200).json({ comments });
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy nhận xét' });
  }
};

// Add a new comment
const addComment = async (req, res) => {
  try {
    const comment = new Comment({
      candidateId: req.params.candidateId,
      user: req.user._id,
      content: req.body.content
    });

    await comment.save();
    
    // Populate user information before sending response
    await comment.populate('user', 'fullName');

    res.status(201).json({ comment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi thêm nhận xét' });
  }
};

module.exports = {
  getComments,
  addComment
}; 