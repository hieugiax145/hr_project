import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  FileSearchOutlined,
  TeamOutlined,
  CalendarOutlined,
  BellOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(location.pathname);

  const menuItems = [
    {
      key: '/dashboard',
      icon: <HomeOutlined />,
      label: 'Trang chủ',
    },
    {
      key: '/recruitment-requests',
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
  ];

  const handleMenuClick = (item) => {
    setSelectedKey(item.key);
    navigate(item.key);
  };

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
            selectedKeys={[selectedKey]}
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