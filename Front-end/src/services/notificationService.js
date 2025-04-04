import axiosInstance from '../config/axios';

export const notificationService = {
  // Lấy danh sách ứng viên hợp lệ (trạng thái Tuyển hoặc Offer)
  getEligibleCandidates: async () => {
    const response = await axiosInstance.get('/notifications/eligible-candidates');
    return response.data;
  },

  // Lấy danh sách HR
  getHRList: async () => {
    const response = await axiosInstance.get('/notifications/hr-list');
    return response.data;
  },

  // Tạo thông báo mới
  createNotification: async (formData) => {
    try {
      // Log FormData contents for debugging
      console.log('FormData contents in service:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }

      // Kiểm tra kích thước tổng của formData
      let totalSize = 0;
      for (let pair of formData.entries()) {
        if (pair[1] instanceof File) {
          totalSize += pair[1].size;
        }
      }
      console.log('Total form data size:', totalSize / (1024 * 1024), 'MB');

      const response = await axiosInstance.post('/notifications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload progress: ${percentCompleted}%`);
        },
        // Tăng timeout cho request này
        timeout: 20000,
        // Thêm các cấu hình để xử lý upload tốt hơn
        maxBodyLength: Infinity,
        maxContentLength: Infinity
      });
      return response.data;
    } catch (error) {
      console.error('Error in createNotification:', error);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Yêu cầu đã hết thời gian chờ. Vui lòng thử lại sau.');
      } else if (error.response) {
        const errorMessage = error.response.data?.message || 'Lỗi khi tạo thông báo';
        console.error('Server error details:', error.response.data);
        throw new Error(errorMessage);
      } else if (error.request) {
        console.error('No response received:', error.request);
        throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.');
      } else {
        console.error('Other error:', error.message);
        throw new Error('Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.');
      }
    }
  },

  // Cập nhật thông báo
  updateNotification: async (id, formData) => {
    const response = await axiosInstance.put(`/notifications/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Lấy chi tiết thông báo
  getNotificationById: async (id) => {
    const response = await axiosInstance.get(`/notifications/${id}`);
    return response.data;
  },

  // Lấy danh sách thông báo
  getNotifications: async () => {
    const response = await axiosInstance.get('/notifications');
    return response.data;
  },

  // Xóa thông báo
  deleteNotification: async (id) => {
    const response = await axiosInstance.delete(`/notifications/${id}`);
    return response.data;
  },
}; 