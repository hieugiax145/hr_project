const cron = require('node-cron');
const Notification = require('../models/Notification');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Cấu hình Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Gửi thông báo mỗi ngày vào 8h sáng
cron.schedule('0 8 * * *', async () => {
  console.log('🚀 Sending daily notifications...');

  try {
    const notifications = await Notification.find({ status: 'unread' }).populate('userId');

    for (const notification of notifications) {
      const mailOptions = {
        to: notification.userId.email,
        from: process.env.EMAIL_USER,
        subject: 'You have unread notifications!',
        text: notification.content
      };

      await transporter.sendMail(mailOptions);
      notification.status = 'read';
      await notification.save();
    }

    console.log('✅ Notifications sent successfully');
  } catch (err) {
    console.error('❌ Error sending notifications:', err);
  }
});
