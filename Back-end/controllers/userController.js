const User = require('../models/User');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Quên mật khẩu
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Tạo token reset
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; 

    await user.save();

    // Gửi email đặt lại mật khẩu
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Please click on the following link to reset your password: ${resetUrl}`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Đặt lại mật khẩu
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const newUser = new User({ username, email, password, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Đăng nhập
const loginUser = async (req, res) => {
  const { username , password } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  // Gửi phản hồi thành công
  res.status(200).json({ message: 'Login successful' });
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
  const adminExists = await User.findOne({ username: 'HRAccount' });
  if (!adminExists) {
    const adminUser = new User({
      username: 'HRAccount',
      email: 'HRAccount@gmail.com',
      password: await bcrypt.hash('HRAccount123', 10),
      role: 'admin'
    });
    await adminUser.save();
    console.log('Admin account created');
  }
};

createAdminAccount();

const addTestUser = async () => {
  const userExists = await User.findOne({ email: 'khang080803@gmail.com' });
  if (!userExists) {
    const testUser = new User({
      username: 'khang080803',
      email: 'khang080803@gmail.com',
      password: await bcrypt.hash('TestPassword123', 10), 
      role: 'admin'
    });
    await testUser.save();
    console.log('Test user created');
  } else {
    console.log('Test user already exists');
  }
};

addTestUser();

module.exports = { registerUser, loginUser, forgotPassword, resetPassword, getUserProfile, updateUserProfile, uploadAvatar };
