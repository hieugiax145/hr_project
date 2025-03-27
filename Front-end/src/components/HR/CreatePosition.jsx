import React, { useState } from 'react';
import { Layout, Input, Select, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const { Content } = Layout;
const { TextArea } = Input;

const CreatePosition = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    level: '',
    experience: '',
    type: 'Full-time',
    mode: 'On-site',
    salary: '',
    description: '',
    requirements: '',
    benefits: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/positions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Tạo vị trí thành công!');
        navigate('/positions');
      } else {
        message.error(data.error || 'Có lỗi xảy ra khi tạo vị trí');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi tạo vị trí');
      console.error('Error creating position:', error);
    } finally {
      setLoading(false);
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
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Nhập vị trí tuyển dụng"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phòng ban
                  </label>
                  <Select
                    value={formData.department}
                    onChange={(value) => handleInputChange('department', value)}
                    placeholder="Chọn phòng ban"
                    className="w-full"
                    options={[
                      { value: 'it', label: 'Phòng IT' },
                      { value: 'marketing', label: 'Phòng Marketing' },
                      { value: 'hr', label: 'Phòng Nhân sự' },
                      { value: 'sales', label: 'Phòng Kinh doanh' }
                    ]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level
                  </label>
                  <Select
                    value={formData.level}
                    onChange={(value) => handleInputChange('level', value)}
                    placeholder="Chọn level"
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
                    onChange={(value) => handleInputChange('experience', value)}
                    placeholder="Chọn kinh nghiệm"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình thức làm việc
                  </label>
                  <div className="flex gap-4">
                    <Select
                      value={formData.type}
                      onChange={(value) => handleInputChange('type', value)}
                      className="w-1/2"
                      options={[
                        { value: 'Full-time', label: 'Full-time' },
                        { value: 'Part-time', label: 'Part-time' },
                        { value: 'Contract', label: 'Contract' }
                      ]}
                    />
                    <Select
                      value={formData.mode}
                      onChange={(value) => handleInputChange('mode', value)}
                      className="w-1/2"
                      options={[
                        { value: 'On-site', label: 'On-site' },
                        { value: 'Remote', label: 'Remote' },
                        { value: 'Hybrid', label: 'Hybrid' }
                      ]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mức lương (VNĐ)
                  </label>
                  <Input
                    value={formData.salary}
                    onChange={(e) => handleInputChange('salary', e.target.value)}
                    placeholder="Nhập mức lương"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold mb-4">Mô tả công việc</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả công việc
                  </label>
                  <TextArea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Nhập mô tả công việc"
                    rows={4}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Yêu cầu ứng viên
                  </label>
                  <TextArea
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    placeholder="Nhập yêu cầu ứng viên"
                    rows={4}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quyền lợi
                  </label>
                  <TextArea
                    value={formData.benefits}
                    onChange={(e) => handleInputChange('benefits', e.target.value)}
                    placeholder="Nhập quyền lợi"
                    rows={4}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <Button
                onClick={() => navigate('/positions')}
                className="px-6 hover:bg-gray-100"
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                className="px-6 bg-[#DAF374] text-black border-none hover:bg-[#c5dd60]"
                loading={loading}
              >
                Tạo vị trí
              </Button>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CreatePosition; 