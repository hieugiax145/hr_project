const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  role: { 
    type: String, 
    enum: [
      'department_head',
      'business_director',
      'ceo',
      'recruitment',
      'applicant',
      'director'
    ], 
    required: true 
  },
  department: { 
    type: String, 
    enum: ['accounting', 'marketing', 'it', 'hr', 'sales'],
    required: function() { return this.role === 'department_head'; }
  },
  avatar: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
