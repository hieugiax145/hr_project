const RecruitmentNotification = require('../models/RecruitmentNotification');
const Application = require('../models/Application');

// Tạo thông báo mới
exports.createNotification = async (req, res) => {
  try {
    const { recruitmentId, position, department, requester } = req.body;
    
    const notification = new RecruitmentNotification({
      recruitmentId,
      position,
      department,
      requester
    });

    await notification.save();
    res.status(201).json({ message: 'Tạo thông báo thành công', data: notification });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Lấy danh sách thông báo
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await RecruitmentNotification.find()
      .populate('recruitmentId')
      .populate('requester', 'fullName username')
      .sort({ createdAt: -1 });
    
    res.json({ message: 'Lấy danh sách thông báo thành công', data: notifications });
  } catch (error) {
    console.error('Error getting notifications:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Đánh dấu thông báo đã đọc
exports.markAsRead = async (req, res) => {
  try {
    const { recruitmentId } = req.params;
    
    const notification = await RecruitmentNotification.findOneAndUpdate(
      { recruitmentId },
      { status: 'read' },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Không tìm thấy thông báo' });
    }

    res.json({ message: 'Đánh dấu thông báo đã đọc thành công', data: notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Xóa thông báo theo recruitmentId
exports.deleteNotificationByRecruitmentId = async (req, res) => {
  try {
    const { recruitmentId } = req.params;
    
    const notification = await RecruitmentNotification.findOneAndDelete({ recruitmentId });

    if (!notification) {
      return res.status(404).json({ message: 'Không tìm thấy thông báo' });
    }

    res.json({ message: 'Xóa thông báo thành công' });
  } catch (error) {
    console.error('Error in deleteNotificationByRecruitmentId:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// Tạo thông báo khi CEO phê duyệt
exports.createApprovalNotification = async (req, res) => {
  try {
    const { recruitmentId } = req.params;
    
    // Tìm application
    const application = await Application.findById(recruitmentId);
    if (!application) {
      return res.status(404).json({ message: 'Không tìm thấy phiếu YCTD' });
    }

    // Tạo thông báo mới
    const notification = new RecruitmentNotification({
      recruitmentId: application._id,
      position: application.position,
      department: application.department,
      requester: application.requester,
      message: 'Phiếu YCTD của bạn đã được CEO phê duyệt'
    });

    await notification.save();

    res.status(201).json({ 
      message: 'Tạo thông báo phê duyệt thành công', 
      data: notification 
    });
  } catch (error) {
    console.error('Error creating approval notification:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
}; 