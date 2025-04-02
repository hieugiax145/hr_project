import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Space, Typography, DatePicker, Upload, Radio, Table, Checkbox, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { notificationService } from '../../services/notificationService';

const { Title } = Typography;
const { Option } = Select;

const CreateNotification = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [trainingCourses, setTrainingCourses] = useState([]);
  const [preparationTasks, setPreparationTasks] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [hrList, setHrList] = useState([]);
  const [fileList, setFileList] = useState({
    personalPhoto: [],
    idCardPhotos: []
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [candidatesRes, hrRes] = await Promise.all([
        notificationService.getEligibleCandidates(),
        notificationService.getHRList()
      ]);
      console.log('Candidates response:', candidatesRes);
      console.log('HR response:', hrRes);
      setCandidates(Array.isArray(candidatesRes?.data) ? candidatesRes.data : []);
      setHrList(Array.isArray(hrRes) ? hrRes : []);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu');
      console.error('Error loading data:', error);
    }
  };

  const onCandidateChange = (value) => {
    const selectedCandidate = candidates.find(c => c._id === value);
    if (selectedCandidate) {
      console.log('Selected candidate:', selectedCandidate);
      form.setFieldsValue({
        candidateId: value,
        fullName: selectedCandidate.name,
        position: selectedCandidate.positionId?.title || 'Chưa có chức vụ',
        department: selectedCandidate.positionId?.department || 'Chưa có phòng ban',
        branch: selectedCandidate.positionId?.branch || 'Chưa có chi nhánh',
        email: selectedCandidate.email,
        phone: selectedCandidate.phone,
        address: selectedCandidate.address || '',
        education: selectedCandidate.education || '',
        experience: selectedCandidate.experience || '',
        skills: selectedCandidate.skills || '',
        hrInCharge: selectedCandidate.hrInCharge || undefined
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
      render: (_, record, index) => (
        <Input
          value={record.name}
          onChange={(e) => {
            const newData = [...trainingCourses];
            newData[index].name = e.target.value;
            setTrainingCourses(newData);
          }}
        />
      )
    },
    {
      title: 'Nơi cấp',
      dataIndex: 'issuedBy',
      key: 'issuedBy',
      render: (_, record, index) => (
        <Input
          value={record.issuedBy}
          onChange={(e) => {
            const newData = [...trainingCourses];
            newData[index].issuedBy = e.target.value;
            setTrainingCourses(newData);
          }}
        />
      )
    },
    {
      title: 'Năm',
      dataIndex: 'year',
      key: 'year',
      render: (_, record, index) => (
        <Input
          value={record.year}
          onChange={(e) => {
            const newData = [...trainingCourses];
            newData[index].year = e.target.value;
            setTrainingCourses(newData);
          }}
        />
      )
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
      render: (_, record, index) => (
        <Input.TextArea
          value={record.content}
          onChange={(e) => {
            const newData = [...preparationTasks];
            newData[index].content = e.target.value;
            setPreparationTasks(newData);
          }}
        />
      )
    },
    {
      title: 'Bộ phận thực hiện',
      dataIndex: 'department',
      key: 'department',
      render: (_, record, index) => (
        <Input
          value={record.department}
          onChange={(e) => {
            const newData = [...preparationTasks];
            newData[index].department = e.target.value;
            setPreparationTasks(newData);
          }}
        />
      )
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
            const newData = [...preparationTasks];
            newData.splice(index, 1);
            setPreparationTasks(newData);
          }}
        />
      )
    }
  ];

  const onFinish = async (values) => {
    try {
      console.log('Form values before processing:', values);
      
      // Kiểm tra xem có candidateId không
      if (!values.candidateId) {
        message.error('Vui lòng chọn ứng viên');
        return;
      }

      const formData = new FormData();

      // Xử lý dữ liệu cơ bản
      Object.keys(values).forEach(key => {
        if (key === 'birthDate' || key === 'startDate' || key === 'idCard.issueDate') {
          if (values[key]) {
            formData.append(key, values[key].format('YYYY-MM-DD'));
          }
        } else if (key === 'personalPhoto' && values[key]?.fileList?.[0]?.originFileObj) {
          formData.append('personalPhoto', values[key].fileList[0].originFileObj);
        } else if (key === 'idCard.photos' && values[key]?.fileList) {
          values[key].fileList.forEach(file => {
            formData.append('idCardPhotos', file.originFileObj);
          });
        } else if (key === 'idCard') {
          // Xử lý nested object idCard
          Object.keys(values[key]).forEach(idCardKey => {
            if (idCardKey === 'issueDate' && values[key][idCardKey]) {
              formData.append(`idCard.${idCardKey}`, values[key][idCardKey].format('YYYY-MM-DD'));
            } else {
              formData.append(`idCard.${idCardKey}`, values[key][idCardKey]);
            }
          });
        } else if (key === 'bankAccount') {
          // Xử lý nested object bankAccount
          Object.keys(values[key]).forEach(bankKey => {
            formData.append(`bankAccount.${bankKey}`, values[key][bankKey]);
          });
        } else if (key === 'emergencyContact') {
          // Xử lý nested object emergencyContact
          Object.keys(values[key]).forEach(contactKey => {
            formData.append(`emergencyContact.${contactKey}`, values[key][contactKey]);
          });
        } else if (key === 'education') {
          // Xử lý nested object education
          Object.keys(values[key]).forEach(eduKey => {
            formData.append(`education.${eduKey}`, values[key][eduKey]);
          });
        } else if (Array.isArray(values[key])) {
          formData.append(key, JSON.stringify(values[key]));
        } else if (typeof values[key] === 'object' && values[key] !== null) {
          formData.append(key, JSON.stringify(values[key]));
        } else if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      // Thêm dữ liệu từ state
      if (trainingCourses.length > 0) {
        formData.append('trainingCourses', JSON.stringify(trainingCourses));
      }
      if (preparationTasks.length > 0) {
        formData.append('preparationTasks', JSON.stringify(preparationTasks));
      }

      // Log formData để debug
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      await notificationService.createNotification(formData);
      message.success('Tạo thông báo thành công');
      navigate('/notifications');
    } catch (error) {
      console.error('Error creating notification:', error);
      message.error(error.response?.data?.message || 'Lỗi khi tạo thông báo');
    }
  };

  return (
    <div className="p-6 pt-[104px] pl-[298px]">
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
          initialValues={{
            personalPhoto: { fileList: [] },
            'idCard.photos': { fileList: [] }
          }}
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
                label={<span>Nhân sự phụ trách <span className="text-red-500">*</span></span>}
                name="hrInCharge"
                rules={[{ required: true, message: 'Vui lòng chọn nhân sự phụ trách' }]}
              >
                <Select>
                  {hrList.map(hr => (
                    <Option key={hr._id} value={hr._id}>{hr.fullName}</Option>
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
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item
                label="CMND/CCCD"
                name="idCard.number"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Ngày cấp"
                name="idCard.issueDate"
              >
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item
                label="Nơi cấp"
                name="idCard.issuePlace"
                className="col-span-2"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Ảnh CMND/CCCD"
                name="idCard.photos"
                className="col-span-2"
              >
                <Upload
                  listType="picture-card"
                  maxCount={2}
                  fileList={fileList.idCardPhotos}
                  onChange={({ fileList }) => setFileList(prev => ({ ...prev, idCardPhotos: fileList }))}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
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
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item
                label="Số sổ BHXH"
                name="insuranceNumber"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Mã số thuế cá nhân"
                name="taxCode"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Số tài khoản"
                name="bankAccount.number"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Tại ngân hàng"
                name="bankAccount.bank"
              >
                <Input />
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
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Địa chỉ thường trú"
                name="permanentAddress"
                className="col-span-2"
              >
                <Input />
              </Form.Item>
            </div>

            <h3 className="text-base font-medium mt-6 mb-4">Liên hệ khẩn:</h3>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Họ tên"
                name="emergencyContact.name"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Mối quan hệ"
                name="emergencyContact.relationship"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="emergencyContact.phone"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name="emergencyContact.email"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Địa chỉ"
                name="emergencyContact.address"
                className="col-span-2"
              >
                <Input />
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
                <Input />
              </Form.Item>

              <Form.Item
                label="Chuyên ngành"
                name="education.major"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Năm tốt nghiệp"
                name="education.graduationYear"
              >
                <Input />
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
              rowKey="id"
            />
            <Button 
              type="dashed" 
              block 
              icon={<PlusOutlined />}
              onClick={() => setTrainingCourses([...trainingCourses, { id: Date.now(), name: '', issuedBy: '', year: '' }])}
              className="mt-4"
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
                <Input />
              </Form.Item>

              <Form.Item
                label="Loại hợp đồng"
                name="contractType"
              >
                <Input />
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
              dataSource={preparationTasks}
              pagination={false}
              rowKey="id"
            />
            <Button 
              type="dashed" 
              block 
              icon={<PlusOutlined />}
              onClick={() => setPreparationTasks([...preparationTasks, { id: Date.now(), content: '', department: '' }])}
              className="mt-4"
            >
              Thêm 1 dòng
            </Button>
          </div>

          <div className="flex justify-end gap-4">
            <Button onClick={() => navigate('/notifications')}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Lưu
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateNotification; 