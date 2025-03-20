import React from 'react';

const employeeTypes = [
  {
    type: 'Full-time',
    percentage: 70,
    count: 35,
    color: 'bg-[#82ca9d]'
  },
  {
    type: 'Part-time',
    percentage: 20,
    count: 10,
    color: 'bg-[#8884d8]'
  },
  {
    type: 'Hybrid',
    percentage: 5,
    count: 3,
    color: 'bg-[#ffc658]'
  },
  {
    type: 'Thử việc',
    percentage: 5,
    count: 2,
    color: 'bg-gray-300'
  }
];

const EmployeeStats = () => {
  const totalEmployees = 50;

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-2xl font-bold">{totalEmployees}</span>
        <span className="text-gray-400 text-sm">Tổng nhân viên</span>
      </div>

      <div className="flex gap-[2px] h-16 mb-6 pr-6">
        {Array.from({ length: 50 }).map((_, index) => {
          let color = '';
          if (index < 35) color = 'bg-[#82ca9d]';
          else if (index < 45) color = 'bg-[#8884d8]';
          else if (index < 48) color = 'bg-[#ffc658]';
          else color = 'bg-gray-300';
          
          return (
            <div 
              key={index} 
              className={`w-[4px] ${color} rounded-sm`}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {employeeTypes.map((type, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-sm ${type.color}`} />
            <div>
              <div className="text-sm font-medium">{type.type} ({type.percentage}%)</div>
              <div className="text-xs text-gray-400">{type.count} người</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeStats; 