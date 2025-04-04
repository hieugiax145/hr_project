import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Form, Input, Button, message, Select, Upload, Layout } from 'antd';
import { SendOutlined, InboxOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/vi';

const { Dragger } = Upload;
const { Content } = Layout;
moment.locale('vi');

const SendEmail = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [emailContent, setEmailContent] = useState('');
  const [upcomingInterview, setUpcomingInterview] = useState(null);

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'align',
    'link'
  ];

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
          const emailContent = candidate.stage === 'rejected' 
            ? `<div style="font-family: Arial, sans-serif;">
<h3 style="text-align: center; margin-bottom: 20px;">THƯ CẢM ƠN ${candidate.name || '[HỌ TÊN ỨNG VIÊN]'} ỨNG TUYỂN ${candidate.position || '[VỊ TRÍ TUYỂN DỤNG]'}</h3>

<p>Kính gửi: ${candidate.name || '[anh/chị] [họ tên ứng viên]'},</p>

<p>Hội đồng Tuyển dụng và Ban lãnh đạo Rikkei Academy gửi lời cảm ơn đến ${candidate.name || '[Anh/Chị]'} vì đã quan tâm và dành thời gian ứng tuyển vị trí ${candidate.position || '[Tên vị trí ứng tuyển]'}.</p>

<p>Sau khi xem xét, Rikkei Academy đã đối tượng với hồ sơ ứng tuyển của ${candidate.name || '[Anh/Chị]'}, tuy nhiên do một số điểm chưa phù hợp, chúng tôi rất tiếc vì chưa thể hợp tác với ${candidate.name || '[Anh/Chị]'} trong thời gian này.</p>

<p>DTS xin phép lưu hồ sơ của ${candidate.name || '[Anh/Chị]'} cho những cơ hội khác trong tương lai. ${candidate.name || '[Anh/Chị]'} có thể giữ liên lạc với chúng tôi và cập nhật những thông tin nghề nghiệp mới nhất tại Tuyển dụng DTS.</p>

<p>Một lần nữa rất cám ơn sự quan tâm, thời gian và nỗ lực của ${candidate.name || '[Anh/Chị]'}. Chúc ${candidate.name || '[Anh/Chị]'} gặt hái nhiều thành công trong sự nghiệp tương lai.</p>

<p>Trân trọng cảm ơn,</p>
<p>TM. HỘI ĐỒNG TUYỂN DỤNG</p>
</div>`
            : `Thân gửi ${candidate.name || '[họ tên ứng viên]'},

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

          form.setFieldsValue({
            to: candidate.email,
            subject: candidate.stage === 'rejected'
              ? `[RIKKEI ACADEMY] THƯ TỪ CHỐI _ ${candidate.name} _ ${candidate.position}`
              : `[RIKKEI ACADEMY] THƯ MỜI ${candidate.name} CHỨC VỤ ỨNG TUYỂN ${candidate.position} GIAI ĐOẠN ${getStatusText(candidate.stage)}`,
            content: emailContent
          });
        }
      } catch (error) {
        console.error('Error fetching candidate data:', error);
        message.error('Không thể tải thông tin ứng viên');
      }
    };

    fetchCandidateData();
  }, [id, form]);

  // File upload configuration
  const uploadProps = {
    name: 'attachments',
    multiple: true,
    fileList: fileList,
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File phải nhỏ hơn 10MB!');
        return Upload.LIST_IGNORE;
      }
      return false; // Prevent auto upload
    },
    onChange: (info) => {
      setFileList(info.fileList);
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
  };

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('to', values.to);
      
      // Handle CC emails
      if (values.cc && values.cc.length > 0) {
        formData.append('cc', values.cc.join(','));
      }
      
      // Handle BCC emails
      if (values.bcc && values.bcc.length > 0) {
        formData.append('bcc', values.bcc.join(','));
      }
      
      formData.append('subject', values.subject);
      formData.append('content', values.content || '');
      
      // Append files if any
      if (fileList && fileList.length > 0) {
        fileList.forEach((file) => {
          formData.append('attachments', file.originFileObj);
        });
      }

      const response = await axios.post('http://localhost:8000/api/emails/send', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 200) {
        message.success('Email đã được gửi thành công!');
        if (location.pathname.includes('/candidates/')) {
          navigate(`/candidates/${id}`);
        } else {
          navigate('/emails');
        }
      }
    } catch (error) {
      console.error('Error sending email:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi gửi email';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 ml-[282px]">
      <div className="max-w-[1200px] mx-auto bg-white rounded-lg p-6 mt-[80px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate(id ? `/candidates/${id}` : '/emails')}
              className="border-none"
            >
              Quay lại
            </Button>
            <h1 className="text-[20px] font-medium text-[#1A1A1A] m-0">Thư mới</h1>
          </div>
        </div>

        {/* Email Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="bg-white rounded-lg"
        >
          {/* Recipients */}
          <div className="border-b border-[#f0f0f0] p-4">
            <div className="flex items-center">
              <span className="w-20 text-[#666]">Đến:</span>
              <Form.Item 
                name="to" 
                className="mb-0 flex-1"
                rules={[{ required: true, message: 'Vui lòng nhập email người nhận' }]}
              >
                <Input 
                  variant="borderless"
                  readOnly={!!id}
                  placeholder="Nhập địa chỉ email người nhận"
                />
              </Form.Item>
            </div>
          </div>

          {/* CC */}
          <div className="border-b border-[#f0f0f0] p-4">
            <div className="flex items-center">
              <span className="w-20 text-[#666]">CC:</span>
              <Form.Item name="cc" className="mb-0 flex-1">
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="Nhập email CC"
                  tokenSeparators={[',']}
                  variant="borderless"
                />
              </Form.Item>
            </div>
          </div>

          {/* BCC */}
          <div className="border-b border-[#f0f0f0] p-4">
            <div className="flex items-center">
              <span className="w-20 text-[#666]">BCC:</span>
              <Form.Item name="bcc" className="mb-0 flex-1">
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  placeholder="Nhập email BCC"
                  tokenSeparators={[',']}
                  variant="borderless"
                />
              </Form.Item>
            </div>
          </div>

          {/* Subject */}
          <div className="border-b border-[#f0f0f0] p-4">
            <div className="flex items-center">
              <span className="w-20 text-[#666]">Tiêu đề:</span>
              <Form.Item 
                name="subject" 
                className="mb-0 flex-1"
                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
              >
                <Input 
                  variant="borderless"
                  readOnly={!!id}
                  placeholder="Nhập tiêu đề email"
                />
              </Form.Item>
            </div>
          </div>

          {/* File Upload */}
          <div className="border-b border-[#f0f0f0] p-4">
            <div className="flex items-start">
              <span className="w-20 text-[#666] mt-2">Đính kèm:</span>
              <div className="flex-1">
                <Upload {...uploadProps}>
                  <Button icon={<InboxOutlined />}>Chọn file</Button>
                </Upload>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <Form.Item
              name="content"
              rules={[{ required: true, message: 'Vui lòng nhập nội dung email' }]}
            >
              <ReactQuill 
                theme="snow"
                value={emailContent}
                onChange={setEmailContent}
                modules={modules}
                formats={formats}
                style={{ 
                  height: '300px',
                  marginBottom: '50px'
                }}
              />
            </Form.Item>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 mt-8">
            <Button onClick={() => navigate(-1)}>
              Hủy
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SendOutlined />}
              loading={loading}
              className="bg-[#1890ff]"
            >
              Gửi
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SendEmail; 