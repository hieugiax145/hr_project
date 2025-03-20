const JobPosition = require('../models/JobPosition');
const Notification = require('../models/Notification');
const User = require('../models/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { registerUser, loginUser };


const createJob = async (req, res) => {
  try {
    const newJob = await JobPosition.create(req.body);

    // Gửi thông báo cho các ứng viên
    const applicants = await User.find({ role: 'applicant' });

    applicants.forEach(async (applicant) => {
      await Notification.create({
        userId: applicant._id,
        content: `New job posted: ${newJob.title}`
      });

      // Gửi email cho các ứng viên
      const mailOptions = {
        to: applicant.email,
        from: process.env.EMAIL_USER,
        subject: `New Job Posted`,
        text: `A new job '${newJob.title}' has been posted in ${newJob.department}. Check it out now!`
      };

      await transporter.sendMail(mailOptions);
    });

    res.status(201).json(newJob);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await JobPosition.find();
    res.status(200).json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await JobPosition.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    await JobPosition.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { createJob, getJobs, updateJob, deleteJob };
