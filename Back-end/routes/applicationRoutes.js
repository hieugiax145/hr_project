const express = require('express');
const { createApplication, getApplications, updateApplication, deleteApplication, getApplicationById } = require('../controllers/applicationController');
const { protect, authorizeAdminHR } = require('../middlewares/authMiddleware');
const Application = require('../models/Application');

const router = express.Router();

// Lấy danh sách yêu cầu tuyển dụng
router.get('/', protect, authorizeAdminHR('view'), getApplications);

// Lấy chi tiết một yêu cầu tuyển dụng
router.get('/:id', protect, authorizeAdminHR('view'), getApplicationById);

// Tạo yêu cầu tuyển dụng mới
router.post('/', protect, authorizeAdminHR('create'), createApplication);

// Cập nhật yêu cầu tuyển dụng
router.put('/:id', protect, authorizeAdminHR('update'), updateApplication);

// Xóa yêu cầu tuyển dụng
router.delete('/:id', protect, authorizeAdminHR('delete'), deleteApplication);

// Cập nhật trạng thái yêu cầu
router.patch('/:id/status', protect, authorizeAdminHR('update'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const application = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select('-__v');
    
    if (!application) {
      return res.status(404).json({ message: 'Không tìm thấy yêu cầu tuyển dụng' });
    }
    
    res.json(application);
  } catch (error) {
    console.error('Error in status update:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route cập nhật trạng thái và người phụ trách
router.patch('/:id/review', protect, authorizeAdminHR('update'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, responsible } = req.body;
    
    // Kiểm tra xem yêu cầu đã có người phụ trách chưa
    const existingApplication = await Application.findById(id);
    if (!existingApplication) {
      return res.status(404).json({ message: 'Không tìm thấy yêu cầu tuyển dụng' });
    }

    // Cập nhật trạng thái và người phụ trách
    const application = await Application.findByIdAndUpdate(
      id,
      { 
        status,
        responsible: responsible // ID của người dùng hiện tại
      },
      { 
        new: true,
        runValidators: true 
      }
    )
    .populate('userId', 'username fullName')
    .populate('responsible', 'username fullName');
    
    res.json(application);
  } catch (error) {
    console.error('Error in review update:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
