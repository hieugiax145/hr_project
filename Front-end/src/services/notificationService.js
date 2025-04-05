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

      const response = await axiosInstance.post('/notifications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error in createNotification:', error);
      throw error;
    }
  },

  // Cập nhật thông báo
  updateNotification: async (id, formData) => {
    try {
      // Log FormData contents for debugging
      console.log('FormData contents in updateNotification service:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }

      console.log('Sending PUT request to /notifications/' + id);
      const response = await axiosInstance.put(`/notifications/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });
      
      console.log('Update notification response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in updateNotification:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      // Trả về lỗi với thông tin chi tiết hơn
      if (error.response?.data) {
        throw {
          message: error.response.data.message || 'Lỗi khi cập nhật thông báo',
          errors: error.response.data.errors || [],
          status: error.response.status
        };
      }
      
      throw error;
    }
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