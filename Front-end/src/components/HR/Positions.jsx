import React, { useState, useEffect } from 'react';
import { Layout, Input, Select, message, Dropdown, Modal } from 'antd';
import { SearchOutlined, MoreOutlined } from '@ant-design/icons';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Content } = Layout;
const API_BASE_URL = 'http://localhost:8000/api';

const Positions = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchPositions();
  }, [currentPage, searchQuery, typeFilter, modeFilter]);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(searchQuery && { search: searchQuery }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(modeFilter !== 'all' && { mode: modeFilter })
      });

      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập lại');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/positions?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200) {
        setPositions(response.data.positions || []);
        setTotalPages(Math.ceil((response.data.total || 0) / itemsPerPage));
      }
    } catch (error) {
      console.error('Error fetching positions:', error);
      
      if (error.response) {
        message.error(error.response.data?.message || 'Có lỗi xảy ra khi tải dữ liệu từ server');
      } else if (error.request) {
        message.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau');
      } else {
        message.error('Có lỗi xảy ra. Vui lòng thử lại sau');
      }
    } finally {
      setLoading(false);
    }
  };

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

  const handlePositionClick = (position) => {
    if (selectedPosition?._id === position._id) {
      setSelectedPosition(null);
    } else {
      setSelectedPosition(position);
    }
  };

  const handleEdit = (position) => {
    navigate(`/positions/edit/${position._id}`, { state: { position } });
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/positions/${positionToDelete._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 200) {
        message.success('Xóa vị trí thành công');
        fetchPositions();
        setDeleteModalVisible(false);
        setPositionToDelete(null);
        if (selectedPosition?._id === positionToDelete._id) {
          setSelectedPosition(null);
        }
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa vị trí');
      console.error('Error deleting position:', error);
    }
  };

  const getDropdownItems = (position) => ({
    items: [
      {
        key: '1',
        label: 'Sửa vị trí',
        onClick: () => handleEdit(position)
      },
      {
        key: '2',
        label: 'Xóa vị trí',
        danger: true,
        onClick: () => {
          setPositionToDelete(position);
          setDeleteModalVisible(true);
        }
      }
    ]
  });

  const handleCardClick = (e, position) => {
    if (e.target.closest('.action-button') || e.target.closest('.applicants-count')) {
      return;
    }
    handlePositionClick(position);
  };

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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={typeFilter}
                onChange={setTypeFilter}
                style={{ width: 120 }}
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'Full-time', label: 'Full-time' },
                  { value: 'Part-time', label: 'Part-time' },
                  { value: 'Contract', label: 'Contract' }
                ]}
                className="h-10"
              />
              <Select
                value={modeFilter}
                onChange={setModeFilter}
                style={{ width: 120 }}
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'On-site', label: 'On-site' },
                  { value: 'Remote', label: 'Remote' },
                  { value: 'Hybrid', label: 'Hybrid' }
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

          <div className="flex gap-6 overflow-hidden">
          {/* Job Cards Grid */}
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B61FF]"></div>
              </div>
            ) : (
              <div className={`flex-1 overflow-y-auto pb-6 ${selectedPosition ? 'pr-4' : ''}`}>
                {/* Positions List */}
                <div className={`${selectedPosition ? 'space-y-4' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
            {positions.map((position) => (
              <div
                key={position._id}
                      className={`bg-white rounded-lg p-4 border transition-colors cursor-pointer relative ${
                        selectedPosition?._id === position._id 
                          ? 'border-[#7B61FF]' 
                          : 'border-gray-200 hover:border-[#7B61FF]'
                      }`}
                      onClick={(e) => handleCardClick(e, position)}
                    >
                      <div className="absolute top-2 right-4">
                        <button className={`px-3 py-1.5 rounded-full text-xs ${getStatusStyle(position.status)}`}>
                          {position.status}
                        </button>
                      </div>

                      <div className="flex items-start gap-3 mt-6">
                        <div className="w-10 h-10 bg-[#F4F1FE] text-[#7B61FF] rounded-lg flex items-center justify-center text-lg font-medium">
                          {position.title.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-[#1A1A1A] text-base">{position.title}</h3>
                            <Dropdown
                              menu={getDropdownItems(position)}
                              trigger={['click']}
                              placement="bottomRight"
                            >
                              <button 
                                className="text-base text-gray-500 hover:text-gray-700 bg-[#F4F1FE] w-8 h-8 rounded-lg flex items-center justify-center action-button"
                                onClick={(e) => e.stopPropagation()} 
                              >
                                ⋮
                              </button>
                            </Dropdown>
                          </div>
                          <p className="text-sm text-gray-500">{position.department}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 ml-[52px] mt-3">
                        <span className="px-3 py-1 bg-gray-50 rounded-full text-xs text-gray-600">
                          {position.level}
                        </span>
                        <span className="px-3 py-1 bg-gray-50 rounded-full text-xs text-gray-600">
                          {position.experience}
                        </span>
                        <span className="px-3 py-1 bg-gray-50 rounded-full text-xs text-gray-600">
                          {position.type}
                        </span>
                        <span className="px-3 py-1 bg-gray-50 rounded-full text-xs text-gray-600">
                          {position.mode}
                        </span>
                      </div>

                      <div className="flex justify-between items-center mt-3 ml-[52px]">
                        <div className="text-[#7B61FF] font-medium">đ {position.salary}</div>
                        <div 
                          className="text-sm text-gray-500 cursor-pointer hover:text-[#7B61FF] applicants-count"
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            try {
                              const token = localStorage.getItem('token');
                              if (!token) {
                                message.error('Vui lòng đăng nhập lại');
                                return;
                              }
                              // Kiểm tra position tồn tại trước khi chuyển trang
                              const response = await axios.get(`${API_BASE_URL}/positions/${position._id}`, {
                                headers: {
                                  'Authorization': `Bearer ${token}`
                                }
                              });
                              if (response.status === 200) {
                                navigate(`/positions/${position._id}/candidates`);
                              }
                            } catch (error) {
                              if (error.response?.status === 401) {
                                message.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
                              } else {
                                message.error('Có lỗi xảy ra. Vui lòng thử lại sau');
                              }
                            }
                          }}
                        >
                          {position.applicants} ứng viên
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Position Detail Panel */}
            {selectedPosition && (
              <div className="w-[400px] bg-white rounded-lg p-6 overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-xs bg-[#F4F1FE] text-[#7B61FF] px-2 py-1 rounded-md inline-block mb-2">
                      ID VTTD: {selectedPosition._id}
                    </div>
                    <h2 className="text-xl font-semibold mb-1">{selectedPosition.title}</h2>
                  </div>
                  <button className="px-3 py-1 bg-[#DAF374] text-black rounded-lg text-sm">
                    Còn tuyển
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Level</div>
                    <div className="font-medium">{selectedPosition.level}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Kinh nghiệm</div>
                    <div className="font-medium">{selectedPosition.experience}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Hình thức làm việc</div>
                    <div className="font-medium">{selectedPosition.type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Mô hình làm việc</div>
                    <div className="font-medium">{selectedPosition.mode}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Mức lương</div>
                    <div className="font-medium text-[#7B61FF]">đ {selectedPosition.salary}</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Mô tả công việc</h3>
                    <div className="text-sm whitespace-pre-line">{selectedPosition.description}</div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Yêu cầu ứng viên</h3>
                    <div className="text-sm whitespace-pre-line">{selectedPosition.requirements}</div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Quyền lợi</h3>
                    <div className="text-sm whitespace-pre-line">{selectedPosition.benefits}</div>
                </div>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 px-2 bg-white p-4 rounded-lg">
            <div className="text-sm text-gray-600">
              Hiển thị {positions.length} vị trí
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-black bg-white text-black hover:bg-gray-50 disabled:opacity-50"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-black bg-white text-black hover:bg-gray-50 disabled:opacity-50"
              >
                →
              </button>
            </div>
          </div>
        </Content>
      </Layout>

      <Modal
        title={<div className="text-lg">Xoá vị trí tuyển dụng</div>}
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setPositionToDelete(null);
        }}
        okText="Xoá"
        cancelText="Huỷ"
        okButtonProps={{ 
          danger: true,
          className: 'bg-[#EF4444] hover:bg-[#DC2626] text-white' 
        }}
        cancelButtonProps={{
          className: 'border-gray-200 text-gray-700'
        }}
        className="custom-delete-modal"
      >
        <p className="text-base mb-2">Bạn có chắc muốn xoá vị trí này không?</p>
        {positionToDelete && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F4F1FE] text-[#7B61FF] rounded-lg flex items-center justify-center text-lg font-medium">
                {positionToDelete.title.charAt(0)}
              </div>
              <div>
                <h4 className="font-medium text-[#1A1A1A]">{positionToDelete.title}</h4>
                <p className="text-sm text-gray-500">{positionToDelete.department}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Positions; 