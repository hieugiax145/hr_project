import React, { useState, useEffect } from 'react';
import { Layout, Input, Select, Button, message, Modal } from 'antd';
import { FaArrowLeft, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Content } = Layout;
const { TextArea } = Input;

const CreatePosition = () => {
  const navigate = useNavigate();
  const [isPositionModalVisible, setIsPositionModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [availablePositions, setAvailablePositions] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    branch: 'Hà Nội',
    level: 'Thực tập sinh',
    experience: 'Dưới 1 năm',
    type: 'Full-time',
    mode: 'On-site',
    salary: '',
    description: '',
    requirements: '',
    benefits: ''
  });

  // Fetch available positions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          message.error('Vui lòng đăng nhập lại');
          navigate('/login');
          return;
        }

        // Fetch available positions (positions that haven't been added to the system yet)
        const availableResponse = await axios.get('http://localhost:8000/api/positions/available', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setAvailablePositions(availableResponse.data.data || []);
        
        console.log('Danh sách vị trí có sẵn:', availableResponse.data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        setAvailablePositions([]);
      }
    };

    fetchData();
  }, [navigate]);

  // Filter positions based on search term
  const filteredPositions = availablePositions.filter(position =>
    position.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    position.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePositionSelect = (position) => {
    setFormData(prev => ({
      ...prev,
      title: position.position,
      department: position.department
    }));
    setIsPositionModalVisible(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      await axios.post('http://localhost:8000/api/positions', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      message.success('Tạo vị trí tuyển dụng thành công');
      navigate('/positions');
    } catch (error) {
      console.error('Error creating position:', error);
      message.error('Có lỗi xảy ra khi tạo vị trí tuyển dụng');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Layout style={{ marginLeft: 282 }}>
        <Content style={{ margin: '80px 16px 24px', minHeight: 280, overflow: 'auto' }}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/positions')}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white hover:bg-gray-50"
            >
              <FaArrowLeft size={16} />
            </button>
            <h1 className="text-xl font-bold">Tạo vị trí tuyển dụng</h1>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4">Thông tin chung</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vị trí tuyển dụng
                  </label>
                  <Input
                    value={formData.title}
                    onClick={() => setIsPositionModalVisible(true)}
                    readOnly
                    placeholder="Chọn vị trí tuyển dụng"
                    className="w-full cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phòng ban
                  </label>
                  <Input
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="Nhập phòng ban"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chi nhánh
                  </label>
                  <Select
                    value={formData.branch}
                    onChange={(value) => handleSelectChange('branch', value)}
                    className="w-full"
                    options={[
                      { value: 'Hà Nội', label: 'Hà Nội' },
                      { value: 'Hồ Chí Minh', label: 'Hồ Chí Minh' },
                      { value: 'Đà Nẵng', label: 'Đà Nẵng' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cấp bậc
                  </label>
                  <Select
                    value={formData.level}
                    onChange={(value) => handleSelectChange('level', value)}
                    className="w-full"
                    options={[
                      { value: 'Thực tập sinh', label: 'Thực tập sinh' },
                      { value: 'Junior', label: 'Junior' },
                      { value: 'Middle', label: 'Middle' },
                      { value: 'Senior', label: 'Senior' },
                      { value: 'Leader', label: 'Leader' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kinh nghiệm
                  </label>
                  <Select
                    value={formData.experience}
                    onChange={(value) => handleSelectChange('experience', value)}
                    className="w-full"
                    options={[
                      { value: 'Dưới 1 năm', label: 'Dưới 1 năm' },
                      { value: '1-2 năm', label: '1-2 năm' },
                      { value: '2-3 năm', label: '2-3 năm' },
                      { value: '3-5 năm', label: '3-5 năm' },
                      { value: 'Trên 5 năm', label: 'Trên 5 năm' }
                    ]}
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4">Thông tin chi tiết</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại hình
                  </label>
                  <Select
                    value={formData.type}
                    onChange={(value) => handleSelectChange('type', value)}
                    className="w-full"
                    options={[
                      { value: 'Full-time', label: 'Full-time' },
                      { value: 'Part-time', label: 'Part-time' },
                      { value: 'Contract', label: 'Contract' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình thức làm việc
                  </label>
                  <Select
                    value={formData.mode}
                    onChange={(value) => handleSelectChange('mode', value)}
                    className="w-full"
                    options={[
                      { value: 'On-site', label: 'On-site' },
                      { value: 'Remote', label: 'Remote' },
                      { value: 'Hybrid', label: 'Hybrid' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mức lương
                  </label>
                  <Input
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="Nhập mức lương"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả công việc
                  </label>
                  <TextArea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Nhập mô tả công việc"
                    className="w-full"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yêu cầu
                  </label>
                  <TextArea
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    placeholder="Nhập yêu cầu"
                    className="w-full"
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quyền lợi
                  </label>
                  <TextArea
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleInputChange}
                    placeholder="Nhập quyền lợi"
                    className="w-full"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex justify-end">
              <Button
                type="primary"
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Tạo vị trí
              </Button>
            </div>
          </div>

          {/* Position Selection Modal */}
          <Modal
            title="Chọn vị trí tuyển dụng"
            open={isPositionModalVisible}
            onCancel={() => setIsPositionModalVisible(false)}
            footer={null}
            width={800}
          >
            <div className="mb-4">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm vị trí..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {filteredPositions.length > 0 ? (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Vị trí tuyển dụng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPositions.map((position, index) => (
                      <tr
                        key={index}
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        onClick={() => handlePositionSelect(position)}
                      >
                        <td className="px-4 py-2 text-sm">
                          {position.position} - {position.department}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Không có Yêu cầu tuyển dụng nào
                </div>
              )}
            </div>
          </Modal>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CreatePosition; 