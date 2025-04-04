const mongoose = require('mongoose');

const trainingCourseSchema = new mongoose.Schema({
  name: String,
  issuedBy: String,
  year: String
});

const preparationTaskSchema = new mongoose.Schema({
  content: String,
  department: String
});

const notificationSchema = new mongoose.Schema({
  // THÔNG TIN TIẾP NHẬN
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  position: String,
  department: String,
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hrInCharge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  branch: String,
  recruitmentId: {
    type: Number,
    unique: true
  },
  personalPhoto: String,

  // THÔNG TIN CÁ NHÂN
  gender: {
    type: String,
    enum: ['male', 'female']
  },
  birthDate: Date,
  idCard: {
    number: String,
    issueDate: Date,
    issuePlace: String,
    photos: [String]
  },
  startDate: Date,
  insuranceNumber: String,
  taxCode: String,
  bankAccount: {
    number: String,
    bank: String
  },

  // THÔNG TIN LIÊN HỆ
  phone: String,
  email: String,
  permanentAddress: String,
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String,
    email: String,
    address: String
  },

  // HỌC VẤN
  education: {
    level: {
      type: String,
      enum: ['postgraduate', 'university', 'college', 'other']
    },
    schoolName: String,
    major: String,
    graduationYear: String
  },

  // KHÓA HUẤN LUYỆN
  trainingCourses: [trainingCourseSchema],

  // NGUYỆN VỌNG
  expectedSalary: String,
  contractType: String,

  // HỒ SƠ CÁ NHÂN
  documents: [{
    type: String,
    enum: [
      'personalInfo',
      'criminalRecord',
      'photos',
      'healthCert',
      'degree',
      'idCard',
      'householdReg',
      'insurance'
    ]
  }],

  // CV của ứng viên
  cv: [{
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],

  // CÔNG VIỆC CHUẨN BỊ
  preparationTasks: [preparationTaskSchema]
}, {
  timestamps: true
});

// Auto-increment recruitmentId
notificationSchema.pre('save', async function(next) {
  if (this.isNew) {
    const lastNotification = await this.constructor.findOne({}, {}, { sort: { 'recruitmentId': -1 } });
    this.recruitmentId = lastNotification ? lastNotification.recruitmentId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);
