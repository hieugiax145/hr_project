import React, { useState } from 'react';
import { Table, Button, Select, Space } from 'antd';
import { FilterOutlined } from '@ant-design/icons';

const Notifications = () => {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const columns = [
    {
      title: 'Người tạo',
      dataIndex: 'creator',
      key: 'creator',
    },
    {
      title: 'Họ và tên nhân viên mới',
      dataIndex: 'fullName',
      key: 'fullName',
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
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];

  const data = [
    {
      key: '1',
      creator: 'Nguyễn Văn An',
      fullName: 'Phạm Hùng',
      position: 'Member',
      department: 'Marketing',
      createdAt: '15:00 - 23/07/2024',
    },
    {
      key: '2',
      creator: 'Nguyễn Văn An',
      fullName: 'Phạm Hùng',
      position: 'Leader',
      department: 'Marketing',
      createdAt: '15:00 - 23/07/2024',
    },
    {
      key: '3',
      creator: 'Nguyễn Văn An',
      fullName: 'Phạm Hùng',
      position: 'Thực tập sinh',
      department: 'Marketing',
      createdAt: '15:00 - 23/07/2024',
    },
    {
      key: '4',
      creator: 'Nguyễn Văn An',
      fullName: 'Phạm Hùng',
      position: 'CTV',
      department: 'Marketing',
      createdAt: '15:00 - 23/07/2024',
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-[80px] ml-[282px]">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Thông báo ứng viên mới</h1>
          <Space>
            <Button type="primary" className="bg-[#656ED3]">
              + Mới
            </Button>
            <Select
              mode="multiple"
              style={{ width: '200px' }}
              placeholder="Bộ lọc"
              value={selectedFilters}
              onChange={setSelectedFilters}
              suffixIcon={<FilterOutlined />}
            >
              <Select.Option value="department">Phòng ban</Select.Option>
              <Select.Option value="position">Chức vụ</Select.Option>
              <Select.Option value="date">Ngày tạo</Select.Option>
            </Select>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={data}
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