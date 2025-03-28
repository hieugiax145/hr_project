import React, { useState, useEffect } from 'react';
import { Layout, Input, Select, Button, Dropdown, Menu, Badge, message, Modal, Form } from 'antd';
import { SearchOutlined, MoreOutlined, PlusOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';

const { Content } = Layout;
const { TextArea } = Input;

const JobsCandidates = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isStageModalVisible, setIsStageModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchPosition = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/positions/${id}`);
        const data = await response.json();
        if (response.ok) {
          setPosition(data.data);
        } else {
          message.error('Không thể tải thông tin vị trí');
          navigate('/positions');
        }
      } catch (error) {
        message.error('Có lỗi xảy ra khi tải thông tin vị trí');
        navigate('/positions');
      } finally {
        setLoading(false);
      }
    };

    fetchPosition();
  }, [id, navigate]);

  // Các trạng thái của ứng viên
  const stages = [
    { title: 'Tiếp nhận hồ sơ', count: 7 },
    { title: 'Hồ sơ đề xuất', count: 8 },
    { title: 'Phỏng vấn lần 1', count: 7 },
    { title: 'Phỏng vấn lần 2', count: 7 },
    { title: 'Offer', count: 7 },
    { title: 'Tuyển', count: 4 },
    { title: 'Từ chối', count: 4 }
  ];

  // Mock data cho ứng viên
  const candidates = [
    {
      id: 1,
      name: 'Nguyễn Thu Phương',
      email: 'ntphuong@gmail.com.vn',
      phone: '0399999333',
      date: '30/03/2024'
    },
    {
      id: 2,
      name: 'Nguyễn Thu Trang',
      email: 'nttrang@gmail.com.vn',
      phone: '0399999333',
      date: '30/03/2024'
    }
  ];

  const handleAddCandidate = async (values) => {
    try {
      const response = await fetch(`http://localhost:8000/api/positions/${id}/candidates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Thêm ứng viên thành công');
        setIsAddModalVisible(false);
        form.resetFields();
        // Refresh candidates list
      } else {
        message.error(data.error || 'Có lỗi xảy ra khi thêm ứng viên');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi thêm ứng viên');
    }
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
        <Sidebar />
        <Layout style={{ marginLeft: 282 }}>
          <Topbar />
          <Content style={{ margin: '80px 16px 24px', minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B61FF]"></div>
          </Content>
        </Layout>
      </Layout>
    );
  }

  if (!position) {
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Sidebar />
      <Layout style={{ marginLeft: 282 }}>
        <Topbar />
        <Content style={{ margin: '80px 16px 24px', minHeight: 280, overflow: 'hidden' }}>
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="text-xl font-bold">{position.title}</div>
              <Input
                prefix={<SearchOutlined className="text-gray-400" />}
                placeholder="Tìm kiếm ứng viên"
                className="w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              className="bg-[#DAF374] text-black border-none hover:bg-[#c5dd60]"
              onClick={() => setIsAddModalVisible(true)}
            >
              Thêm mới
            </Button>
          </div>

          {/* Kanban Board */}
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 'calc(100vh - 200px)' }}>
            {stages.map((stage, index) => (
              <div
                key={index}
                className="flex-none w-[300px] bg-[#F8F9FB] rounded-lg p-4"
              >
                {/* Stage Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{stage.title}</span>
                    <Badge 
                      count={stage.count} 
                      style={{ 
                        backgroundColor: '#F4F1FE',
                        color: '#7B61FF',
                        border: 'none'
                      }} 
                    />
                  </div>
                  <Button 
                    type="text" 
                    icon={<MoreOutlined />} 
                    className="hover:bg-gray-100"
                    onClick={() => setIsStageModalVisible(true)}
                  />
                </div>

                {/* Candidates List */}
                <div className="space-y-3">
                  {candidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className="bg-white rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{candidate.name}</h4>
                          <div className="text-xs text-gray-500 space-y-1">
                            <div className="flex items-center gap-1">
                              <span>📧</span>
                              <span>{candidate.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>📱</span>
                              <span>{candidate.phone}</span>
                            </div>
                          </div>
                        </div>
                        <Dropdown
                          trigger={['click']}
                          menu={{
                            items: [
                              {
                                key: '1',
                                label: 'Chỉnh sửa',
                              },
                              {
                                key: '2',
                                label: 'Xóa',
                                danger: true,
                              },
                            ],
                          }}
                          placement="bottomRight"
                        >
                          <Button
                            type="text"
                            icon={<MoreOutlined />}
                            className="hover:bg-gray-100"
                            onClick={handleMoreClick}
                          />
                        </Dropdown>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        <span>📅 {candidate.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Add Candidate Modal */}
          <Modal
            title="Thêm thông tin ứng viên mới"
            open={isAddModalVisible}
            onCancel={() => setIsAddModalVisible(false)}
            footer={null}
            width={500}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleAddCandidate}
              className="mt-4"
            >
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>

              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email' },
                  { type: 'email', message: 'Email không hợp lệ' }
                ]}
              >
                <Input placeholder="Nhập địa chỉ email" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item
                name="cv"
                label="CV"
                rules={[{ required: true, message: 'Vui lòng nhập link CV' }]}
              >
                <Input placeholder="Nhập link CV" />
              </Form.Item>

              <Form.Item
                name="notes"
                label="Ghi chú"
              >
                <TextArea rows={4} placeholder="Nhập ghi chú" />
              </Form.Item>

              <div className="flex justify-end gap-2">
                <Button onClick={() => setIsAddModalVisible(false)}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" className="bg-[#7B61FF] text-white">
                  Thêm
                </Button>
              </div>
            </Form>
          </Modal>

          {/* Add Stage Modal */}
          <Modal
            title="Thêm giai đoạn"
            open={isStageModalVisible}
            onCancel={() => setIsStageModalVisible(false)}
            footer={null}
            width={500}
          >
            <Form
              layout="vertical"
              className="mt-4"
            >
              <Form.Item
                name="stageName"
                label="Tên giai đoạn"
                rules={[{ required: true, message: 'Vui lòng nhập tên giai đoạn' }]}
              >
                <Input placeholder="Nhập tên giai đoạn" />
              </Form.Item>

              <div className="flex justify-end gap-2">
                <Button onClick={() => setIsStageModalVisible(false)}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" className="bg-[#7B61FF] text-white">
                  Thêm
                </Button>
              </div>
            </Form>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default JobsCandidates; 