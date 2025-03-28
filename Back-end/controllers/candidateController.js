const Candidate = require('../models/Candidate');
const Position = require('../models/Position');

// Lấy danh sách ứng viên theo vị trí
exports.getCandidatesByPosition = async (req, res) => {
  try {
    const { positionId } = req.params;
    
    // Kiểm tra vị trí có tồn tại không
    const position = await Position.findById(positionId);
    if (!position) {
      return res.status(404).json({ error: 'Không tìm thấy vị trí tuyển dụng' });
    }

    // Lấy danh sách ứng viên theo vị trí
    const candidates = await Candidate.find({ positionId })
      .sort({ appliedDate: -1 });

    // Nhóm ứng viên theo trạng thái
    const groupedCandidates = candidates.reduce((acc, candidate) => {
      const status = candidate.status;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(candidate);
      return acc;
    }, {});

    res.json({
      success: true,
      data: groupedCandidates
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'Có lỗi xảy ra khi tải danh sách ứng viên' });
  }
};

// Thêm ứng viên mới
exports.createCandidate = async (req, res) => {
  try {
    const { positionId } = req.params;
    const candidateData = req.body;

    // Kiểm tra vị trí có tồn tại không
    const position = await Position.findById(positionId);
    if (!position) {
      return res.status(404).json({ error: 'Không tìm thấy vị trí tuyển dụng' });
    }

    // Tạo ứng viên mới
    const candidate = new Candidate({
      ...candidateData,
      positionId
    });

    await candidate.save();

    // Cập nhật số lượng ứng viên của vị trí
    position.applicants += 1;
    await position.save();

    res.status(201).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({ error: 'Có lỗi xảy ra khi tạo ứng viên' });
  }
};

// Cập nhật trạng thái ứng viên
exports.updateCandidateStatus = async (req, res) => {
  try {
    const { candidateId } = req.params;
    const { status } = req.body;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: 'Không tìm thấy ứng viên' });
    }

    candidate.status = status;
    await candidate.save();

    res.json({
      success: true,
      data: candidate
    });
  } catch (error) {
    console.error('Error updating candidate status:', error);
    res.status(500).json({ error: 'Có lỗi xảy ra khi cập nhật trạng thái ứng viên' });
  }
};

// Xóa ứng viên
exports.deleteCandidate = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ error: 'Không tìm thấy ứng viên' });
    }

    // Cập nhật số lượng ứng viên của vị trí
    const position = await Position.findById(candidate.positionId);
    if (position) {
      position.applicants = Math.max(0, position.applicants - 1);
      await position.save();
    }

    await candidate.deleteOne();

    res.json({
      success: true,
      message: 'Xóa ứng viên thành công'
    });
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ error: 'Có lỗi xảy ra khi xóa ứng viên' });
  }
}; 