import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Space, Typography, DatePicker, Upload, Radio, Table, Checkbox, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { notificationService } from '../../services/notificationService';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const CreateNotification = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [trainingCourses, setTrainingCourses] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [hrList, setHrList] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [candidatesRes, hrRes] = await Promise.all([
        notificationService.getEligibleCandidates(),
        notificationService.getHRList()
      ]);
      setCandidates(candidatesRes.data);
      setHrList(hrRes.data);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu');
    }
  };

  const onCandidateChange = (value) => {
    const candidate = candidates.find(c => c._id === value);
    setSelectedCandidate(candidate);
    if (candidate) {
      form.setFieldsValue({
        position: candidate.position,
        department: candidate.department,
        branch: candidate.branch
      });
    }
  };

  const trainingColumns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1
    },
    {
      title: 'Tên khóa huấn luyện, đào tạo/ Chứng chỉ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Nơi cấp',
      dataIndex: 'issuedBy',
      key: 'issuedBy',
    },
    {
      title: 'Năm',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_, __, index) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />}
          onClick={() => {
            const newData = [...trainingCourses];
            newData.splice(index, 1);
            setTrainingCourses(newData);
          }}
        />
      )
    }
  ];

  const preparationColumns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Bộ phận thực hiện',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 100,
      render: (_, __, index) => (
        <Button 
          type="text" 
          danger 
          icon={<DeleteOutlined />}
        />
      )
    }
  ];

  const onFinish = async (values) => {
    try {
      const formData = new FormData();

      // Xử lý dữ liệu cơ bản
      Object.keys(values).forEach(key => {
        if (key === 'birthDate' || key === 'startDate' || key === 'idCard.issueDate') {
          formData.append(key, values[key].format('YYYY-MM-DD'));
        } else if (key === 'personalPhoto' && values[key]?.fileList?.[0]?.originFileObj) {
          formData.append('personalPhoto', values[key].fileList[0].originFileObj);
        } else if (key === 'idCard.photos' && values[key]?.fileList) {
          values[key].fileList.forEach(file => {
            formData.append('idCardPhotos', file.originFileObj);
          });
        } else if (Array.isArray(values[key])) {
          formData.append(key, JSON.stringify(values[key]));
        } else if (typeof values[key] === 'object') {
          formData.append(key, JSON.stringify(values[key]));
        } else {
          formData.append(key, values[key]);
        }
      });

      await notificationService.createNotification(formData);
      message.success('Tạo thông báo thành công');
      navigate('/notifications');
    } catch (error) {
      message.error('Lỗi khi tạo thông báo');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-[80px] ml-[282px]">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/notifications')}
          >
            Quay lại
          </Button>
          <Title level={4} className="m-0">Khởi tạo thông báo ứng viên mới</Title>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="max-w-[800px]"
        >
          {/* THÔNG TIN TIẾP NHẬN */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">THÔNG TIN TIẾP NHẬN</h2>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label={<span>Họ và tên <span className="text-red-500">*</span></span>}
                name="candidateId"
                rules={[{ required: true, message: 'Vui lòng chọn ứng viên' }]}
              >
                <Select onChange={onCandidateChange}>
                  {candidates.map(candidate => (
                    <Option key={candidate._id} value={candidate._id}>{candidate.name}</Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Chức vụ"
                name="position"
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                label="Phòng"
                name="department"
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                label="Chi nhánh"
                name="branch"
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                label="Nhân sự phụ trách"
                name="hrInCharge"
                rules={[{ required: true, message: 'Vui lòng chọn nhân sự phụ trách' }]}
              >
                <Select>
                  {hrList.map(hr => (
                    <Option key={hr._id} value={hr._id}>{hr.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>

          {/* THÔNG TIN CÁ NHÂN */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">THÔNG TIN CÁ NHÂN</h2>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Giới tính"
                name="gender"
              >
                <Radio.Group>
                  <Radio value="male">Nam</Radio>
                  <Radio value="female">Nữ</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Ngày sinh"
                name="birthDate"
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>

              <Form.Item
                label="Căn cước công dân"
                name="idCard.number"
              >
                <Input placeholder="Nhập CCCD" />
              </Form.Item>

              <Form.Item
                label="Ngày cấp CCCD"
                name="idCard.issueDate"
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>

              <Form.Item
                label="Nơi cấp CCCD"
                name="idCard.issuePlace"
                className="col-span-2"
              >
                <Input placeholder="Nhập nơi cấp CCCD" />
              </Form.Item>

              <Form.Item
                label="Ảnh CCCD (2 mặt)"
                name="idCard.photos"
              >
                <Upload
                  listType="picture-card"
                  maxCount={2}
                  beforeUpload={() => false}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Tải lên</div>
                  </div>
                </Upload>
              </Form.Item>
            </div>

            <h3 className="text-base font-medium mt-6 mb-4">Thông tin khác:</h3>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Ngày vào làm việc"
                name="startDate"
              >
                <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
              </Form.Item>

              <Form.Item
                label="Số sổ BHXH"
                name="insuranceNumber"
              >
                <Input placeholder="Nhập thông tin mô tả" />
              </Form.Item>

              <Form.Item
                label="Mã số thuế cá nhân"
                name="taxCode"
              >
                <Input placeholder="Nhập mã số thuế" />
              </Form.Item>

              <Form.Item
                label="Số tài khoản"
                name="bankAccount.number"
              >
                <Input placeholder="Nhập thông tin mô tả" />
              </Form.Item>

              <Form.Item
                label="Tại ngân hàng"
                name="bankAccount.bank"
              >
                <Input placeholder="Nhập thông tin mô tả" />
              </Form.Item>
            </div>
          </div>

          {/* THÔNG TIN LIÊN HỆ */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">THÔNG TIN LIÊN HỆ</h2>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Số điện thoại"
                name="phone"
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
              >
                <Input placeholder="Nhập email" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ thường trú"
                name="permanentAddress"
                className="col-span-2"
              >
                <Input placeholder="Nhập địa chỉ thường trú" />
              </Form.Item>
            </div>

            <h3 className="text-base font-medium mt-6 mb-4">Liên hệ khẩn:</h3>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Họ tên"
                name="emergencyContact.name"
              >
                <Input placeholder="Nhập thông tin mô tả" />
              </Form.Item>

              <Form.Item
                label="Mối quan hệ"
                name="emergencyContact.relationship"
              >
                <Input placeholder="Nhập thông tin mô tả" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="emergencyContact.phone"
              >
                <Input placeholder="Nhập thông tin số điện thoại" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="emergencyContact.email"
              >
                <Input placeholder="Nhập thông tin email" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ"
                name="emergencyContact.address"
                className="col-span-2"
              >
                <Input placeholder="Nhập thông tin mô tả" />
              </Form.Item>
            </div>
          </div>

          {/* HỌC VẤN */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">HỌC VẤN</h2>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Trình độ"
                name="education.level"
              >
                <Select>
                  <Option value="postgraduate">Sau đại học</Option>
                  <Option value="university">Đại học</Option>
                  <Option value="college">Cao đẳng</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label="Tên trường"
                name="education.schoolName"
              >
                <Input placeholder="Nhập thông tin mô tả" />
              </Form.Item>

              <Form.Item
                label="Chuyên ngành"
                name="education.major"
              >
                <Input placeholder="Nhập thông tin mô tả" />
              </Form.Item>

              <Form.Item
                label="Năm tốt nghiệp"
                name="education.graduationYear"
              >
                <Input placeholder="Nhập thông tin mô tả" />
              </Form.Item>
            </div>
          </div>

          {/* Các khóa huấn luyện, đào tạo */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Các khóa huấn luyện, đào tạo/ Chứng chỉ (Tin học, ngoại ngữ, chứng chỉ chuyên môn, ...)</h2>
            <Table
              columns={trainingColumns}
              dataSource={trainingCourses}
              pagination={false}
              className="mb-4"
            />
            <Button 
              type="dashed" 
              block 
              icon={<PlusOutlined />}
              onClick={() => setTrainingCourses([...trainingCourses, {}])}
            >
              Thêm 1 dòng
            </Button>
          </div>

          {/* NGUYỆN VỌNG */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">NGUYỆN VỌNG</h2>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Mức lương"
                name="expectedSalary"
              >
                <Input defaultValue="8 triệu" />
              </Form.Item>

              <Form.Item
                label="Loại hợp đồng"
                name="contractType"
              >
                <Input defaultValue="Thử việc" />
              </Form.Item>
            </div>
          </div>

          {/* HỒ SƠ CÁ NHÂN NỘP CÔNG TY */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">HỒ SƠ CÁ NHÂN NỘP CÔNG TY</h2>
            <Form.Item name="documents">
              <Checkbox.Group>
                <Space direction="vertical">
                  <Checkbox value="personalInfo">Sơ yếu lý lịch</Checkbox>
                  <Checkbox value="criminalRecord">Lý lịch tư pháp</Checkbox>
                  <Checkbox value="photos">Ảnh</Checkbox>
                  <Checkbox value="healthCert">Giấy khám sức khỏe</Checkbox>
                  <Checkbox value="degree">Bằng cấp</Checkbox>
                  <Checkbox value="idCard">CCCD</Checkbox>
                  <Checkbox value="householdReg">Sổ hộ khẩu</Checkbox>
                  <Checkbox value="insurance">Sổ BHXH</Checkbox>
                </Space>
              </Checkbox.Group>
            </Form.Item>
          </div>

          {/* CÔNG VIỆC CẦN CHUẨN BỊ */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">CÔNG VIỆC CẦN CHUẨN BỊ</h2>
            <Table
              columns={preparationColumns}
              dataSource={[
                {
                  content: [
                    'Chỗ ngồi làm việc',
                    'Phụ cấp hành chính khác: vé xe'
                  ].join('\n'),
                  department: 'Hành chính nhân sự'
                },
                {
                  content: [
                    'Hồ sơ nhân sự mới (thư mời nhận việc, thông tin nhân sự...)',
                    'Chào mừng nhân sự mới: giới thiệu nhân sự với các phòng',
                    'Đào tạo hội nhập (nội quy, quy định, chính sách công ty, ...)'
                  ].join('\n'),
                  department: 'Hành chính nhân sự'
                },
                {
                  content: [
                    'Cung cấp tài khoản nội bộ',
                    'Cài đặt tài khoản trên thiết bị máy tính, điện thoại',
                    'Hướng dẫn sử dụng (email, IP, server,...) cho nhân viên mới'
                  ].join('\n'),
                  department: 'Hành chính nhân sự'
                }
              ]}
              pagination={false}
              className="mb-4"
            />
            <Button 
              type="dashed" 
              block 
              icon={<PlusOutlined />}
            >
              Thêm 1 dòng
            </Button>
          </div>

          {/* Buttons */}
          <Form.Item className="mt-8">
            <Space>
              <Button onClick={() => navigate('/notifications')}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" className="bg-[#656ED3]">
                Tạo mới
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default CreateNotification; 