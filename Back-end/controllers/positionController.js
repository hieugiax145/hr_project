const Position = require('../models/Position');

// Tạo vị trí mới
exports.createPosition = async (req, res) => {
  try {
    const position = new Position(req.body);
    await position.save();
    res.status(201).json({
      success: true,
      position
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy danh sách vị trí với filter và tìm kiếm
exports.getPositions = async (req, res) => {
  try {
    const { search, type, mode, page = 1, limit = 8 } = req.query;
    
    // Xây dựng query
    let query = {};
    
    // Tìm kiếm theo title hoặc department
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter theo type
    if (type && type !== 'all') {
      query.type = type;
    }
    
    // Filter theo mode
    if (mode && mode !== 'all') {
      query.mode = mode;
    }

    // Tính toán skip và limit cho phân trang
    const skip = (page - 1) * limit;

    // Thực hiện query với phân trang
    const positions = await Position.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    // Đếm tổng số kết quả
    const total = await Position.countDocuments(query);

    res.status(200).json({
      positions,
      total
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy chi tiết một vị trí
exports.getPosition = async (req, res) => {
  try {
    const position = await Position.findById(req.params.id);
    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy vị trí'
      });
    }
    res.status(200).json({
      success: true,
      position
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Cập nhật vị trí
exports.updatePosition = async (req, res) => {
  try {
    const position = await Position.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy vị trí'
      });
    }
    res.status(200).json({
      success: true,
      position
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Xóa vị trí
exports.deletePosition = async (req, res) => {
  try {
    const position = await Position.findByIdAndDelete(req.params.id);
    if (!position) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy vị trí'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Xóa vị trí thành công'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 