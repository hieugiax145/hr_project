const cron = require('node-cron');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Interview = require('../models/Interview');
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

// Kiểm tra và gửi email thông báo cho các sự kiện sắp diễn ra
cron.schedule('* * * * *', async () => {
  console.log('🔍 Checking upcoming events...');

  try {
    const now = new Date();
    
    // Tìm tất cả các sự kiện chưa được gửi thông báo
    const events = await Interview.find({
      startTime: { $gt: now },
      notificationSent: { $ne: true }
    }).populate('candidate').populate('attendees');

    for (const event of events) {
      const eventStartTime = new Date(event.startTime);
      const notificationTime = new Date(eventStartTime.getTime() - (event.beforeEvent * 60000)); // Chuyển phút thành milliseconds
      
      // Nếu đã đến thời gian gửi thông báo
      if (now >= notificationTime) {
        // Chuẩn bị danh sách người nhận
        const recipients = [];
        
        // Thêm email của ứng viên
        if (event.candidate && event.candidate.email) {
          recipients.push(event.candidate.email);
        }
        
        // Thêm email của người tham dự
        if (event.attendees && event.attendees.length > 0) {
          event.attendees.forEach(attendee => {
            if (attendee.email) {
              recipients.push(attendee.email);
            }
          });
        }

        if (recipients.length > 0) {
          // Tạo nội dung email
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipients.join(', '),
            subject: `Thông báo sự kiện: ${event.title}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Thông báo sự kiện sắp diễn ra</h2>
                <p>Xin chào,</p>
                <p>Sự kiện <strong>${event.title}</strong> sẽ bắt đầu sau ${event.beforeEvent} phút.</p>
                <p><strong>Thời gian:</strong> ${new Date(event.startTime).toLocaleString('vi-VN')}</p>
                <p><strong>Hình thức:</strong> ${event.eventType === 'online' ? 'Online' : 'Offline'}</p>
                ${event.location ? `<p><strong>Địa điểm:</strong> ${event.location}</p>` : ''}
                ${event.description ? `<p><strong>Mô tả:</strong> ${event.description}</p>` : ''}
                <p>Trân trọng,<br>Đội ngũ JHR</p>
              </div>
            `
          };

          // Gửi email
          await transporter.sendMail(mailOptions);
          
          // Đánh dấu đã gửi thông báo
          event.notificationSent = true;
          await event.save();
          
          console.log(`✅ Notification sent for event: ${event.title}`);
        }
      }
    }
  } catch (err) {
    console.error('❌ Error checking upcoming events:', err);
  }
});
