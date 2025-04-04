const Candidate = require('../models/Candidate');
const Position = require('../models/Position');
const cloudinary = require('cloudinary');
const Application = require('../models/Application');

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
    console.log('Files:', req.files);
    console.log('Uploaded files:', req.uploadedFiles);

    // Kiểm tra vị trí có tồn tại không
    const position = await Position.findById(positionId);
    if (!position) {
      return res.status(404).json({ message: 'Không tìm thấy vị trí tuyển dụng' });
    }

    // Kiểm tra các trường bắt buộc
    if (!candidateData.name || !candidateData.email || !candidateData.phone || !candidateData.source) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin bắt buộc' });
    }

    // Kiểm tra customSource khi source là 'Khác'
    if (candidateData.source === 'Khác' && !candidateData.customSource) {
      return res.status(400).json({ message: 'Vui lòng nhập nguồn khác' });
    }

    // Kiểm tra xem có ít nhất một CV được upload hoặc link CV được cung cấp
    if ((!req.uploadedFiles || req.uploadedFiles.length === 0) && !candidateData.cvLink) {
      return res.status(400).json({ message: 'Vui lòng upload ít nhất một CV hoặc cung cấp link CV' });
    }

    // Tạo mảng CV từ các file đã upload
    const cvArray = [];
    if (req.uploadedFiles && req.uploadedFiles.length > 0) {
      req.uploadedFiles.forEach(file => {
        cvArray.push({
          url: file.url,
          public_id: file.public_id,
          fileName: file.fileName,
          uploadDate: new Date()
        });
      });
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
      cv: cvArray,
      cvLink: candidateData.cvLink || ''
    });

    console.log('Candidate to save:', candidate);

    await candidate.save();

    // Cập nhật số lượng ứng viên của vị trí
    position.applicants = (position.applicants || 0) + 1;
    await position.save();

    // Kiểm tra và cập nhật trạng thái vị trí nếu đã đủ số lượng
    const application = await Application.findOne({ position: position.title, department: position.department });
    if (application && position.applicants >= application.quantity) {
      position.status = 'Đã đủ';
      await position.save();
    }

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

    console.log('Updating candidate status:', {
      candidateId,
      stage,
      body: req.body,
      headers: req.headers
    });

    // Kiểm tra giá trị stage có hợp lệ không
    const validStages = ['new', 'reviewing', 'interview1', 'interview2', 'offer', 'hired', 'rejected', 'archived'];
    if (!stage) {
      return res.status(400).json({ 
        message: 'Trường stage là bắt buộc',
        validStages
      });
    }

    if (!validStages.includes(stage)) {
      return res.status(400).json({ 
        message: 'Trạng thái không hợp lệ',
        receivedStage: stage,
        validStages
      });
    }

    // Tìm candidate
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: 'Không tìm thấy ứng viên' });
    }

    console.log('Current candidate:', candidate);

    // Chỉ cập nhật trường stage
    candidate.stage = stage;
    
    try {
      // Sử dụng findOneAndUpdate để chỉ cập nhật trường stage
      const updatedCandidate = await Candidate.findOneAndUpdate(
        { _id: candidateId },
        { $set: { stage: stage } },
        { new: true }
      );

      console.log('Updated candidate:', updatedCandidate);

      res.json({
        message: 'Cập nhật trạng thái ứng viên thành công',
        candidate: updatedCandidate
      });
    } catch (updateError) {
      console.error('Error updating candidate:', updateError);
      res.status(500).json({ 
        message: 'Có lỗi xảy ra khi cập nhật trạng thái ứng viên',
        error: updateError.message 
      });
    }
  } catch (error) {
    console.error('Error updating candidate status:', error);
    res.status(500).json({ 
      message: 'Có lỗi xảy ra khi cập nhật trạng thái ứng viên',
      error: error.message 
    });
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

    // Xóa file trên Cloudinary
    if (candidate.cv.public_id) {
      await cloudinary.uploader.destroy(candidate.cv.public_id);
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

// Lấy tất cả ứng viên
exports.getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find()
      .populate('positionId', 'title department')
      .sort({ createdAt: -1 });

    res.json({
      candidates: candidates.map(candidate => ({
        _id: candidate._id,
        name: candidate.name,
        email: candidate.email,
        phone: candidate.phone,
        positionId: candidate.positionId,
        stage: candidate.stage,
        source: candidate.source,
        customSource: candidate.customSource,
        cv: candidate.cv,
        notes: candidate.notes,
        createdAt: candidate.createdAt
      }))
    });
  } catch (error) {
    console.error('Error in getAllCandidates:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi tải danh sách ứng viên' });
  }
};

// Lấy chi tiết ứng viên
exports.getCandidateById = async (req, res) => {
  try {
    const { candidateId } = req.params;

    const candidate = await Candidate.findById(candidateId)
      .populate({
        path: 'positionId',
        select: 'title type mode level experience salary department'
      });

    if (!candidate) {
      return res.status(404).json({ message: 'Không tìm thấy ứng viên' });
    }

    // Format dữ liệu để phù hợp với frontend
    const formattedCandidate = {
      _id: candidate._id,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      position: candidate.positionId ? candidate.positionId.title : 'N/A',
      type: candidate.positionId ? candidate.positionId.type : 'N/A',
      mode: candidate.positionId ? candidate.positionId.mode : 'N/A',
      level: candidate.positionId ? candidate.positionId.level : 'N/A',
      experience: candidate.positionId ? candidate.positionId.experience : 'N/A',
      salary: candidate.positionId ? candidate.positionId.salary : 'N/A',
      department: candidate.positionId ? candidate.positionId.department : 'N/A',
      stage: candidate.stage,
      source: candidate.source,
      customSource: candidate.customSource,
      cv: candidate.cv,
      notes: candidate.notes,
      createdAt: candidate.createdAt
    };

    res.json({
      candidate: formattedCandidate
    });
  } catch (error) {
    console.error('Error fetching candidate details:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi tải thông tin ứng viên' });
  }
};

// Lấy danh sách ứng viên cho calendar
exports.getCandidatesForCalendar = async (req, res) => {
  try {
    const candidates = await Candidate.find({
      stage: { $nin: ['rejected', 'hired'] }
    })
    .populate('positionId', 'name')
    .select('name email phone stage positionId')
    .sort({ createdAt: -1 });

    const formattedCandidates = candidates.map(candidate => ({
      _id: candidate._id,
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      position: candidate.positionId?.name || 'Chưa có vị trí',
      stage: candidate.stage
    }));

    res.json({
      candidates: formattedCandidates
    });
  } catch (error) {
    console.error('Error fetching candidates for calendar:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi tải danh sách ứng viên' });
  }
}; 