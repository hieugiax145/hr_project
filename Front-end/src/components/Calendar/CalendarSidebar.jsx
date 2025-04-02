import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const CalendarSidebar = () => {
  return (
    <div className="w-[280px] fixed left-0 top-0 h-screen bg-white border-r">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b">
        <div className="text-xl font-bold">JHR</div>
      </div>

      {/* Search */}
      <div className="p-4">
        <Input
          prefix={<SearchOutlined className="text-gray-400" />}
          placeholder="Tìm kiếm lịch hẹn"
          className="w-full"
        />
      </div>

      {/* Quản lý */}
      <div className="px-4">
        <h3 className="text-sm font-medium mb-2">Quản lý</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F4F1FE] text-[#7B61FF]">
            <div className="w-2 h-2 rounded-full bg-[#7B61FF]"></div>
            <span>Duyên DTM</span>
          </div>
        </div>
      </div>

      {/* Đang theo dõi */}
      <div className="px-4 mt-4">
        <h3 className="text-sm font-medium mb-2">Đang theo dõi</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span>Nguyễn Hương Giang</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <span>Nguyễn Viết Lâm</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <span>Nguyễn Duy Quang</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarSidebar; 