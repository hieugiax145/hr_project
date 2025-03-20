import { useState } from 'react';
import mailImg from '../../assets/ForgotPassword/mail.png';

const ForgotPassword = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [contact, setContact] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className="container">
      {/* Hình minh họa */}
      <div className="image-container">
        <img
          src={mailImg}
          alt="Mail Illustration"
          className="object-cover"
        />
      </div>

      {/* Form */}
      <div className="form-container">
        {/* Tiêu đề */}
        <h2 className="text-center text-[16px] font-bold text-[#1A1A1A] mb-6">
          Điền thông tin lấy lại mật khẩu!
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Họ và tên */}
          <div>
            <label className="block text-[16px] font-normal text-[#000] mb-2">
              Họ và tên:
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-[365px] h-[34px] border border-[#656ED3] rounded-full px-4 text-[16px] focus:outline-none focus:border-[#4c59c3]"
            />
          </div>

          {/* Tên đăng nhập */}
          <div>
            <label className="block text-[16px] font-normal text-[#000] mb-2">
              Tên đăng nhập:
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-[365px] h-[34px] border border-[#656ED3] rounded-full px-4 text-[16px] focus:outline-none focus:border-[#4c59c3]"
            />
          </div>

          {/* Email / Số điện thoại */}
          <div>
            <label className="block text-[16px] font-normal text-[#000] mb-2">
              Email/Số điện thoại:
            </label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-[365px] h-[34px] border border-[#656ED3] rounded-full px-4 text-[16px] focus:outline-none focus:border-[#4c59c3]"
            />
          </div>

          {/* Button Lấy lại mật khẩu */}
          <button
            type="submit"
            className="w-[365px] h-[34px] bg-[#656ED3] text-white font-medium text-[16px] rounded-full hover:bg-[#4c59c3] transition"
          >
            Lấy lại mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
