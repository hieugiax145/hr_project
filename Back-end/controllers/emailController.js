const Imap = require('imap');
const { simpleParser } = require('mailparser');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Hàm kết nối IMAP
const connectIMAP = () => {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
      authTimeout: 30000, // Tăng timeout lên 30s
      connTimeout: 30000
    });

    imap.once('ready', () => {
      resolve(imap);
    });

    imap.once('error', (err) => {
      reject(err);
    });

    imap.connect();
  });
};

// Lấy danh sách email
exports.getEmails = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const imap = await connectIMAP();

    imap.openBox('INBOX', false, (err, box) => {
      if (err) {
        console.error('Error opening inbox:', err);
        return res.status(500).json({ message: 'Lỗi khi mở hộp thư' });
      }

      // Tính toán vị trí bắt đầu và kết thúc từ cuối lên
      const totalMessages = box.messages.total;
      const start = Math.max(1, totalMessages - (page * limit) + 1);
      const end = Math.min(totalMessages, totalMessages - ((page - 1) * limit));

      const f = imap.seq.fetch(`${start}:${end}`, {
        bodies: '',
        struct: true
      });

      const emails = [];

      f.on('message', (msg) => {
        msg.on('body', (stream) => {
          simpleParser(stream, (err, parsed) => {
            if (err) {
              console.error('Error parsing email:', err);
              return;
            }

            emails.push({
              id: parsed.messageId,
              subject: parsed.subject,
              from: parsed.from.text,
              date: parsed.date,
              preview: parsed.text?.substring(0, 200) || '',
              attachments: parsed.attachments.map(attachment => ({
                filename: attachment.filename,
                contentType: attachment.contentType,
                size: attachment.size
              }))
            });
          });
        });
      });

      f.once('error', (err) => {
        console.error('Fetch error:', err);
        res.status(500).json({ message: 'Lỗi khi lấy email' });
      });

      f.once('end', () => {
        imap.end();
        // Sắp xếp email theo thời gian mới nhất
        emails.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json({
          emails,
          total: box.messages.total,
          page: parseInt(page),
          limit: parseInt(limit)
        });
      });
    });
  } catch (error) {
    console.error('Error in getEmails:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách email' });
  }
};

// Lấy danh sách email đã gửi
exports.getSentEmails = async (req, res) => {
  try {
    const { page = 1, limit = 5 } = req.query;
    const imap = await connectIMAP();

    imap.openBox('[Gmail]/Sent Mail', false, (err, box) => {
      if (err) {
        console.error('Error opening sent mail box:', err);
        return res.status(500).json({ message: 'Lỗi khi mở hộp thư đã gửi' });
      }

      // Tính toán vị trí bắt đầu và kết thúc từ cuối lên
      const totalMessages = box.messages.total;
      const start = Math.max(1, totalMessages - (page * limit) + 1);
      const end = Math.min(totalMessages, totalMessages - ((page - 1) * limit));

      const f = imap.seq.fetch(`${start}:${end}`, {
        bodies: '',
        struct: true
      });

      const emails = [];

      f.on('message', (msg) => {
        msg.on('body', (stream) => {
          simpleParser(stream, (err, parsed) => {
            if (err) {
              console.error('Error parsing email:', err);
              return;
            }

            emails.push({
              id: parsed.messageId,
              subject: parsed.subject,
              from: parsed.from.text,
              to: parsed.to.text,
              date: parsed.date,
              text: parsed.text,
              html: parsed.html,
              attachments: parsed.attachments.map(attachment => ({
                filename: attachment.filename,
                contentType: attachment.contentType,
                size: attachment.size
              }))
            });
          });
        });
      });

      f.once('error', (err) => {
        console.error('Fetch error:', err);
        res.status(500).json({ message: 'Lỗi khi lấy email đã gửi' });
      });

      f.once('end', () => {
        imap.end();
        // Sắp xếp email theo thời gian mới nhất
        emails.sort((a, b) => new Date(b.date) - new Date(a.date));
        res.json({
          emails,
          total: box.messages.total,
          page: parseInt(page),
          limit: parseInt(limit)
        });
      });
    });
  } catch (error) {
    console.error('Error in getSentEmails:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi lấy danh sách email đã gửi' });
  }
};

// Gửi email
exports.sendEmail = async (req, res) => {
  try {
    const { to, subject, content } = req.body;
    
    // Tạo transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    
    // Cấu hình email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      text: content
    };
    
    // Gửi email
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: 'Email đã được gửi thành công' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi gửi email' });
  }
};

// Xóa email
exports.deleteEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const imap = await connectIMAP();

    imap.openBox('INBOX', false, (err, box) => {
      if (err) {
        console.error('Error opening inbox:', err);
        return res.status(500).json({ message: 'Lỗi khi mở hộp thư' });
      }

      // Tìm email theo ID
      const f = imap.seq.fetch(id, {
        bodies: '',
        struct: true
      });

      f.once('error', (err) => {
        console.error('Delete error:', err);
        res.status(500).json({ message: 'Lỗi khi xóa email' });
      });

      f.once('end', () => {
        imap.end();
        res.json({ message: 'Email đã được xóa thành công' });
      });
    });
  } catch (error) {
    console.error('Error in deleteEmail:', error);
    res.status(500).json({ message: 'Có lỗi xảy ra khi xóa email' });
  }
}; 