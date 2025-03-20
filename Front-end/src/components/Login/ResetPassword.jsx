import { useState } from 'react';
import mailImg from '../../assets/ForgotPassword/mail.png';

const ResetPassword = () => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ fullName, username, email, password, confirmPassword });
  };

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      backgroundColor: '#EBEFFF',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      margin: 0
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '60px'
      }}>
        {/* Hình minh họa */}
        <div className="image-container">
          <img
            src={mailImg}
            alt="Mail Illustration"
            style={{
              width: '400px',
              height: 'auto'
            }}
          />
        </div>

        {/* Form */}
        <div className="form-container" style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '400px'
        }}>
          {/* Tiêu đề */}
          <h2 style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#1A1A1A',
            textAlign: 'left',
            marginBottom: '16px'
          }}>
            Đổi mật khẩu!
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Họ và tên */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: 500,
                color: '#1A1A1A',
                marginBottom: '8px'
              }}>
                Họ và tên:
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  border: '1px solid #656ED3',
                  borderRadius: '20px',
                  padding: '0 16px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>

            {/* Tên đăng nhập */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: 500,
                color: '#1A1A1A',
                marginBottom: '8px'
              }}>
                Tên đăng nhập:
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  border: '1px solid #656ED3',
                  borderRadius: '20px',
                  padding: '0 16px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>

            {/* Email/Số điện thoại */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: 500,
                color: '#1A1A1A',
                marginBottom: '8px'
              }}>
                Email/Số điện thoại:
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  border: '1px solid #656ED3',
                  borderRadius: '20px',
                  padding: '0 16px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>

            {/* Mật khẩu mới */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: 500,
                color: '#1A1A1A',
                marginBottom: '8px'
              }}>
                Mật khẩu mới:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  border: '1px solid #656ED3',
                  borderRadius: '20px',
                  padding: '0 16px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>

            {/* Xác nhận mật khẩu mới */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: 500,
                color: '#1A1A1A',
                marginBottom: '8px'
              }}>
                Xác nhận mật khẩu mới:
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  border: '1px solid #656ED3',
                  borderRadius: '20px',
                  padding: '0 16px',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
              />
            </div>

            {/* Button Đăng nhập */}
            <button
              type="submit"
              style={{
                width: '100%',
                height: '40px',
                backgroundColor: '#656ED3',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '20px',
                fontSize: '16px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background-color 0.3s ease'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#4c59c3'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#656ED3'}
            >
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
