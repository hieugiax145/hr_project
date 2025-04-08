const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Tạo mã xác nhận ngẫu nhiên 6 số
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Quên mật khẩu - Gửi mã xác nhận
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Không tìm thấy tài khoản' });

    // Tạo mã xác nhận 6 số
    const verificationCode = generateVerificationCode();
    user.resetPasswordToken = verificationCode;
    user.resetPasswordExpires = Date.now() + 300000; // Mã hết hạn sau 5 phút

    await user.save();

    // Gửi email đặt lại mật khẩu
    const mailOptions = {
      from: `"JHR System" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Mã xác nhận đặt lại mật khẩu',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Yêu cầu đặt lại mật khẩu</h2>
          <p>Xin chào ${user.fullName || user.username},</p>
          <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình.</p>
          <p>Mã xác nhận của bạn là: <strong style="color: #656ED3; font-size: 24px;">${verificationCode}</strong></p>
          <p>Mã này sẽ hết hạn sau 5 phút.</p>
          <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
          <p>Trân trọng,<br>Đội ngũ JHR</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ 
      message: 'Đã gửi mã xác nhận đến email của bạn'
    });
  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ error: 'Không thể gửi email. Vui lòng thử lại sau!' });
  }
};

// Xác nhận mã và đặt lại mật khẩu
const resetPassword = async (req, res) => {
  try {
    const { email, verificationCode, newPassword } = req.body;
    
    const user = await User.findOne({
      email,
      resetPasswordToken: verificationCode,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Mã xác nhận không hợp lệ hoặc đã hết hạn' 
      });
    }

    // Cập nhật mật khẩu mới
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Đặt lại mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password, role, department, fullName } = req.body;

    // Kiểm tra xem username hoặc email đã tồn tại chưa
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({
        error: existingUser.username === username 
          ? 'Tên đăng nhập đã tồn tại'
          : 'Email đã được sử dụng'
      });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới với mật khẩu đã mã hóa
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      fullName,
      // Chỉ thêm department nếu role là department_head
      ...(role === 'department_head' ? { department } : {})
    });

    await newUser.save();

    // Tạo JWT token
    const token = jwt.sign(
      { 
        id: newUser._id,
        username: newUser.username,
        role: newUser.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      message: 'Đăng ký tài khoản thành công',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        fullName: newUser.fullName
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Đăng ký thất bại. Vui lòng thử lại!' });
  }
};

// Đăng nhập
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: 'Tài khoản không tồn tại' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu không chính xác' });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Gửi phản hồi thành công với token và thông tin user
    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        fullName: user.fullName
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Lỗi server, vui lòng thử lại sau' });
  }
};

// Xem thông tin người dùng
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật hồ sơ cá nhân
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (req.body.username) user.username = req.body.username;
    if (req.body.email) user.email = req.body.email;
    if (req.body.avatar) user.avatar = req.body.avatar;

    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);
    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({ avatar: user.avatar });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createAdminAccount = async () => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('123456', salt);

      const adminUser = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        fullName: 'Administrator',
        role: 'ceo',
        department: undefined
      });

      await adminUser.save();
      console.log('Tài khoản admin đã được tạo thành công');
    } else {
      console.log('Tài khoản admin đã tồn tại');
    }
  } catch (error) {
    console.error('Lỗi khi tạo tài khoản admin:', error);
  }
};

// Gọi hàm để tạo tài khoản admin
createAdminAccount();

// @desc    Get all users
// @route   GET /api/users/all
// @access  Private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, 'username email fullName role department');
  res.json(users);
});

// Xóa người dùng
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Kiểm tra xem người dùng có tồn tại không
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Kiểm tra xem người dùng hiện tại có quyền xóa không
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'ceo')) {
      return res.status(403).json({ message: 'Không có quyền thực hiện thao tác này' });
    }

    // Không cho phép xóa tài khoản admin
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Không thể xóa tài khoản admin' });
    }

    // Thực hiện xóa người dùng
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: 'Xóa người dùng thành công' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Lỗi server, vui lòng thử lại sau' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  getAllUsers,
  forgotPassword,
  resetPassword,
  deleteUser
};
