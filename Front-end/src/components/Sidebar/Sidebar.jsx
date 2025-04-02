import React from 'react';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  FileSearchOutlined,
  TeamOutlined,
  CalendarOutlined,
  BellOutlined,
  UserOutlined,
  MailOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Lấy thông tin user từ localStorage
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const userRole = user?.role;

  const menuItems = [
    {
      key: '/dashboard',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
    },
    {
      key: userRole === 'ceo' ? '/hr/ceo-recruitment-requests' : '/hr/recruitment-requests',
      icon: <FileSearchOutlined />,
      label: 'Yêu cầu tuyển dụng',
    },
    {
      key: '/positions',
      icon: <TeamOutlined />,
      label: 'Vị trí tuyển dụng',
    },
    {
      key: '/candidates',
      icon: <UserOutlined />,
      label: 'Ứng viên',
    },
    {
      key: '/calendar',
      icon: <CalendarOutlined />,
      label: 'Lịch',
    },
    {
      key: '/notifications',
      icon: <BellOutlined />,
      label: 'Thông báo ứng viên mới',
    },
    {
      key: '/emails',
      icon: <MailOutlined />,
      label: 'Email',
    },
  ];

  const handleMenuClick = (item) => {
    navigate(item.key);
  };

  // Hàm kiểm tra route active
  const isActiveRoute = (menuKey) => {
    const currentPath = location.pathname;
    
    if (currentPath === menuKey) return true;
    
    // Xử lý đặc biệt cho route yêu cầu tuyển dụng
    if (menuKey === '/hr/recruitment-requests' || menuKey === '/hr/ceo-recruitment-requests') {
      return currentPath.startsWith('/hr/recruitment-requests') || 
             currentPath === '/hr/ceo-recruitment-requests';
    }
    
    if (menuKey === '/positions') {
      return currentPath.startsWith('/positions');
    }
    
    return false;
  };

  const selectedKeys = menuItems
    .filter(item => isActiveRoute(item.key))
    .map(item => item.key);

  return (
    <div className="m-4">
      <Sider
        width={250}
        style={{
          background: '#FCFCFC',
          borderRadius: '16px',
          height: 'calc(100vh - 32px)',
          position: 'fixed',
          left: '16px',
          top: '16px',
          bottom: '16px',
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <img src={logo} alt="JHR Logo" className="h-8 w-8" />
            <span className="text-xl font-['Inter'] text-black">JHR</span>
          </div>
          <Menu
            mode="inline"
            selectedKeys={selectedKeys}
            onClick={handleMenuClick}
            items={menuItems}
            style={{
              background: '#FCFCFC',
              border: 'none',
            }}
            className="custom-menu"
          />
        </div>
      </Sider>
    </div>
  );
};

export default Sidebar; 