import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { API_URL } from '../../config';

const JobsCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/candidates`);
      setCandidates(response.data.candidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      message.error('Có lỗi xảy ra khi tải danh sách ứng viên');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCandidateStatus = async (candidateId, newStatus) => {
    try {
      console.log('Updating candidate status:', { candidateId, newStatus });
      
      // Kiểm tra giá trị newStatus có hợp lệ không
      const validStages = ['new', 'reviewing', 'interview1', 'interview2', 'offer', 'hired', 'rejected'];
      if (!validStages.includes(newStatus)) {
        message.error('Trạng thái không hợp lệ');
        return;
      }

      // Gửi request với body đúng format
      const response = await axios.patch(
        `${API_URL}/candidates/${candidateId}/status`,
        { stage: newStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      console.log('Update response:', response.data);
      
      // Cập nhật lại danh sách ứng viên
      fetchCandidates();
      
      message.success('Cập nhật trạng thái thành công');
    } catch (error) {
      console.error('Error updating candidate status:', error);
      if (error.response) {
        // Server trả về lỗi
        console.error('Error response:', error.response.data);
        message.error(error.response.data.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
      } else if (error.request) {
        // Không nhận được response
        console.error('No response received:', error.request);
        message.error('Không thể kết nối đến server');
      } else {
        // Lỗi khi tạo request
        console.error('Error creating request:', error.message);
        message.error('Có lỗi xảy ra khi tạo yêu cầu');
      }
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return (
    <div>
      {/* Render your candidates component here */}
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <div>
          {candidates.map(candidate => (
            <div key={candidate._id}>
              <div>ID: {candidate._id}</div>
              <div>Trạng thái hiện tại: {candidate.stage}</div>
              <div>
                <select 
                  value={candidate.stage}
                  onChange={(e) => handleUpdateCandidateStatus(candidate._id, e.target.value)}
                >
                  <option value="new">Mới</option>
                  <option value="reviewing">Đang xem xét</option>
                  <option value="interview1">Phỏng vấn vòng 1</option>
                  <option value="interview2">Phỏng vấn vòng 2</option>
                  <option value="offer">Đã offer</option>
                  <option value="hired">Đã tuyển</option>
                  <option value="rejected">Từ chối</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobsCandidates; 