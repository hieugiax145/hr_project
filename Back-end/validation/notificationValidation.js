const Joi = require('joi');

const notificationSchema = Joi.object({
  // THÔNG TIN TIẾP NHẬN
  candidateId: Joi.string().required().messages({
    'string.empty': 'Vui lòng chọn ứng viên',
    'any.required': 'Vui lòng chọn ứng viên'
  }),
  hrInCharge: Joi.string().required().messages({
    'string.empty': 'Vui lòng chọn nhân sự phụ trách',
    'any.required': 'Vui lòng chọn nhân sự phụ trách'
  }),
  position: Joi.string().allow('').optional(),
  department: Joi.string().allow('').optional(),
  branch: Joi.string().allow('').optional(),
  personalPhoto: Joi.string().allow('').optional(),

  // THÔNG TIN CÁ NHÂN
  gender: Joi.string().valid('male', 'female').messages({
    'any.only': 'Giới tính không hợp lệ'
  }),
  birthDate: Joi.date().messages({
    'date.base': 'Ngày sinh không hợp lệ'
  }),
  idCard: Joi.object({
    number: Joi.string().pattern(/^[0-9]{12}$/).messages({
      'string.pattern.base': 'Số CCCD phải có 12 chữ số'
    }),
    issueDate: Joi.date().messages({
      'date.base': 'Ngày cấp không hợp lệ'
    }),
    issuePlace: Joi.string(),
    photos: Joi.array().items(Joi.string())
  }),
  startDate: Joi.date().messages({
    'date.base': 'Ngày vào làm không hợp lệ'
  }),
  insuranceNumber: Joi.string(),
  taxCode: Joi.string(),
  bankAccount: Joi.object({
    number: Joi.string(),
    bank: Joi.string()
  }),

  // THÔNG TIN LIÊN HỆ
  phone: Joi.string().pattern(/^[0-9]{10}$/).messages({
    'string.pattern.base': 'Số điện thoại phải có 10 chữ số'
  }),
  email: Joi.string().email().messages({
    'string.email': 'Email không hợp lệ'
  }),
  permanentAddress: Joi.string(),
  emergencyContact: Joi.object({
    name: Joi.string().allow('').optional(),
    relationship: Joi.string().allow('').optional(),
    phone: Joi.string().allow('').optional(),
    email: Joi.string().allow('').optional(),
    address: Joi.string().allow('').optional()
  }),

  // HỌC VẤN
  education: Joi.object({
    level: Joi.string().valid('postgraduate', 'university', 'college', 'other'),
    schoolName: Joi.string(),
    major: Joi.string(),
    graduationYear: Joi.string()
  }),

  // KHÓA HUẤN LUYỆN
  trainingCourses: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      issuedBy: Joi.string().required(),
      year: Joi.string().required()
    })
  ),

  // NGUYỆN VỌNG
  expectedSalary: Joi.string(),
  contractType: Joi.string(),

  // HỒ SƠ CÁ NHÂN
  documents: Joi.array().items(
    Joi.string().valid(
      'personalInfo',
      'criminalRecord',
      'photos',
      'healthCert',
      'degree',
      'idCard',
      'householdReg',
      'insurance'
    )
  ),

  // CÔNG VIỆC CHUẨN BỊ
  preparationTasks: Joi.array().items(
    Joi.object({
      content: Joi.string().required(),
      department: Joi.string().required()
    })
  )
});

exports.validateNotification = (data) => {
  return notificationSchema.validate(data, { abortEarly: false });
}; 