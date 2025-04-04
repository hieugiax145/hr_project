import React from 'react';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { useNavigate } from 'react-router-dom';

// Cấu hình locale cho dayjs
dayjs.locale('vi');

const CalendarSidebar = ({ selectedDate, selectedDateEvents, onClose }) => {
  const navigate = useNavigate();

  const handleViewEventDetail = (eventId) => {
    navigate(`/calendar/event/${eventId}`);
  };

  if (!selectedDate) return null;

  const formatDate = (date) => {
    const weekDay = date.format('dddd');
    return `${weekDay}, ${date.format('DD/MM/YYYY')}`;
  };

  return (
    <div className="w-[250px] bg-white border-r border-gray-200 overflow-auto">
      <div className="p-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {formatDate(selectedDate)}
          </h3>
          <Button 
            type="text" 
            icon={<CloseOutlined />} 
            onClick={onClose}
          />
        </div>
      </div>

      <div className="p-4">
        {selectedDateEvents.length === 0 ? (
          <div className="text-gray-500 text-center py-4">
            Không có lịch trong ngày này
          </div>
        ) : (
          <div className="space-y-3">
            {selectedDateEvents.map((event, index) => (
              <div 
                key={event._id || index}
                className="p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                style={{
                  backgroundColor: event.type === 'interview' ? '#E8EAFF' : '#E7FE50',
                }}
                onClick={() => handleViewEventDetail(event._id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium" style={{
                    color: event.type === 'interview' ? '#7B61FF' : '#000'
                  }}>
                    {event.title}
                  </h4>
                </div>
                <div className="text-sm text-gray-600">
                  <p>Thời gian: {dayjs(event.startTime).format('HH:mm')}</p>
                  <p>{event.eventType === 'online' ? 'Online' : 'Offline'}</p>
                  {event.room && <p>Phòng: {event.room}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarSidebar; 