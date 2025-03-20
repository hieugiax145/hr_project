import React from 'react';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const StatCard = ({ title, count, trend, trendValue, icon: Icon, iconColor }) => {
  const isNegative = trendValue.startsWith('-');
  
  return (
    <div className="bg-white p-5 rounded-[20px]">
      <div className="flex flex-col gap-2">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${iconColor}`}>
          <Icon className="text-xl text-white" />
        </div>
        <p className="text-gray-400 text-sm">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-[28px] font-bold">{count}</h3>
          <div className="flex items-center gap-1">
            {isNegative ? (
              <ArrowDownOutlined className="text-red-500 text-xs" />
            ) : (
              <ArrowUpOutlined className="text-green-500 text-xs" />
            )}
            <span className={`text-xs ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
              {trendValue}%
            </span>
          </div>
        </div>
        <span className="text-gray-400 text-xs">{trend}</span>
      </div>
    </div>
  );
};

export default StatCard; 