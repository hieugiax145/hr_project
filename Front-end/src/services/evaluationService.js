import axiosInstance from '../config/axios';

export const evaluationService = {
  // Lấy đánh giá theo ID thông báo
  getEvaluationByNotificationId: async (notificationId) => {
    try {
      const response = await axiosInstance.get(`/evaluations/${notificationId}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  // Tạo hoặc cập nhật đánh giá
  createOrUpdateEvaluation: async (notificationId, evaluationData) => {
    const response = await axiosInstance.post(`/evaluations/${notificationId}`, evaluationData);
    return response.data;
  }
}; 