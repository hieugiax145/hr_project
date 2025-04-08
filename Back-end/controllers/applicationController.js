const Application = require('../models/Application');
const Notification = require('../models/Notification');
const User = require('../models/User');
const RecruitmentNotification = require('../models/RecruitmentNotification');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// ✅ Tạo đơn tuyển dụng mới
const createApplication = async (req, res) => {
  try {
    const application = new Application({
      ...req.body,
      userId: req.user._id,
      requester: req.user._id,  // Người tạo đơn chính là requester
      status: req.body.status
    });
    const savedApplication = await application.save();
    res.status(201).json(savedApplication);
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi khi tạo yêu cầu tuyển dụng',
      error: error.message 
    });
  }
};

// ✅ Lấy danh sách đơn tuyển dụng của người dùng hiện tại
const getApplications = async (req, res) => {
  try {
    let query = {};
    
    // Nếu là trưởng phòng ban (không phải HR), chỉ lấy yêu cầu của phòng mình
    if (req.user.role === 'department_head' && req.user.department !== 'hr') {
      query.department = req.user.department;
    }

    const applications = await Application.find(query)
      .populate('userId', 'username fullName')
      .sort({ createdAt: -1 });

    const formattedApplications = applications.map(app => {
      const createdDate = new Date(app.createdAt);
      return {
        _id: app._id,
        id: app._id,
        requester: {
          _id: app.userId?._id,
          username: app.userId?.username,
          fullName: app.userId?.fullName
        },
        responsible: app.responsible ? {
          _id: app.responsible?._id,
          username: app.responsible?.username,
          fullName: app.responsible?.fullName
        } : null,
        position: app.position,
        quantity: app.quantity,
        department: app.department,
        date: createdDate,  // Gửi nguyên date object về frontend
        createdAt: app.createdAt,
        status: app.status || 'Chờ nộp',
        mainLocation: app.mainLocation,
        otherLocations: app.otherLocations,
        reason: app.reason,
        budget: app.budget,
        jobDescription: app.jobDescription,
        requirements: app.requirements,
        benefits: app.benefits
      };
    });

    res.status(200).json(formattedApplications);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ 
      error: 'Có lỗi xảy ra khi tải danh sách yêu cầu tuyển dụng' 
    });
  }
};

// ✅ Cập nhật đơn tuyển dụng
const updateApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select('-__v');
    
    if (!application) {
      return res.status(404).json({ message: 'Không tìm thấy yêu cầu tuyển dụng' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi khi cập nhật yêu cầu tuyển dụng',
      error: error.message 
    });
  }
};

// ✅ Xóa đơn tuyển dụng
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    await Application.findByIdAndDelete(id);
    res.status(200).json({ message: 'Xóa yêu cầu thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa yêu cầu' });
  }
};

// ✅ Lấy chi tiết một phiếu tuyển dụng
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('requester', 'fullName username')
      .populate('userId', 'fullName username')
      .select('-__v');
    
    if (!application) {
      return res.status(404).json({ message: 'Không tìm thấy yêu cầu tuyển dụng' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ 
      message: 'Lỗi khi lấy chi tiết yêu cầu tuyển dụng',
      error: error.message 
    });
  }
};

// Cập nhật status của application
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select('-__v'); // Không trả về trường __v
    
    if (!application) {
      return res.status(404).json({ message: 'Không tìm thấy yêu cầu tuyển dụng' });
    }

    // Nếu CEO phê duyệt, tạo thông báo cho người lập phiếu
    if (req.user.role === 'ceo' && status === 'Đã duyệt') {
      const notification = new RecruitmentNotification({
        recruitmentId: application._id,
        position: application.position,
        department: application.department,
        requester: application.requester,
        message: 'Phiếu YCTD của bạn đã được CEO phê duyệt'
      });

      await notification.save();
    }
    
    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getApplications,
  getApplicationById,
  createApplication,
  updateApplication,
  deleteApplication,
  updateApplicationStatus
};