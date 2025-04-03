const Evaluation = require('../models/evaluation');
const mongoose = require('mongoose');

// Lấy đánh giá theo ID thông báo
exports.getEvaluationByNotificationId = async (req, res) => {
  try {
    const { notificationId } = req.params;
    console.log('Getting evaluation for notificationId:', notificationId);
    
    // Kiểm tra định dạng ObjectId
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      console.log('Invalid ObjectId format');
      return res.status(400).json({ message: 'ID thông báo không hợp lệ' });
    }

    const evaluation = await Evaluation.findOne({ 
      notificationId: notificationId
    });
    
    console.log('Found evaluation:', evaluation);
    
    if (!evaluation) {
      return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
    }
    res.json(evaluation);
  } catch (error) {
    console.error('Error in getEvaluationByNotificationId:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy đánh giá' });
  }
};

// Tạo hoặc cập nhật đánh giá
exports.createOrUpdateEvaluation = async (req, res) => {
  try {
    const { notificationId } = req.params;
    console.log('Creating/Updating evaluation for notificationId:', notificationId);
    console.log('Evaluation data:', req.body);
    
    // Kiểm tra định dạng ObjectId
    if (!mongoose.Types.ObjectId.isValid(notificationId)) {
      console.log('Invalid ObjectId format');
      return res.status(400).json({ message: 'ID thông báo không hợp lệ' });
    }

    const evaluation = await Evaluation.findOneAndUpdate(
      { notificationId: notificationId },
      {
        ...req.body,
        notificationId: notificationId
      },
      { 
        new: true, 
        upsert: true,
        runValidators: true
      }
    );

    console.log('Saved evaluation:', evaluation);
    res.json(evaluation);
  } catch (error) {
    console.error('Error in createOrUpdateEvaluation:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Dữ liệu đánh giá không hợp lệ', 
        errors: error.errors 
      });
    }
    res.status(500).json({ message: 'Lỗi server khi lưu đánh giá' });
  }
}; 