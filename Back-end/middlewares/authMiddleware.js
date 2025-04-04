const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // Kiểm tra token từ header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Kiểm tra token từ query parameter
    else if (req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).json({ message: 'Vui lòng đăng nhập để thực hiện chức năng này' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Get user from database
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Người dùng không tồn tại' });
      }

      // Add user to request
      req.user = user;
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Lỗi xác thực, vui lòng thử lại' });
  }
};

// Middleware phân quyền theo role
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Vui lòng đăng nhập để thực hiện chức năng này' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Bạn không có quyền thực hiện chức năng này',
        currentRole: req.user.role,
        requiredRoles: roles
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
