const Notification = require('../models/Notification');
const Candidate = require('../models/Candidate');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const { validateNotification } = require('../validation/notificationValidation');

exports.createNotification = async (req, res) => {
  try {
    const { error } = validateNotification(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Kiểm tra candidate có trạng thái hợp lệ
    const candidate = await Candidate.findById(req.body.candidateId);
    if (!candidate || !['Tuyển', 'Offer'].includes(candidate.status)) {
      return res.status(400).json({ message: 'Ứng viên không hợp lệ hoặc không có trạng thái phù hợp' });
    }

    // Upload ảnh cá nhân
    let personalPhotoUrl = '';
    if (req.files && req.files.personalPhoto) {
      const result = await cloudinary.uploader.upload(req.files.personalPhoto.tempFilePath, {
        folder: 'notifications/personal'
      });
      personalPhotoUrl = result.secure_url;
    }

    // Upload ảnh CCCD
    let idCardPhotos = [];
    if (req.files && req.files.idCardPhotos) {
      const files = Array.isArray(req.files.idCardPhotos) 
        ? req.files.idCardPhotos 
        : [req.files.idCardPhotos];

      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          folder: 'notifications/idcard'
        });
        idCardPhotos.push(result.secure_url);
      }
    }

    // Tạo notification mới
    const notification = new Notification({
      ...req.body,
      creator: req.user._id, // Lấy từ JWT token
      personalPhoto: personalPhotoUrl,
      'idCard.photos': idCardPhotos
    });

    await notification.save();

    res.status(201).json({
      message: 'Tạo thông báo thành công',
      data: notification
    });
  } catch (error) {
    console.error('Error in createNotification:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('candidateId', 'name status')
      .populate('creator', 'name')
      .populate('hrInCharge', 'name')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Lấy danh sách thông báo thành công',
      data: notifications
    });
  } catch (error) {
    console.error('Error in getNotifications:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id)
      .populate('candidateId', 'name status')
      .populate('creator', 'name')
      .populate('hrInCharge', 'name');

    if (!notification) {
      return res.status(404).json({ message: 'Không tìm thấy thông báo' });
    }

    res.json({
      message: 'Lấy thông tin thông báo thành công',
      data: notification
    });
  } catch (error) {
    console.error('Error in getNotificationById:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.updateNotification = async (req, res) => {
  try {
    const { error } = validateNotification(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Xử lý upload ảnh mới nếu có
    if (req.files) {
      if (req.files.personalPhoto) {
        const result = await cloudinary.uploader.upload(req.files.personalPhoto.tempFilePath, {
          folder: 'notifications/personal'
        });
        req.body.personalPhoto = result.secure_url;
      }

      if (req.files.idCardPhotos) {
        const files = Array.isArray(req.files.idCardPhotos) 
          ? req.files.idCardPhotos 
          : [req.files.idCardPhotos];

        const idCardPhotos = [];
        for (const file of files) {
          const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'notifications/idcard'
          });
          idCardPhotos.push(result.secure_url);
        }
        req.body['idCard.photos'] = idCardPhotos;
      }
    }

    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Không tìm thấy thông báo' });
    }

    res.json({
      message: 'Cập nhật thông báo thành công',
      data: notification
    });
  } catch (error) {
    console.error('Error in updateNotification:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: 'Không tìm thấy thông báo' });
    }

    res.json({
      message: 'Xóa thông báo thành công'
    });
  } catch (error) {
    console.error('Error in deleteNotification:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// API để lấy danh sách ứng viên có trạng thái Tuyển hoặc Offer
exports.getEligibleCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({
      status: { $in: ['Tuyển', 'Offer'] }
    }).select('name position department branch');

    res.json({
      message: 'Lấy danh sách ứng viên thành công',
      data: candidates
    });
  } catch (error) {
    console.error('Error in getEligibleCandidates:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

// API để lấy danh sách HR
exports.getHRList = async (req, res) => {
  try {
    const hrUsers = await User.find().select('name');

    res.json({
      message: 'Lấy danh sách HR thành công',
      data: hrUsers
    });
  } catch (error) {
    console.error('Error in getHRList:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
