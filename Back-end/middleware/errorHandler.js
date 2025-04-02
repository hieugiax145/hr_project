const errorHandler = (err, req, res, next) => {
  // Log lỗi
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query,
    params: req.params,
  });

  // Xử lý các loại lỗi cụ thể
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Lỗi validation',
      errors: Object.values(err.errors).map(e => e.message)
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'ID không hợp lệ'
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      message: 'Dữ liệu bị trùng lặp'
    });
  }

  // Lỗi mặc định
  res.status(err.status || 500).json({
    message: err.message || 'Có lỗi xảy ra!',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler; 