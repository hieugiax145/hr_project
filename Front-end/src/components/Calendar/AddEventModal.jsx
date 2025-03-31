import React, { useState } from 'react';
import { Modal, Input, Select, DatePicker, TimePicker, Button, Checkbox, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const AddEventModal = ({ visible, onClose, onSave }) => {
  const [form] = Form.useForm();
  const [description, setDescription] = useState('');

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const formData = {
        ...values,
        description,
      };
      onSave(formData);
      form.resetFields();
      setDescription('');
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
        <Button key="save" type="primary" onClick={handleSave} className="bg-[#656ED3]">
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
        }}
      >
        <div className="grid grid-cols-3 gap-4">
          {/* Cột 1 */}
          <div className="col-span-1 space-y-4">
            <Form.Item name="room" label="Thêm phòng">
              <Select placeholder="Chọn phòng">
                <Option value="room1">Phòng 1</Option>
                <Option value="room2">Phòng 2</Option>
              </Select>
            </Form.Item>

            <Form.Item name="addGuests" label="Thêm đối diện">
              <Select mode="multiple" placeholder="Thêm đối diện">
                <Option value="guest1">Nguyễn Văn A</Option>
                <Option value="guest2">Trần Thị B</Option>
              </Select>
            </Form.Item>

            <Form.Item name="beforeEvent" label="Trước 5 phút">
              <Select defaultValue="5min">
                <Option value="5min">5 phút</Option>
                <Option value="10min">10 phút</Option>
                <Option value="15min">15 phút</Option>
              </Select>
            </Form.Item>

            <Form.Item name="assignTo" label="Duyên DTM">
              <Input prefix={<PlusOutlined />} placeholder="Thêm người" />
            </Form.Item>

            <Form.Item name="eventType" label="Mặc định">
              <Select defaultValue="default">
                <Option value="default">Mặc định</Option>
                <Option value="important">Quan trọng</Option>
              </Select>
            </Form.Item>
          </div>

          {/* Cột 2 & 3 */}
          <div className="col-span-2 space-y-4">
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <div className="flex gap-4">
              <Form.Item name="date" label="Ngày" className="flex-1">
                <DatePicker locale={locale} className="w-full" />
              </Form.Item>

              <Form.Item name="startTime" label="Thời gian bắt đầu" className="flex-1">
                <TimePicker format="HH:mm" className="w-full" />
              </Form.Item>

              <Form.Item name="endTime" label="Thời gian kết thúc" className="flex-1">
                <TimePicker format="HH:mm" className="w-full" />
              </Form.Item>
            </div>

            <Form.Item name="allDay" valuePropName="checked">
              <Checkbox>Cả ngày</Checkbox>
            </Form.Item>

            <Form.Item label="Khách">
              <Input.Search placeholder="Thêm khách mời" />
              <div className="mt-2">
                <Checkbox>Khách có thể sửa được</Checkbox>
                <Checkbox>Mời người khác</Checkbox>
                <Checkbox>Xem danh sách khách</Checkbox>
              </div>
            </Form.Item>

            <Form.Item label="Mô tả chi tiết">
              <ReactQuill
                value={description}
                onChange={setDescription}
                className="h-32"
                modules={{
                  toolbar: [
                    ['bold', 'italic', 'underline'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['link'],
                  ]
                }}
              />
            </Form.Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AddEventModal; 