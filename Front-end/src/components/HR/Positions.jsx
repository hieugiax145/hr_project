import React, { useState } from 'react';
import { Layout, Input, Select, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

const Positions = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const positions = [
    {
      id: 'YCTD-01',
      title: 'Giáo Viên Data Analyst',
      department: 'Phòng Đào Tạo',
      level: 'Mid-level',
      experience: '1-2 năm kinh nghiệm',
      type: 'Full-time',
      mode: 'On-site',
      salary: '25 triệu',
      applicants: '01',
      status: 'Còn tuyển'
    },
    {
      id: 'YCTD-02',
      title: 'Chuyên viên tuyển dụng',
      department: 'Cung ứng nguồn nhân lực',
      level: 'Mid-level',
      experience: '0-1 năm kinh nghiệm',
      type: 'Full-time',
      mode: 'On-site',
      salary: '8 - 10 triệu',
      applicants: '04',
      status: 'Còn tuyển'
    },
    {
      id: 'YCTD-03',
      title: 'Marketing Executive',
      department: 'Marketing',
      level: 'Mid-level',
      experience: '0-2 Years Experience',
      type: 'Full-time',
      mode: 'On-site',
      salary: '8 - 10 triệu',
      applicants: '04',
      status: 'Nhập'
    },
    {
      id: 'YCTD-04',
      title: 'Kế Toán',
      department: 'Kế toán',
      level: 'Mid-level',
      experience: '1-2 năm kinh nghiệm',
      type: 'Full-time',
      mode: 'On-site',
      salary: '8 - 10 triệu',
      applicants: '10',
      status: 'Còn tuyển'
    },
    {
      id: 'YCTD-05',
      title: 'Giáo Viên Tiếng Nhật',
      department: 'Phòng Đào Tạo',
      level: 'Senior-level',
      experience: '2-3 năm kinh nghiệm',
      type: 'Full-time',
      mode: 'On-site',
      salary: '15 - 20 triệu',
      applicants: '03',
      status: 'Còn tuyển'
    },
    {
      id: 'YCTD-06',
      title: 'Nhân Viên IT Support',
      department: 'IT',
      level: 'Junior-level',
      experience: '0-1 năm kinh nghiệm',
      type: 'Full-time',
      mode: 'On-site',
      salary: '7 - 9 triệu',
      applicants: '06',
      status: 'Nhập'
    },
    {
      id: 'YCTD-07',
      title: 'Chuyên Viên Content',
      department: 'Marketing',
      level: 'Mid-level',
      experience: '1-2 năm kinh nghiệm',
      type: 'Full-time',
      mode: 'Remote',
      salary: '10 - 12 triệu',
      applicants: '08',
      status: 'Còn tuyển'
    },
    {
      id: 'YCTD-08',
      title: 'Trưởng Phòng Kinh Doanh',
      department: 'Kinh Doanh',
      level: 'Senior-level',
      experience: '5+ năm kinh nghiệm',
      type: 'Full-time',
      mode: 'On-site',
      salary: '30 - 35 triệu',
      applicants: '02',
      status: 'Còn tuyển'
    }
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Còn tuyển':
        return 'bg-[#E7F6EC] text-[#12B76A] border border-[#12B76A]';
      case 'Nhập':
        return 'bg-[#FFF3E8] text-[#F79009] border border-[#F79009]';
      case 'Tạm dừng':
        return 'bg-[#FEE4E2] text-[#F04438] border border-[#F04438]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Tính toán các vị trí hiển thị cho trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPositions = positions.slice(startIndex, endIndex);

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Layout style={{ marginLeft: 282 }}>
        <Content style={{ margin: '80px 16px 24px', minHeight: 280, maxHeight: 'calc(100vh - 104px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Search and Filters */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-[400px]">
                <Input
                  placeholder="Tìm vị trí tuyển dụng"
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200"
                />
              </div>
              <Select
                defaultValue="all"
                style={{ width: 120 }}
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'full-time', label: 'Full-time' },
                  { value: 'part-time', label: 'Part-time' },
                  { value: 'contract', label: 'Contract' }
                ]}
                className="h-10"
              />
              <Select
                defaultValue="all"
                style={{ width: 120 }}
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'on-site', label: 'On-site' },
                  { value: 'remote', label: 'Remote' },
                  { value: 'hybrid', label: 'Hybrid' }
                ]}
                className="h-10"
              />
            </div>
            <button
              onClick={() => navigate('/positions/create')}
              className="flex items-center gap-2 px-4 py-2 bg-[#DAF374] text-black rounded-lg hover:bg-[#c5dd60] transition-colors"
            >
              <FaPlus size={16} />
              <span>Thêm mới</span>
            </button>
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto pb-6">
            {currentPositions.map((position, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:border-[#7B61FF] transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-medium text-[#1A1A1A] mb-1">{position.title}</h3>
                    <p className="text-sm text-gray-500">{position.department}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(position.status)}`}>
                    {position.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Level:</span>
                    <span className="text-sm">{position.level}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Kinh nghiệm:</span>
                    <span className="text-sm">{position.experience}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                    {position.type}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                    {position.mode}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-[#7B61FF] font-medium">đ {position.salary}</div>
                  <div className="text-sm text-gray-500">{position.applicants} ứng viên</div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 px-2 bg-white p-4 rounded-lg">
            <div className="text-sm text-gray-600">
              Hiển thị {currentPositions.length} trên {positions.length} vị trí
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-black bg-white text-black hover:bg-gray-50 disabled:opacity-50"
              >
                ←
              </button>
              {Array.from({ length: Math.ceil(positions.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded border border-black ${
                    page === currentPage
                      ? 'bg-[#DAF374] text-black border-[#DAF374]'
                      : 'bg-white text-black hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(positions.length / itemsPerPage), prev + 1))}
                disabled={currentPage === Math.ceil(positions.length / itemsPerPage)}
                className="px-3 py-1 rounded border border-black bg-white text-black hover:bg-gray-50 disabled:opacity-50"
              >
                →
              </button>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Positions; 