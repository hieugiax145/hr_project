import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout, Button, Tag, message, Modal, Form, Input, Select, Avatar } from 'antd';
import { ArrowLeftOutlined, EditOutlined, UserOutlined, MessageOutlined, DownloadOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Content } = Layout;
const { TextArea } = Input;
const API_BASE_URL = 'http://localhost:8000/api';

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCandidateDetail();
  }, [id]);

  const fetchCandidateDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/candidates/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        setCandidate(response.data.candidate);
        if (response.data.candidate.cv) {
          // Tạo URL với token
          const pdfUrlWithToken = `${response.data.candidate.cv}?token=${token}`;
          setPdfUrl(pdfUrlWithToken);
        }
      }
    } catch (error) {
      console.error('Error fetching candidate details:', error);
      message.error('Có lỗi xảy ra khi tải thông tin ứng viên');
    } finally {
      setLoading(false);
    }
  };

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

  const handleEdit = () => {
    form.setFieldsValue({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      source: candidate.source,
      customSource: candidate.customSource,
      notes: candidate.notes,
      stage: candidate.stage
    });
    setIsEditModalVisible(true);
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
      const token = localStorage.getItem('token');
      const response = await axios.get(candidate.cv, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CV-${candidate.name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CV:', error);
      message.error('Có lỗi xảy ra khi tải CV');
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!candidate) {
    return <div>Không tìm thấy thông tin ứng viên</div>;
  }

  return (
    <div style={{ padding: '24px 24px 24px 324px', minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ 
        display: 'flex', 
        gap: '16px',
        height: 'calc(100vh - 48px)',
        overflow: 'hidden'
      }}>
        {/* Left sidebar */}
        <div style={{ 
          width: '300px',
          background: 'white',
          borderRadius: '8px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <Avatar 
              size={64} 
              icon={<UserOutlined />} 
              style={{ marginBottom: '16px' }}
            />
            <h2 style={{ margin: 0 }}>{candidate.name}</h2>
            <p style={{ color: '#666', margin: '8px 0' }}>{candidate.position}</p>
            <Tag color={getStatusColor(candidate.stage)}>
              {getStatusText(candidate.stage)}
            </Tag>
          </div>

          <div>
            <h3>Thông tin liên hệ</h3>
            <p><strong>Email:</strong> {candidate.email}</p>
            <p><strong>Điện thoại:</strong> {candidate.phone}</p>
          </div>

          <div>
            <h3>Thông tin ứng tuyển</h3>
            <p><strong>Loại:</strong> {candidate.type}</p>
            <p><strong>Chế độ:</strong> {candidate.mode}</p>
            <p><strong>Nguồn:</strong> {candidate.source === 'Khác' ? candidate.customSource : candidate.source}</p>
            <p><strong>Ngày ứng tuyển:</strong> {new Date(candidate.createdAt).toLocaleDateString('vi-VN')}</p>
          </div>

          <div>
            <h3>Ghi chú</h3>
            <p>{candidate.notes || 'Không có ghi chú'}</p>
          </div>

          <div style={{ marginTop: 'auto' }}>
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={handleEdit}
              block
            >
              Chỉnh sửa
            </Button>
            <Button 
              onClick={() => navigate('/candidates')} 
              block 
              style={{ marginTop: '8px' }}
            >
              Quay lại
            </Button>
          </div>
        </div>

        {/* Main content - CV viewer */}
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
              <Button icon={<MessageOutlined />}>
                Gửi mail
              </Button>
            </div>
          </div>
          <div style={{ flex: 1, overflow: 'auto' }}>
            {pdfUrl && (
              <object
                data={pdfUrl}
                type="application/pdf"
                style={{ width: '100%', height: '100%' }}
              >
                <p>Không thể hiển thị PDF. <a href={pdfUrl} target="_blank" rel="noopener noreferrer">Mở trong tab mới</a></p>
              </object>
            )}
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default CandidateDetail; 