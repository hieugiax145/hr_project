import React, { useState, useEffect } from 'react';
import { Button, Typography, Descriptions, Image, Space, message, Layout } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { notificationService } from '../../services/notificationService';
import dayjs from 'dayjs';
import Topbar from '../Topbar/Topbar';
import Sidebar from '../Sidebar/Sidebar';

const { Title } = Typography;
const { Content } = Layout;

const NotificationDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getNotificationById(id);
      setNotification(response.data);
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
        <Layout style={{ marginLeft: 282 }}>
          <Content style={{ margin: '80px 16px 24px', minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B61FF]"></div>
          </Content>
        </Layout>
      </Layout>
    );
  }

  if (!notification) {
    return (
      <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
        <Layout style={{ marginLeft: 282 }}>
          <Content style={{ margin: '80px 16px 24px', minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div>Không tìm thấy thông báo</div>
          </Content>
        </Layout>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Sidebar />
      <Layout style={{ marginLeft: 282 }}>
        <Topbar />
        <Content style={{ margin: '80px 16px 24px', minHeight: 280 }}>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button 
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate('/notifications')}
                >
                  Quay lại
                </Button>
                <Title level={4} className="m-0">Chi tiết thông báo ứng viên</Title>
              </div>
              <Button
                className="bg-[#DAF374] hover:bg-[#c5dd60] text-black border-none"
                onClick={() => navigate(`/notifications/${id}/evaluate`)}
              >
                Đánh giá
              </Button>
            </div>

            {/* THÔNG TIN TIẾP NHẬN */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">THÔNG TIN TIẾP NHẬN</h2>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Họ và tên">{notification.candidateId?.name}</Descriptions.Item>
                <Descriptions.Item label="Chức vụ">{notification.position}</Descriptions.Item>
                <Descriptions.Item label="Phòng">{notification.department}</Descriptions.Item>
                <Descriptions.Item label="Chi nhánh">{notification.branch}</Descriptions.Item>
                <Descriptions.Item label="Nhân sự phụ trách">{notification.hrInCharge?.fullName}</Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">{dayjs(notification.createdAt).format('DD/MM/YYYY')}</Descriptions.Item>
              </Descriptions>
            </div>

            {/* THÔNG TIN CÁ NHÂN */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">THÔNG TIN CÁ NHÂN</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="col-span-2">
                  <div className="mb-4">
                    <div className="font-medium mb-2">Ảnh cá nhân:</div>
                    {notification.personalPhoto && (
                      <Image
                        src={notification.personalPhoto}
                        alt="Ảnh cá nhân"
                        width={200}
                        className="rounded-lg"
                      />
                    )}
                  </div>
                </div>
              </div>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Giới tính">{notification.gender === 'male' ? 'Nam' : 'Nữ'}</Descriptions.Item>
                <Descriptions.Item label="Ngày sinh">{dayjs(notification.birthDate).format('DD/MM/YYYY')}</Descriptions.Item>
                <Descriptions.Item label="CMND/CCCD">{notification.idCard?.number}</Descriptions.Item>
                <Descriptions.Item label="Ngày cấp">{dayjs(notification.idCard?.issueDate).format('DD/MM/YYYY')}</Descriptions.Item>
                <Descriptions.Item label="Nơi cấp" span={2}>{notification.idCard?.issuePlace}</Descriptions.Item>
                <Descriptions.Item label="Ảnh CMND/CCCD" span={2}>
                  <Space>
                    {notification.idCard?.photos?.map((photo, index) => (
                      <Image
                        key={index}
                        src={photo}
                        alt={`Ảnh CMND/CCCD ${index + 1}`}
                        width={200}
                        className="rounded-lg"
                      />
                    ))}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Ngày vào làm việc">{dayjs(notification.startDate).format('DD/MM/YYYY')}</Descriptions.Item>
                <Descriptions.Item label="Số sổ BHXH">{notification.insuranceNumber}</Descriptions.Item>
                <Descriptions.Item label="Mã số thuế">{notification.taxCode}</Descriptions.Item>
                <Descriptions.Item label="Số tài khoản">{notification.bankAccount?.number}</Descriptions.Item>
                <Descriptions.Item label="Tại ngân hàng">{notification.bankAccount?.bank}</Descriptions.Item>
              </Descriptions>
            </div>

            {/* THÔNG TIN LIÊN HỆ */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">THÔNG TIN LIÊN HỆ</h2>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Số điện thoại">{notification.phone}</Descriptions.Item>
                <Descriptions.Item label="Email">{notification.email}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ thường trú" span={2}>{notification.permanentAddress}</Descriptions.Item>
              </Descriptions>

              <h3 className="text-base font-medium mt-6 mb-4">Liên hệ khẩn:</h3>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Họ tên">{notification.emergencyContact?.name}</Descriptions.Item>
                <Descriptions.Item label="Mối quan hệ">{notification.emergencyContact?.relationship}</Descriptions.Item>
                <Descriptions.Item label="Số điện thoại">{notification.emergencyContact?.phone}</Descriptions.Item>
                <Descriptions.Item label="Email">{notification.emergencyContact?.email}</Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" span={2}>{notification.emergencyContact?.address}</Descriptions.Item>
              </Descriptions>
            </div>

            {/* HỌC VẤN */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">HỌC VẤN</h2>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Trình độ">
                  {notification.education?.level === 'postgraduate' ? 'Sau đại học' :
                   notification.education?.level === 'university' ? 'Đại học' :
                   notification.education?.level === 'college' ? 'Cao đẳng' : 'Khác'}
                </Descriptions.Item>
                <Descriptions.Item label="Tên trường">{notification.education?.schoolName}</Descriptions.Item>
                <Descriptions.Item label="Chuyên ngành">{notification.education?.major}</Descriptions.Item>
                <Descriptions.Item label="Năm tốt nghiệp">{notification.education?.graduationYear}</Descriptions.Item>
              </Descriptions>
            </div>

            {/* Các khóa huấn luyện, đào tạo */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">Các khóa huấn luyện, đào tạo/ Chứng chỉ</h2>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">STT</th>
                    <th className="border border-gray-300 p-2">Tên khóa huấn luyện, đào tạo/ Chứng chỉ</th>
                    <th className="border border-gray-300 p-2">Nơi cấp</th>
                    <th className="border border-gray-300 p-2">Năm</th>
                  </tr>
                </thead>
                <tbody>
                  {notification.trainingCourses?.map((course, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                      <td className="border border-gray-300 p-2">{course.name}</td>
                      <td className="border border-gray-300 p-2">{course.issuedBy}</td>
                      <td className="border border-gray-300 p-2">{course.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* NGUYỆN VỌNG */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">NGUYỆN VỌNG</h2>
              <Descriptions bordered column={2}>
                <Descriptions.Item label="Mức lương">{notification.expectedSalary}</Descriptions.Item>
                <Descriptions.Item label="Loại hợp đồng">{notification.contractType}</Descriptions.Item>
              </Descriptions>
            </div>

            {/* HỒ SƠ CÁ NHÂN NỘP CÔNG TY */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">HỒ SƠ CÁ NHÂN NỘP CÔNG TY</h2>
              <div className="grid grid-cols-2 gap-4">
                {notification.documents?.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>
                      {doc === 'personalInfo' ? 'Sơ yếu lý lịch' :
                       doc === 'criminalRecord' ? 'Lý lịch tư pháp' :
                       doc === 'photos' ? 'Ảnh' :
                       doc === 'healthCert' ? 'Giấy khám sức khỏe' :
                       doc === 'degree' ? 'Bằng cấp' :
                       doc === 'idCard' ? 'CCCD' :
                       doc === 'householdReg' ? 'Sổ hộ khẩu' :
                       doc === 'insurance' ? 'Sổ BHXH' : doc}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CÔNG VIỆC CẦN CHUẨN BỊ */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">CÔNG VIỆC CẦN CHUẨN BỊ</h2>
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">STT</th>
                    <th className="border border-gray-300 p-2">Nội dung</th>
                    <th className="border border-gray-300 p-2">Bộ phận thực hiện</th>
                  </tr>
                </thead>
                <tbody>
                  {notification.preparationTasks?.map((task, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-2 text-center">{index + 1}</td>
                      <td className="border border-gray-300 p-2">{task.content}</td>
                      <td className="border border-gray-300 p-2">{task.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default NotificationDetail; 