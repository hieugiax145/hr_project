import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, message, Spin, Calendar } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import locale from 'antd/es/calendar/locale/vi_VN';
import 'dayjs/locale/vi';

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEventDetail();
    fetchAllEvents();
  }, [eventId]);

  const fetchEventDetail = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/interviews/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event detail:', error);
      message.error('Không thể tải thông tin chi tiết lịch');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/interviews', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const cellRender = (current) => {
    const dateEvents = events.filter(event => 
      dayjs(event.date).format('YYYY-MM-DD') === current.format('YYYY-MM-DD')
    );

    return (
      <ul className="events p-0 m-0">
        {dateEvents.map((evt, index) => (
          <li key={evt._id || index} className="list-none">
            <div 
              className={`text-xs p-1 rounded ${
                evt._id === eventId 
                  ? 'bg-[#656ED3] text-white' 
                  : 'bg-gray-100'
              }`}
            >
              {evt.title}
            </div>
          </li>
        ))}
      </ul>
    );
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
      <div className="mb-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/calendar')}
        >
          Quay lại
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Cột thông tin chi tiết */}
        <div className="col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-6">{event?.title}</h2>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-600 block mb-1">Ngày</label>
                <p>{dayjs(event?.date).format('DD/MM/YYYY')}</p>
              </div>
              <div>
                <label className="text-gray-600 block mb-1">Thời gian</label>
                <p>{dayjs(event?.startTime).format('HH:mm')} - {dayjs(event?.endTime).format('HH:mm')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-600 block mb-1">Hình thức</label>
                <p>{event?.eventType === 'online' ? 'Online' : 'Offline'}</p>
              </div>
              <div>
                <label className="text-gray-600 block mb-1">Địa điểm</label>
                <p>{event?.location || 'Chưa có'}</p>
              </div>
            </div>

            <div>
              <label className="text-gray-600 block mb-1">Phòng họp</label>
              <p>{event?.room || 'Chưa có'}</p>
            </div>

            <div>
              <label className="text-gray-600 block mb-1">Ứng viên</label>
              <p className="flex items-center gap-2">
                {event?.candidate?.name || 'Chưa có'}
                {event?.candidate?.cv && (
                  <a 
                    href={event.candidate.cv.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#656ED3] hover:underline text-sm"
                  >
                    (Xem CV)
                  </a>
                )}
              </p>
            </div>

            <div>
              <label className="text-gray-600 block mb-1">Người phỏng vấn</label>
              <div className="flex flex-wrap gap-2">
                {event?.interviewers?.map((interviewer, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <img
                      src={interviewer.avatar || '/default-avatar.png'}
                      alt={interviewer.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span>{interviewer.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {event?.notes && (
              <div>
                <label className="text-gray-600 block mb-1">Ghi chú</label>
                <p className="whitespace-pre-wrap">{event.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Cột lịch */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <Calendar
            locale={locale}
            fullscreen={false}
            cellRender={cellRender}
            value={dayjs(event?.date)}
            className="custom-calendar"
          />
        </div>
      </div>
    </div>
  );
};

export default EventDetail; 