import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Space, Typography, DatePicker, Upload, Radio, Table, Checkbox, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { notificationService } from '../../services/notificationService';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const EditNotification = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [trainingCourses, setTrainingCourses] = useState([]);
  const [preparationTasks, setPreparationTasks] = useState([]);
  const [hrList, setHrList] = useState([]);
  const [fileList, setFileList] = useState({
    personalPhoto: [],
    idCardPhotos: []
  });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [notificationRes, hrRes] = await Promise.all([
        notificationService.getNotificationById(id),
        notificationService.getHRList()
      ]);

      const notification = notificationRes.data;
      setHrList(Array.isArray(hrRes) ? hrRes : []);
      setNotification(notification);
      
      // Log để kiểm tra dữ liệu
      console.log('Raw notification data:', notification);
      console.log('HR list:', hrRes);
      
      // Chuyển đổi dữ liệu cho form
      const formValues = {
        ...notification,
        candidateId: notification.candidateId?._id || notification.candidateId,
        candidateName: notification.candidateId?.name || '',
        // Chuyển đổi các trường ngày tháng
        birthDate: notification.birthDate ? dayjs(notification.birthDate) : null,
        startDate: notification.startDate ? dayjs(notification.startDate) : null,
        
        // Xử lý dữ liệu CMND/CCCD
        'idCard.number': notification.idCard?.number || '',
        'idCard.issueDate': notification.idCard?.issueDate ? dayjs(notification.idCard.issueDate) : null,
        'idCard.issuePlace': notification.idCard?.issuePlace || '',
        
        // Xử lý dữ liệu tài khoản ngân hàng
        'bankAccount.number': notification.bankAccount?.number || '',
        'bankAccount.bank': notification.bankAccount?.bank || '',
        
        // Xử lý dữ liệu liên hệ khẩn cấp
        'emergencyContact.name': notification.emergencyContact?.name || '',
        'emergencyContact.relationship': notification.emergencyContact?.relationship || '',
        'emergencyContact.phone': notification.emergencyContact?.phone || '',
        'emergencyContact.email': notification.emergencyContact?.email || '',
        'emergencyContact.address': notification.emergencyContact?.address || '',
        
        // Xử lý dữ liệu học vấn
        'education.level': notification.education?.level || 'other',
        'education.schoolName': notification.education?.schoolName || '',
        'education.major': notification.education?.major || '',
        'education.graduationYear': notification.education?.graduationYear || '',
        
        // Các trường còn lại
        gender: notification.gender || 'male',
        insuranceNumber: notification.insuranceNumber || '',
        taxCode: notification.taxCode || '',
        phone: notification.phone || '',
        email: notification.email || '',
        permanentAddress: notification.permanentAddress || '',
        expectedSalary: notification.expectedSalary || '',
        contractType: notification.contractType || '',
        documents: notification.documents || [],
        hrInCharge: notification.hrInCharge?._id || notification.hrInCharge || ''
      };

      // Đảm bảo các mảng có giá trị mặc định
      setTrainingCourses(notification.trainingCourses || []);
      setPreparationTasks(notification.preparationTasks || []);

      // Xử lý ảnh
      if (notification.personalPhoto) {
        setFileList(prev => ({
          ...prev,
          personalPhoto: [{
            uid: '-1',
            name: 'personalPhoto',
            status: 'done',
            url: notification.personalPhoto,
            thumbUrl: notification.personalPhoto
          }]
        }));
      }

      if (notification.idCard?.photos) {
        setFileList(prev => ({
          ...prev,
          idCardPhotos: notification.idCard.photos.map((url, index) => ({
            uid: `-${index + 1}`,
            name: `idCardPhoto${index + 1}`,
            status: 'done',
            url: url,
            thumbUrl: url
          }))
        }));
      }

      // Log để kiểm tra dữ liệu
      console.log('Form values:', formValues);
      console.log('Training courses:', notification.trainingCourses);
      console.log('Preparation tasks:', notification.preparationTasks);
      console.log('File list:', fileList);

      form.setFieldsValue(formValues);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    try {
      // Lấy dữ liệu hiện tại từ form
      const currentFormData = form.getFieldsValue();
      
      // Kết hợp dữ liệu hiện tại với dữ liệu mới
      const updatedValues = {
        ...notification,
        ...currentFormData,
        ...values,
        candidateId: notification.candidateId?._id || notification.candidateId,
        
        // Đảm bảo cấu trúc dữ liệu đúng
        idCard: {
          number: values['idCard.number'] || notification.idCard?.number,
          issueDate: values['idCard.issueDate']?.format('YYYY-MM-DD') || notification.idCard?.issueDate,
          issuePlace: values['idCard.issuePlace'] || notification.idCard?.issuePlace,
          photos: notification.idCard?.photos || []
        },
        
        bankAccount: {
          number: values['bankAccount.number'] || notification.bankAccount?.number,
          bank: values['bankAccount.bank'] || notification.bankAccount?.bank
        },
        
        birthDate: values.birthDate?.format('YYYY-MM-DD') || notification.birthDate,
        startDate: values.startDate?.format('YYYY-MM-DD') || notification.startDate,
        
        emergencyContact: {
          name: values['emergencyContact.name'] || notification.emergencyContact?.name,
          relationship: values['emergencyContact.relationship'] || notification.emergencyContact?.relationship,
          phone: values['emergencyContact.phone'] || notification.emergencyContact?.phone,
          email: values['emergencyContact.email'] || notification.emergencyContact?.email,
          address: values['emergencyContact.address'] || notification.emergencyContact?.address
        },
        
        education: {
          level: values['education.level'] || notification.education?.level,
          schoolName: values['education.schoolName'] || notification.education?.schoolName,
          major: values['education.major'] || notification.education?.major,
          graduationYear: values['education.graduationYear'] || notification.education?.graduationYear
        }
      };

      // Tạo FormData và thêm dữ liệu
      const formData = new FormData();
      formData.append('data', JSON.stringify(updatedValues));

      // Thêm file mới nếu có
      if (values.personalPhoto?.fileList?.[0]?.originFileObj) {
        formData.append('personalPhoto', values.personalPhoto.fileList[0].originFileObj);
      }

      if (values.idCard?.photos?.fileList) {
        values.idCard.photos.fileList.forEach((file, index) => {
          if (file.originFileObj) {
            formData.append('idCardPhotos', file.originFileObj);
          }
        });
      }

      await notificationService.updateNotification(id, formData);
      message.success('Cập nhật thông báo thành công');
      navigate('/notifications');
    } catch (error) {
      console.error('Error updating notification:', error);
      message.error(error.response?.data?.message || 'Lỗi khi cập nhật thông báo');
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 pt-[80px] pl-[298px]">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/notifications')}
          >
            Quay lại
          </Button>
          <Title level={4} className="m-0">Chỉnh sửa thông báo ứng viên</Title>
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
                name="candidateName"
                rules={[{ required: false }]}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="candidateId"
                hidden
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Chức vụ"
                name="position"
                rules={[{ required: true, message: 'Vui lòng nhập chức vụ' }]}
              >
                <Input disabled value={notification?.position || ''} />
              </Form.Item>

              <Form.Item
                label="Phòng"
                name="department"
                rules={[{ required: true, message: 'Vui lòng nhập phòng ban' }]}
              >
                <Input disabled value={notification?.department || ''} />
              </Form.Item>

              <Form.Item
                label="Chi nhánh"
                name="branch"
                rules={[{ required: true, message: 'Vui lòng nhập chi nhánh' }]}
              >
                <Input disabled value={notification?.branch || ''} />
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
                label={<span>Ảnh cá nhân <span className="text-red-500">*</span></span>}
                name="personalPhoto"
                rules={[{ required: true, message: 'Vui lòng tải lên ảnh cá nhân' }]}
                className="col-span-2"
              >
                <Upload
                  listType="picture-card"
                  maxCount={1}
                  fileList={fileList.personalPhoto}
                  onChange={({ fileList }) => setFileList(prev => ({ ...prev, personalPhoto: fileList }))}
                >
                  <div>
                    <PlusOutlined />
                    <div style={{ marginTop: 8 }}>Upload</div>
                  </div>
                </Upload>
              </Form.Item>

              <Form.Item
                label={<span>Giới tính <span className="text-red-500">*</span></span>}
                name="gender"
                rules={[{ required: true, message: 'Vui lòng chọn giới tính' }]}
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

export default EditNotification; 