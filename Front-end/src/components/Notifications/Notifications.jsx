import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { notificationService } from '../../services/notificationService';
import dayjs from 'dayjs';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

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
      dataIndex: ['creator', 'name'],
      key: 'creator',
    },
    {
      title: 'Nhân sự phụ trách',
      dataIndex: ['hrInCharge', 'name'],
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
    <div>
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Danh sách thông báo</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/notifications/create')}
        >
          Tạo mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={notifications}
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
};

export default Notifications; 