import React, { useState, useEffect } from 'react';
import { Calendar as AntCalendar, Badge, Button, message } from 'antd';
import locale from 'antd/es/calendar/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import AddEventModal from './AddEventModal';
import axios from 'axios';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [isAddEventModalVisible, setIsAddEventModalVisible] = useState(false);
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/interviews', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
      message.error('Không thể tải dữ liệu lịch');
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    const eventsOnDate = events.filter(event => 
      dayjs(event.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    );
    setSelectedDateEvents(eventsOnDate);
  };

  const handleViewEventDetail = (eventId) => {
    navigate(`/calendar/event/${eventId}`);
  };

  const cellRender = (current, info) => {
    if (info.type !== 'date') return null;
    
    const dateEvents = events.filter(event => 
      dayjs(event.date).format('YYYY-MM-DD') === current.format('YYYY-MM-DD')
    );

    return (
      <ul className="events">
        {dateEvents.map((event, index) => (
          <li key={event._id || index}>
            <div 
              className="cursor-pointer hover:bg-gray-50 rounded p-1 transition-colors"
              onClick={() => handleViewEventDetail(event._id)}
            >
              <Badge
                status={event.type === 'interview' ? 'processing' : 'success'}
                text={
                  <span className="text-xs hover:text-[#656ED3]">
                    {event.title}
                  </span>
                }
              />
            </div>
          </li>
        ))}
      </ul>
    );
  };

  const handleAddEvent = async (values) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập lại');
        return;
      }

      // Convert date and times to full ISO datetime
      const eventDate = dayjs(values.date);
      const startTime = dayjs(values.startTime);
      const endTime = dayjs(values.endTime);

      // Combine date with times to create full datetime
      const startDateTime = eventDate
        .hour(startTime.hour())
        .minute(startTime.minute())
        .second(0)
        .millisecond(0);

      const endDateTime = eventDate
        .hour(endTime.hour())
        .minute(endTime.minute())
        .second(0)
        .millisecond(0);

      // Validate thời gian
      if (endDateTime.isBefore(startDateTime)) {
        message.error('Thời gian kết thúc phải sau thời gian bắt đầu');
        return;
      }

      // Format dữ liệu trước khi gửi
      const formattedData = {
        title: values.title?.trim(),
        date: eventDate.toISOString(),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        eventType: values.eventType,
        location: values.location?.trim() || '',
        room: values.room,
        description: values.description?.trim() || '',
        type: values.type,
        attendees: values.attendees || [],
        candidate: values.assignTo === 'no-candidates' ? null : values.assignTo,
        beforeEvent: values.beforeEvent || '5min',
        allDay: values.allDay || false
      };

      // Validate dữ liệu bắt buộc
      if (!formattedData.title) {
        message.error('Vui lòng nhập tiêu đề');
        return;
      }

      if (!formattedData.candidate) {
        message.error('Vui lòng chọn ứng viên');
        return;
      }

      // Log dữ liệu trước khi gửi để debug
      console.log('Data being sent:', formattedData);

      const response = await axios.post('http://localhost:8000/api/interviews', formattedData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 201 || response.status === 200) {
        message.success('Thêm sự kiện thành công');
        setIsAddEventModalVisible(false);
        fetchEvents();
      }
    } catch (error) {
      console.error('Error adding event:', error);
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
      } else {
        // Log error response để debug
        console.error('Error response:', error.response?.data);
        const errorMessage = error.response?.data?.message || 'Không thể thêm sự kiện';
        message.error(errorMessage);
      }
    }
  };

  const renderEventDetails = () => {
    if (!selectedDate) return null;

    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 
            className="text-lg font-medium cursor-pointer hover:text-[#656ED3] transition-colors"
            onClick={() => selectedDate && navigate(`/calendar/event/${selectedDate.format('YYYY-MM-DD')}`)}
          >
            Lịch chi tiết
          </h3>
          <CloseOutlined className="cursor-pointer text-gray-500" onClick={() => setSelectedDate(null)} />
        </div>

        {selectedDateEvents.length === 0 ? (
          <div className="p-4">
            <p className="text-gray-500">Không có lịch trong ngày này</p>
          </div>
        ) : (
          <div className="divide-y">
            {selectedDateEvents.map((event, index) => (
              <div 
                key={event._id || index} 
                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                onClick={() => handleViewEventDetail(event._id)}
              >
                <div className="mb-2">
                  <h4 className="font-medium text-[#656ED3] group-hover:text-[#4E55A4]">{event.title}</h4>
                  <p className="text-sm text-gray-500">{dayjs(event.date).format('DD/MM/YYYY')}</p>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Thời gian: {dayjs(event.startTime).format('HH:mm')}</p>
                  <p>{event.eventType === 'online' ? 'Online' : 'Offline'}</p>
                  {event.attendees && event.attendees.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      {event.attendees.slice(0, 2).map((attendee, i) => (
                        <img
                          key={i}
                          src={attendee.avatar || '/default-avatar.png'}
                          alt={attendee.username}
                          className="w-6 h-6 rounded-full"
                        />
                      ))}
                      {event.attendees.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{event.attendees.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                {event.cv && (
                  <div className="mt-2 text-sm text-gray-500">
                    <a 
                      href={event.cv.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[#656ED3] hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      CV của {event.candidate?.name}
                    </a>
                  </div>
                )}
                <div className="mt-2 text-xs text-[#656ED3] opacity-0 group-hover:opacity-100 transition-opacity">
                  Nhấn để xem chi tiết →
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 border-t">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsAddEventModalVisible(true)}
            className="w-full bg-[#656ED3]"
          >
            Tạo lịch
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] mt-[80px] ml-[282px] bg-gray-100">
      <div className="flex gap-4 p-6 h-full overflow-auto">
        <div className="flex-1 bg-white rounded-xl shadow-sm">
          <AntCalendar
            locale={locale}
            cellRender={cellRender}
            onSelect={handleDateSelect}
          />
        </div>
        <div className="w-1/3">
          {renderEventDetails()}
        </div>

        <AddEventModal
          visible={isAddEventModalVisible}
          onClose={() => setIsAddEventModalVisible(false)}
          onSave={handleAddEvent}
          selectedDate={selectedDate}
        />
      </div>
    </div>
  );
};

export default Calendar; 