import React, { useState, useEffect } from 'react';
import { Layout, List, Avatar, Button, Input, Space, Checkbox, Tooltip, message, Tabs } from 'antd';
import { SearchOutlined, ReloadOutlined, DeleteOutlined, StarOutlined, ArrowRightOutlined, ArrowLeftOutlined, PaperClipOutlined, CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import DOMPurify from 'dompurify';

const { Content } = Layout;
const { TabPane } = Tabs;
const API_BASE_URL = 'http://localhost:8000/api';

const EmailList = () => {
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    fetchEmails(1);
  }, []);

  const fetchEmails = async (pageNum) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/emails?page=${pageNum}&limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        const { emails: newEmails, total: totalEmails } = response.data;
        // Sắp xếp email mới nhất lên đầu
        const sortedEmails = [...newEmails].sort((a, b) => new Date(b.date) - new Date(a.date));
        setEmails(prev => pageNum === 1 ? sortedEmails : [...prev, ...sortedEmails]);
        setHasMore(emails.length + newEmails.length < totalEmails);
        setPage(pageNum);
      }
    } catch (error) {
      console.error('Error fetching emails:', error);
      message.error('Có lỗi xảy ra khi tải email');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    fetchEmails(page + 1);
  };

  const handleEmailClick = (email) => {
    if (selectedEmail?._id === email._id && showDetail) {
      // Nếu click vào email đang được chọn và panel đang mở, đóng panel
      setSelectedEmail(null);
      setShowDetail(false);
    } else {
      // Trong mọi trường hợp khác (click email mới hoặc click lại email cũ khi panel đã đóng)
      setSelectedEmail(email);
      setShowDetail(true);
    }
  };

  const handleCloseDetail = () => {
    setSelectedEmail(null);
    setShowDetail(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderEmailContent = (email) => {
    if (email.html) {
      // Nếu email có nội dung HTML, sanitize và render nó
      return (
        <div 
          dangerouslySetInnerHTML={{ 
            __html: DOMPurify.sanitize(email.html, { 
              ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a', 'img'],
              ALLOWED_ATTR: ['href', 'src', 'alt', 'style']
            }) 
          }} 
        />
      );
    }

    // Nếu không có HTML, hiển thị text preview
    return <div style={{ whiteSpace: 'pre-wrap' }}>{email.preview}</div>;
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Layout style={{ marginLeft: 282 }}>
        <Content style={{ margin: '80px 16px 24px', minHeight: 280 }}>
          <div style={{ 
            display: 'flex',
            gap: '16px',
            height: 'calc(100vh - 120px)'
          }}>
            {/* Left Panel - Email List */}
            <div style={{ 
              width: showDetail ? '400px' : '100%',
              background: '#fff',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'width 0.3s ease'
            }}>
              {/* Search Bar */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
                <Input
                  placeholder="Tìm kiếm"
                  prefix={<SearchOutlined />}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Email Categories */}
              <div style={{ 
                padding: '8px 24px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                gap: '16px',
                overflowX: 'auto',
                whiteSpace: 'nowrap'
              }}>
                <Button type="text">Thư đã gửi</Button>
                <Button type="text">Thư mẫu</Button>
                <Button type="text">Thư đến</Button>
                <Button type="text">Thước lọc</Button>
                <Button type="text" style={{ color: '#7B61FF' }}>Xem tất cả</Button>
                <Button type="primary" style={{ marginLeft: 'auto', background: '#7B61FF' }}>
                  + Thêm mới
                </Button>
              </div>

              {/* Toolbar */}
              <div style={{ 
                padding: '8px 24px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                gap: '8px',
                alignItems: 'center'
              }}>
                <Button type="text" icon={<ReloadOutlined />} />
                <Button type="text" icon={<DeleteOutlined />} />
                <Button type="text" icon={<ArrowRightOutlined />} />
                <Button type="text" icon={<ArrowLeftOutlined />} />
              </div>

              {/* Email List */}
              <div style={{ flex: 1, overflow: 'auto' }}>
                <List
                  loading={loading}
                  dataSource={emails}
                  renderItem={email => (
                    <div 
                      onClick={() => handleEmailClick(email)}
                      style={{
                        padding: '12px 24px',
                        borderBottom: '1px solid #f0f0f0',
                        cursor: 'pointer',
                        background: selectedEmail?._id === email._id ? '#f0f7ff' : 'white',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                      }}
                    >
                      <Checkbox checked={false} onClick={e => e.stopPropagation()} />
                      <StarOutlined style={{ color: '#d9d9d9', marginTop: '4px' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 500, marginBottom: '4px' }}>
                          {email.from}
                        </div>
                        <div style={{ fontWeight: 500, color: '#666' }}>
                          {email.subject}
                        </div>
                        <div style={{ 
                          color: '#666',
                          fontSize: '14px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {email.preview}
                        </div>
                      </div>
                      <div style={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: '4px',
                        minWidth: 'fit-content'
                      }}>
                        <span style={{ color: '#666', fontSize: '12px' }}>
                          {formatDate(email.date)}
                        </span>
                        {email.attachments?.length > 0 && (
                          <PaperClipOutlined style={{ color: '#666' }} />
                        )}
                      </div>
                    </div>
                  )}
                />
                {hasMore && (
                  <div style={{ textAlign: 'center', padding: '12px' }}>
                    <Button onClick={handleLoadMore} loading={loading}>
                      Tải thêm
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel - Email Detail */}
            {showDetail && (
              <div style={{ 
                flex: 1,
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}>
                {selectedEmail ? (
                  <>
                    <div style={{ 
                      padding: '16px 24px',
                      borderBottom: '1px solid #f0f0f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <h2 style={{ margin: 0 }}>{selectedEmail.subject}</h2>
                      <Space>
                        <Button icon={<DeleteOutlined />}>Xóa</Button>
                        <Button icon={<StarOutlined />}>Đánh dấu</Button>
                        <Button icon={<ArrowRightOutlined />}>Chuyển tiếp</Button>
                        <Button icon={<CloseOutlined />} onClick={handleCloseDetail}>Đóng</Button>
                      </Space>
                    </div>
                    <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginBottom: '24px'
                      }}>
                        <Avatar size={40}>{selectedEmail.from[0]}</Avatar>
                        <div>
                          <div style={{ fontWeight: 500 }}>{selectedEmail.from}</div>
                          <div style={{ color: '#666', fontSize: '14px' }}>
                            đến: tôi
                          </div>
                        </div>
                        <div style={{ 
                          marginLeft: 'auto',
                          color: '#666',
                          fontSize: '14px'
                        }}>
                          {formatDate(selectedEmail.date)}
                        </div>
                      </div>
                      
                      {/* Email Content */}
                      <div className="email-content">
                        {renderEmailContent(selectedEmail)}
                      </div>

                      {/* Attachments section remains the same */}
                      {selectedEmail.attachments?.length > 0 && (
                        <div style={{ 
                          marginTop: '24px',
                          padding: '16px',
                          background: '#f5f5f5',
                          borderRadius: '8px'
                        }}>
                          <div style={{ marginBottom: '8px', fontWeight: 500 }}>
                            Tệp đính kèm ({selectedEmail.attachments.length})
                          </div>
                          {selectedEmail.attachments.map((attachment, index) => (
                            <div 
                              key={index}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px',
                                background: 'white',
                                borderRadius: '4px',
                                marginBottom: '8px'
                              }}
                            >
                              <PaperClipOutlined />
                              <div style={{ flex: 1 }}>
                                <div>{attachment.filename}</div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                  {Math.round(attachment.size / 1024)} KB
                                </div>
                              </div>
                              <Button size="small">Tải xuống</Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div style={{ 
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666'
                  }}>
                    Chọn một email để xem chi tiết
                  </div>
                )}
              </div>
            )}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default EmailList; 