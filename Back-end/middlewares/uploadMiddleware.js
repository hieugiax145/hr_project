const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const fs = require('fs');
require('dotenv').config();

// Tạo thư mục uploads nếu chưa tồn tại
const uploadDir = path.join(__dirname, '../uploads');
const tempDir = path.join(uploadDir, 'temp');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Kiểm tra cấu hình Cloudinary
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Cloudinary configuration is missing. Please check your .env file');
  throw new Error('Cloudinary configuration is missing');
}

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cấu hình storage cho Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'cvs',
    resource_type: 'raw',
    format: 'pdf',
    use_filename: true,
    unique_filename: true,
    type: 'upload',
    access_mode: 'public',
    transformation: [
      { flags: 'attachment' }
    ]
  }
});

// Cấu hình multer
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Chỉ chấp nhận file PDF'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // Giới hạn 5MB
  }
});

// Middleware xử lý upload và Cloudinary
const handleUpload = async (req, res, next) => {
  try {
    console.log('Starting file upload process...');
    
    upload.single('cv')(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.error('Multer error:', err);
        return res.status(400).json({ message: 'Lỗi khi upload file: ' + err.message });
      } 
      
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({ message: err.message || 'Có lỗi xảy ra khi upload file' });
      }

      if (!req.file) {
        return res.status(400).json({ message: 'Vui lòng chọn file để upload' });
      }

      console.log('File uploaded successfully:', {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype,
        cloudinaryUrl: req.file.path,
        cloudinaryPublicId: req.file.filename
      });

      // Thêm thông tin file vào request
      req.uploadedFile = {
        url: req.file.path,
        public_id: req.file.filename
      };
      
      next();
    });
  } catch (error) {
    console.error('Unexpected error in handleUpload:', error);
    return res.status(500).json({ 
      message: 'Có lỗi xảy ra trong quá trình xử lý upload',
      error: error.message 
    });
  }
};

module.exports = {
  upload,
  handleUpload
};
