const Application = require('../models/Application');
const Notification = require('../models/Notification');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  

const createApplication = async (req, res) => {
  try {
    const { jobPositionId, resumeLink } = req.body;
    const newApplication = new Application({
      userId: req.user.id,
      jobPositionId,
      resumeLink
    });

    await newApplication.save();
    res.status(201).json(newApplication);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id }).populate('jobPositionId');
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateApplication = async (req, res) => {
    try {
      const updatedApplication = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('userId');
  
      if (req.body.status) {
        // Gửi email cho ứng viên khi trạng thái hồ sơ thay đổi
        const mailOptions = {
          to: updatedApplication.userId.email,
          from: process.env.EMAIL_USER,
          subject: `Application Status Update`,
          text: `Your application status has been updated to: ${req.body.status}`
        };
  
        await transporter.sendMail(mailOptions);
  
        // Tạo thông báo trong hệ thống
        await Notification.create({
          userId: updatedApplication.userId._id,
          content: `Your application status has been updated to: ${req.body.status}`
        });
      }
  
      res.status(200).json(updatedApplication);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

const deleteApplication = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createApplication, getApplications, updateApplication, deleteApplication };
