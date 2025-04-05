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
  const [candidates, setCandidates] = useState([]);
  const [hrList, setHrList] = useState([]); 
  const [fileList, setFileList] = useState({
    personalPhoto: [],
    idCardPhotos: []
  });
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, [id]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [notificationRes, candidatesRes, hrRes] = await Promise.all([
        notificationService.getNotificationById(id),
        notificationService.getEligibleCandidates(),
        notificationService.getHRList()
      ]);
      
      console.log('Notification response:', notificationRes);
      console.log('Candidates response:', candidatesRes);
      console.log('HR response:', hrRes);
      
      // Store original data for comparison
      setOriginalData(notificationRes.data);
      
      // Set candidates and HR list
      setCandidates(Array.isArray(candidatesRes?.data) ? candidatesRes.data : []);
      setHrList(Array.isArray(hrRes) ? hrRes : []);
      
      // Set training courses and preparation tasks
      if (notificationRes.data.trainingCourses) {
        setTrainingCourses(notificationRes.data.trainingCourses.map((course, index) => ({
          ...course,
          id: index
        })));
      }
      
      if (notificationRes.data.preparationTasks) {
        setPreparationTasks(notificationRes.data.preparationTasks.map((task, index) => ({
          ...task,
          id: index
        })));
      }
      
      // Set file lists
      if (notificationRes.data.personalPhoto) {
        setFileList(prev => ({
          ...prev,
          personalPhoto: [{
            uid: '-1',
            name: 'personalPhoto',
            status: 'done',
            url: notificationRes.data.personalPhoto
          }]
        }));
      }
      
      if (notificationRes.data.idCard?.photos && notificationRes.data.idCard.photos.length > 0) {
        setFileList(prev => ({
          ...prev,
          idCardPhotos: notificationRes.data.idCard.photos.map((url, index) => ({
            uid: `-${index + 1}`,
            name: `idCardPhoto${index + 1}`,
            status: 'done',
            url: url
          }))
        }));
      }
      
      // Set form values
      const formValues = {
        candidateId: notificationRes.data.candidateId?._id,
        fullName: notificationRes.data.candidateId?.name,
        position: notificationRes.data.position,
        department: notificationRes.data.department,
        branch: notificationRes.data.branch,
        hrInCharge: notificationRes.data.hrInCharge?._id,
        gender: notificationRes.data.gender,
        birthDate: notificationRes.data.birthDate ? dayjs(notificationRes.data.birthDate) : null,
        idCard: {
          number: notificationRes.data.idCard?.number,
          issueDate: notificationRes.data.idCard?.issueDate ? dayjs(notificationRes.data.idCard.issueDate) : null,
          issuePlace: notificationRes.data.idCard?.issuePlace
        },
        startDate: notificationRes.data.startDate ? dayjs(notificationRes.data.startDate) : null,
        insuranceNumber: notificationRes.data.insuranceNumber,
        taxCode: notificationRes.data.taxCode,
        bankAccount: {
          number: notificationRes.data.bankAccount?.number,
          bank: notificationRes.data.bankAccount?.bank
        },
        phone: notificationRes.data.phone,
        email: notificationRes.data.email,
        permanentAddress: notificationRes.data.permanentAddress,
        emergencyContact: {
          name: notificationRes.data.emergencyContact?.name || '',
          relationship: notificationRes.data.emergencyContact?.relationship || '',
          phone: notificationRes.data.emergencyContact?.phone || '',
          email: notificationRes.data.emergencyContact?.email || '',
          address: notificationRes.data.emergencyContact?.address || ''
        },
        education: {
          level: notificationRes.data.education?.level || 'other',
          schoolName: notificationRes.data.education?.schoolName || '',
          major: notificationRes.data.education?.major || '',
          graduationYear: notificationRes.data.education?.graduationYear || ''
        },
        expectedSalary: notificationRes.data.expectedSalary,
        contractType: notificationRes.data.contractType,
        documents: notificationRes.data.documents || []
      };
      
      console.log('Setting form values:', formValues);
      form.setFieldsValue(formValues);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onCandidateChange = (value) => {
    console.log('Selected value:', value);
    const selectedCandidate = candidates.find(c => c._id === value);
    console.log('Selected candidate:', selectedCandidate);
    if (selectedCandidate) {
      const formValues = {
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
      };
      console.log('Setting form values:', formValues);
      form.setFieldsValue(formValues);
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
      console.log('onFinish function called');
      // Log chi tiết các giá trị form
      console.log('Form values:', JSON.stringify(values, null, 2));
      console.log('Original data:', JSON.stringify(originalData, null, 2));

      // Kiểm tra các trường bắt buộc
      const requiredFields = [
        'candidateId', 
        'hrInCharge', 
        'position', 
        'department', 
        'branch',
        'gender',
        'birthDate',
        'idCard.number',
        'idCard.issueDate',
        'idCard.issuePlace',
        'startDate',
        'insuranceNumber',
        'taxCode',
        'bankAccount.number',
        'bankAccount.bank'
      ];
      
      const missingFields = requiredFields.filter(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], values);
        console.log(`Checking field ${field}:`, value); // Log từng trường
        return !value;
      });
      
      if (missingFields.length > 0) {
        console.log('Missing fields:', missingFields); // Log các trường thiếu
        message.error(`Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`);
        return;
      }

      // Kiểm tra ảnh - Sửa lại logic kiểm tra để xử lý trường hợp ảnh đã tồn tại
      const hasPersonalPhoto = values.personalPhoto?.fileList?.[0]?.originFileObj || originalData.personalPhoto;
      if (!hasPersonalPhoto) {
        message.error('Vui lòng tải lên ảnh cá nhân');
        return;
      }

      const hasIdCardPhotos = (values.idCard?.photos?.fileList && values.idCard.photos.fileList.length > 0) || 
                             (originalData.idCard?.photos && originalData.idCard.photos.length > 0);
      if (!hasIdCardPhotos) {
        message.error('Vui lòng tải lên ảnh CMND/CCCD');
        return;
      }

      // Kiểm tra dữ liệu từ state
      if (trainingCourses.length > 0) {
        const invalidTrainingCourses = trainingCourses.filter(course => 
          !course.name || !course.issuedBy || !course.year
        );
        if (invalidTrainingCourses.length > 0) {
          message.error('Vui lòng điền đầy đủ thông tin cho các khóa huấn luyện');
          return;
        }
      }

      if (preparationTasks.length > 0) {
        const invalidTasks = preparationTasks.filter(task => 
          !task.content || !task.department
        );
        if (invalidTasks.length > 0) {
          message.error('Vui lòng điền đầy đủ thông tin cho các công việc cần chuẩn bị');
          return;
        }
      }

      // Tạo object chứa tất cả dữ liệu từ form
      const formData = new FormData();
      
      // Tạo object chứa dữ liệu cần gửi lên server - SEND ALL FIELDS, NOT JUST CHANGED ONES
      const notificationData = {
        candidateId: values.candidateId,
        position: values.position,
        department: values.department,
        branch: values.branch,
        hrInCharge: values.hrInCharge,
        gender: values.gender,
        birthDate: values.birthDate?.format('YYYY-MM-DD'),
        idCard: {
          number: values.idCard?.number,
          issueDate: values.idCard?.issueDate?.format('YYYY-MM-DD'),
          issuePlace: values.idCard?.issuePlace,
          photos: originalData.idCard?.photos || []
        },
        startDate: values.startDate?.format('YYYY-MM-DD'),
        insuranceNumber: values.insuranceNumber,
        taxCode: values.taxCode,
        bankAccount: {
          number: values.bankAccount?.number,
          bank: values.bankAccount?.bank
        },
        phone: values.phone,
        email: values.email,
        permanentAddress: values.permanentAddress,
        emergencyContact: {
          name: values.emergencyContact?.name || 'Không có',
          relationship: values.emergencyContact?.relationship || 'Không có',
          phone: values.emergencyContact?.phone || 'Không có',
          email: values.emergencyContact?.email || 'Không có',
          address: values.emergencyContact?.address || 'Không có'
        },
        education: {
          level: values.education?.level || 'other',
          schoolName: values.education?.schoolName || '',
          major: values.education?.major || '',
          graduationYear: values.education?.graduationYear || ''
        },
        expectedSalary: values.expectedSalary,
        contractType: values.contractType,
        documents: values.documents || [],
        trainingCourses: trainingCourses.map(course => ({
          name: course.name,
          issuedBy: course.issuedBy,
          year: course.year
        })),
        preparationTasks: preparationTasks.map(task => ({
          content: task.content,
          department: task.department
        }))
      };
      
      // Thêm ảnh cá nhân nếu có
      if (values.personalPhoto?.fileList?.[0]?.originFileObj) {
        formData.append('personalPhoto', values.personalPhoto.fileList[0].originFileObj);
        console.log('Adding personal photo:', values.personalPhoto.fileList[0].originFileObj);
      } else if (originalData.personalPhoto) {
        // Nếu không có file mới nhưng có URL cũ, thêm URL vào dữ liệu
        notificationData.personalPhoto = originalData.personalPhoto;
        console.log('Using existing personal photo URL:', originalData.personalPhoto);
      }
      
      // Thêm ảnh CCCD nếu có
      if (values.idCard?.photos?.fileList) {
        let hasNewFiles = false;
        values.idCard.photos.fileList.forEach((file, index) => {
          if (file.originFileObj) {
            formData.append('idCardPhotos', file.originFileObj);
            console.log(`Adding ID card photo ${index + 1}:`, file.originFileObj);
            hasNewFiles = true;
          }
        });
        
        // Nếu không có file mới nhưng có URL cũ, thêm URL vào dữ liệu
        if (!hasNewFiles && originalData.idCard?.photos && originalData.idCard.photos.length > 0) {
          notificationData.idCard.photos = originalData.idCard.photos;
          console.log('Using existing ID card photo URLs:', originalData.idCard.photos);
        }
      } else if (originalData.idCard?.photos && originalData.idCard.photos.length > 0) {
        // Nếu không có fileList nhưng có URL cũ, thêm URL vào dữ liệu
        notificationData.idCard.photos = originalData.idCard.photos;
        console.log('Using existing ID card photo URLs:', originalData.idCard.photos);
      }
      
      // Thêm dữ liệu vào FormData
      formData.append('data', JSON.stringify(notificationData));
      
      // Log FormData contents for debugging
      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }
      
      // Log dữ liệu sẽ gửi lên server
      console.log('Data to be sent to server:', JSON.stringify(notificationData, null, 2));

      try {
        console.log('Sending update request to API...');
        const response = await notificationService.updateNotification(id, formData);
        console.log('API Response:', response);
        
        if (response && response.message) {
          message.success(response.message || 'Cập nhật thông báo thành công');
          navigate('/notifications');
        } else {
          message.success('Cập nhật thông báo thành công');
          navigate('/notifications');
        }
      } catch (error) {
        console.error('API Error details:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        
        // Hiển thị thông báo lỗi chi tiết
        if (error.errors && error.errors.length > 0) {
          error.errors.forEach(err => {
            message.error(err);
          });
        } else {
          message.error(error.message || 'Lỗi khi cập nhật thông báo');
        }
      }
    } catch (error) {
      console.error('Error updating notification:', error);
      message.error('Lỗi khi cập nhật thông báo');
    }
  };

  if (loading) {
    return (
      <div className="p-6 pt-[104px] pl-[298px] flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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
          <Title level={4} className="m-0">Chỉnh sửa thông báo ứng viên</Title>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={(errorInfo) => {
            console.log('Form validation failed:', errorInfo);
          }}
          className="max-w-[800px]"
          initialValues={{
            personalPhoto: { fileList: fileList.personalPhoto },
            'idCard.photos': { fileList: fileList.idCardPhotos }
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
                label={<span>Ngày sinh <span className="text-red-500">*</span></span>}
                name="birthDate"
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh' }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item
                label={<span>CMND/CCCD <span className="text-red-500">*</span></span>}
                name={['idCard', 'number']}
                rules={[{ required: true, message: 'Vui lòng nhập số CMND/CCCD' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={<span>Ngày cấp <span className="text-red-500">*</span></span>}
                name={['idCard', 'issueDate']}
                rules={[{ required: true, message: 'Vui lòng chọn ngày cấp' }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item
                label={<span>Nơi cấp <span className="text-red-500">*</span></span>}
                name={['idCard', 'issuePlace']}
                rules={[{ required: true, message: 'Vui lòng nhập nơi cấp' }]}
                className="col-span-2"
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={<span>Ảnh CMND/CCCD <span className="text-red-500">*</span></span>}
                name={['idCard', 'photos']}
                rules={[
                  {
                    validator: (_, value) => {
                      // Kiểm tra nếu có file mới hoặc có ảnh từ dữ liệu gốc
                      const hasNewFiles = value?.fileList && value.fileList.length > 0;
                      const hasOriginalPhotos = originalData?.idCard?.photos && originalData.idCard.photos.length > 0;
                      
                      if (hasNewFiles || hasOriginalPhotos) {
                        return Promise.resolve();
                      }
                      return Promise.reject('Vui lòng tải lên ảnh CMND/CCCD');
                    }
                  }
                ]}
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
                label={<span>Ngày vào làm việc <span className="text-red-500">*</span></span>}
                name="startDate"
                rules={[{ required: true, message: 'Vui lòng chọn ngày vào làm việc' }]}
              >
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item
                label={<span>Số sổ BHXH <span className="text-red-500">*</span></span>}
                name="insuranceNumber"
                rules={[{ required: true, message: 'Vui lòng nhập số sổ BHXH' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={<span>Mã số thuế cá nhân <span className="text-red-500">*</span></span>}
                name="taxCode"
                rules={[{ required: true, message: 'Vui lòng nhập mã số thuế' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={<span>Số tài khoản <span className="text-red-500">*</span></span>}
                name={['bankAccount', 'number']}
                rules={[{ required: true, message: 'Vui lòng nhập số tài khoản' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label={<span>Tại ngân hàng <span className="text-red-500">*</span></span>}
                name={['bankAccount', 'bank']}
                rules={[{ required: true, message: 'Vui lòng nhập tên ngân hàng' }]}
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
                name={['emergencyContact', 'name']}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Mối quan hệ"
                name={['emergencyContact', 'relationship']}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name={['emergencyContact', 'phone']}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Email"
                name={['emergencyContact', 'email']}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Địa chỉ"
                name={['emergencyContact', 'address']}
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
                name={['education', 'level']}
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
                name={['education', 'schoolName']}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Chuyên ngành"
                name={['education', 'major']}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Năm tốt nghiệp"
                name={['education', 'graduationYear']}
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
            <Button 
              type="primary" 
              htmlType="submit"
              onClick={() => {
                console.log('Save button clicked');
                // Kiểm tra form trước khi submit
                form.validateFields()
                  .then(() => {
                    console.log('Form validation passed, submitting...');
                    form.submit();
                  })
                  .catch(errorInfo => {
                    console.log('Form validation failed:', errorInfo);
                    // Hiển thị thông báo lỗi cụ thể
                    if (errorInfo.errorFields && errorInfo.errorFields.length > 0) {
                      const errorMessages = errorInfo.errorFields.map(field => {
                        return `${field.name.join('.')}: ${field.errors.join(', ')}`;
                      });
                      message.error(`Vui lòng kiểm tra lại các trường sau: ${errorMessages.join('; ')}`);
                    } else {
                      message.error('Vui lòng kiểm tra lại thông tin');
                    }
                  });
              }}
            >
              Lưu
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EditNotification; 