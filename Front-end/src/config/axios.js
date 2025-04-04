import axios from 'axios';
import axiosRetry from 'axios-retry';

const instance = axios.create({
  baseURL: 'http://localhost:8000/api', // Sửa port từ 5000 thành 8000
  timeout: 20000, // Giảm timeout xuống 20 giây
  maxContentLength: Infinity,
  maxBodyLength: Infinity,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Thêm retry logic
axiosRetry(instance, { 
  retries: 3,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.code === 'ECONNABORTED';
  }
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Nếu là FormData, không set Content-Type để browser tự set
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    // Loại bỏ các header không cần thiết gây lỗi CORS
    // config.headers['Cache-Control'] = 'no-cache';
    // config.headers['Pragma'] = 'no-cache';
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Xử lý các lỗi response (401, 403, 500, etc.)
      switch (error.response.status) {
        case 401:
          // Xử lý lỗi unauthorized
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // Xử lý lỗi forbidden
          break;
        default:
          console.error('API Error:', error.response.data);
          break;
      }
    } else if (error.request) {
      // Lỗi không có response từ server
      console.error('Network Error:', error.message);
    } else {
      // Lỗi khi setup request
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default instance; 