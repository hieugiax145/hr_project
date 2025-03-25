import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import { FaPlus, FaFilter } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const { Content } = Layout;

const RecruitmentRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:8000/api/applications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching requests:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Có lỗi xảy ra khi tải dữ liệu');
        }
        setLoading(false);
      }
    };

    fetchRequests();
  }, [navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã nộp":
        return "text-[#7B61FF] bg-[#F4F1FE] border border-[#7B61FF] rounded-[25px] px-2 py-0.5 text-xs inline-block";
      case "Đang duyệt":
        return "text-[#FF9900] bg-[#FFF8F0] border border-[#FF9900] rounded-[25px] px-2 py-0.5 text-xs inline-block";
      case "Đã duyệt":
        return "text-[#00B300] bg-[#F0FFF0] border border-[#00B300] rounded-[25px] px-2 py-0.5 text-xs inline-block";
      case "Từ chối":
        return "text-[#FF0000] bg-[#FFF0F0] border border-[#FF0000] rounded-[25px] px-2 py-0.5 text-xs inline-block";
      case "Chờ nộp":
        return "text-[#7B61FF] bg-[#F4F1FE] border border-[#7B61FF] rounded-[25px] px-2 py-0.5 text-xs inline-block";
      default:
        return "text-[#7B61FF] bg-[#F4F1FE] border border-[#7B61FF] rounded-[25px] px-2 py-0.5 text-xs inline-block";
    }
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
        <Layout style={{ marginLeft: 282 }}>
          <Content style={{ margin: '80px 16px 24px' }}>
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#656ED3]"></div>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
        <Layout style={{ marginLeft: 282 }}>
          <Content style={{ margin: '80px 16px 24px' }}>
            <div className="flex justify-center items-center h-full">
              <div className="text-red-500">{error}</div>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }

  // Tính toán số trang
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = requests.slice(startIndex, endIndex);

  // Tạo mảng số trang
  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Layout style={{ marginLeft: 282 }}>
        <Content style={{ margin: '80px 16px 24px', minHeight: 280, maxHeight: 'calc(100vh - 104px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Header Actions - Outside of white container */}
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                <button className="flex items-center gap-2 bg-[#8D75F5] text-white px-4 py-2 rounded hover:bg-[#7152F3]" onClick={() => navigate('create')}>
                  <FaPlus size={16} />
                  <span>Mới</span>
                </button>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-[10px] hover:border-[#8D75F5] hover:text-[#8D75F5]">
                  <IoSettingsSharp size={16} />
                  <span>Thực hiện</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-[10px] hover:border-[#8D75F5] hover:text-[#8D75F5]">
                  <FaFilter size={14} />
                  <span>Bộ lọc</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm flex-1 flex flex-col">
            {/* Table */}
            <div className="overflow-y-auto flex-1">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F9FAFB]">
                    <th className="w-12 p-4 sticky top-0 bg-[#F9FAFB]">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600 sticky top-0 bg-[#F9FAFB]">ID phiếu</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600 sticky top-0 bg-[#F9FAFB]">Nhân sự lập phiếu</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600 sticky top-0 bg-[#F9FAFB]">Nhân sự phụ trách</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600 sticky top-0 bg-[#F9FAFB]">Vị trí</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600 sticky top-0 bg-[#F9FAFB]">Số lượng</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600 sticky top-0 bg-[#F9FAFB]">Phòng</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600 sticky top-0 bg-[#F9FAFB]">Ngày tạo</th>
                    <th className="p-4 text-left text-sm font-medium text-gray-600 sticky top-0 bg-[#F9FAFB]">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRequests.map((request) => (
                    <tr 
                      key={request.id} 
                      className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/hr/recruitment-requests/${request.id}`)}
                    >
                      <td className="p-4">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </td>
                      <td className="p-4 text-sm">{request.id}</td>
                      <td className="p-4 text-sm">{request.requester}</td>
                      <td className="p-4 text-sm">{request.responsible}</td>
                      <td className="p-4 text-sm">{request.position}</td>
                      <td className="p-4 text-sm">{request.quantity}</td>
                      <td className="p-4 text-sm">{request.department}</td>
                      <td className="p-4 text-sm">{request.date}</td>
                      <td className="p-4">
                        <span className={getStatusColor(request.status)}>{request.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 border-t bg-white">
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-[10px] hover:border-[#8D75F5] hover:text-[#8D75F5]"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <IoIosArrowBack size={16} />
                <span>Trước</span>
              </button>
              <div className="flex gap-3">
                {getPageNumbers().map((number, index) => (
                  number === '...' ? (
                    <span key={index} className="w-10 h-10 flex items-center justify-center text-gray-500">...</span>
                  ) : (
                    <button
                      key={index}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                        currentPage === number
                          ? 'bg-[#F9F5FF] text-[#7F56D9]'
                          : 'bg-white text-black'
                      }`}
                      onClick={() => setCurrentPage(number)}
                    >
                      {number}
                    </button>
                  )
                ))}
              </div>
              <button 
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-[10px] hover:border-[#8D75F5] hover:text-[#8D75F5]"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <span>Sau</span>
                <IoIosArrowForward size={16} />
              </button>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default RecruitmentRequests;