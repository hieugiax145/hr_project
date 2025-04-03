import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, message, Layout } from 'antd';
import { ArrowLeftOutlined, SendOutlined, SaveOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/vi';

const { Content } = Layout;
moment.locale('vi');

const SendEmail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    content: ''
  });
  const [upcomingInterview, setUpcomingInterview] = useState(null);

  // Hàm chuyển đổi trạng thái ứng viên
  const getStatusText = (stage) => {
    const texts = {
      'new': 'Mới',
      'reviewing': 'Đang xem xét',
      'interview1': 'Phỏng vấn vòng 1',
      'interview2': 'Phỏng vấn vòng 2',
      'offer': 'Đề xuất',
      'hired': 'Đã tuyển',
      'rejected': 'Từ chối'
    };
    return texts[stage] || stage;
  };

  useEffect(() => {
    const fetchCandidateData = async () => {
      if (!id) return; // Nếu không có id, không fetch data

      try {
        const token = localStorage.getItem('token');
        
        // Lấy thông tin ứng viên
        const candidateResponse = await axios.get(`http://localhost:8000/api/candidates/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Lấy thông tin phỏng vấn
        const interviewResponse = await axios.get(`http://localhost:8000/api/interviews/candidate/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (candidateResponse.data && candidateResponse.data.candidate) {
          const candidate = candidateResponse.data.candidate;
          
          // Lưu thông tin phỏng vấn nếu có
          if (interviewResponse.status === 200 && interviewResponse.data.length > 0) {
            setUpcomingInterview(interviewResponse.data[0]);
          }
          
          // Lấy thông tin HR từ localStorage
          const userString = localStorage.getItem('user');
          const user = userString ? JSON.parse(userString) : null;
          const hrName = user?.fullName || '[tên HR]';
          const hrPhone = user?.phone || '[SDT]';
          
          // Tạo nội dung email mẫu
          const emailContent = `Thân gửi ${candidate.name || '[họ tên ứng viên]'},

Công ty TNHH Rikkei Education (Rikkei) rất cảm ơn Bạn đã quan tâm ứng tuyển vào vị trí: ${candidate.position || '[tên vị trí tuyển dụng]'}

Trân trọng mời Bạn tham dự buổi phỏng vấn tại Rikkei theo thông tin chi tiết như sau:

✔ Thời gian: ${upcomingInterview ? moment(upcomingInterview.startTime).format('HH:mm, DD/MM/YYYY') : '[thời gian phỏng vấn]'}
✔ Địa điểm: Tầng 7 tháp A tòa Sông Đà, đường Phạm Hùng, quận Nam Từ Liêm, Hà Nội
✔ Hình thức phỏng vấn: Trực tiếp
✔ Thời lượng: 30 - 45 phút
✔ Người liên hệ: ${hrName} – ${hrPhone}

🔹 Bạn vui lòng phản hồi lại email để xác nhận tham gia phỏng vấn.
🔹 Cám ơn Bạn đã sắp xếp để có buổi trao đổi này. Chúc Bạn có một buổi phỏng vấn thành công!

Trân trọng,

TM. HỘI ĐỒNG TUYỂN DỤNG`;

          setEmailData({
            to: candidate.email,
            subject: `[RIKKEI ACADEMY] THƯ MỜI ${candidate.name} CHỨC VỤ ỨNG TUYỂN ${candidate.position} GIAI ĐOẠN ${getStatusText(candidate.stage)}`,
            content: emailContent
          });
        }
      } catch (error) {
        console.error('Error fetching candidate data:', error);
        message.error('Không thể tải thông tin ứng viên');
      }
    };

    fetchCandidateData();
  }, [id]);

  const handleSendEmail = async () => {
    if (!emailData.to || !emailData.subject || !emailData.content) {
      message.error('Vui lòng điền đầy đủ thông tin email');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/emails/send', emailData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      message.success('Email đã được gửi thành công!');
      navigate(id ? `/candidates/${id}` : '/emails');
    } catch (error) {
      console.error('Error sending email:', error);
      message.error('Có lỗi xảy ra khi gửi email');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (e) => {
    setEmailData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <Layout>
      <Layout style={{ marginLeft: 282 }}>
        <Content style={{ margin: '80px 16px 24px', background: '#F5F5F5', minHeight: 280 }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto',
            height: 'calc(100vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <Button 
                  icon={<ArrowLeftOutlined />} 
                  onClick={() => navigate(id ? `/candidates/${id}` : '/emails')}
                  style={{ border: 'none' }}
                >
                  Quay lại
                </Button>
                <h2 style={{ margin: 0 }}>Thư mới</h2>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  loading={loading}
                  onClick={handleSendEmail}
                >
                  Gửi
                </Button>
              </div>
            </div>

            {/* Email Form */}
            <div style={{
              background: 'white',
              borderRadius: '8px',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
            }}>
              {/* Recipients */}
              <div style={{ 
                padding: '12px 24px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ width: '80px', color: '#666' }}>Đến:</span>
                <Input 
                  value={emailData.to}
                  onChange={handleInputChange('to')}
                  bordered={false}
                  style={{ flex: 1 }}
                  readOnly={!!id}
                  placeholder="Nhập địa chỉ email người nhận"
                />
              </div>

              {/* Subject */}
              <div style={{ 
                padding: '12px 24px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ width: '80px', color: '#666' }}>Tiêu đề:</span>
                <Input 
                  value={emailData.subject}
                  onChange={handleInputChange('subject')}
                  bordered={false}
                  style={{ flex: 1 }}
                  readOnly={!!id}
                  placeholder="Nhập tiêu đề email"
                />
              </div>

              {/* Content */}
              <div style={{ flex: 1, padding: '24px' }}>
                <Input.TextArea
                  value={emailData.content}
                  onChange={handleInputChange('content')}
                  style={{ 
                    height: '100%', 
                    resize: 'none',
                    border: 'none',
                    padding: 0
                  }}
                  bordered={false}
                  placeholder="Nhập nội dung email"
                />
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default SendEmail; 