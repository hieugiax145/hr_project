import React from 'react';
import { Input, Badge, Dropdown, Space, message, Layout, Avatar, Button } from 'antd';
import { SearchOutlined, BellOutlined, MessageOutlined, UserOutlined, DownOutlined, LogoutOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header } = Layout;
const API_BASE_URL = 'http://localhost:8000/api';

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate(); 

  // Hàm kiểm tra xem có phải là route mới không
  const isNewRoute = (pathname) => {
    const newRoutes = [
      '/positions/:id/candidates',
      '/candidates/:id',
      '/send-email',
      '/hr/ceo-recruitment-requests/:id',
      '/hr/recruitment-requests/:id',
      '/hr/recruitment-requests/:id/edit'
    ];
    
    return newRoutes.some(route => {
      // Xử lý các route có tham số động
      if (route.includes(':')) {
        const routePattern = route.replace(/:[^/]+/g, '[^/]+');
        return new RegExp(`^${routePattern}$`).test(pathname);
      }
      return route === pathname;
    });
  };

  // Map routes to page titles
  const getPageTitle = (pathname) => {
    const routes = {
      '/': 'Trang chủ',
      '/hr/recruitment-requests': 'Yêu cầu tuyển dụng',
      '/hr/ceo-recruitment-requests': 'Yêu cầu tuyển dụng CEO',
      '/hr/other-recruitment-requests': 'Yêu cầu tuyển dụng',
      '/positions': 'Vị trí tuyển dụng',
      '/positions/:id/candidates': 'Danh sách ứng viên',
      '/candidates': 'Ứng viên',
      '/candidates/:id': 'Chi tiết ứng viên',
      '/calendar': 'Lịch',
      '/notifications': 'Thông báo ứng viên mới',
      '/emails': 'Email',
      '/send-email': 'Gửi email',
      '/hr/ceo-recruitment-requests/:id': 'Chi tiết yêu cầu tuyển dụng CEO',
      '/hr/recruitment-requests/:id': 'Chi tiết yêu cầu tuyển dụng'
    };

    // Xử lý các route có tham số động
    if (pathname.includes('/positions/') && pathname.includes('/candidates')) {
      return 'Danh sách ứng viên';
    }
    if (pathname.includes('/candidates/')) {
      return 'Chi tiết ứng viên';
    }
    if (pathname.includes('/hr/ceo-recruitment-requests/')) {
      return 'Chi tiết yêu cầu tuyển dụng CEO';
    }
    if (pathname.includes('/hr/recruitment-requests/')) {
      return 'Chi tiết yêu cầu tuyển dụng';
    }

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
        {/* Page Title with Back Button */}
        <div className="flex items-center gap-4">
          {isNewRoute(location.pathname) && (
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate(-1)}
              className="flex items-center"
            >
              Quay lại
            </Button>
          )}
          <h1 className="text-xl font-['Inter'] font-bold">
            {getPageTitle(location.pathname)}
          </h1>
        </div>

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