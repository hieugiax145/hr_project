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
      otherLocations,
      reason,
      budget,
      jobDescription,
      requirements,
      benefits
    } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!department || !position || !quantity || !mainLocation || !reason || !budget) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const application = new Application({
      userId: req.user.id,
      department,
      jobPositionId: position,
      quantity,
      workLocation: [mainLocation, ...otherLocations],
      reasonForHiring: reason,
      recruitmentBudget: budget,
      jobDescription,
      requirements,
      benefits
    });

    await application.save();
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


// ✅ Lấy danh sách đơn tuyển dụng của người dùng hiện tại
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ createdBy: req.user.id })
      .populate('createdBy', 'name email');

    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
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