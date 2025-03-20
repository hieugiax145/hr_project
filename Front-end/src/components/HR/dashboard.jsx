import React from 'react';
import { Layout, Button, Select } from 'antd';
import { FileTextOutlined, UserOutlined, TeamOutlined, CloseCircleOutlined, CodeOutlined } from '@ant-design/icons';
import Sidebar from '../Sidebar/Sidebar';
import Topbar from '../Topbar/Topbar';
import StatCard from './StatCard';
import JobCard from './JobCard';
import BarChart from './BarChart';
import PositionStats from './PositionStats';
import EmployeeStats from './EmployeeStats';
import Calendar from './Calendar';
import ApplicationSourceStats from './ApplicationSourceStats';

const { Content } = Layout;
const { Option } = Select;

const statCards = [
  {
    title: 'Hồ sơ ứng tuyển',
    count: '56',
    trend: 'so với tuần trước',
    trendValue: '0.82',
    icon: FileTextOutlined,
    iconColor: 'bg-blue-500'
  },
  {
    title: 'Tuyển',
    count: '08',
    trend: 'so với tuần trước',
    trendValue: '1.04',
    icon: UserOutlined,
    iconColor: 'bg-green-500'
  },
  {
    title: 'Phỏng vấn',
    count: '14',
    trend: 'so với tuần trước',
    trendValue: '-0.62',
    icon: TeamOutlined,
    iconColor: 'bg-purple-500'
  },
  {
    title: 'Từ chối',
    count: '03',
    trend: 'so với tuần trước',
    trendValue: '0.58',
    icon: CloseCircleOutlined,
    iconColor: 'bg-red-500'
  }
];

const jobPositions = [
  {
    title: 'Giáo Viên DA',
    type: 'Full-time',
    workMode: 'On-site',
    salary: '25 triệu',
    applicants: '01',
    icon: <CodeOutlined className="text-purple-600 text-xl" />
  },
  {
    title: 'Giáo Viên Sơ Cấp',
    type: 'Part-time',
    workMode: 'Hybrid',
    salary: '150 - 300 nghìn',
    applicants: '10',
    icon: <TeamOutlined className="text-green-600 text-xl" />
  },
  {
    title: 'Marketing Executive',
    type: 'Full-time',
    workMode: 'On-site',
    salary: '8 - 10 triệu',
    applicants: '04',
    icon: <UserOutlined className="text-blue-600 text-xl" />
  },
  {
    title: 'Chuyên Viên Tuyển Sinh',
    type: 'Full-time',
    workMode: 'On-site',
    salary: '6 - 8 triệu',
    applicants: '04',
    icon: <TeamOutlined className="text-purple-600 text-xl" />
  },
  {
    title: 'Nhân Viên Hành Chính',
    type: 'Full-time',
    workMode: 'On-site',
    salary: '7 - 9 triệu',
    applicants: '03',
    icon: <UserOutlined className="text-blue-600 text-xl" />
  }
];

export default function Dashboard() {
  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Sidebar />
      <Layout style={{ marginLeft: 282 }}>
        <Topbar />
        <Content style={{ margin: '80px 16px 24px', padding: 24, minHeight: 280 }}>
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="col-span-1">
              {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {statCards.map((card, index) => (
                    <StatCard key={index} {...card} />
                  ))}
                </div>

              {/* Job Positions Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Vị trí tuyển dụng (5)</h2>
                <Button type="link" className="text-[#7152F3] font-medium p-0">
                  Tất cả
                </Button>
              </div>

              {/* Job Positions Cards */}
              <div className="space-y-2">
                {jobPositions.map((job, index) => (
                  <div key={index} className="bg-white px-4 py-3 rounded-[10px] shadow-sm">
                    <JobCard {...job} />
                  </div>
                ))}
              </div>
            </div>

            {/* Center Column */}
            <div className="col-span-1 space-y-6">
              {/* Applications Chart */}
              <div className="bg-white p-6 rounded-[20px] shadow-sm min-h-[362px]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">Hồ sơ ứng tuyển</h2>
                  <Select defaultValue="7" className="w-32" size="large" bordered={false}>
                    <Option value="7">7 tháng nay</Option>
                    <Option value="30">30 ngày qua</Option>
                    <Option value="90">90 ngày qua</Option>
                  </Select>
                </div>
                <BarChart />
              </div>

              {/* Position Stats */}
              <div className="bg-white p-6 rounded-[20px] shadow-sm min-h-[362px]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">Hồ sơ theo vị trí tuyển dụng</h2>
                  <Select defaultValue="now" className="w-32" size="large" bordered={false}>
                    <Option value="now">Nay</Option>
                    <Option value="week">Tuần này</Option>
                    <Option value="month">Tháng này</Option>
                  </Select>
                </div>
                <PositionStats />
              </div>

              {/* Employee Stats */}
              <div className="bg-white p-6 rounded-[20px] shadow-sm min-h-[362px]">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold">Chức danh nhân viên</h2>
                  <Button type="text" className="text-gray-400">...</Button>
                </div>
                <EmployeeStats />
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-1 space-y-6">
              <Calendar />
              <ApplicationSourceStats />
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

