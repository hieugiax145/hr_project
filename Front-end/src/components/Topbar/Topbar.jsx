import React from 'react';
import { Input, Badge, Dropdown, Space, message, Layout, Avatar } from 'antd';
import { SearchOutlined, BellOutlined, MessageOutlined, UserOutlined, DownOutlined, LogoutOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header } = Layout;
const API_BASE_URL = 'http://localhost:8000/api';

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate(); 

  // Map routes to page titles
  const getPageTitle = (pathname) => {
    const routes = {
      '/': 'Trang chủ',
      '/hr/recruitment-requests': 'Yêu cầu tuyển dụng',
      '/hr/ceo-recruitment-requests': 'Yêu cầu tuyển dụng CEO',
      '/positions': 'Vị trí tuyển dụng',
      '/candidates': 'Ứng viên',
      '/calendar': 'Lịch',
      '/notifications': 'Thông báo ứng viên mới',
    };
    return routes[pathname] || 'Trang chủ';
  };

  // Lấy thông tin user từ localStorage
  const userString = localStorage.getItem('user');
  console.log('User string from localStorage:', userString);
  const user = userString ? JSON.parse(userString) : null;
  console.log('Parsed user data:', user);

  // Hàm dịch role sang tiếng Việt
  const translateRole = (role) => {
    const roleTranslations = {
      'department_head': 'Trưởng phòng ban',
      'business_director': 'Giám đốc kinh doanh',
      'ceo': 'CEO (Giám đốc điều hành)',
      'recruitment': 'Bộ phận tuyển dụng',
      'applicant': 'Ứng viên',
      'director': 'Giám đốc'
    };
    return roleTranslations[role] || role;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    message.success('Đăng xuất thành công!'); 
    navigate('/login'); 
  };

  const items = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Thông tin cá nhân',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
    },
  ];

  return (
    <div className="fixed top-4 right-4 left-[298px] z-10">
      <div className="bg-[#FCFCFC] h-16 rounded-2xl shadow-sm px-6 flex items-center justify-between">
        {/* Page Title */}
        <h1 className="text-xl font-['Inter'] font-bold">
          {getPageTitle(location.pathname)}
        </h1>

        {/* Right Section */}
        <div className="flex items-center gap-8">
          {/* Icons */}
          <div className="flex items-center gap-6">
            {/* Chat */}
            <Badge count={3}>
              <MessageOutlined className="text-2xl text-gray-600 cursor-pointer" />
            </Badge>

            {/* Notifications */}
            <Badge count={5}>
              <BellOutlined className="text-2xl text-gray-600 cursor-pointer" />
            </Badge>
          </div>

          {/* User Profile */}
          <Dropdown menu={{ items }} placement="bottomRight">
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'background-color 0.3s'
            }}>
              <Avatar 
                icon={<UserOutlined />} 
                style={{ 
                  backgroundColor: '#656ED3',
                  marginRight: '12px'
                }}
              />
              <div>
                <div className="font-['Inter'] font-normal">
                  {user && user.fullName ? user.fullName : 'User'}
                </div>
                <div className="text-sm text-gray-500">
                  {translateRole(user?.role || '')}
                </div>
              </div>
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
