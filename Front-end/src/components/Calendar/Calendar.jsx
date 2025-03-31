import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import { message } from 'antd';
import './Calendar.css';
import AddEventModal from './AddEventModal';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState('Tháng');
  const [selectedDate, setSelectedDate] = useState(null);
  const [isAddEventModalVisible, setIsAddEventModalVisible] = useState(false);

  // Tạo mảng các ngày trong tháng
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate)
  });

  // Danh sách các cuộc phỏng vấn mẫu
  const [interviews, setInterviews] = useState([
    {
      id: 1,
      title: 'PV - Giáo Viên Data Analyst - D.A.Tuấn',
      date: new Date(2024, 1, 2),
      type: 'offline',
      time: '10:30',
      status: 'pending'
    },
    {
      id: 2,
      title: 'PV - TTS Giáo Viên Lập Trình - C.T.Thành',
      date: new Date(2024, 1, 7),
      type: 'online',
      time: '15:00',
      status: 'confirmed'
    }
  ]);

  const handleAddEvent = (eventData) => {
    // Tạo event mới
    const newEvent = {
      id: interviews.length + 1,
      title: eventData.title,
      date: eventData.date.toDate(),
      type: eventData.eventType === 'default' ? 'offline' : 'online',
      time: eventData.startTime.format('HH:mm'),
      status: 'pending'
    };

    // Thêm event mới vào danh sách
    setInterviews([...interviews, newEvent]);

    // Gửi thông báo cho người được thêm
    if (eventData.addGuests?.length > 0) {
      message.success('Đã gửi thông báo cho người được thêm vào lịch');
    }

    setIsAddEventModalVisible(false);
  };

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">
            {format(currentDate, 'MMMM yyyy', { locale: vi })}
          </h2>
          <div className="flex space-x-2">
            <button className={`px-4 py-1 rounded-full ${selectedView === 'Ngày' ? 'bg-gray-200' : ''}`}>
              Ngày
            </button>
            <button className={`px-4 py-1 rounded-full ${selectedView === 'Tuần' ? 'bg-gray-200' : ''}`}>
              Tuần
            </button>
            <button className={`px-4 py-1 rounded-full ${selectedView === 'Tháng' ? 'bg-[#E7E9F8]' : ''}`}>
              Tháng
            </button>
          </div>
        </div>
        <button 
          className="px-4 py-2 bg-[#656ED3] text-white rounded-full hover:bg-[#4c59c3]"
          onClick={() => setIsAddEventModalVisible(true)}
        >
          + Tạo lịch
        </button>
      </div>
    );
  };

  const renderDayHeader = () => {
    const weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return (
      <div className="grid grid-cols-7 gap-1 py-2 bg-white">
        {weekDays.map(day => (
          <div key={day} className="text-center text-sm font-medium">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderInterviewCard = (interview) => {
    const bgColor = interview.type === 'offline' ? 'bg-[#E7E9F8]' : 'bg-[#EBFBEE]';
    const textColor = interview.type === 'offline' ? 'text-[#656ED3]' : 'text-[#1F9254]';
    return (
      <div
        key={interview.id}
        className={`${bgColor} p-2 rounded-md mb-1 text-sm cursor-pointer hover:opacity-90`}
      >
        <div className={`font-medium ${textColor}`}>{interview.title}</div>
        <div className="text-xs text-gray-600">{interview.time}</div>
      </div>
    );
  };

  const renderDayDetails = () => {
    if (!selectedDate) return null;

    const dayInterviews = interviews.filter(interview =>
      isSameDay(interview.date, selectedDate)
    );

    return (
      <div className="fixed right-4 top-24 w-80 bg-white rounded-lg shadow-lg p-4 z-50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">
            {format(selectedDate, 'dd/MM/yyyy')}
          </h3>
          <button 
            onClick={() => setSelectedDate(null)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        {dayInterviews.length > 0 ? (
          <div className="space-y-2">
            {dayInterviews.map(interview => renderInterviewCard(interview))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">Không có lịch phỏng vấn</p>
        )}
      </div>
    );
  };

  const renderCalendarGrid = () => {
    const firstDay = startOfMonth(currentDate);
    const prefixDays = firstDay.getDay();
    
    return (
      <div className="grid grid-cols-7 gap-1 bg-gray-100">
        {[...Array(prefixDays)].map((_, index) => (
          <div key={`empty-${index}`} className="h-32 p-2 bg-white"></div>
        ))}
        {daysInMonth.map(day => {
          const dayInterviews = interviews.filter(
            interview => isSameDay(interview.date, day)
          );

          return (
            <div
              key={day.toString()}
              className={`h-32 p-2 bg-white border cursor-pointer hover:bg-gray-50 ${
                isToday(day) ? 'bg-blue-50' : ''
              } ${isSameDay(day, selectedDate) ? 'ring-2 ring-[#656ED3]' : ''}`}
              onClick={() => setSelectedDate(day)}
            >
              <div className="text-right">{format(day, 'd')}</div>
              <div className="mt-1">
                {dayInterviews.map(interview => renderInterviewCard(interview))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-100 mt-[80px] ml-[282px]">
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg shadow">
          {renderHeader()}
          {renderDayHeader()}
          {renderCalendarGrid()}
        </div>
      </div>
      {renderDayDetails()}
      <AddEventModal
        visible={isAddEventModalVisible}
        onClose={() => setIsAddEventModalVisible(false)}
        onSave={handleAddEvent}
      />
    </div>
  );
};

export default Calendar; 