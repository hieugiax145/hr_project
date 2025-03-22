import { useState } from 'react';
import mailImg from '../../assets/ForgotPassword/mail.png';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/users/forgot-password`, {
        email,
      });

      setMessage(res.data.message);
      setError(null);
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
      </div>
    </div>
  );
};

export default ForgotPassword;
