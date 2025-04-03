import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Oct', value: 140, color: '#8884d8' },
  { name: 'Nov', value: 160, color: '#8884d8' },
  { name: 'Dec', value: 250, color: '#8884d8' },
  { name: 'Jan', value: 180, color: '#82ca9d' },
  { name: 'Feb', value: 220, color: '#8884d8' },
  { name: 'Mar', value: 190, color: '#8884d8' },
  { name: 'Apr', value: 210, color: '#8884d8' }
];

const CustomBar = (props) => {
  const { x, y, width, height, color } = props;
  const radius = 6;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={color}
        rx={radius}
        ry={radius}
      />
    </g>
  );
};

const BarChart = () => {
  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <RechartsBarChart
          data={data}
          margin={{ top: 20, right: 20, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false}
            fontSize={12}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false}
            fontSize={12}
          />
          <Tooltip />
          <Bar
            dataKey="value"
            fill="#8884d8"
            shape={<CustomBar />}
            barSize={20}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChart; 