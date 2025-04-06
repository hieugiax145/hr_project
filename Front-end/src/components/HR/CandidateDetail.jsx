import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Button, Tag, message, Modal, Form, Input, Select, Avatar, Card } from 'antd';
import { ArrowLeftOutlined, EditOutlined, UserOutlined, MessageOutlined, DownloadOutlined, MailOutlined, PhoneOutlined, FileTextOutlined, BarChartOutlined, RiseOutlined, CommentOutlined } from '@ant-design/icons';
import axios from 'axios';
import moment from 'moment';
import 'moment/locale/vi';

const { Content } = Layout;
const { TextArea } = Input;
const API_BASE_URL = 'http://localhost:8000/api';

moment.locale('vi');

const RecruitmentStages = ({ currentStage }) => {
  const getStageColor = (stageName, currentStage) => {
    const stageOrder = {
      'new': 0,
      'reviewing': 0,
      'interview1': 1,
      'interview2': 1,
      'offer': 2,
      'hired': 3,
      'rejected': 3
    };

    const currentStageIndex = stageOrder[currentStage];
    const stageIndex = {
      'proposal': 0,
      'interview': 1,
      'offer': 2,
      'final': 3
    }[stageName];

    // Nếu là giai đoạn cuối và trạng thái là rejected
    if (stageName === 'final' && currentStage === 'rejected') {
      return '#E15651';
    }

    // Nếu là giai đoạn hiện tại
    if (stageIndex === currentStageIndex) {
      return '#DAF375';
    }

    // Nếu là giai đoạn đã qua
    if (stageIndex < currentStageIndex) {
      return '#CBD3FC';
    }

    // Nếu là giai đoạn chưa đến
    return '#F3F3FE';
  };

  const getFinalStageText = (currentStage) => {
    if (currentStage === 'hired') {
      return 'Tuyển';
    } else if (currentStage === 'rejected') {
      return 'Từ chối';
    }
    return 'Tuyển/Từ chối';
  };

  return (
    <div style={{ 
      background: 'white',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '16px'
    }}>
      <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 500 }}>Giai đoạn tuyển dụng</h3>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
        <div style={{ 
          flex: 1,
          padding: '12px',
          background: getStageColor('proposal', currentStage),
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#1A1A1A'
        }}>
          Đề xuất
        </div>
        <div style={{ 
          flex: 1,
          padding: '12px',
          background: getStageColor('interview', currentStage),
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#1A1A1A'
        }}>
          Phỏng vấn
        </div>
        <div style={{ 
          flex: 1,
          padding: '12px',
          background: getStageColor('offer', currentStage),
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#1A1A1A'
        }}>
          Offer
        </div>
        <div style={{ 
          flex: 1,
          padding: '12px',
          background: getStageColor('final', currentStage),
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '14px',
          color: '#1A1A1A'
        }}>
          {getFinalStageText(currentStage)}
        </div>
      </div>
    </div>
  );
};

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [upcomingInterview, setUpcomingInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [form] = Form.useForm();
  const [commentForm] = Form.useForm();

  const fetchCandidateDetail = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      const [candidateResponse, interviewResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}/candidates/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }),
        axios.get(`${API_BASE_URL}/interviews/candidate/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      ]);

      if (candidateResponse.status === 200) {
        setCandidate(candidateResponse.data.candidate);
      }

      if (interviewResponse.status === 200 && interviewResponse.data.length > 0) {
        setUpcomingInterview(interviewResponse.data[0]);
      }
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      message.error('Có lỗi xảy ra khi tải thông tin ứng viên');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const fetchComments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/candidates/${id}/comments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      message.error('Có lỗi xảy ra khi tải nhận xét');
    }
  };

  useEffect(() => {
    fetchCandidateDetail();
  }, [fetchCandidateDetail]);

  useEffect(() => {
    if (isCommentModalVisible) {
      fetchComments();
    }
  }, [isCommentModalVisible]);

  const getStatusColor = (stage) => {
    const colors = {
      'new': 'default',
      'reviewing': 'processing',
      'interview1': 'warning',
      'interview2': 'warning',
      'offer': 'success',
      'hired': 'success',
      'rejected': 'error'
    };
    return colors[stage] || 'default';
  };

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

  const handleUpdate = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `${API_BASE_URL}/candidates/${id}`,
        values,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 200) {
        message.success('Cập nhật thông tin thành công');
        setIsEditModalVisible(false);
        fetchCandidateDetail();
      }
    } catch (error) {
      console.error('Error updating candidate:', error);
      message.error('Có lỗi xảy ra khi cập nhật thông tin');
    }
  };

  const handleDownloadCV = async () => {
    try {
      // Kiểm tra xem có CV nào không
      if (!candidate.cv || candidate.cv.length === 0) {
        message.error('Không có CV để tải');
        return;
      }
      
      // Tạo link tải trực tiếp từ Cloudinary
      const link = document.createElement('a');
      link.href = candidate.cv[0].url; // Lấy URL của CV đầu tiên
      link.setAttribute('download', `CV-${candidate.name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading CV:', error);
      message.error('Có lỗi xảy ra khi tải CV');
    }
  };

  const handleViewCV = () => {
    // Kiểm tra xem có CV nào không
    if (!candidate.cv || candidate.cv.length === 0) {
      message.error('Không có CV để xem');
      return;
    }
    
    // Sử dụng Google Docs Viewer để xem PDF
    const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(candidate.cv[0].url)}&embedded=true`;
    window.open(googleDocsUrl, '_blank');
  };

  // Hàm chuyển đổi role sang tiếng Việt
  const translateRole = (role) => {
    const roleTranslations = {
      'department_head': 'Trưởng phòng ban',
      'business_director': 'Giám đốc kinh doanh',
      'ceo': 'CEO',
      'recruitment': 'Bộ phận tuyển dụng',
      'director': 'Giám đốc',
      'hr': 'HR'
    };
    return roleTranslations[role] || role;
  };

  const handleAddComment = async (values) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/candidates/${id}/comments`,
        values,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 201) {
        message.success('Thêm nhận xét thành công');
        commentForm.resetFields();
        setIsCommentModalVisible(false);
        fetchComments();
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      message.error('Có lỗi xảy ra khi thêm nhận xét');
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!candidate) {
    return <div>Không tìm thấy thông tin ứng viên</div>;
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Layout style={{ marginLeft: 282 }}>
        <Content style={{ margin: '80px 16px 24px', minHeight: 280 }}>
          <div style={{ 
            display: 'flex', 
            gap: '16px',
            height: 'calc(100vh - 112px)',
            overflow: 'hidden'
          }}>
            {/* Left sidebar */}
            <div style={{ 
              width: '300px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              overflow: 'auto'
            }}>
              {/* Card 1: Thông tin cơ bản */}
              <div style={{ 
                background: 'white',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <Avatar 
                    size={64} 
                    icon={<UserOutlined />} 
                    style={{ marginBottom: '16px' }}
                  />
                  <h2 style={{ margin: 0 }}>{candidate.name}</h2>
                  <Tag color={getStatusColor(candidate.stage)} style={{ margin: '8px 0' }}>
                    {getStatusText(candidate.stage)}
                  </Tag>
                  <p style={{ color: '#666', margin: '8px 0' }}>
                    Ứng tuyển vào {new Date(candidate.createdAt).toLocaleDateString('vi-VN')} qua {candidate.source === 'Khác' ? candidate.customSource : candidate.source}
                  </p>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <h3 style={{ marginBottom: '12px', fontSize: '16px', fontWeight: 500 }}>Thông tin cá nhân</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <MailOutlined style={{ color: '#656ED3' }} />
                    <span>{candidate.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <PhoneOutlined style={{ color: '#656ED3' }} />
                    <span>{candidate.phone}</span>
                  </div>
                </div>
              </div>

              {/* Card: Lịch sắp tới (hiển thị khi có interview) */}
              {upcomingInterview && (
                <Card className="mb-4">
                  <div className="text-lg font-medium mb-4">Lịch sắp tới</div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-gray-600 mb-2">{upcomingInterview.title}</div>
                    
                    {/* Thời gian */}
                    <div className="text-lg mb-2">
                      {moment(upcomingInterview.date).format('D MMMM, YYYY')}
                    </div>
                    <div className="text-gray-600 mb-2">
                      {moment(upcomingInterview.startTime).format('HH:mm')} - 
                      {moment(upcomingInterview.endTime).format('HH:mm')}
                    </div>

                    {/* Loại và địa điểm */}
                    <div className="mb-2">
                      <Tag color={upcomingInterview.eventType === 'online' ? 'blue' : 'green'}>
                        {upcomingInterview.eventType === 'online' ? 'Online' : 'Offline'}
                      </Tag>
                    </div>
                    <div className="text-gray-600 mb-4">
                      Địa điểm: {upcomingInterview.location}
                    </div>

                    {/* Người tham gia */}
                    <div className="mt-4">
                      <div className="text-gray-600 mb-2">Người tham gia:</div>
                      <div className="flex flex-wrap gap-4">
                        {/* Người tạo */}
                        <div className="flex items-center gap-2">
                          <Avatar style={{ backgroundColor: '#1890ff' }}>
                            {upcomingInterview.createdBy.role[0].toUpperCase()}
                          </Avatar>
                          <div>
                            <div className="font-medium">{upcomingInterview.createdBy.fullName}</div>
                            <div className="text-xs text-gray-500">
                              {translateRole(upcomingInterview.createdBy.role)}
                            </div>
                          </div>
                        </div>

                        {/* Những người tham gia khác */}
                        {upcomingInterview.attendees.map((attendee, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Avatar style={{ backgroundColor: '#52c41a' }}>
                              {attendee.role[0].toUpperCase()}
                            </Avatar>
                            <div>
                              <div className="font-medium">{attendee.fullName}</div>
                              <div className="text-xs text-gray-500">
                                {translateRole(attendee.role)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Card 2: Thông tin ứng tuyển */}
              <div style={{ 
                background: 'white',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 500 }}>Vị trí ứng tuyển</h3>
                <div style={{ 
                  background: '#F4F1FE',
                  padding: '16px',
                  borderRadius: '8px'
                }}>
                  <div style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: '#DAF374',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      {candidate.position?.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>{candidate.position}</h4>
                      <p style={{ margin: '4px 0 0 0', color: '#666', fontSize: '14px' }}>{candidate.department}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <Tag color="blue">{candidate.type}</Tag>
                    <Tag color="green">{candidate.mode}</Tag>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <BarChartOutlined style={{ color: '#666' }} />
                      <span style={{ color: '#666' }}>{candidate.level}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <RiseOutlined style={{ color: '#666' }} />
                      <span style={{ color: '#666' }}>{candidate.experience}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span style={{ color: '#7B61FF', fontWeight: 500 }}>
                        {candidate.salary !== 'N/A' ? `đ ${candidate.salary}` : 'Chưa cập nhật'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Tệp đính kèm */}
              <div style={{ 
                background: 'white',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ marginBottom: '16px', fontSize: '16px', fontWeight: 500 }}>Tệp đính kèm</h3>
                {candidate.cv && (
                  <Button 
                    type="text" 
                    icon={<FileTextOutlined />}
                    onClick={handleViewCV}
                    style={{ width: '100%', textAlign: 'left', marginBottom: '8px' }}
                  >
                    Xem CV
                  </Button>
                )}
                {candidate.video && (
                  <Button 
                    type="text" 
                    icon={<VideoCameraOutlined />}
                    onClick={() => window.open(candidate.video, '_blank')}
                    style={{ width: '100%', textAlign: 'left' }}
                  >
                    Xem video
                  </Button>
                )}
              </div>

              {/* Card: Nhận xét */}
              <div style={{ 
                background: 'white',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                marginTop: '16px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 500 }}>Nhận xét</h3>
                  <Button 
                    type="primary"
                    icon={<CommentOutlined />}
                    onClick={() => setIsCommentModalVisible(true)}
                  >
                    Thêm nhận xét
                  </Button>
                </div>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {comments.map((comment, index) => (
                    <div 
                      key={comment._id} 
                      style={{
                        padding: '12px',
                        borderBottom: index < comments.length - 1 ? '1px solid #f0f0f0' : 'none',
                        display: 'flex',
                        gap: '12px'
                      }}
                    >
                      <Avatar style={{ backgroundColor: '#1890ff' }}>
                        {comment.user.fullName[0]}
                      </Avatar>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          marginBottom: '4px' 
                        }}>
                          <span style={{ fontWeight: 500 }}>{comment.user.fullName}</span>
                          <span style={{ color: '#8c8c8c', fontSize: '12px' }}>
                            {moment(comment.createdAt).fromNow()}
                          </span>
                        </div>
                        <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <div style={{ textAlign: 'center', color: '#8c8c8c', padding: '24px' }}>
                      Chưa có nhận xét nào
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right content */}
            <div style={{ 
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              overflow: 'hidden'
            }}>
              {/* Recruitment Stages */}
              <RecruitmentStages currentStage={candidate.stage} />

              {/* CV Viewer */}
              <div style={{ 
                flex: 1,
                background: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <div style={{ 
                  padding: '16px 24px',
                  borderBottom: '1px solid #f0f0f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <h2 style={{ margin: 0 }}>CV ứng viên</h2>
                  <div>
                    <Button 
                      icon={<DownloadOutlined />} 
                      onClick={handleDownloadCV}
                      style={{ marginRight: 8 }}
                    >
                      Tải CV
                    </Button>
                    <Button 
                      icon={<MessageOutlined />}
                      onClick={() => navigate(`/candidates/${id}/send-email`)}
                    >
                      Gửi mail
                    </Button>
                  </div>
                </div>
                <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
                  {candidate.cv && candidate.cv.length > 0 ? (
                    <iframe
                      style={{ width: '100%', height: '500px', border: 'none' }}
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(candidate.cv[0].url)}&embedded=true`}
                      title="CV Preview"
                    />
                  ) : (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      Không có CV để xem
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Content>
      </Layout>

      <Modal
        title="Chỉnh sửa thông tin ứng viên"
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleUpdate}
        >
          <Form.Item
            name="name"
            label="Họ tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="stage"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Select.Option value="new">Mới</Select.Option>
              <Select.Option value="reviewing">Đang xem xét</Select.Option>
              <Select.Option value="interview1">Phỏng vấn vòng 1</Select.Option>
              <Select.Option value="interview2">Phỏng vấn vòng 2</Select.Option>
              <Select.Option value="offer">Đề xuất</Select.Option>
              <Select.Option value="hired">Đã tuyển</Select.Option>
              <Select.Option value="rejected">Từ chối</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="notes"
            label="Ghi chú"
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item className="text-right">
            <Button onClick={() => setIsEditModalVisible(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Comment Modal */}
      <Modal
        title="Thêm nhận xét"
        open={isCommentModalVisible}
        onCancel={() => {
          setIsCommentModalVisible(false);
          commentForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={commentForm}
          layout="vertical"
          onFinish={handleAddComment}
        >
          <Form.Item
            name="content"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung nhận xét' }]}
          >
            <TextArea
              rows={4}
              placeholder="Nhập nhận xét của bạn..."
            />
          </Form.Item>

          <Form.Item className="text-right">
            <Button 
              onClick={() => {
                setIsCommentModalVisible(false);
                commentForm.resetFields();
              }} 
              style={{ marginRight: 8 }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Thêm nhận xét
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default CandidateDetail; 