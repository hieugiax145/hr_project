import React from 'react';
import { Input, Badge, Dropdown, Space, message } from 'antd';
import { SearchOutlined, BellOutlined, MessageOutlined, UserOutlined, DownOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const Topbar = () => {
  const location = useLocation();
  const navigate = useNavigate(); 

  // Map routes to page titles
  const getPageTitle = (pathname) => {
    const routes = {
      '/': 'Trang chủ',
      '/recruitment-requests': 'Yêu cầu tuyển dụng',
      '/positions': 'Vị trí tuyển dụng',
      '/candidates': 'Ứng viên',
      '/calendar': 'Lịch',
      '/notifications': 'Thông báo ứng viên mới',
    };
    return routes[pathname] || 'Trang chủ';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    message.success('Đăng xuất thành công!'); 
    navigate('/login'); 
  };

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
    },
    {
      key: 'settings',
      label: 'Cài đặt',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      danger: true,
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

        {/* Search Bar */}
        <div className="w-[400px]">
          <Input
            placeholder="Tìm kiếm"
            prefix={<SearchOutlined className="text-gray-400" />}
            className="rounded-full bg-gray-50 border-none h-10"
          />
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
          <Dropdown
            menu={{ items: userMenuItems }}
            trigger={['click']}
            placement="bottomRight"
          >
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <UserOutlined className="text-purple-600" />
              </div>
              <Space>
                <div>
                  <div className="font-['Inter'] font-normal">Duyên DTM</div>
                  <div className="text-sm text-gray-500">HR</div>
                </div>
                <DownOutlined className="text-xs text-gray-400" />
              </Space>
            </div>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
