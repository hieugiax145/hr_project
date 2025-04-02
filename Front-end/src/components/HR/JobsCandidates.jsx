import React, { useState, useEffect } from 'react';
import { Layout, Input, Select, Button, Dropdown, Menu, Badge, message, Modal, Form, Upload } from 'antd';
import { SearchOutlined, MoreOutlined, PlusOutlined, InboxOutlined } from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';

const { Content } = Layout;
const { TextArea } = Input;
const API_BASE_URL = 'http://localhost:8000/api';

const JobsCandidates = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [stages, setStages] = useState([]);
  const [form] = Form.useForm();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [editForm] = Form.useForm();

  // Fetch position và candidates
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          message.error('Vui lòng đăng nhập lại');
          navigate('/login');
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // Fetch position
        const positionResponse = await axios.get(`${API_BASE_URL}/positions/${id}`, { headers });
        if (positionResponse.status === 200) {
          setPosition(positionResponse.data.data);
        }

        // Fetch candidates
        const candidatesResponse = await axios.get(`${API_BASE_URL}/positions/${id}/candidates`, { headers });
        if (candidatesResponse.status === 200) {
          const candidatesData = candidatesResponse.data.candidates || [];
          setCandidates(candidatesData);

          // Tính toán số lượng ứng viên cho mỗi stage
          const stageCounts = {};
          candidatesData.forEach(candidate => {
            stageCounts[candidate.stage] = (stageCounts[candidate.stage] || 0) + 1;
          });

          // Cập nhật stages với số lượng thực tế
          const updatedStages = [
            { title: 'Tiếp nhận hồ sơ', key: 'new', count: stageCounts['new'] || 0 },
            { title: 'Hồ sơ đề xuất', key: 'reviewing', count: stageCounts['reviewing'] || 0 },
            { title: 'Phỏng vấn lần 1', key: 'interview1', count: stageCounts['interview1'] || 0 },
            { title: 'Phỏng vấn lần 2', key: 'interview2', count: stageCounts['interview2'] || 0 },
            { title: 'Offer', key: 'offer', count: stageCounts['offer'] || 0 },
            { title: 'Tuyển', key: 'hired', count: stageCounts['hired'] || 0 },
            { title: 'Từ chối', key: 'rejected', count: stageCounts['rejected'] || 0 }
          ];
          setStages(updatedStages);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          message.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
          navigate('/login');
        } else {
          message.error('Có lỗi xảy ra khi tải dữ liệu');
          navigate('/positions');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleAddCandidate = async (values) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      // Kiểm tra xem có file CV được chọn không
      if (!values.cv?.fileList?.[0]?.originFileObj) {
        message.error('Vui lòng upload CV');
        return;
      }

      // Tạo FormData để gửi file
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('email', values.email);
      formData.append('phone', values.phone);
      formData.append('source', values.source);
      if (values.source === 'Khác') {
        formData.append('customSource', values.customSource);
      }

      // Lấy file từ fileList và kiểm tra kích thước
      const file = values.cv.fileList[0].originFileObj;
      if (file.size > 5 * 1024 * 1024) { // 5MB
        message.error('File không được vượt quá 5MB');
        return;
      }
      formData.append('cv', file);

      if (values.notes) {
        formData.append('notes', values.notes);
      }

      const response = await axios.post(
        `${API_BASE_URL}/positions/${id}/candidates`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 201) {
        message.success('Thêm ứng viên thành công');
        setIsAddModalVisible(false);
        form.resetFields();
        
        // Refresh candidates list
        const candidatesResponse = await axios.get(`${API_BASE_URL}/positions/${id}/candidates`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (candidatesResponse.status === 200) {
          setCandidates(candidatesResponse.data.candidates || []);
        }
      }
    } catch (error) {
      console.error('Error adding candidate:', error);
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
        navigate('/login');
      } else {
        const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi thêm ứng viên';
        console.error('Error details:', error.response?.data);
        message.error(errorMessage);
      }
    }
  };

  const handleUpdateCandidateStatus = async (candidateId, newStage) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập lại');
        return;
      }

      const response = await axios.patch(
        `${API_BASE_URL}/candidates/${candidateId}/status`,
        { stage: newStage },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        message.success('Cập nhật trạng thái thành công');
        // Refresh candidates list
        const candidatesResponse = await axios.get(`${API_BASE_URL}/positions/${id}/candidates`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (candidatesResponse.status === 200) {
          setCandidates(candidatesResponse.data.candidates || []);
        }
      }
    } catch (error) {
      console.error('Error updating candidate status:', error);
      message.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const handleDeleteCandidate = async (candidateId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập lại');
        return;
      }

      const response = await axios.delete(`${API_BASE_URL}/candidates/${candidateId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        message.success('Xóa ứng viên thành công');
        // Refresh candidates list
        const candidatesResponse = await axios.get(`${API_BASE_URL}/positions/${id}/candidates`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (candidatesResponse.status === 200) {
          setCandidates(candidatesResponse.data.candidates || []);
        }
      }
    } catch (error) {
      console.error('Error deleting candidate:', error);
      message.error('Có lỗi xảy ra khi xóa ứng viên');
    }
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
  };

  const handleEditCandidate = (candidate) => {
    setEditingCandidate(candidate);
    editForm.setFieldsValue({
      name: candidate.name,
      email: candidate.email,
      phone: candidate.phone,
      source: candidate.source,
      customSource: candidate.customSource,
      notes: candidate.notes
    });
    setIsEditModalVisible(true);
  };

  const handleUpdateCandidate = async (values) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập lại');
        return;
      }

      const response = await axios.patch(
        `${API_BASE_URL}/candidates/${editingCandidate._id}`,
        values,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        message.success('Cập nhật thông tin ứng viên thành công');
        setIsEditModalVisible(false);
        editForm.resetFields();
        
        // Refresh candidates list
        const candidatesResponse = await axios.get(`${API_BASE_URL}/positions/${id}/candidates`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (candidatesResponse.status === 200) {
          setCandidates(candidatesResponse.data.candidates || []);
        }
      }
    } catch (error) {
      console.error('Error updating candidate:', error);
      message.error('Có lỗi xảy ra khi cập nhật thông tin ứng viên');
    }
  };

  // Filter candidates by search term
  const filteredCandidates = candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.phone.includes(searchTerm)
  );

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
            {stages.map((stage) => (
              <div
                key={stage.key}
                className="flex-none w-[300px] bg-[#D5CCFF] rounded-2xl p-4"
              >
                {/* Stage Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{stage.title}</span>
                    <Badge 
                      count={stage.count} 
                      style={{ 
                        backgroundColor: '#F4F1FE',
                        color: '#FFFFF',
                        border: 'none'
                      }} 
                    />
                  </div>
                </div>

                {/* Candidates List */}
                <div className="space-y-3">
                  {filteredCandidates
                    .filter(candidate => candidate.stage === stage.key)
                    .map((candidate) => (
                      <div
                        key={candidate._id}
                        className="bg-[#F4F2FF] rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
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
                              {candidate.cv && (
                                <div className="flex items-center gap-1">
                                  <span>📄</span>
                                  <a href={candidate.cv.url} target="_blank" rel="noopener noreferrer" className="text-[#7B61FF] hover:underline">
                                    Xem CV
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                          <Dropdown
                            trigger={['click']}
                            menu={{
                              items: [
                                {
                                  key: '1',
                                  label: 'Chỉnh sửa',
                                  onClick: () => handleEditCandidate(candidate)
                                },
                                {
                                  key: '2',
                                  label: 'Xóa',
                                  danger: true,
                                  onClick: () => handleDeleteCandidate(candidate._id)
                                },
                                ...stages
                                  .filter(s => s.key !== stage.key)
                                  .map(s => ({
                                    key: `move-${s.key}`,
                                    label: `Chuyển đến ${s.title}`,
                                    onClick: () => handleUpdateCandidateStatus(candidate._id, s.key)
                                  }))
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
                          <span>📅 {new Date(candidate.createdAt).toLocaleDateString('vi-VN')}</span>
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
                label="Tên ứng viên"
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
                name="source"
                label="Nguồn"
                rules={[{ required: true, message: 'Vui lòng chọn nguồn' }]}
              >
                <Select placeholder="Chọn nguồn CV">
                  <Select.Option value="Facebook">Facebook</Select.Option>
                  <Select.Option value="Email">Email</Select.Option>
                  <Select.Option value="JobsGo">JobsGo</Select.Option>
                  <Select.Option value="Khác">Khác</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.source !== currentValues.source}
              >
                {({ getFieldValue }) => 
                  getFieldValue('source') === 'Khác' ? (
                    <Form.Item
                      name="customSource"
                      label="Nguồn khác"
                      rules={[{ required: true, message: 'Vui lòng nhập nguồn' }]}
                    >
                      <Input placeholder="Nhập nguồn" />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>

              <Form.Item
                name="cv"
                label="CV ứng viên"
                valuePropName="file"
                getValueFromEvent={(e) => ({
                  fileList: Array.isArray(e) ? e : e && e.fileList,
                })}
                rules={[{ required: true, message: 'Vui lòng upload CV' }]}
              >
                <Upload.Dragger
                  name="cv"
                  maxCount={1}
                  beforeUpload={(file) => {
                    const isLt5M = file.size / 1024 / 1024 < 5;
                    if (!isLt5M) {
                      message.error('File phải nhỏ hơn 5MB');
                      return Upload.LIST_IGNORE;
                    }
                    return false; // Prevent auto upload
                  }}
                  onChange={(info) => {
                    if (info.file.status === 'removed') {
                      form.setFieldValue('cv', undefined);
                    }
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click hoặc kéo thả file vào đây</p>
                  <p className="ant-upload-hint">Tối đa 5MB</p>
                </Upload.Dragger>
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

          {/* Edit Candidate Modal */}
          <Modal
            title="Chỉnh sửa thông tin ứng viên"
            open={isEditModalVisible}
            onCancel={() => setIsEditModalVisible(false)}
            footer={null}
            width={500}
          >
            <Form
              form={editForm}
              layout="vertical"
              onFinish={handleUpdateCandidate}
              className="mt-4"
            >
              <Form.Item
                name="name"
                label="Tên ứng viên"
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
                name="source"
                label="Nguồn ứng viên"
                rules={[{ required: true, message: 'Vui lòng chọn nguồn ứng viên' }]}
              >
                <Select placeholder="Chọn nguồn ứng viên">
                  <Select.Option value="Facebook">Facebook</Select.Option>
                  <Select.Option value="Email">Email</Select.Option>
                  <Select.Option value="JobsGo">JobsGo</Select.Option>
                  <Select.Option value="Khác">Khác</Select.Option>
                </Select>
              </Form.Item>

              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) => prevValues.source !== currentValues.source}
              >
                {({ getFieldValue }) =>
                  getFieldValue('source') === 'Khác' ? (
                    <Form.Item
                      name="customSource"
                      label="Nguồn khác"
                      rules={[{ required: true, message: 'Vui lòng nhập nguồn khác' }]}
                    >
                      <Input placeholder="Nhập nguồn khác" />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>

              <Form.Item
                name="notes"
                label="Ghi chú"
              >
                <TextArea placeholder="Nhập ghi chú" rows={4} />
              </Form.Item>

              <div className="flex justify-end gap-2">
                <Button onClick={() => setIsEditModalVisible(false)}>
                  Hủy
                </Button>
                <Button type="primary" htmlType="submit" className="bg-[#7B61FF] text-white">
                  Cập nhật
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