const Candidate = require('../models/Candidate');
const Position = require('../models/Position');

// Lấy danh sách ứng viên theo vị trí
exports.getCandidatesByPosition = async (req, res) => {
  try {
    const { positionId } = req.params;
    
    // Kiểm tra vị trí có tồn tại không
    const position = await Position.findById(positionId);
    if (!position) {
      return res.status(404).json({ message: 'Không tìm thấy vị trí tuyển dụng' });
    }

    // Lấy danh sách ứng viên theo vị trí
    const candidates = await Candidate.find({ positionId })
      .sort({ createdAt: -1 });

    res.json({
      candidates
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi tải danh sách ứng viên' });
  }
};

// Thêm ứng viên mới
exports.createCandidate = async (req, res) => {
  try {
    const { positionId } = req.params;
    const candidateData = req.body;

    // Log để debug
    console.log('Request body:', req.body);
    console.log('File:', req.file);

    // Kiểm tra vị trí có tồn tại không
    const position = await Position.findById(positionId);
    if (!position) {
      return res.status(404).json({ message: 'Không tìm thấy vị trí tuyển dụng' });
    }

    // Kiểm tra file CV có được upload không
    if (!req.file || !req.file.cloudinaryUrl) {
      return res.status(400).json({ message: 'Vui lòng upload CV' });
    }

    // Kiểm tra các trường bắt buộc
    if (!candidateData.name || !candidateData.email || !candidateData.phone || !candidateData.source) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    }

    // Kiểm tra customSource khi source là 'Khác'
    if (candidateData.source === 'Khác' && !candidateData.customSource) {
      return res.status(400).json({ message: 'Vui lòng nhập nguồn khác' });
    }

    // Tạo ứng viên mới
    const candidate = new Candidate({
      name: candidateData.name,
      email: candidateData.email,
      phone: candidateData.phone,
      source: candidateData.source,
      customSource: candidateData.customSource,
      notes: candidateData.notes,
      positionId,
      stage: 'new',
      cv: req.file.cloudinaryUrl // Sử dụng URL từ Cloudinary
    });

    console.log('Candidate to save:', candidate);

    await candidate.save();

    // Cập nhật số lượng ứng viên của vị trí
    position.applicants = (position.applicants || 0) + 1;
    await position.save();

    res.status(201).json({
      message: 'Thêm ứng viên thành công',
      candidate
    });
  } catch (error) {
    console.error('Error creating candidate:', error);
    
    // Xử lý các loại lỗi cụ thể
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Dữ liệu không hợp lệ',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.code === 11000) { // Duplicate key error
      return res.status(400).json({ 
        message: 'Email đã tồn tại trong hệ thống'
      });
    }

    // Log chi tiết lỗi để debug
    console.error('Detailed error:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });

    res.status(500).json({ 
      message: 'Có lỗi xảy ra khi tạo ứng viên',
      error: error.message 
    });
  }
};

// Cập nhật trạng thái ứng viên
exports.updateCandidateStatus = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { stage } = req.body;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Không tìm thấy ứng viên' });
    }

    candidate.stage = stage;
    await candidate.save();

    res.json({
      candidate
    });
  } catch (error) {
    console.error('Error updating candidate status:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi cập nhật trạng thái ứng viên' });
  }
};

// Xóa ứng viên
exports.deleteCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Không tìm thấy ứng viên' });
    }

    // Cập nhật số lượng ứng viên của vị trí
    const position = await Position.findById(candidate.positionId);
    if (position) {
      position.applicants = Math.max(0, (position.applicants || 0) - 1);
      await position.save();
    }

    await candidate.deleteOne();

    res.json({
      message: 'Xóa ứng viên thành công'
    });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa ứng viên' });
  }
};

// Cập nhật thông tin ứng viên
exports.updateCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const updateData = req.body;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Không tìm thấy ứng viên' });
    }

    // Cập nhật các trường thông tin
    candidate.name = updateData.name || candidate.name;
    candidate.email = updateData.email || candidate.email;
    candidate.phone = updateData.phone || candidate.phone;
    candidate.source = updateData.source || candidate.source;
    candidate.customSource = updateData.customSource || candidate.customSource;
    candidate.notes = updateData.notes || candidate.notes;

    await candidate.save();

    res.json({
      message: 'Cập nhật thông tin ứng viên thành công',
      candidate
    });
  } catch (error) {
    console.error('Error updating candidate:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Dữ liệu không hợp lệ',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Email đã tồn tại trong hệ thống'
      });
    }

    res.status(500).json({ 
      message: 'Có lỗi xảy ra khi cập nhật thông tin ứng viên',
      error: error.message 
    });
  }
}; 