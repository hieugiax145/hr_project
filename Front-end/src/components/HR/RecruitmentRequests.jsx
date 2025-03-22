import React from 'react';
import { Layout } from 'antd';
import { FaPlus, FaFilter } from 'react-icons/fa';
import { IoSettingsSharp } from 'react-icons/io5';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;

const RecruitmentRequests = () => {
  const navigate = useNavigate();
  const requests = [
    {
      id: 2,
      requester: "Nguyễn Văn An",
      responsible: "Nguyễn Văn An",
      position: "Trưởng phòng",
      quantity: 1,
      department: "Phòng Marketing",
      date: "15:00 - 23/07/2024",
      status: "Đã nộp"
    },
    {
      id: 5,
      requester: "Nguyễn Văn An",
      responsible: "Nguyễn Văn An",
      position: "Trưởng phòng",
      quantity: 2,
      department: "Phòng Đào tạo",
      date: "15:00 - 23/07/2024",
      status: "Đã nộp"
    },
    {
      id: 14,
      requester: "Nguyễn Văn An",
      responsible: "Nguyễn Văn An",
      position: "Giám đốc kinh doanh",
      quantity: 3,
      department: "Phòng Marketing",
      date: "15:00 - 23/07/2024",
      status: "Đang duyệt"
    },
    {
      id: 15,
      requester: "Nguyễn Văn An",
      responsible: "Nguyễn Văn An",
      position: "Trưởng phòng",
      quantity: 1,
      department: "Phòng Marketing",
      date: "15:00 - 23/07/2024",
      status: "Đã duyệt"
    },
    {
      id: 16,
      requester: "Nguyễn Văn An",
      responsible: "Nguyễn Văn An",
      position: "Giám đốc kinh doanh",
      quantity: 2,
      department: "Phòng Đào tạo",
      date: "15:00 - 23/07/2024",
      status: "Từ chối"
    },
    {
      id: 17,
      requester: "Nguyễn Văn An",
      responsible: "Nguyễn Văn An",
      position: "Trưởng phòng",
      quantity: 3,
      department: "Phòng Marketing",
      date: "15:00 - 23/07/2024",
      status: "Từ chối"
    },
    {
      id: 18,
      requester: "Nguyễn Văn An",
      responsible: "Nguyễn Văn An",
      position: "Trưởng phòng",
      quantity: 2,
      department: "Phòng Đào tạo",
      date: "15:00 - 23/07/2024",
      status: "Từ chối"
    },
    {
      id: 19,
      requester: "Nguyễn Văn An",
      responsible: "Nguyễn Văn An",
      position: "Trưởng phòng",
      quantity: 1,
      department: "Phòng Đào tạo",
      date: "15:00 - 23/07/2024",
      status: "Từ chối"
    },
    {
      id: 55,
      requester: "Nguyễn Văn An",
      responsible: "Nguyễn Văn An",
      position: "Trưởng phòng",
      quantity: 1,
      department: "Phòng Đào tạo",
      date: "15:00 - 23/07/2024",
      status: "Từ chối"
    },
    {
      id: 88,
      requester: "Nguyễn Văn An",
      responsible: "Nguyễn Văn An",
      position: "Trưởng phòng",
      quantity: 2,
      department: "Phòng Đào tạo",
      date: "15:00 - 23/07/2024",
      status: "Từ chối"
    }
  ];

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
                  {requests.map((request) => (
                    <tr key={request.id} className="border-b last:border-b-0 hover:bg-gray-50">
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
                      <td className={getStatusColor(request.status)}>
                        {request.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center p-4 border-t bg-white">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-[10px] hover:border-[#8D75F5] hover:text-[#8D75F5]">
                <IoIosArrowBack size={16} />
                <span>Trước</span>
              </button>
              <div className="flex gap-3">
                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#F9F5FF] text-[#7F56D9]">
                  1
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-black">
                  2
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-black">
                  3
                </button>
                <span className="w-10 h-10 flex items-center justify-center text-gray-500">...</span>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-black">
                  8
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-black">
                  9
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-white text-black">
                  10
                </button>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-[10px] hover:border-[#8D75F5] hover:text-[#8D75F5]">
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