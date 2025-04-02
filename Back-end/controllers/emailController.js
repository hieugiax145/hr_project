const Imap = require('imap');
const { simpleParser } = require('mailparser');
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
      tlsOptions: { rejectUnauthorized: false }
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

      const start = (page - 1) * limit;
      const end = start + limit;

      const f = imap.seq.fetch(`${start + 1}:${end}`, {
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