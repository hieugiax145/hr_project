import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, message, Spin } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import CalendarSidebar from '../components/Calendar/CalendarSidebar';
import Sidebar from '../components/Sidebar/Sidebar';

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedView, setSelectedView] = useState('Tuần');

  useEffect(() => {
    if (!eventId) {
      message.error('ID sự kiện không hợp lệ');
      navigate('/calendar');
      return;
    }

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

      const response = await axios.get(`http://localhost:8000/api/interviews/${eventId}`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data) {
        setEvent(response.data);
        if (response.data.date) {
          setSelectedDate(dayjs(response.data.date));
        }
      }
    } catch (error) {
      console.error('Error fetching event detail:', error);
      if (error.response?.status === 404) {
        message.error('Không tìm thấy sự kiện này');
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
        headers: { Authorization: `Bearer ${token}` }
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
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 ml-[250px]">
        <CalendarSidebar />
        <div className="flex-1 ml-[250px] p-6 pt-[104px] pl-[298px]">
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
              <div className="flex border rounded-lg overflow-hidden">
                <button 
                  className={`px-4 py-1 ${selectedView === 'Ngày' ? 'bg-[#7B61FF] text-white' : 'bg-white'}`}
                  onClick={() => setSelectedView('Ngày')}
                >
                  Ngày
                </button>
                <button 
                  className={`px-4 py-1 ${selectedView === 'Tuần' ? 'bg-[#7B61FF] text-white' : 'bg-white'}`}
                  onClick={() => setSelectedView('Tuần')}
                >
                  Tuần
                </button>
                <button 
                  className={`px-4 py-1 ${selectedView === 'Tháng' ? 'bg-[#7B61FF] text-white' : 'bg-white'}`}
                  onClick={() => setSelectedView('Tháng')}
                >
                  Tháng
                </button>
              </div>
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                className="bg-[#7B61FF] hover:bg-[#6B51EF]"
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
                      ? 'bg-[#F4F1FE]' 
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
                      <div 
                        key={dayIndex}
                        className={`border-r relative ${
                          date.format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
                            ? 'bg-[#F4F1FE]'
                            : ''
                        }`}
                      >
                        {dayEvents.map((event, eventIndex) => {
                          const startTime = dayjs(event.startTime);
                          if (startTime.format('HH') === time.split(':')[0]) {
                            return (
                              <div
                                key={eventIndex}
                                className="absolute left-0 right-0 mx-1 p-1 bg-[#E7F6EC] text-[#12B76A] text-xs rounded"
                                style={{
                                  top: '0',
                                  zIndex: 10
                                }}
                                onClick={() => navigate(`/calendar/event/${event._id}`)}
                              >
                                {event.title}
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
      </div>
    </div>
  );
};

export default EventDetail; 