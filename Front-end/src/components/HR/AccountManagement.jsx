import React, { useState, useEffect } from 'react';
import { Layout, Table, Tag, Spin, Alert, Typography, Card } from 'antd';
import { getAllUsers } from '../../services/userService';

const { Content } = Layout;
const { Title } = Typography;

const AccountManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
        setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Hàm để lấy màu cho role
  const getRoleColor = (role) => {
    switch (role) {
      case 'ceo':
        return 'red';
      case 'department_head':
        return 'blue';
      case 'business_director':
        return 'green';
      case 'recruitment':
        return 'purple';
      case 'applicant':
        return 'orange';
      case 'director':
        return 'cyan';
      default:
        return 'default';
    }
  };

  // Hàm để hiển thị tên role tiếng Việt
  const getRoleName = (role) => {
    switch (role) {
      case 'ceo':
        return 'Giám đốc điều hành';
      case 'department_head':
        return 'Trưởng phòng';
      case 'business_director':
        return 'Giám đốc kinh doanh';
      case 'recruitment':
        return 'Nhân viên tuyển dụng';
      case 'applicant':
        return 'Ứng viên';
      case 'director':
        return 'Giám đốc';
      default:
        return role;
    }
  };

  const columns = [
    {
      title: 'Tên đầy đủ',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Tên đăng nhập',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={getRoleColor(role)}>
          {getRoleName(role)}
        </Tag>
      ),
      filters: [
        { text: 'Giám đốc điều hành', value: 'ceo' },
        { text: 'Trưởng phòng', value: 'department_head' },
        { text: 'Giám đốc kinh doanh', value: 'business_director' },
        { text: 'Nhân viên tuyển dụng', value: 'recruitment' },
        { text: 'Ứng viên', value: 'applicant' },
        { text: 'Giám đốc', value: 'director' },
      ],
      onFilter: (value, record) => record.role === value,
    },
  ];

  return (
    <Content className="p-6 ml-[282px] mt-[80px]">
      <Card className="mb-6">
        <Title level={2}>Quản lý Tài khoản</Title>
        <p className="text-gray-500">Quản lý và xem thông tin tất cả tài khoản trong hệ thống</p>
      </Card>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
        />
      ) : (
        <Card>
          <Table
            dataSource={users}
            columns={columns}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} tài khoản`,
            }}
            className="custom-table"
          />
        </Card>
      )}
    </Content>
  );
};

export default AccountManagement; 