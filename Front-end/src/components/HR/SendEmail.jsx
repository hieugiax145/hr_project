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

  useEffect(() => {
    const fetchCandidateData = async () => {
      if (!id) return; // Nếu không có id, không fetch data

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8000/api/candidates/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.candidate) {
          const candidate = response.data.candidate;
          
          // Tạo nội dung email mẫu
          const emailContent = `THƯ MỜI THAM DỰ [GIAI ĐOẠN TUYỂN DỤNG]

Kính gửi: [anh/chị] ${candidate.name || '[họ tên ứng viên]'},

Hội đồng Tuyển dụng và Ban lãnh đạo Rikkei Academy xin gửi tới [Anh/Chị] lời chào và lời chúc sức khỏe!
Qua thông tin tìm hiểu sơ bộ, chúng tôi nhận thấy [Anh/Chị] phù hợp với yêu cầu vị trí ${candidate.position || '[tên vị trí tuyển dụng]'}.
Để có thể trao đổi chi tiết hơn về công việc, cũng như đánh giá chính xác hơn kiến thức và năng lực của [Anh/Chị],
chúng tôi kính mời [Anh/Chị] tham gia buổi tuyển dụng với thông tin như sau:

Vị trí tuyển dụng: ${candidate.position || '[tên vị trí tuyển dụng]'}

Thời gian: 09:00, Thứ 3, ngày 01/10/2024

Hình thức: Online (Link) / Offline: Tầng 7, khối A, tòa nhà Sông Đà, Phạm Hùng, Nam Từ Liêm, HN

Người liên hệ: [tên HR] – [SDT]

Đến với Rikkei Academy học viên sẽ được đào tạo theo triết lý 4T độc quyền (Tin cậy – Thực tiễn – Tinh gọn – Tận tâm):
✔ Tin cậy: Rikkei Academy cam kết là học viện đào tạo đáng tin cậy, uy tín đối với học viên. Chương trình đào tạo được nghiên cứu kỹ lưỡng bởi chuyên gia, giúp học viên có đầy đủ kiến thức chuẩn và cần thiết cho ngành học của mình.

✔ Thực tiễn: Chuyên gia tại Rikkei Academy không ngừng học hỏi, cập nhật công nghệ và kiến thức mới để đưa ra chương trình học thực tiễn, bám sát nhu cầu thị trường để đào tạo học viên.

✔ Tinh gọn: Chương trình đào tạo của Rikkei Academy được thiết kế tinh gọn, đầy đủ kiến thức cần thiết và phù hợp với trình độ của từng học viên để đảm bảo chất lượng, kết quả đầu ra.

✔ Tận tâm: Giảng viên, trợ giảng tại Rikkei Academy luôn tận tâm để hỗ trợ, chia sẻ, kết nối với học viên qua những câu chuyện nghề, hỗ trợ liên tục và mang đến kỹ thuật đặt câu hỏi nâng cao tư duy phản biện của học viên, giúp học viên thấy hứng thú và có động lực để theo đuổi nghề.

Tìm hiểu thêm về Rikkei Academy tại:
🔹 Fanpage Rikkei Academy: [Link]
🔹 Fanpage Tuyển dụng Rikkei Academy: [Link]
🔹 Website Tuyển dụng Rikkei Academy: [Link]

Trân trọng cảm ơn,
TM. HỘI ĐỒNG TUYỂN DỤNG`;

          setEmailData({
            to: candidate.email,
            subject: `[RIKKEI ACADEMY] THƯ MỜI [GIAI ĐOẠN TUYỂN DỤNG]_[${candidate.position}]_[${candidate.name}]`,
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