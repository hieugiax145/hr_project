const Position = require('../models/Position');

// Tạo vị trí mới
exports.createPosition = async (req, res) => {
  try {
    const position = new Position({
      ...req.body,
      creator: req.user._id // Lấy từ middleware auth
    });

    await position.save();

    res.status(201).json({
      message: 'Tạo vị trí thành công',
      data: position
    });
  } catch (error) {
    console.error('Error in createPosition:', error);
    res.status(500).json({ message: 'Lỗi khi tạo vị trí' });
  }
};

// Lấy danh sách vị trí với phân trang
exports.getPositions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    const [positions, total] = await Promise.all([
      Position.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('creator', 'name'),
      Position.countDocuments()
    ]);

    res.json({
      message: 'Lấy danh sách vị trí thành công',
      data: positions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Error in getPositions:', error);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách vị trí' });
  }
};

// Lấy chi tiết một vị trí
exports.getPositionById = async (req, res) => {
  try {
    const position = await Position.findById(req.params.id)
      .populate('creator', 'name');

    if (!position) {
      return res.status(404).json({ message: 'Không tìm thấy vị trí' });
    }

    res.json({
      message: 'Lấy thông tin vị trí thành công',
      data: position
    });
  } catch (error) {
    console.error('Error in getPositionById:', error);
    res.status(500).json({ message: 'Lỗi khi lấy thông tin vị trí' });
  }
};

// Cập nhật vị trí
exports.updatePosition = async (req, res) => {
  try {
    const position = await Position.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!position) {
      return res.status(404).json({ message: 'Không tìm thấy vị trí' });
    }

    res.json({
      message: 'Cập nhật vị trí thành công',
      data: position
    });
  } catch (error) {
    console.error('Error in updatePosition:', error);
    res.status(500).json({ message: 'Lỗi khi cập nhật vị trí' });
  }
};

// Xóa vị trí
exports.deletePosition = async (req, res) => {
  try {
    const position = await Position.findByIdAndDelete(req.params.id);

    if (!position) {
      return res.status(404).json({ message: 'Không tìm thấy vị trí' });
    }

    res.json({
      message: 'Xóa vị trí thành công'
    });
  } catch (error) {
    console.error('Error in deletePosition:', error);
    res.status(500).json({ message: 'Lỗi khi xóa vị trí' });
  }
}; 