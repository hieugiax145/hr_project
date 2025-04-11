const Notification = require('../models/Notification');
const Candidate = require('../models/Candidate');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const { validateNotification } = require('../validation/notificationValidation');

exports.createNotification = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received files:', req.files);

    // Parse JSON data from FormData
    let notificationData;
    try {
      if (!req.body.data) {
        console.error('No data field in request body');
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
      }
      notificationData = JSON.parse(req.body.data);
      console.log('Parsed notification data:', notificationData);
    } catch (error) {
      console.error('Error parsing notification data:', error);
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }

    // Validate required fields
    if (!notificationData.candidateId) {
      return res.status(400).json({ message: 'Vui lòng chọn ứng viên' });
    }

    // Check if candidate exists and is eligible
    const candidate = await Candidate.findById(notificationData.candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Không tìm thấy ứng viên' });
    }

    if (!['offer', 'hired'].includes(candidate.stage)) {
      return res.status(400).json({ message: 'Ứng viên không đủ điều kiện' });
    }

    // Handle file uploads
    let personalPhotoUrl = null;
    let idCardPhotoUrls = [];

    if (req.files) {
      // Xử lý ảnh cá nhân
      if (req.files.personalPhoto) {
        const result = await cloudinary.uploader.upload(req.files.personalPhoto[0].path, {
          folder: 'notifications/personal'
        });
        personalPhotoUrl = result.secure_url;
      }

      // Xử lý ảnh CCCD
      if (req.files.idCardPhotos) {
        const files = Array.isArray(req.files.idCardPhotos) 
          ? req.files.idCardPhotos 
          : [req.files.idCardPhotos];

        for (const file of files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'notifications/idcard'
          });
          idCardPhotoUrls.push(result.secure_url);
        }
      }
    }

    // Log để kiểm tra dữ liệu
    console.log('Personal photo URL:', personalPhotoUrl);
    console.log('ID card photo URLs:', idCardPhotoUrls);

    // Tạo thông báo mới với đầy đủ thông tin
    const notification = new Notification({
      candidateId: notificationData.candidateId,
      position: notificationData.position,
      department: notificationData.department,
      branch: notificationData.branch,
      creator: req.user._id,
      hrInCharge: notificationData.hrInCharge,
      personalPhoto: personalPhotoUrl,
      gender: notificationData.gender,
      birthDate: notificationData.birthDate,
      idCard: {
        number: notificationData.idCard?.number || '',
        issueDate: notificationData.idCard?.issueDate || null,
        issuePlace: notificationData.idCard?.issuePlace || '',
        photos: idCardPhotoUrls
      },
      startDate: notificationData.startDate,
      insuranceNumber: notificationData.insuranceNumber,
      taxCode: notificationData.taxCode,
      bankAccount: {
        number: notificationData.bankAccount?.number || '',
        bank: notificationData.bankAccount?.bank || ''
      },
      phone: notificationData.phone,
      email: notificationData.email,
      permanentAddress: notificationData.permanentAddress,
      emergencyContact: {
        name: notificationData.emergencyContact?.name || '',
        relationship: notificationData.emergencyContact?.relationship || '',
        phone: notificationData.emergencyContact?.phone || '',
        email: notificationData.emergencyContact?.email || '',
        address: notificationData.emergencyContact?.address || ''
      },
      education: {
        level: notificationData.education?.level || 'other',
        schoolName: notificationData.education?.schoolName || '',
        major: notificationData.education?.major || '',
        graduationYear: notificationData.education?.graduationYear || ''
      },
      trainingCourses: notificationData.trainingCourses || [],
      expectedSalary: notificationData.expectedSalary,
      contractType: notificationData.contractType,
      documents: notificationData.documents || [],
      preparationTasks: notificationData.preparationTasks || []
    });

    // Log để kiểm tra dữ liệu trước khi lưu
    console.log('Notification data before save:', notification);

    try {
      await notification.save();
      
      // Update candidate status - FIXED: Only update the stage field to avoid validation errors
      await Candidate.findByIdAndUpdate(
        candidate._id,
        { stage: 'hired' },
        { new: true }
      );

      // Populate thông tin creator và hrInCharge trước khi trả về
      const populatedNotification = await Notification.findById(notification._id)
        .populate('creator', 'fullName')
        .populate('hrInCharge', 'fullName')
        .populate('candidateId', 'name');

      res.status(201).json({
        message: 'Tạo thông báo thành công',
        data: populatedNotification
      });
    } catch (error) {
      console.error('Error saving notification:', error);
      if (error.name === 'ValidationError') {
        return res.status(400).json({ 
          message: 'Dữ liệu không hợp lệ',
          errors: Object.values(error.errors).map(err => err.message)
        });
      }
      res.status(500).json({ message: 'Lỗi server' });
    }
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('candidateId', 'name status')
      .populate('creator', 'fullName')
      .populate('hrInCharge', 'fullName')
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
      .populate('creator', 'fullName')
      .populate('hrInCharge', 'fullName');

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
    // Lấy danh sách ID của các ứng viên đã có thông báo
    const existingNotifications = await Notification.find().select('candidateId');
    const existingCandidateIds = existingNotifications.map(notification => notification.candidateId.toString());
    
    // Lấy danh sách ứng viên có trạng thái Tuyển hoặc Offer và chưa có thông báo
    const candidates = await Candidate.find({
      stage: { $in: ['offer', 'hired'] },
      _id: { $nin: existingCandidateIds } // Loại trừ các ứng viên đã có thông báo
    })
    .populate('positionId', 'title department branch level')
    .select('name positionId email phone address education experience skills hrInCharge');

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
    const users = await User.find()
      .select('_id fullName username email role department')
      .sort({ fullName: 1 });

    console.log('All Users:', users);

    if (!users || users.length === 0) {
      return res.json([]);
    }

    res.json(users);
  } catch (error) {
    console.error('Error in getHRList:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.updateNotification = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received files:', req.files);

    // Parse JSON data from FormData
    let notificationData;
    try {
      if (!req.body.data) {
        console.error('No data field in request body');
        return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
      }
      notificationData = JSON.parse(req.body.data);
      console.log('Parsed notification data:', notificationData);
    } catch (error) {
      console.error('Error parsing notification data:', error);
      return res.status(400).json({ message: 'Dữ liệu không hợp lệ' });
    }

    // Find existing notification
    const existingNotification = await Notification.findById(req.params.id);
    if (!existingNotification) {
      console.error('Notification not found with ID:', req.params.id);
      return res.status(404).json({ message: 'Không tìm thấy thông báo' });
    }

    console.log('Existing notification:', existingNotification);

    // Handle file uploads
    let personalPhotoUrl = existingNotification.personalPhoto;
    let idCardPhotoUrls = existingNotification.idCard?.photos || [];

    if (req.files) {
      // Handle personal photo
      if (req.files.personalPhoto) {
        console.log('Processing new personal photo');
        const result = await cloudinary.uploader.upload(req.files.personalPhoto[0].path, {
          folder: 'notifications/personal'
        });
        personalPhotoUrl = result.secure_url;
        console.log('New personal photo URL:', personalPhotoUrl);
      } else {
        console.log('No new personal photo, using existing:', personalPhotoUrl);
      }

      // Handle ID card photos
      if (req.files.idCardPhotos) {
        console.log('Processing new ID card photos');
        const files = Array.isArray(req.files.idCardPhotos) 
          ? req.files.idCardPhotos 
          : [req.files.idCardPhotos];

        idCardPhotoUrls = [];
        for (const file of files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'notifications/idcard'
          });
          idCardPhotoUrls.push(result.secure_url);
        }
        console.log('New ID card photo URLs:', idCardPhotoUrls);
      } else {
        console.log('No new ID card photos, using existing:', idCardPhotoUrls);
      }
    } else {
      console.log('No files received in request');
    }

    // Update notification data
    const updatedNotification = {
      candidateId: notificationData.candidateId,
      position: notificationData.position,
      department: notificationData.department,
      branch: notificationData.branch,
      hrInCharge: notificationData.hrInCharge,
      personalPhoto: personalPhotoUrl,
      gender: notificationData.gender,
      birthDate: notificationData.birthDate,
      idCard: {
        number: notificationData.idCard?.number || '',
        issueDate: notificationData.idCard?.issueDate || null,
        issuePlace: notificationData.idCard?.issuePlace || '',
        photos: idCardPhotoUrls
      },
      startDate: notificationData.startDate,
      insuranceNumber: notificationData.insuranceNumber,
      taxCode: notificationData.taxCode,
      bankAccount: {
        number: notificationData.bankAccount?.number || '',
        bank: notificationData.bankAccount?.bank || ''
      },
      phone: notificationData.phone,
      email: notificationData.email,
      permanentAddress: notificationData.permanentAddress,
      emergencyContact: {
        name: notificationData.emergencyContact?.name || '',
        relationship: notificationData.emergencyContact?.relationship || '',
        phone: notificationData.emergencyContact?.phone || '',
        email: notificationData.emergencyContact?.email || '',
        address: notificationData.emergencyContact?.address || ''
      },
      education: {
        level: notificationData.education?.level || 'other',
        schoolName: notificationData.education?.schoolName || '',
        major: notificationData.education?.major || '',
        graduationYear: notificationData.education?.graduationYear || ''
      },
      trainingCourses: notificationData.trainingCourses || [],
      expectedSalary: notificationData.expectedSalary,
      contractType: notificationData.contractType,
      documents: notificationData.documents || [],
      preparationTasks: notificationData.preparationTasks || []
    };

    console.log('Updated notification data:', updatedNotification);

    // Validate the updated data
    const { error } = validateNotification(updatedNotification);
    if (error) {
      console.error('Validation error:', error);
      return res.status(400).json({
        message: 'Dữ liệu không hợp lệ',
        errors: error.details.map(err => err.message)
      });
    }

    // Update the notification
    console.log('Updating notification with ID:', req.params.id);
    try {
      const notification = await Notification.findByIdAndUpdate(
        req.params.id,
        updatedNotification,
        { new: true }
      )
      .populate('candidateId', 'name')
      .populate('creator', 'fullName')
      .populate('hrInCharge', 'fullName');

      console.log('Updated notification:', notification);

      res.json({
        message: 'Cập nhật thông báo thành công',
        data: notification
      });
    } catch (updateError) {
      console.error('Error during notification update:', updateError);
      if (updateError.name === 'ValidationError') {
        return res.status(400).json({
          message: 'Dữ liệu không hợp lệ',
          errors: Object.values(updateError.errors).map(err => err.message)
        });
      }
      throw updateError;
    }
  } catch (error) {
    console.error('Error updating notification:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

