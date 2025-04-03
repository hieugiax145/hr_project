import React, { useState } from 'react';
import { Layout, Button, Typography, Table, Input, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import Topbar from '../Topbar/Topbar';
import Sidebar from '../Sidebar/Sidebar';

const { Title } = Typography;
const { Content } = Layout;
const { TextArea } = Input;

const EvaluationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Cấu trúc cột cho bảng đánh giá
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 50,
      render: (text, record, index) => index + 1,
      className: 'bg-[#8B1C1C] text-white',
    },
    {
      title: 'Các hạng mục công việc được giao',
      dataIndex: 'task',
      key: 'task',
      width: '20%',
      className: 'bg-[#8B1C1C] text-white',
    },
    {
      title: 'Chi tiết công việc',
      dataIndex: 'details',
      key: 'details',
      width: '20%',
      className: 'bg-[#8B1C1C] text-white',
    },
    {
      title: 'Kết quả công việc (chỉ tiết)',
      dataIndex: 'results',
      key: 'results',
      width: '20%',
      className: 'bg-[#8B1C1C] text-white',
    },
    {
      title: 'Mức độ hoàn thành',
      dataIndex: 'completion',
      key: 'completion',
      width: '15%',
      className: 'bg-[#8B1C1C] text-white',
    },
    {
      title: 'Nhận xét chi tiết',
      dataIndex: 'comments',
      key: 'comments',
      width: '15%',
      className: 'bg-[#8B1C1C] text-white',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      width: '10%',
      className: 'bg-[#8B1C1C] text-white',
    },
  ];

  const [dataSource] = useState([
    { key: '1', task: '', details: '', results: '', completion: '*', comments: '', notes: '' },
    { key: '2', task: '', details: '', results: '', completion: '*', comments: '', notes: '' },
    { key: '3', task: '', details: '', results: '', completion: '*', comments: '', notes: '' },
    { key: '4', task: '', details: '', results: '', completion: '*', comments: '', notes: '' },
  ]);

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Sidebar />
      <Layout style={{ marginLeft: 282 }}>
        <Topbar />
        <Content style={{ margin: '80px 16px 24px', minHeight: 280 }}>
          <div className="bg-white rounded-lg shadow p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button 
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate(`/notifications/${id}`)}
                >
                  Quay lại
                </Button>
                <Title level={4} className="m-0">Đánh giá kết quả thử việc</Title>
              </div>
              <Space>
                <Button className="border-none text-black bg-white hover:bg-gray-100">
                  Hủy
                </Button>
                <Button className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border-none">
                  Lưu
                </Button>
                <Button className="bg-[#DAF374] hover:bg-[#c5dd60] text-black border-none">
                  Xuất file
                </Button>
              </Space>
            </div>

            {/* Thông tin cơ bản */}
            <div className="bg-[#8B1C1C] text-white p-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-2">Họ và tên:</p>
                  <p className="mb-2">Team:</p>
                  <p className="mb-0">Leader:</p>
                </div>
                <div>
                  <p className="mb-2">Vị trí:</p>
                </div>
              </div>
            </div>

            {/* Kỳ đánh giá */}
            <div className="bg-[#C2D5A8] p-4 mb-4">
              <div className="flex justify-between">
                <div>Kỳ đánh giá</div>
                <div>HĐTV - 2 tháng</div>
              </div>
            </div>

            {/* Bảng đánh giá */}
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center font-medium bg-[#C2D5A8] p-2">Phần dành cho nhân viên tự đánh giá</div>
                <div className="text-center font-medium bg-[#C2D5A8] p-2">Phần quản lý đánh giá</div>
              </div>
              <Table 
                columns={columns} 
                dataSource={dataSource}
                pagination={false}
                bordered
                size="middle"
                className="evaluation-table"
              />
            </div>

            {/* Nhận xét tự đánh giá tổng quan */}
            <div className="bg-[#8B1C1C] text-white p-2 mb-2">
              <div className="text-center">Nhận xét tự đánh giá tổng quan</div>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <div className="font-medium mb-2">Ưu điểm:</div>
                <TextArea rows={4} />
              </div>
              <div>
                <div className="font-medium mb-2">Nhược điểm:</div>
                <TextArea rows={4} />
              </div>
              <div>
                <div className="font-medium mb-2">Mục tiêu cải thiện bản thân:</div>
                <TextArea rows={4} />
              </div>
              <div>
                <div className="font-medium mb-2">Đánh giá kết quả công việc chung:</div>
                <TextArea rows={4} />
              </div>
            </div>

            {/* Quản lý trực tiếp đánh giá tổng quan */}
            <div className="bg-[#8B1C1C] text-white p-2 mb-2">
              <div className="text-center">Quản lý trực tiếp đánh giá tổng quan</div>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <div className="font-medium mb-2">Đánh giá kết quả công việc chung:</div>
                <TextArea rows={4} />
              </div>
              <div>
                <div className="font-medium mb-2">Kế hoạch công việc sắp giao cho nhân viên thử nhiệm:</div>
                <TextArea rows={4} />
              </div>
            </div>

            {/* Kết quả đánh giá */}
            <div className="bg-yellow-200 p-4 mb-4">
              <div className="font-medium">KẾT QUẢ ĐÁNH GIÁ</div>
              <Input className="mt-2" />
            </div>

            {/* Lưu ý */}
            <div className="bg-yellow-200 p-4">
              <div className="font-medium">Lưu ý (thay đổi mức lương nếu có)</div>
              <Input className="mt-2" />
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default EvaluationForm; 