import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mailImg from '../../assets/ForgotPassword/mail.png';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [showResetForm, setShowResetForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:8000/api/users/forgot-password', {
        email,
      });

      setMessage(res.data.message);
      setShowResetForm(true);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
      setMessage(null);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8000/api/users/reset-password', {
        email,
        verificationCode,
        newPassword
      });

      setMessage(res.data.message);
      setError(null);
      
      // Chuyển hướng về trang login sau 2 giây
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại!');
      setMessage(null);
    }
  };

  return (
    <div className="container flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-[400px]">
        {/* Hình minh họa */}
        <div className="flex justify-center mb-4">
          <img
            src={mailImg}
            alt="Mail Illustration"
            className="w-24 h-24"
          />
        </div>

        {/* Tiêu đề */}
        <h2 className="text-center text-[16px] font-bold text-[#1A1A1A] mb-6">
          Điền email để lấy lại mật khẩu!
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-[16px] font-normal text-[#000] mb-2">
              Email:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[34px] border border-[#656ED3] rounded-full px-4 text-[16px] focus:outline-none focus:border-[#4c59c3]"
              required
            />
          </div>

          {/* Thông báo thành công / lỗi */}
          {message && <div className="text-green-500">{message}</div>}
          {error && <div className="text-red-500">{error}</div>}

          {/* Button Lấy lại mật khẩu */}
          <button
            type="submit"
            className="w-full h-[34px] bg-[#656ED3] text-white font-medium text-[16px] rounded-full hover:bg-[#4c59c3] transition"
          >
            Lấy lại mật khẩu
          </button>
        </form>

        {/* Form đặt lại mật khẩu */}
        {showResetForm && (
          <div className="mt-6 border-t pt-6">
            <h3 className="text-center text-[16px] font-bold text-[#1A1A1A] mb-4">
              Nhập mã xác nhận đã gửi đến email của bạn
            </h3>
            
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-[16px] font-normal text-[#000] mb-2">
                  Mã xác nhận:
                </label>
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="w-full h-[34px] border border-[#656ED3] rounded-full px-4 text-[16px] focus:outline-none focus:border-[#4c59c3]"
                  required
                />
              </div>

              <div>
                <label className="block text-[16px] font-normal text-[#000] mb-2">
                  Mật khẩu mới:
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-[34px] border border-[#656ED3] rounded-full px-4 text-[16px] focus:outline-none focus:border-[#4c59c3]"
                  required
                />
              </div>

              <div>
                <label className="block text-[16px] font-normal text-[#000] mb-2">
                  Xác nhận mật khẩu:
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-[34px] border border-[#656ED3] rounded-full px-4 text-[16px] focus:outline-none focus:border-[#4c59c3]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full h-[34px] bg-[#656ED3] text-white font-medium text-[16px] rounded-full hover:bg-[#4c59c3] transition"
              >
                Đặt lại mật khẩu
              </button>
            </form>
          </div>
        )}

        {/* Nút trở lại */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-[#656ED3] hover:text-[#4c59c3] transition"
          >
            ← Quay lại trang đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
