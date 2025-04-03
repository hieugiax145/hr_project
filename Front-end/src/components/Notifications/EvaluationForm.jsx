import React, { useState, useEffect } from 'react';
import { Layout, Button, Typography, Table, Input, Space, message, Select } from 'antd';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import Topbar from '../Topbar/Topbar';
import Sidebar from '../Sidebar/Sidebar';
import { evaluationService } from '../../services/evaluationService';

const { Title } = Typography;
const { Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;

const completionOptions = [
  'Chưa hoàn thành',
  'Hoàn thiện',
  'Hoàn thành trước thời hạn'
];

const EvaluationForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  
  // State cho các trường dữ liệu
  const [tasks, setTasks] = useState([
    { key: '1', stt: 1, task: '', details: '', results: '', completion: '', comments: '', notes: '' },
  ]);

  const [selfEvaluation, setSelfEvaluation] = useState({
    advantages: '',
    disadvantages: '',
    improvements: '',
    overall: ''
  });

  const [managerEvaluation, setManagerEvaluation] = useState({
    overall: '',
    futurePlan: ''
  });

  const [result, setResult] = useState('');
  const [note, setNote] = useState('');

  // Load dữ liệu đánh giá
  useEffect(() => {
    loadEvaluation();
  }, [id]);

  const loadEvaluation = async () => {
    try {
      setIsLoading(true);
      const data = await evaluationService.getEvaluationByNotificationId(id);
      if (data) {
        setTasks(data.tasks.length > 0 ? data.tasks.map((task, index) => ({
          ...task,
          key: String(index + 1),
          stt: index + 1
        })) : [{ key: '1', stt: 1, task: '', details: '', results: '', completion: '', comments: '', notes: '' }]);
        setSelfEvaluation(data.selfEvaluation);
        setManagerEvaluation(data.managerEvaluation);
        setResult(data.result);
        setNote(data.note);
      }
    } catch (error) {
      message.error('Lỗi khi tải dữ liệu đánh giá');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRow = () => {
    const newKey = String(tasks.length + 1);
    setTasks([...tasks, { 
      key: newKey, 
      stt: tasks.length + 1,
      task: '', 
      details: '', 
      results: '', 
      completion: '', 
      comments: '', 
      notes: '' 
    }]);
  };

  const handleDeleteRow = (key) => {
    if (tasks.length === 1) {
      message.warning('Phải có ít nhất một hàng đánh giá');
      return;
    }
    const newTasks = tasks.filter(item => item.key !== key);
    // Cập nhật lại key cho các hàng còn lại
    const updatedTasks = newTasks.map((task, index) => ({
      ...task,
      key: String(index + 1)
    }));
    setTasks(updatedTasks);
  };

  // Xử lý lưu đánh giá
  const handleSave = async () => {
    try {
      const evaluationData = {
        tasks,
        selfEvaluation,
        managerEvaluation,
        result,
        note
      };

      await evaluationService.createOrUpdateEvaluation(id, evaluationData);
      message.success('Lưu đánh giá thành công');
      navigate(`/notifications/${id}`);
    } catch (error) {
      message.error('Lỗi khi lưu đánh giá');
    }
  };

  // Xử lý hủy
  const handleCancel = () => {
    navigate(`/notifications/${id}`);
  };

  const evaluationColumns = [
    {
      title: () => <div style={{ textAlign: 'center', color: 'white' }}>STT</div>,
      width: 60,
      align: 'center',
      className: 'bg-[#8B1C1C] text-white',
      render: (_, __, index) => (
        <div style={{ 
          textAlign: 'center', 
          color: 'black',
          width: '100%',
          padding: '4px 0'
        }}>
          {index + 1}
        </div>
      )
    },
    {
      title: 'Các Hạng mục công việc được giao',
      dataIndex: 'task',
      key: 'task',
      width: '20%',
      className: 'bg-[#8B1C1C] text-white',
      render: (text, record) => (
        <Input
          value={text}
          onChange={e => {
            const newTasks = [...tasks];
            const index = newTasks.findIndex(item => item.key === record.key);
            newTasks[index] = { ...newTasks[index], task: e.target.value };
            setTasks(newTasks);
          }}
        />
      )
    },
    {
      title: 'Chi tiết công việc',
      dataIndex: 'details',
      key: 'details',
      width: '20%',
      className: 'bg-[#8B1C1C] text-white',
      render: (text, record) => (
        <Input
          value={text}
          onChange={e => {
            const newTasks = [...tasks];
            const index = newTasks.findIndex(item => item.key === record.key);
            newTasks[index] = { ...newTasks[index], details: e.target.value };
            setTasks(newTasks);
          }}
        />
      )
    },
    {
      title: 'Kết quả công việc (chỉ tiết)',
      dataIndex: 'results',
      key: 'results',
      width: '20%',
      className: 'bg-[#8B1C1C] text-white',
      render: (text, record) => (
        <Input
          value={text}
          onChange={e => {
            const newTasks = [...tasks];
            const index = newTasks.findIndex(item => item.key === record.key);
            newTasks[index] = { ...newTasks[index], results: e.target.value };
            setTasks(newTasks);
          }}
        />
      )
    },
  ];

  const managementColumns = [
    {
      title: 'Mức độ hoàn thành',
      dataIndex: 'completion',
      key: 'completion',
      width: '15%',
      className: 'bg-[#8B1C1C] text-white',
      render: (text, record) => (
        <Select
          value={text}
          allowClear
          placeholder="Chọn mức độ"
          onChange={value => {
            const newTasks = [...tasks];
            const index = newTasks.findIndex(item => item.key === record.key);
            newTasks[index] = { ...newTasks[index], completion: value };
            setTasks(newTasks);
          }}
          style={{ width: '100%' }}
        >
          {completionOptions.map(option => (
            <Option key={option} value={option}>{option}</Option>
          ))}
        </Select>
      )
    },
    {
      title: 'Nhận xét chi tiết',
      dataIndex: 'comments',
      key: 'comments',
      width: '20%',
      className: 'bg-[#8B1C1C] text-white',
      render: (text, record) => (
        <TextArea
          value={text}
          onChange={e => {
            const newTasks = [...tasks];
            const index = newTasks.findIndex(item => item.key === record.key);
            newTasks[index] = { ...newTasks[index], comments: e.target.value };
            setTasks(newTasks);
          }}
          autoSize={{ minRows: 2, maxRows: 4 }}
        />
      )
    },
    {
      title: 'Ghi chú',
      dataIndex: 'notes',
      key: 'notes',
      width: '25%',
      className: 'bg-[#8B1C1C] text-white',
      render: (text, record) => (
        <TextArea
          value={text}
          onChange={e => {
            const newTasks = [...tasks];
            const index = newTasks.findIndex(item => item.key === record.key);
            newTasks[index] = { ...newTasks[index], notes: e.target.value };
            setTasks(newTasks);
          }}
          autoSize={{ minRows: 2, maxRows: 4 }}
        />
      )
    },
  ];

  const selfEvaluationLabels = {
    advantages: 'Điểm mạnh',
    disadvantages: 'Điểm yếu',
    improvements: 'Điểm cần cải thiện',
    overall: 'Đánh giá chung'
  };

  const managerEvaluationLabels = {
    overall: 'Đánh giá chung',
    futurePlan: 'Kế hoạch phát triển'
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Sidebar />
      <Layout style={{ marginLeft: 282 }}>
        <Topbar />
        <Content style={{ margin: '80px 16px 24px', minHeight: 280 }}>
          <div className="bg-white rounded-lg shadow p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Button 
                  icon={<ArrowLeftOutlined />}
                  onClick={handleCancel}
                >
                  Quay lại
                </Button>
                <Title level={4} className="m-0">Đánh giá kết quả thử việc</Title>
              </div>
              <Space>
                <Button 
                  className="border-none text-black bg-white hover:bg-gray-100"
                  onClick={handleCancel}
                >
                  Hủy
                </Button>
                <Button 
                  className="bg-[#8B5CF6] hover:bg-[#7C3AED] text-white border-none"
                  onClick={handleSave}
                >
                  Lưu
                </Button>
                <Button className="bg-[#DAF374] hover:bg-[#c5dd60] text-black border-none">
                  Xuất file
                </Button>
              </Space>
            </div>

            {/* Thông tin cơ bản */}
            <div className="bg-[#8B1C1C] text-white p-4 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-2">Họ và tên:</p>
                  <p className="mb-2">Team:</p>
                  <p className="mb-0">Leader:</p>
                </div>
                <div>
                  <p className="mb-2">Vị trí:</p>
                </div>
              </div>
            </div>

            {/* Kỳ đánh giá */}
            <div className="bg-[#C2D5A8] p-4 mb-4">
              <div className="flex justify-between">
                <div>Kỳ đánh giá</div>
                <div>HĐTV - 2 tháng</div>
              </div>
            </div>

            {/* Bảng đánh giá */}
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center font-medium bg-[#C2D5A8] p-2">Phần dành cho nhân viên tự đánh giá</div>
                <div className="text-center font-medium bg-[#C2D5A8] p-2">Phần quản lý đánh giá</div>
              </div>
              <Table 
                columns={[...evaluationColumns, ...managementColumns]}
                dataSource={tasks}
                pagination={false}
                bordered
                size="middle"
                className="evaluation-table"
                loading={isLoading}
                footer={() => (
                  <Button 
                    type="dashed" 
                    onClick={handleAddRow} 
                    icon={<PlusOutlined />}
                    className="w-full"
                  >
                    Thêm hàng đánh giá
                  </Button>
                )}
              />
            </div>

            {/* Nhận xét tự đánh giá tổng quan */}
            <div className="bg-[#8B1C1C] text-white p-2 mb-2 text-center">
              Nhận xét tự đánh giá tổng quan
            </div>
            <table className="w-full mb-4 border-collapse border border-gray-300">
              <tbody>
                {Object.entries(selfEvaluation).map(([key, value]) => (
                  <tr key={key} className="border-b border-gray-300">
                    <td className="border-r border-gray-300 p-2 w-1/4">{selfEvaluationLabels[key]}</td>
                    <td className="p-2">
                      <TextArea
                        value={value}
                        onChange={e => setSelfEvaluation({ ...selfEvaluation, [key]: e.target.value })}
                        rows={3}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Quản lý trực tiếp đánh giá tổng quan */}
            <div className="bg-[#8B1C1C] text-white p-2 mb-2 text-center">
              Quản lý trực tiếp đánh giá tổng quan
            </div>
            <table className="w-full mb-4 border-collapse border border-gray-300">
              <tbody>
                {Object.entries(managerEvaluation).map(([key, value]) => (
                  <tr key={key} className="border-b border-gray-300">
                    <td className="border-r border-gray-300 p-2 w-1/4">{managerEvaluationLabels[key]}</td>
                    <td className="p-2">
                      <TextArea
                        value={value}
                        onChange={e => setManagerEvaluation({ ...managerEvaluation, [key]: e.target.value })}
                        rows={3}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Kết quả đánh giá */}
            <table className="w-full mb-4 border-collapse border border-gray-300">
              <tbody>
                <tr className="bg-yellow-200">
                  <td className="border-r border-gray-300 p-2 w-1/4">KẾT QUẢ ĐÁNH GIÁ</td>
                  <td className="p-2">
                    <TextArea
                      value={result}
                      onChange={e => setResult(e.target.value)}
                      rows={3}
                    />
                  </td>
                </tr>
                <tr className="bg-yellow-200">
                  <td className="border-r border-gray-300 p-2 w-1/4">Lưu ý (thay đổi mức lương nếu có)</td>
                  <td className="p-2">
                    <TextArea
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      rows={3}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default EvaluationForm; 