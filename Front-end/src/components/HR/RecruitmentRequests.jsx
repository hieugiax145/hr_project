import React, { useEffect, useState } from 'react';
import { Layout, Spin, message } from 'antd';
import { FaPlus, FaFilter } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

const RecruitmentRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRequests();
  }, [currentPage]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/recruitment-requests?page=${currentPage}`);
      const data = await response.json();
      setRequests(data.requests);
      setTotalPages(data.totalPages);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu!');
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã nộp":
        return "text-[#656ED3] bg-[#F4F1FE] border border-[#656ED3] rounded-[25px] px-2 py-0.5 text-xs inline-block";
      case "Đang duyệt":
        return "text-[#FF9900] bg-[#FFF8F0] border border-[#FF9900] rounded-[25px] px-2 py-0.5 text-xs inline-block";
      case "Đã duyệt":
        return "text-[#00B300] bg-[#F0FFF0] border border-[#00B300] rounded-[25px] px-2 py-0.5 text-xs inline-block";
      case "Từ chối":
        return "text-[#FF0000] bg-[#FFF0F0] border border-[#FF0000] rounded-[25px] px-2 py-0.5 text-xs inline-block";
      default:
        return "text-black";
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Layout style={{ marginLeft: 282 }}>
        <Content style={{ margin: '80px 16px 24px', minHeight: 280 }}>
          {/* Header */}
          <div className="flex justify-between mb-4">
            <button className="bg-[#8D75F5] text-white px-4 py-2 rounded" onClick={() => navigate('create')}>
              <FaPlus size={16} /> Mới
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-auto">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Spin size="large" />
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F9FAFB]">
                    <th className="p-4 text-left">ID</th>
                    <th className="p-4 text-left">Người lập</th>
                    <th className="p-4 text-left">Người phụ trách</th>
                    <th className="p-4 text-left">Vị trí</th>
                    <th className="p-4 text-left">Số lượng</th>
                    <th className="p-4 text-left">Phòng</th>
                    <th className="p-4 text-left">Ngày tạo</th>
                    <th className="p-4 text-left">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="p-4">{request.id}</td>
                      <td className="p-4">{request.requester}</td>
                      <td className="p-4">{request.responsible}</td>
                      <td className="p-4">{request.position}</td>
                      <td className="p-4">{request.quantity}</td>
                      <td className="p-4">{request.department}</td>
                      <td className="p-4">{request.date}</td>
                      <td className="p-4">
                        <span className={getStatusColor(request.status)}>{request.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between p-4 border-t">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded"
            >
              <IoIosArrowBack size={16} /> Trước
            </button>

            <span>Trang {currentPage} / {totalPages}</span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded"
            >
              Sau <IoIosArrowForward size={16} />
            </button>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default RecruitmentRequests;
