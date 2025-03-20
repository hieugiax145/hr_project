import React from 'react';

const positions = [
  {
    title: 'Giáo Viên Kaiwa',
    percentage: 12.5,
    applications: 2,
    color: 'bg-purple-100'
  },
  {
    title: 'Kế Toán',
    percentage: 31.25,
    applications: 5,
    color: 'bg-blue-100'
  },
  {
    title: 'Giáo Viên Tiếng Anh',
    percentage: 12.5,
    applications: 2,
    color: 'bg-green-100'
  },
  {
    title: 'Thực Tập Sinh Kế Toán',
    percentage: 43.75,
    applications: 7,
    color: 'bg-yellow-100'
  }
];

const PositionStats = () => {
  return (
    <div className="space-y-4">
      {positions.map((position, index) => (
        <div key={index} className="flex items-center gap-4">
          <div className="flex-grow">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-600">{position.title} ({position.percentage}%)</span>
              <span className="text-sm text-gray-500">{position.applications} hồ sơ ứng tuyển</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div
                className={`h-full rounded-full ${position.color}`}
                style={{ width: `${position.percentage}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PositionStats; 