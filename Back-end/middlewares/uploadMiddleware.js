const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
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
const cloudinaryConfig = cloudinary.config();
console.log('Cloudinary configuration:', {
  cloud_name: cloudinaryConfig.cloud_name,
  api_key: cloudinaryConfig.api_key,
  url: process.env.CLOUDINARY_URL
});

// Cấu hình local storage tạm thời
const localStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, tempDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter chỉ cho phép file PDF
const fileFilter = (req, file, cb) => {
  console.log('Processing file:', {
    fieldname: file.fieldname,
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });

  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file PDF'), false);
  }
};

// Tạo multer instance với cấu hình local storage
const upload = multer({
  storage: localStorage,
  fileFilter: fileFilter,
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

      console.log('File saved locally:', {
        path: req.file.path,
        size: req.file.size,
        mimetype: req.file.mimetype
      });

      try {
        // Upload lên Cloudinary với cấu hình cho PDF
        console.log('Attempting to upload to Cloudinary...');
        const result = await cloudinary.uploader.upload(req.file.path, {
          resource_type: 'auto',
          folder: 'cvs',
          public_id: `cv-${Date.now()}`,
          overwrite: true,
          use_filename: false,
          unique_filename: true,
          format: 'pdf',
          type: 'upload',
          access_mode: 'public',
          content_disposition: 'attachment'
        });
        
        console.log('Cloudinary upload successful:', {
          public_id: result.public_id,
          url: result.secure_url,
          format: result.format,
          size: result.bytes,
          resource_type: result.resource_type
        });
        
        // Xóa file tạm sau khi upload thành công
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error('Error deleting temp file:', err);
          } else {
            console.log('Temp file deleted successfully');
          }
        });
        
        // Gán URL từ Cloudinary vào req.file
        req.file.cloudinaryUrl = result.secure_url;
        
        next();
      } catch (cloudinaryError) {
        console.error('Cloudinary upload error:', {
          message: cloudinaryError.message,
          code: cloudinaryError.http_code,
          stack: cloudinaryError.stack,
          error: cloudinaryError.error
        });

        // Xóa file tạm nếu upload thất bại
        fs.unlink(req.file.path, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });

        return res.status(500).json({ 
          message: 'Lỗi khi upload file lên cloud',
          error: cloudinaryError.message,
          details: cloudinaryError.error || cloudinaryError.message,
          code: cloudinaryError.http_code
        });
      }
    });
  } catch (error) {
    console.error('Unexpected error:', {
      message: error.message,
      stack: error.stack
    });
    return res.status(500).json({ 
      message: 'Có lỗi không mong muốn xảy ra',
      error: error.message
    });
  }
};

module.exports = {
  upload,
  handleUpload
};
