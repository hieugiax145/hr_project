import React from 'react';
import { Button } from 'antd';
import { MoreOutlined } from '@ant-design/icons';

const JobCard = ({ title, type, workMode, salary, applicants, icon }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'Full-time':
        return 'bg-purple-100 text-purple-600';
      case 'Part-time':
        return 'bg-green-100 text-green-600';
      case 'Hybrid':
        return 'bg-yellow-100 text-yellow-600';
      case 'On-site':
        return 'bg-blue-100 text-blue-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-medium mb-1">{title}</h3>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(type)}`}>
              {type}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${getTypeColor(workMode)}`}>
              {workMode}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <span className="text-base font-medium">{salary}</span>
        <div className="flex items-center gap-1 text-gray-500">
          <span className="text-xs">{applicants} ứng viên</span>
          <Button type="text" className="flex items-center justify-center p-0 min-w-0 h-auto">
            <MoreOutlined className="text-gray-400" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCard; 