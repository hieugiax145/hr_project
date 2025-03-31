import React, { useState, useEffect } from 'react';
import { Layout, List, Avatar, Badge, Spin, message } from 'antd';
import axios from 'axios';

const { Content } = Layout;

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          message.error('Vui lòng đăng nhập lại');
          return;
        }

        const response = await axios.get('http://localhost:8000/api/notifications', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        message.error('Có lỗi xảy ra khi tải thông báo');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '📢';
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Layout style={{ marginLeft: 282 }}>
        <Content style={{ margin: '80px 16px 24px', minHeight: 280, overflow: 'auto' }}>
          <div className="bg-white rounded-lg p-6">
            <h1 className="text-xl font-bold mb-6">Thông báo</h1>
            
            <Spin spinning={loading}>
              <List
                itemLayout="horizontal"
                dataSource={notifications}
                renderItem={(item) => (
                  <List.Item className="hover:bg-gray-50 p-4 rounded-lg cursor-pointer">
                    <List.Item.Meta
                      avatar={
                        <Avatar className="bg-gray-200 flex items-center justify-center">
                          {getNotificationIcon(item.type)}
                        </Avatar>
                      }
                      title={
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.title}</span>
                          {!item.read && (
                            <Badge status="processing" color="#1890ff" />
                          )}
                        </div>
                      }
                      description={
                        <div className="text-sm text-gray-500">
                          <p>{item.message}</p>
                          <p className="mt-1">{new Date(item.createdAt).toLocaleString('vi-VN')}</p>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </Spin>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Notifications; 