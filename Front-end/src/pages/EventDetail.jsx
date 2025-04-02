import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, message, Spin } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    if (!eventId) {
      message.error('ID sự kiện không hợp lệ');
      navigate('/calendar');
      return;
    }

    // Kiểm tra xem eventId có phải là một ngày không
    if (dayjs(eventId, 'YYYY-MM-DD', true).isValid()) {
      setSelectedDate(dayjs(eventId));
      setLoading(false);
    } else {
      fetchEventDetail();
    }
    fetchAllEvents();
  }, [eventId, navigate]);

  const fetchEventDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      // Log để debug
      console.log('Fetching event with ID:', eventId);

      const response = await axios.get(`http://localhost:8000/api/interviews/${eventId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Event detail response:', response.data);

      if (response.data) {
        setEvent(response.data);
        if (response.data.date) {
          setSelectedDate(dayjs(response.data.date));
        }
      } else {
        throw new Error('Không tìm thấy thông tin sự kiện');
      }
    } catch (error) {
      console.error('Error fetching event detail:', error);
      console.error('Error response:', error.response);
      
      if (error.response?.status === 404) {
        message.error('Không tìm thấy sự kiện này');
        // Chờ 2 giây trước khi chuyển hướng để người dùng đọc được thông báo
        setTimeout(() => navigate('/calendar'), 2000);
      } else if (error.response?.status === 401) {
        message.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
        navigate('/login');
      } else {
        message.error('Không thể tải thông tin chi tiết lịch');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:8000/api/interviews', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      if (error.response?.status === 401) {
        message.error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
        navigate('/login');
      } else {
        message.error('Không thể tải danh sách lịch');
      }
    }
  };

  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 9;
    return `${hour}:00`;
  });

  const getEventsForDay = (date) => {
    return events.filter(evt => 
      dayjs(evt.date).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    );
  };

  const getDaysInWeek = () => {
    const startOfWeek = selectedDate.startOf('week');
    return Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-[80px] ml-[282px]">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/calendar')}
          >
            Quay lại
          </Button>
          <h1 className="text-2xl font-semibold">
            {event ? event.title : `Tháng ${selectedDate.format('M')}, ${selectedDate.format('YYYY')}`}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button onClick={() => setSelectedDate(prev => prev.subtract(1, 'week'))}>
              &lt;
            </Button>
            <Button onClick={() => setSelectedDate(prev => prev.add(1, 'week'))}>
              &gt;
            </Button>
          </div>
          <div className="flex gap-2">
            <Button className={selectedDate.format('dddd') === 'Ngày' ? 'bg-blue-100' : ''}>Ngày</Button>
            <Button className="bg-blue-100">Tuần</Button>
            <Button>Tháng</Button>
          </div>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            className="bg-[#656ED3]"
            onClick={() => navigate('/calendar')}
          >
            Tạo lịch
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-4 border-r"></div>
          {getDaysInWeek().map((date, index) => (
            <div 
              key={index}
              className={`p-4 text-center border-r ${
                date.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD') 
                  ? 'bg-blue-50' 
                  : ''
              }`}
            >
              <div className="font-medium">T{date.format('d')}</div>
              <div className="text-lg">{date.format('D')}</div>
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div className="relative">
          {timeSlots.map((time, index) => (
            <div key={index} className="grid grid-cols-8 border-b" style={{ height: '60px' }}>
              <div className="p-2 border-r text-sm text-gray-500">{time}</div>
              {getDaysInWeek().map((date, dayIndex) => {
                const dayEvents = getEventsForDay(date);
                return (
                  <div key={dayIndex} className="border-r relative">
                    {dayEvents.map((evt, eventIndex) => {
                      if (dayjs(evt.startTime).format('HH:00') === time) {
                        const duration = dayjs(evt.endTime).diff(dayjs(evt.startTime), 'hour');
                        return (
                          <div
                            key={eventIndex}
                            className={`absolute w-[95%] left-[2.5%] rounded p-2 text-sm ${
                              evt._id === eventId
                                ? 'bg-[#656ED3] text-white'
                                : 'bg-[#E8F5E9] text-[#1B5E20]'
                            } border ${
                              evt._id === eventId
                                ? 'border-[#4E55A4]'
                                : 'border-[#A5D6A7]'
                            }`}
                            style={{
                              top: '0',
                              height: `${duration * 60}px`,
                              zIndex: evt._id === eventId ? 2 : 1
                            }}
                            onClick={() => navigate(`/calendar/event/${evt._id}`)}
                          >
                            <div className="font-medium">{evt.title}</div>
                            <div>{dayjs(evt.startTime).format('HH:mm')} - {dayjs(evt.endTime).format('HH:mm')}</div>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventDetail; 