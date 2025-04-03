import React, { useState, useEffect } from 'react';
import { Layout, Input } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { MdKeyboardArrowRight } from 'react-icons/md';
import axios from 'axios';

const { Content } = Layout;

const CEORecruitmentRequestDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    department: '',
    position: '',
    quantity: '',
    mainLocation: '',
    otherLocations: [],
    reason: '',
    budget: '',
    jobDescription: '',
    requirements: '',
    benefits: '',
    status: '',
    date: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequestDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`http://localhost:8000/api/applications/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.status === 'Đã nộp') {
          try {
            const updateResponse = await axios.put(
              `http://localhost:8000/api/applications/${id}`,
              { status: 'Đang duyệt' },
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );
            setFormData(updateResponse.data);
          } catch (updateError) {
            console.error('Error updating status:', updateError);
            setFormData(response.data);
          }
        } else {
          setFormData(response.data);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching request:', error);
        setError('Có lỗi xảy ra khi tải dữ liệu');
        setLoading(false);
      }
    };

    fetchRequestDetail();
  }, [id, navigate]);

  const handleApprove = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8000/api/applications/${id}`,
        { status: 'Đã duyệt' },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Xóa thông báo khi phê duyệt
      await axios.delete(
        `http://localhost:8000/api/recruitment-notifications/by-recruitment/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.status === 200) {
        navigate('/hr/ceo-recruitment-requests');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      setError('Có lỗi xảy ra khi phê duyệt yêu cầu');
    }
  };

  const handleReject = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8000/api/applications/${id}`,
        { status: 'Từ chối' },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      // Xóa thông báo khi từ chối
      await axios.delete(
        `http://localhost:8000/api/recruitment-notifications/by-recruitment/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.status === 200) {
        navigate('/hr/ceo-recruitment-requests');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      setError('Có lỗi xảy ra khi từ chối yêu cầu');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#656ED3]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 ml-[282px]">
      <div className="max-w-[1200px] mx-auto bg-white rounded-lg p-4 md:p-6 mt-[80px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[20px] font-medium text-[#1A1A1A] mb-4">Chi tiết phiếu tuyển dụng</h1>
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex gap-2 w-full md:w-auto">
              <button 
                className="h-[36px] px-4 bg-[#D42A2A] text-white rounded-[6px] text-sm font-medium hover:bg-[#BB0000] flex items-center gap-2"
                onClick={handleReject}
              >
                Từ chối
              </button>
              <button 
                className="h-[36px] px-4 bg-[#7B61FF] text-white rounded-[6px] text-sm font-medium hover:bg-[#6B4EFF] flex items-center gap-2"
                onClick={handleApprove}
              >
                Phê duyệt
              </button>
            </div>

            {/* Progress Steps */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center">
                <span className={`text-sm border-b-2 pb-1 ${formData.status === 'Chờ nộp' ? 'text-[#7B61FF] border-[#7B61FF]' : 'text-[#A3A3A3] border-[#A3A3A3]'}`}>Chờ nộp</span>
              </div>
              <MdKeyboardArrowRight className="text-[#E0E0E0]" size={20} />
              <div className="flex items-center">
                <span className={`text-sm border-b-2 pb-1 ${formData.status === 'Đã nộp' ? 'text-[#7B61FF] border-[#7B61FF]' : 'text-[#A3A3A3] border-[#A3A3A3]'}`}>Đã nộp</span>
              </div>
              <MdKeyboardArrowRight className="text-[#E0E0E0]" size={20} />
              <div className="flex items-center">
                <span className={`text-sm border-b-2 pb-1 ${formData.status === 'Đang duyệt' ? 'text-[#7B61FF] border-[#7B61FF]' : 'text-[#A3A3A3] border-[#A3A3A3]'}`}>Đang duyệt</span>
              </div>
              <MdKeyboardArrowRight className="text-[#E0E0E0]" size={20} />
              <div className="flex items-center">
                <span className={`text-sm border-b-2 pb-1 ${formData.status === 'Đã duyệt' ? 'text-[#7B61FF] border-[#7B61FF]' : 'text-[#A3A3A3] border-[#A3A3A3]'}`}>Đã duyệt</span>
              </div>
              <MdKeyboardArrowRight className="text-[#E0E0E0]" size={20} />
              <div className="flex items-center">
                <span className={`text-sm border-b-2 pb-1 ${formData.status === 'Từ chối' ? 'text-[#FF0000] border-[#FF0000]' : 'text-[#A3A3A3] border-[#A3A3A3]'}`}>Từ chối</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* THÔNG TIN CHUNG */}
          <div className="border border-[#E0E0E0] rounded-lg p-4">
            <h2 className="text-sm font-medium mb-4 text-[#1A1A1A]">THÔNG TIN CHUNG</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
              <div className="flex flex-col md:flex-row md:items-center">
                <label className="text-sm text-[#1A1A1A] w-full md:w-[120px] mb-2 md:mb-0 md:mr-4">
                  Nhân sự lập phiếu
                </label>
                <span className="text-sm text-[#1A1A1A]">Trưởng phòng</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <label className="text-sm text-[#1A1A1A] w-full md:w-[120px] mb-2 md:mb-0">
                  Phòng
                </label>
                <Input
                  value={formData.department}
                  disabled
                  className="flex-1 border-0 border-b border-[#E0E0E0] rounded-none px-0 h-[36px] bg-transparent"
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <label className="text-sm text-[#1A1A1A] w-full md:w-[120px] mb-2 md:mb-0">
                  Vị trí
                </label>
                <Input
                  value={formData.position}
                  disabled
                  className="flex-1 border-0 border-b border-[#E0E0E0] rounded-none px-0 h-[36px] bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* THÔNG TIN YÊU CẦU TUYỂN DỤNG */}
          <div className="border border-[#E0E0E0] rounded-lg p-4">
            <h2 className="text-sm font-medium mb-4 text-[#1A1A1A]">THÔNG TIN YÊU CẦU TUYỂN DỤNG</h2>
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center">
                <label className="text-sm text-[#1A1A1A] w-full md:w-[120px] mb-2 md:mb-0">
                  Số lượng
                </label>
                <Input
                  value={formData.quantity}
                  disabled
                  className="w-full md:w-[300px] border-0 border-b border-[#E0E0E0] rounded-none px-0 h-[36px] bg-transparent"
                />
              </div>
              <div>
                <label className="text-sm text-[#1A1A1A] inline-block w-[120px] align-top">
                  Nơi làm việc
                </label>
                <div className="inline-block">
                  <div className="flex gap-4">
                    <span className="text-sm">{formData.mainLocation}</span>
                    {formData.otherLocations && formData.otherLocations.length > 0 && (
                      <span className="text-sm">, {formData.otherLocations.join(', ')}</span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-sm text-[#1A1A1A] inline-flex items-center w-[120px] whitespace-nowrap mr-4">
                  Lý do tuyển dụng
                </label>
                <span className="text-sm">{formData.reason}</span>
              </div>
              <div>
                <label className="text-sm text-[#1A1A1A] inline-block w-[120px] align-top">
                  Quỹ tuyển dụng
                </label>
                <span className="text-sm">{formData.budget}</span>
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
                <div className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm bg-transparent">
                  {formData.jobDescription}
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1 text-[#1A1A1A]">
                  2, Yêu cầu ứng viên
                </label>
                <div className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm bg-transparent">
                  {formData.requirements}
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1 text-[#1A1A1A]">
                  3, Quyền lợi
                </label>
                <div className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm bg-transparent">
                  {formData.benefits}
                </div>
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
                  <span className="text-sm">{formData.status}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1 text-[#1A1A1A]">Thời gian phê duyệt</label>
                <div className="h-[116px] flex items-center justify-center border border-[#E0E0E0] rounded-lg">
                  <span className="text-sm">{formData.date}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CEORecruitmentRequestDetail; 