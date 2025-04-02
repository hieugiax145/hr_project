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
    const response = await axiosInstance.post('/notifications', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
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