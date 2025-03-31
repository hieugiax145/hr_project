import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, DatePicker, TimePicker, Button, Checkbox, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';
import axios from 'axios';

const { TextArea } = Input;
const { Option } = Select;

const AddEventModal = ({ visible, onClose, onSave }) => {
  const [form] = Form.useForm();
  const [candidates, setCandidates] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          message.error('Vui lòng đăng nhập lại');
          return;
        }

        // Fetch candidates
        try {
          const candidatesResponse = await axios.get('http://localhost:8000/api/candidates', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          console.log('Candidates response:', candidatesResponse.data);
          
          // Lấy dữ liệu từ response.candidates
          const candidatesData = candidatesResponse.data.candidates || [];
          
          if (Array.isArray(candidatesData)) {
            const availableCandidates = candidatesData.filter(
              candidate => candidate && 
              candidate.status && 
              candidate.status !== 'Từ chối' && 
              candidate.status !== 'Đã từ chối' &&
              candidate._id // Đảm bảo có _id
            );
            console.log('Available candidates:', availableCandidates);
            setCandidates(availableCandidates);
          } else {
            console.error('Candidates data is not an array:', candidatesData);
            message.error('Dữ liệu ứng viên không đúng định dạng');
          }
        } catch (error) {
          console.error('Error fetching candidates:', error);
          message.error('Không thể tải danh sách ứng viên');
        }

        // Fetch users
        try {
          const usersResponse = await axios.get('http://localhost:8000/api/users/all', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          const usersData = usersResponse.data;
          if (Array.isArray(usersData)) {
            setUsers(usersData);
          } else {
            console.error('Users data is not an array:', usersData);
            message.error('Dữ liệu người dùng không đúng định dạng');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
          if (error.response) {
            console.error('Server error:', error.response.data);
            message.error(error.response.data.message || 'Không thể tải danh sách người dùng');
          } else if (error.request) {
            console.error('No response:', error.request);
            message.error('Không thể kết nối đến server');
          } else {
            console.error('Error:', error.message);
            message.error('Có lỗi xảy ra khi tải danh sách người dùng');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchData();
    }
  }, [visible]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="Thêm sự kiện"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="save" type="primary" onClick={handleSave} className="bg-[#656ED3]" loading={loading}>
          Lưu
        </Button>,
      ]}
      width={800}
      className="add-event-modal"
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          date: dayjs(),
          startTime: dayjs('14:00', 'HH:mm'),
          endTime: dayjs('14:30', 'HH:mm'),
          eventType: 'offline',
          beforeEvent: '5min'
        }}
      >
        <div className="grid grid-cols-3 gap-4">
          {/* Cột 1 */}
          <div className="col-span-1 space-y-4">
            <Form.Item
              label="Phòng họp"
              name="room"
              rules={[{ required: true, message: 'Vui lòng chọn phòng họp' }]}
            >
              <Select
                variant="outlined"
                placeholder="Chọn phòng họp"
                options={[
                  { value: 'room1', label: 'Phòng họp 1' },
                  { value: 'room2', label: 'Phòng họp 2' },
                  { value: 'room3', label: 'Phòng họp 3' }
                ]}
              />
            </Form.Item>

            <Form.Item name="location" label="Địa điểm">
              <Input placeholder="Nhập địa điểm" />
            </Form.Item>

            <Form.Item name="assignTo" label="Chọn ứng viên">
              <Select
                showSearch
                placeholder="Chọn ứng viên"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                loading={loading}
              >
                {candidates && candidates.length > 0 ? (
                  candidates.map(candidate => (
                    <Option 
                      key={candidate._id} 
                      value={candidate._id}
                    >
                      {candidate.name} - {candidate.position} ({candidate.status})
                    </Option>
                  ))
                ) : (
                  <Option disabled>Không có ứng viên phù hợp</Option>
                )}
              </Select>
            </Form.Item>

            <Form.Item name="eventType" label="Hình thức">
              <Select>
                <Option value="offline">
                  <span className="text-blue-600">Offline</span>
                </Option>
                <Option value="online">
                  <span className="text-green-600">Online</span>
                </Option>
              </Select>
            </Form.Item>

            <Form.Item name="beforeEvent" label="Trước 5 phút">
              <Select>
                <Option value="5min">5 phút</Option>
                <Option value="10min">10 phút</Option>
                <Option value="15min">15 phút</Option>
              </Select>
            </Form.Item>
          </div>

          {/* Cột 2 & 3 */}
          <div className="col-span-2 space-y-4">
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
              <Input />
            </Form.Item>

            <div className="flex gap-4">
              <Form.Item name="date" label="Ngày" className="flex-1" rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}>
                <DatePicker locale={locale} className="w-full" />
              </Form.Item>

              <Form.Item name="startTime" label="Thời gian bắt đầu" className="flex-1" rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}>
                <TimePicker format="HH:mm" className="w-full" />
              </Form.Item>

              <Form.Item name="endTime" label="Thời gian kết thúc" className="flex-1" rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc' }]}>
                <TimePicker format="HH:mm" className="w-full" />
              </Form.Item>
            </div>

            <Form.Item name="allDay" valuePropName="checked">
              <Checkbox>Cả ngày</Checkbox>
            </Form.Item>

            <Form.Item
              label="Người tham dự"
              name="attendees"
              rules={[{ required: true, message: 'Vui lòng chọn người tham dự' }]}
            >
              <Select
                variant="outlined"
                mode="multiple"
                placeholder="Chọn người tham dự"
                options={users.filter(user => user && user._id).map(user => ({
                  value: user._id,
                  label: `${user.username} (${user.email})`
                }))}
                loading={loading}
              />
            </Form.Item>

            <Form.Item
              label="Loại cuộc họp"
              name="type"
              rules={[{ required: true, message: 'Vui lòng chọn loại cuộc họp' }]}
            >
              <Select
                variant="outlined"
                placeholder="Chọn loại cuộc họp"
                options={[
                  { value: 'interview', label: 'Phỏng vấn', color: '#1890ff' },
                  { value: 'meeting', label: 'Họp nội bộ', color: '#52c41a' },
                  { value: 'presentation', label: 'Thuyết trình', color: '#722ed1' }
                ]}
              />
            </Form.Item>

            <Form.Item
              label="Mô tả"
              name="description"
              rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
            >
              <TextArea
                rows={6}
                placeholder="Nhập mô tả chi tiết về cuộc họp"
                style={{ resize: 'none' }}
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AddEventModal; 