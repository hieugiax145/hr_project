import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Lấy danh sách tất cả người dùng
export const getAllUsers = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Không tìm thấy token xác thực');
    }

    const response = await axios.get(`${API_URL}/users/all`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Lỗi khi lấy danh sách người dùng:', error);
    throw error;
  }
}; 