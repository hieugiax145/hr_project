const Application = require('../models/Application');
const Notification = require('../models/Notification');
const User = require('../models/User');
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
    const {
      department,
      position,
      quantity,
      mainLocation,
      otherLocations = [],
      reason,
      budget,
      jobDescription,
      requirements,
      benefits
    } = req.body;

    // Kiểm tra các trường bắt buộc
    const requiredFields = {
      department: 'Phòng ban',
      position: 'Vị trí',
      quantity: 'Số lượng',
      mainLocation: 'Nơi làm việc chính',
      reason: 'Lý do tuyển dụng',
      budget: 'Quỹ tuyển dụng',
      jobDescription: 'Mô tả công việc',
      requirements: 'Yêu cầu ứng viên',
      benefits: 'Quyền lợi'
    };

    const missingFields = [];
    for (const [field, label] of Object.entries(requiredFields)) {
      if (!req.body[field]) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`
      });
    }

    // Validate quantity
    if (quantity < 1) {
      return res.status(400).json({
        error: 'Số lượng tuyển dụng phải lớn hơn 0'
      });
    }

    // Validate reason
    const validReasons = ['Tuyển do thiếu nhân sự', 'Tuyển do mở rộng quy mô'];
    if (!validReasons.includes(reason)) {
      return res.status(400).json({
        error: 'Lý do tuyển dụng không hợp lệ'
      });
    }

    // Validate budget
    const validBudgets = ['Đạt chuẩn', 'Vượt quỹ'];
    if (!validBudgets.includes(budget)) {
      return res.status(400).json({
        error: 'Quỹ tuyển dụng không hợp lệ'
      });
    }

    // Tạo application mới
    const application = new Application({
      userId: req.user._id,
      department,
      position,
      quantity,
      mainLocation,
      otherLocations,
      reason,
      budget,
      jobDescription,
      requirements,
      benefits,
      status: 'Chờ nộp'
    });

    await application.save();

    res.status(201).json({
      message: 'Tạo yêu cầu tuyển dụng thành công',
      data: application
    });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ 
      error: 'Có lỗi xảy ra khi tạo yêu cầu tuyển dụng. Vui lòng thử lại sau.' 
    });
  }
};


// ✅ Lấy danh sách đơn tuyển dụng của người dùng hiện tại
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    const formattedApplications = applications.map(app => {
      const createdDate = new Date(app.createdAt);
      return {
        id: app._id,
        requester: app.userId.username || 'N/A',
        responsible: app.userId.username || 'N/A',
        position: app.position,
        quantity: app.quantity,
        department: app.department,
        date: `${createdDate.getHours().toString().padStart(2, '0')}:${createdDate.getMinutes().toString().padStart(2, '0')} - ${createdDate.getDate().toString().padStart(2, '0')}/${(createdDate.getMonth() + 1).toString().padStart(2, '0')}/${createdDate.getFullYear()}`,
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
    const {
      status,
      department,
      position,
      quantity,
      mainLocation,
      otherLocations,
      reason,
      budget,
      jobDescription,
      requirements,
      benefits
    } = req.body;

    const application = await Application.findById(req.params.id).populate('createdBy');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (String(application.createdBy._id) !== String(req.user.id) && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (status) {
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }
      application.approvalStatus = status;
      application.approvalDate = status === 'approved' ? new Date() : null;

      const mailOptions = {
        to: application.createdBy.email,
        from: process.env.EMAIL_USER,
        subject: 'Application Status Update',
        text: `Your application status has been updated to: ${status}`
      };
      await transporter.sendMail(mailOptions);

      await Notification.create({
        userId: application.createdBy._id,
        content: `Your application status has been updated to: ${status}`
      });
    }

    if (department) application.department = department;
    if (position) application.position = position;
    if (quantity) application.quantity = quantity;
    if (mainLocation) application.mainLocation = mainLocation;
    if (otherLocations) application.otherLocations = otherLocations;
    if (reason) application.reason = reason;
    if (budget) application.budget = budget;
    if (jobDescription) application.jobDescription = jobDescription;
    if (requirements) application.requirements = requirements;
    if (benefits) application.benefits = benefits;

    await application.save();

    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Xóa đơn tuyển dụng
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (String(application.createdBy) !== String(req.user.id) && !req.user.isAdmin) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication
};