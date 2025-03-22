import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, Modal, message } from 'antd';
import { CloudUploadOutlined } from '@ant-design/icons';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { MdKeyboardArrowRight } from 'react-icons/md';
import axios from 'axios';

const CreateRecruitmentRequest = () => {
  const navigate = useNavigate();
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedMainLocation, setSelectedMainLocation] = useState('');

  const mainLocations = [
    { id: 'hochiminh', name: 'Hồ Chí Minh' },
    { id: 'hanoi', name: 'Hà Nội' },
    { id: 'other', name: 'Khác' }
  ];

  const otherLocations = [
    { id: 'headoffice', name: 'Head Office', bgColor: '#FEF3E7' },
    { id: 'danang', name: 'Đà Nẵng', bgColor: '#E5F6F6' },
    { id: 'ptit-hanoi', name: 'PTIT Hà Nội', bgColor: '#E5F6F6' },
    { id: 'ptit-hcm', name: 'PTIT HCM', bgColor: '#FEE7EF' },
  ];

  const handleMainLocationChange = (locationId) => {
    setSelectedMainLocation(locationId);
    if (locationId === 'other') {
      setShowLocationModal(true);
    } else {
      setSelectedLocations([locationId]);
    }
  };

  const handleOtherLocationChange = (locationId) => {
    setSelectedLocations(prev => {
      if (prev.includes(locationId)) {
        return prev.filter(id => id !== locationId);
      } else {
        return [...prev, locationId];
      }
    });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('/api/applications', {
        department: 'Trưởng phòng',
        position: 'Vị trí cần tuyển',
        quantity: 1,
        mainLocation: selectedMainLocation,
        otherLocations: selectedLocations,
        reason: 'Tuyển do thiếu nhân sự',
        budget: 'Đạt chuẩn',
        jobDescription: 'Mô tả công việc',
        requirements: 'Yêu cầu ứng viên',
        benefits: 'Quyền lợi'
      });
      message.success('Yêu cầu tuyển dụng đã được gửi thành công!');
      navigate('/hr/recruitment-requests');
    } catch (error) {
      message.error('Có lỗi xảy ra khi gửi yêu cầu tuyển dụng.');
    }
  };

  return (
    <div className="h-full">
      <div className="max-w-[1200px] mx-auto bg-white rounded-lg p-6 mt-[80px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[20px] font-medium text-[#1A1A1A] mb-4">Khởi tạo yêu cầu tuyển dụng</h1>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button 
                className="h-[36px] px-4 bg-[#7B61FF] text-white rounded-[6px] text-sm font-medium hover:bg-[#6B4EFF] flex items-center gap-2"
                onClick={handleSubmit}
              >
                <CloudUploadOutlined />
                Gửi duyệt
              </button>
              <button 
                className="h-[36px] px-4 border border-[#D92D20] text-[#D92D20] bg-white rounded-[6px] text-sm font-medium hover:bg-red-50 flex items-center gap-2"
                onClick={() => navigate('/hr/recruitment-requests')}
              >
                <IoCloseCircleOutline size={16} />
                Hủy
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <span className="text-[#7B61FF] text-sm border-b-2 border-[#7B61FF] pb-1">Chờ nộp</span>
              </div>
              <MdKeyboardArrowRight className="text-[#E0E0E0]" size={20} />
              <div className="flex items-center">
                <span className="text-[#A3A3A3] text-sm">Đã nộp</span>
              </div>
              <MdKeyboardArrowRight className="text-[#E0E0E0]" size={20} />
              <div className="flex items-center">
                <span className="text-[#A3A3A3] text-sm">Đang duyệt</span>
              </div>
              <MdKeyboardArrowRight className="text-[#E0E0E0]" size={20} />
              <div className="flex items-center">
                <span className="text-[#A3A3A3] text-sm">Đã duyệt</span>
              </div>
              <MdKeyboardArrowRight className="text-[#E0E0E0]" size={20} />
              <div className="flex items-center">
                <span className="text-[#A3A3A3] text-sm">Từ chối</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* THÔNG TIN CHUNG */}
          <div className="border border-[#E0E0E0] rounded-lg p-4">
            <h2 className="text-sm font-medium mb-4 text-[#1A1A1A]">THÔNG TIN CHUNG</h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-6">
              <div className="flex items-center">
                <label className="text-sm text-[#1A1A1A] w-[120px] mr-4">
                  Nhân sự lập phiếu
                </label>
                <span className="text-sm text-[#1A1A1A]">Trưởng phòng</span>
              </div>
              <div className="flex items-center">
                <label className="text-sm text-[#1A1A1A] w-[120px]">
                  Phòng
                </label>
                <Input
                  placeholder="Chọn bộ phận/phòng ban yêu cầu tuyển dụng"
                  className="flex-1 border-0 border-b border-[#E0E0E0] rounded-none px-0 h-[36px] hover:border-b-[#7B61FF] focus:border-b-[#7B61FF]"
                />
              </div>
              <div className="flex items-center">
                <label className="text-sm text-[#1A1A1A] w-[120px]">
                  Vị trí <span className="text-[#D92D20]">*</span>
                </label>
                <Input
                  placeholder="Chọn vị trí cần tuyển dụng"
                  className="flex-1 border-0 border-b border-[#E0E0E0] rounded-none px-0 h-[36px] hover:border-b-[#7B61FF] focus:border-b-[#7B61FF]"
                />
              </div>
            </div>
          </div>

          {/* THÔNG TIN YÊU CẦU TUYỂN DỤNG */}
          <div className="border border-[#E0E0E0] rounded-lg p-4">
            <h2 className="text-sm font-medium mb-4 text-[#1A1A1A]">THÔNG TIN YÊU CẦU TUYỂN DỤNG</h2>
            <div className="space-y-6">
              <div>
                <label className="text-sm text-[#1A1A1A] inline-block w-[120px]">
                  Số lượng <span className="text-[#D92D20]">*</span>
                </label>
                <Input
                  type="number"
                  placeholder="Nhập thông tin số lượng cần tuyển"
                  className="w-[300px] border-0 border-b border-[#E0E0E0] rounded-none px-0 h-[36px] hover:border-b-[#7B61FF] focus:border-b-[#7B61FF]"
                />
              </div>
              <div>
                <label className="text-sm text-[#1A1A1A] inline-block w-[120px] align-top">
                  Nơi làm việc <span className="text-[#D92D20]">*</span>
                </label>
                <div className="inline-block">
                  <div className="flex gap-4">
                    {mainLocations.map((location) => (
                      <label
                        key={location.id}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="mainLocation"
                          checked={selectedMainLocation === location.id}
                          onChange={() => handleMainLocationChange(location.id)}
                          className="text-[#8D75F5] focus:ring-[#8D75F5]"
                        />
                        <span className="text-sm">{location.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <Modal
                title="Chọn một tùy chọn"
                open={showLocationModal}
                onCancel={() => {
                  setShowLocationModal(false);
                  setSelectedMainLocation('');
                }}
                footer={null}
                width={400}
              >
                <div className="flex flex-col gap-2 mt-4">
                  {otherLocations.map((location) => (
                    <label
                      key={location.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer`}
                      style={{ backgroundColor: location.bgColor }}
                    >
                      <input
                        type="checkbox"
                        checked={selectedLocations.includes(location.id)}
                        onChange={() => handleOtherLocationChange(location.id)}
                        className="w-4 h-4 rounded border-gray-300 text-[#8D75F5] focus:ring-[#8D75F5]"
                      />
                      <span className="text-sm">{location.name}</span>
                    </label>
                  ))}
                </div>
              </Modal>
              <div>
                <label className="text-sm text-[#1A1A1A] inline-flex items-center w-[120px] whitespace-nowrap mr-4">
                  Lý do tuyển dụng
                  <span className="text-[#D92D20]">*</span>
                </label>
                <div className="inline-flex gap-6">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="reason" className="text-[#7B61FF]" />
                    <span className="text-sm">Tuyển do thiếu nhân sự</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="reason" className="text-[#7B61FF]" />
                    <span className="text-sm">Tuyển do mở rộng quy mô</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="text-sm text-[#1A1A1A] inline-block w-[120px] align-top">
                  Quỹ tuyển dụng <span className="text-[#D92D20]">*</span>
                </label>
                <div className="inline-flex gap-6">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="budget" className="text-[#7B61FF]" />
                    <span className="text-sm">Đạt chuẩn</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="budget" className="text-[#7B61FF]" />
                    <span className="text-sm">Vượt quỹ</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* THÔNG TIN MÔ TẢ CÔNG VIỆC */}
          <div className="border border-[#E0E0E0] rounded-lg p-4">
            <h2 className="text-sm font-medium mb-4 text-[#1A1A1A]">THÔNG TIN MÔ TẢ CÔNG VIỆC</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1 text-[#1A1A1A]">
                  1, Mô tả công việc
                </label>
                <textarea
                  placeholder="Nhập nội dung mô tả"
                  rows={4}
                  className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#7B61FF] text-sm"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm mb-1 text-[#1A1A1A]">
                  2, Yêu cầu ứng viên
                </label>
                <textarea
                  placeholder="Nhập nội dung yêu cầu"
                  rows={4}
                  className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#7B61FF] text-sm"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm mb-1 text-[#1A1A1A]">
                  3, Quyền lợi
                </label>
                <textarea
                  placeholder="Nhập nội dung quyền lợi"
                  rows={4}
                  className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg focus:outline-none focus:border-[#7B61FF] text-sm"
                ></textarea>
              </div>
            </div>
          </div>

          {/* THÔNG TIN PHÊ DUYỆT */}
          <div className="border border-[#E0E0E0] rounded-lg p-4">
            <h2 className="text-sm font-medium mb-4 text-[#1A1A1A]">THÔNG TIN PHÊ DUYỆT</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1 text-[#1A1A1A]">Người phê duyệt</label>
                <div className="space-y-2">
                  <div className="h-[36px] px-3 flex items-center border border-[#E0E0E0] rounded-lg text-sm">
                    Trưởng phòng
                  </div>
                  <div className="h-[36px] px-3 flex items-center border border-[#E0E0E0] rounded-lg text-sm">
                    Giám đốc kinh doanh
                  </div>
                  <div className="h-[36px] px-3 flex items-center border border-[#E0E0E0] rounded-lg text-sm">
                    Tổng Giám Đốc
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1 text-[#1A1A1A]">Trạng thái phê duyệt</label>
                <div className="h-[116px] flex items-center justify-center border border-[#E0E0E0] rounded-lg">
                  <span className="text-[#A3A3A3] text-sm">Chưa phê duyệt</span>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1 text-[#1A1A1A]">Thời gian phê duyệt</label>
                <div className="h-[116px] flex items-center justify-center border border-[#E0E0E0] rounded-lg">
                  <span className="text-[#A3A3A3] text-sm">Chưa phê duyệt</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRecruitmentRequest; 