import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Select, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import { notificationService } from '../../services/notificationService';
import dayjs from 'dayjs';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotifications();
      setNotifications(response.data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách thông báo');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa thông báo này?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await notificationService.deleteNotification(id);
          message.success('Xóa thông báo thành công');
          fetchNotifications();
        } catch (error) {
          message.error('Lỗi khi xóa thông báo');
        }
      },
    });
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'recruitmentId',
      key: 'recruitmentId',
      width: 80,
    },
    {
      title: 'Họ và Tên',
      dataIndex: ['candidateId', 'name'],
      key: 'name',
    },
    {
      title: 'Chức vụ',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Phòng',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Chi nhánh',
      dataIndex: 'branch',
      key: 'branch',
    },
    {
      title: 'Người tạo',
      dataIndex: ['creator', 'fullName'],
      key: 'creator',
    },
    {
      title: 'Nhân sự phụ trách',
      dataIndex: ['hrInCharge', 'fullName'],
      key: 'hrInCharge',
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => navigate(`/notifications/${record._id}`)}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => navigate(`/notifications/edit/${record._id}`)}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 pt-[104px] pl-[298px]">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Thông báo ứng viên mới</h1>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined className="text-gray-400" />}
              className="w-[280px]"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button 
              type="primary" 
              className="bg-[#7B61FF] hover:bg-[#6B51EF]"
              onClick={() => navigate('/notifications/create')}
            >
              + Mới
            </Button>
            <Select
              mode="multiple"
              style={{ width: '200px' }}
              placeholder={
                <div className="flex items-center gap-2">
                  <FilterOutlined />
                  <span>Bộ lọc</span>
                </div>
              }
              value={selectedFilters}
              onChange={setSelectedFilters}
              options={[
                { value: 'department', label: 'Phòng ban' },
                { value: 'position', label: 'Chức vụ' },
                { value: 'date', label: 'Ngày tạo' }
              ]}
            />
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={notifications}
          rowKey="_id"
          loading={loading}
          pagination={{
            total: 50,
            pageSize: 10,
            showSizeChanger: false,
            showQuickJumper: false,
          }}
        />
      </div>
    </div>
  );
};

export default Notifications; 