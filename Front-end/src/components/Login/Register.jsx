import { useState } from 'react';
import registerImg from '../../assets/login/register.png';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [emailPhone, setEmailPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ fullName, username, emailPhone, password, confirmPassword });
  };

  return (
    <div className="min-h-screen w-full bg-[#EBEFFF] flex font-inter">
      {/* Phần hình ảnh bên trái */}
      <div className="w-1/2 relative">
        <div className="absolute top-0 left-24 w-full h-[80vh]">
          <img src={registerImg} alt="Register Illustration" className="w-full h-full object-contain object-top" />
        </div>
      </div>

      {/* Form bên phải */}
      <div className="w-1/2 flex flex-col items-center justify-center px-16">
        <div className="w-full max-w-[400px]">
          {/* Tiêu đề */}
          <h2 className="text-center font-bold text-2xl text-[#1A1A1A] mb-8">Đăng ký tài khoản!</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Họ và tên */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Họ và tên:</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-[40px] border border-[#656ED3] rounded-[25px] px-4 focus:outline-none bg-transparent"
                placeholder="Nhập họ và tên"
              />
            </div>

            {/* Tên đăng nhập */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Tên đăng nhập:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-[40px] border border-[#656ED3] rounded-[25px] px-4 focus:outline-none bg-transparent"
                placeholder="Nhập tên đăng nhập"
              />
            </div>

            {/* Email/Số điện thoại */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Email/Số điện thoại:</label>
              <input
                type="text"
                value={emailPhone}
                onChange={(e) => setEmailPhone(e.target.value)}
                className="w-full h-[40px] border border-[#656ED3] rounded-[25px] px-4 focus:outline-none bg-transparent"
                placeholder="Nhập email hoặc số điện thoại"
              />
            </div>

            {/* Mật khẩu mới */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Mật khẩu mới:</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[40px] border border-[#656ED3] rounded-[25px] px-4 pr-10 focus:outline-none bg-transparent"
                  placeholder="Nhập mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-transparent border-none p-0"
                >
                  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div>
              <label className="block text-sm font-medium text-[#1A1A1A] mb-2">Xác nhận mật khẩu mới:</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-[40px] border border-[#656ED3] rounded-[25px] px-4 pr-10 focus:outline-none bg-transparent"
                  placeholder="Xác nhận mật khẩu mới"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 bg-transparent border-none p-0"
                >
                  {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                </button>
              </div>
            </div>

            {/* Nút đăng ký */}
            <button
              type="submit"
              className="w-full h-[40px] bg-[#656ED3] text-white font-medium text-base rounded-[25px] hover:bg-[#4d4dbf] transition mt-8"
            >
              Đăng ký
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register; 