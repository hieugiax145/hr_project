import React, { useState, useEffect } from 'react';
import { Layout, Table, Tag, Spin, Alert, Typography, Card, Button, Modal, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { getAllUsers, deleteUser } from '../../services/userService';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Title } = Typography;

const AccountManagement = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      console.log('Fetched users:', data);
      setUsers(data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
      setError('Không thể tải danh sách người dùng. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    navigate('/register');
  };

  const showDeleteConfirm = (user) => {
    setSelectedUser(user);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteCancel = () => {
    setSelectedUser(null);
    setIsDeleteModalVisible(false);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteUser(selectedUser._id);
      message.success('Xóa tài khoản thành công');
      fetchUsers(); // Refresh danh sách
      setIsDeleteModalVisible(false);
      setSelectedUser(null);
    } catch (error) {
      message.error('Không thể xóa tài khoản. Vui lòng thử lại sau.');
    }
  };

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

  // Hàm để hiển thị tên phòng ban tiếng Việt
  const getDepartmentName = (department) => {
    switch (department) {
      case 'accounting':
        return 'Kế toán';
      case 'marketing':
        return 'Marketing';
      case 'it':
        return 'IT';
      case 'hr':
        return 'Nhân sự';
      case 'sales':
        return 'Kinh doanh';
      default:
        return department;
    }
  };

  // Hàm để lấy màu cho department
  const getDepartmentColor = (department) => {
    switch (department) {
      case 'accounting':
        return 'gold';
      case 'marketing':
        return 'lime';
      case 'it':
        return 'geekblue';
      case 'hr':
        return 'volcano';
      case 'sales':
        return 'cyan';
      default:
        return 'default';
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
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
      render: (department, record) => {
        console.log('Record:', record); // Debug log
        if (record.role === 'department_head') {
          return department ? (
            <Tag color={getDepartmentColor(department)}>
              {getDepartmentName(department)}
            </Tag>
          ) : (
            <Tag color="default">Chưa phân công</Tag>
          );
        }
        return null;
      },
      filters: [
        { text: 'Kế toán', value: 'accounting' },
        { text: 'Marketing', value: 'marketing' },
        { text: 'IT', value: 'it' },
        { text: 'Nhân sự', value: 'hr' },
        { text: 'Kinh doanh', value: 'sales' },
      ],
      onFilter: (value, record) => record.department === value,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => showDeleteConfirm(record)}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <Content className="p-6 ml-[282px] mt-[80px]">
      <Card className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <Title level={2}>Quản lý Tài khoản</Title>
            <p className="text-gray-500">Quản lý và xem thông tin tất cả tài khoản trong hệ thống</p>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddUser}
            className="bg-[#1890ff]"
          >
            Thêm tài khoản
          </Button>
        </div>
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

      <Modal
        title="Xác nhận xóa tài khoản"
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <p>Bạn có chắc chắn muốn xóa tài khoản của {selectedUser?.fullName}?</p>
        <p>Hành động này không thể hoàn tác.</p>
      </Modal>
    </Content>
  );
};

export default AccountManagement; 