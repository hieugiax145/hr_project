import React, { useState, useEffect } from 'react';
import { Layout, Input, Select, message, Dropdown, Modal, Button } from 'antd';
import { SearchOutlined, MoreOutlined, UserOutlined, BarChartOutlined, RiseOutlined, DownloadOutlined } from '@ant-design/icons';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from 'docx';
import html2pdf from 'html2pdf.js';

const { Content } = Layout;
const API_BASE_URL = 'http://localhost:8000/api';

const Positions = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [positions, setPositions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [positionToDelete, setPositionToDelete] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchPositions();
  }, [currentPage, searchQuery, typeFilter, modeFilter]);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: itemsPerPage,
        ...(searchQuery && { search: searchQuery }),
        ...(typeFilter !== 'all' && { type: typeFilter }),
        ...(modeFilter !== 'all' && { mode: modeFilter })
      });

      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập lại');
        return;
      }

      // Lấy danh sách positions
      const positionsResponse = await axios.get(`${API_BASE_URL}/positions?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Lấy danh sách applications đã duyệt
      const applicationsResponse = await axios.get(`${API_BASE_URL}/applications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (positionsResponse.status === 200) {
        const positions = positionsResponse.data.data || [];
        const applications = applicationsResponse.data || [];

        // Map thông tin địa điểm từ applications vào positions
        const positionsWithLocations = positions.map(position => {
          const matchingApplication = applications.find(app => 
            app.position === position.title && app.department === position.department
          );

          return {
            ...position,
            mainLocation: matchingApplication?.mainLocation || '',
            otherLocations: matchingApplication?.otherLocations || []
          };
        });

        setPositions(positionsWithLocations);
        setTotalPages(positionsResponse.data.pagination.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching positions:', error);
      
      if (error.response) {
        message.error(error.response.data?.message || 'Có lỗi xảy ra khi tải dữ liệu từ server');
      } else if (error.request) {
        message.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc thử lại sau');
      } else {
        message.error('Có lỗi xảy ra. Vui lòng thử lại sau');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Còn tuyển':
        return 'bg-[#E7F6EC] text-[#12B76A] border border-[#12B76A]';
      case 'Đã đủ':
        return 'bg-[#EFF4FF] text-[#3E63DD] border border-[#3E63DD]';
      case 'Tạm dừng':
        return 'bg-[#FEE4E2] text-[#F04438] border border-[#F04438]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handlePositionClick = (position) => {
    if (selectedPosition?._id === position._id) {
      setSelectedPosition(null);
    } else {
      setSelectedPosition(position);
    }
  };

  const handleEdit = (position) => {
    navigate(`/positions/edit/${position._id}`, { state: { position } });
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/positions/${positionToDelete._id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 200) {
        message.success('Xóa vị trí thành công');
        fetchPositions();
        setDeleteModalVisible(false);
        setPositionToDelete(null);
        if (selectedPosition?._id === positionToDelete._id) {
          setSelectedPosition(null);
        }
      }
    } catch (error) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa vị trí');
      console.error('Error deleting position:', error);
    }
  };

  const handleUpdateStatus = async (positionId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập lại');
        return;
      }

      const response = await axios.patch(
        `${API_BASE_URL}/positions/${positionId}/status`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        message.success('Cập nhật trạng thái thành công');
        fetchPositions();
      }
    } catch (error) {
      console.error('Error updating position status:', error);
      message.error('Có lỗi xảy ra khi cập nhật trạng thái');
    }
  };

  const getDropdownItems = (position) => ({
    items: [
      {
        key: '1',
        label: 'Sửa vị trí',
        onClick: () => handleEdit(position)
      },
      {
        key: '2',
        label: 'Cập nhật trạng thái',
        children: [
          {
            key: '2-1',
            label: 'Còn tuyển',
            onClick: () => handleUpdateStatus(position._id, 'Còn tuyển')
          },
          {
            key: '2-2',
            label: 'Tạm dừng',
            onClick: () => handleUpdateStatus(position._id, 'Tạm dừng')
          },
          {
            key: '2-3',
            label: 'Đã đủ',
            onClick: () => handleUpdateStatus(position._id, 'Đã đủ')
          }
        ]
      },
      {
        key: '3',
        label: 'Xóa vị trí',
        danger: true,
        onClick: () => {
          setPositionToDelete(position);
          setDeleteModalVisible(true);
        }
      }
    ]
  });

  const handleCardClick = (e, position) => {
    if (e.target.closest('.action-button') || e.target.closest('.applicants-count')) {
      return;
    }
    handlePositionClick(position);
  };

  const shortenId = (id) => {
    if (!id) return '';
    return id.substring(0, 6);
  };

  // Mapping địa chỉ chi tiết
  const getFullAddress = (mainLocation, otherLocations = []) => {
    const addressMapping = {
      'hanoi': 'Hà Nội - Tầng 7 tháp A tòa Sông Đà, đường Phạm Hùng, quận Nam Từ Liêm, Hà Nội',
      'hochiminh': 'HCM - Tầng 12, Tòa nhà Đảm Bảo An Toàn Hàng Hải phía Nam Số 42 đường Tự Cường, phường 4, Tân Bình, TP. Hồ Chí Minh',
      'danang': 'Đà Nẵng - Tầng 4, tòa nhà Ricco, số 363 Nguyễn Hữu Thọ, phường Khuê Trung, Quận Cẩm Lệ, Đà Nẵng'
    };

    const addresses = [];
    if (mainLocation && addressMapping[mainLocation]) {
      addresses.push(addressMapping[mainLocation]);
    }
    if (otherLocations && otherLocations.length > 0) {
      otherLocations.forEach(loc => {
        if (addressMapping[loc]) {
          addresses.push(addressMapping[loc]);
        }
      });
    }
    return addresses;
  };

  // Sửa lại hàm tải xuống JD
  const handleDownloadJD = async (format) => {
    try {
      if (!selectedPosition) {
        message.error('Không tìm thấy thông tin vị trí');
        return;
      }

      if (format === 'docx') {
        // Tạo document DOCX
        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: "MÔ TẢ CÔNG VIỆC",
                    bold: true,
                    size: 28
                  })
                ]
              }),
              new Paragraph({}),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Vị trí: ",
                    bold: true
                  }),
                  new TextRun({
                    text: selectedPosition.title
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Phòng ban: ",
                    bold: true
                  }),
                  new TextRun({
                    text: selectedPosition.department
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Cấp bậc: ",
                    bold: true
                  }),
                  new TextRun({
                    text: selectedPosition.level
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Kinh nghiệm: ",
                    bold: true
                  }),
                  new TextRun({
                    text: selectedPosition.experience
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Hình thức làm việc: ",
                    bold: true
                  }),
                  new TextRun({
                    text: selectedPosition.type
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Mô hình làm việc: ",
                    bold: true
                  }),
                  new TextRun({
                    text: selectedPosition.mode
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "Mức lương: ",
                    bold: true
                  }),
                  new TextRun({
                    text: `đ ${selectedPosition.salary}`
                  })
                ]
              }),
              new Paragraph({}),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "MÔ TẢ CÔNG VIỆC",
                    bold: true,
                    size: 24
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: selectedPosition.description
                  })
                ]
              }),
              new Paragraph({}),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "YÊU CẦU ỨNG VIÊN",
                    bold: true,
                    size: 24
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: selectedPosition.requirements
                  })
                ]
              }),
              new Paragraph({}),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "QUYỀN LỢI",
                    bold: true,
                    size: 24
                  })
                ]
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: selectedPosition.benefits
                  })
                ]
              })
            ]
          }]
        });

        // Tạo và tải xuống file
        const blob = await Packer.toBlob(doc);
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${selectedPosition.title.replace(/\s+/g, '_')}_JD.docx`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else if (format === 'pdf') {
        // Tạo HTML tạm thời cho PDF
        const tempDiv = document.createElement('div');
        tempDiv.style.padding = '20px';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        
        // Tiêu đề
        const title = document.createElement('h1');
        title.style.textAlign = 'center';
        title.style.color = '#333';
        title.style.marginBottom = '20px';
        title.innerHTML = 'MÔ TẢ CÔNG VIỆC';
        tempDiv.appendChild(title);
        
        // Thông tin vị trí
        const infoTable = document.createElement('table');
        infoTable.style.width = '100%';
        infoTable.style.marginBottom = '20px';
        infoTable.style.borderCollapse = 'collapse';
        
        const infoRows = [
          { label: 'Vị trí:', value: selectedPosition.title },
          { label: 'Phòng ban:', value: selectedPosition.department },
          { label: 'Cấp bậc:', value: selectedPosition.level },
          { label: 'Kinh nghiệm:', value: selectedPosition.experience },
          { label: 'Hình thức làm việc:', value: selectedPosition.type },
          { label: 'Mô hình làm việc:', value: selectedPosition.mode },
          { label: 'Mức lương:', value: `đ ${selectedPosition.salary}` }
        ];
        
        infoRows.forEach(row => {
          const tr = document.createElement('tr');
          
          const labelCell = document.createElement('td');
          labelCell.style.padding = '8px';
          labelCell.style.borderBottom = '1px solid #ddd';
          labelCell.style.width = '30%';
          labelCell.style.fontWeight = 'bold';
          labelCell.innerHTML = row.label;
          
          const valueCell = document.createElement('td');
          valueCell.style.padding = '8px';
          valueCell.style.borderBottom = '1px solid #ddd';
          valueCell.innerHTML = row.value;
          
          tr.appendChild(labelCell);
          tr.appendChild(valueCell);
          infoTable.appendChild(tr);
        });
        
        tempDiv.appendChild(infoTable);
        
        // Mô tả công việc
        const descTitle = document.createElement('h2');
        descTitle.style.color = '#333';
        descTitle.style.marginTop = '20px';
        descTitle.style.marginBottom = '10px';
        descTitle.innerHTML = 'MÔ TẢ CÔNG VIỆC';
        tempDiv.appendChild(descTitle);
        
        const descContent = document.createElement('div');
        descContent.style.marginBottom = '20px';
        descContent.style.whiteSpace = 'pre-line';
        descContent.innerHTML = selectedPosition.description;
        tempDiv.appendChild(descContent);
        
        // Yêu cầu ứng viên
        const reqTitle = document.createElement('h2');
        reqTitle.style.color = '#333';
        reqTitle.style.marginTop = '20px';
        reqTitle.style.marginBottom = '10px';
        reqTitle.innerHTML = 'YÊU CẦU ỨNG VIÊN';
        tempDiv.appendChild(reqTitle);
        
        const reqContent = document.createElement('div');
        reqContent.style.marginBottom = '20px';
        reqContent.style.whiteSpace = 'pre-line';
        reqContent.innerHTML = selectedPosition.requirements;
        tempDiv.appendChild(reqContent);
        
        // Quyền lợi
        const benefitsTitle = document.createElement('h2');
        benefitsTitle.style.color = '#333';
        benefitsTitle.style.marginTop = '20px';
        benefitsTitle.style.marginBottom = '10px';
        benefitsTitle.innerHTML = 'QUYỀN LỢI';
        tempDiv.appendChild(benefitsTitle);
        
        const benefitsContent = document.createElement('div');
        benefitsContent.style.marginBottom = '20px';
        benefitsContent.style.whiteSpace = 'pre-line';
        benefitsContent.innerHTML = selectedPosition.benefits;
        tempDiv.appendChild(benefitsContent);
        
        // Thêm div tạm thời vào body
        document.body.appendChild(tempDiv);
        
        // Cấu hình cho html2pdf
        const options = {
          margin: 10,
          filename: `${selectedPosition.title.replace(/\s+/g, '_')}_JD.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // Tạo PDF
        html2pdf().from(tempDiv).set(options).save().then(() => {
          // Xóa div tạm thời sau khi tạo PDF
          document.body.removeChild(tempDiv);
        });
      }

      message.success(`Đã tải xuống JD định dạng ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Error downloading JD:', error);
      message.error('Có lỗi xảy ra khi tải xuống JD');
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <Layout style={{ marginLeft: 282 }}>
        <Content style={{ margin: '80px 16px 24px', minHeight: 280, maxHeight: 'calc(100vh - 104px)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {/* Search and Filters */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-[400px]">
                <Input
                  placeholder="Tìm vị trí tuyển dụng"
                  prefix={<SearchOutlined className="text-gray-400" />}
                  className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select
                value={typeFilter}
                onChange={setTypeFilter}
                style={{ width: 120 }}
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'Full-time', label: 'Full-time' },
                  { value: 'Part-time', label: 'Part-time' },
                  { value: 'Contract', label: 'Contract' }
                ]}
                className="h-10"
              />
              <Select
                value={modeFilter}
                onChange={setModeFilter}
                style={{ width: 120 }}
                options={[
                  { value: 'all', label: 'Tất cả' },
                  { value: 'On-site', label: 'On-site' },
                  { value: 'Remote', label: 'Remote' },
                  { value: 'Hybrid', label: 'Hybrid' }
                ]}
                className="h-10"
              />
            </div>
            <button
              onClick={() => navigate('/positions/create')}
              className="flex items-center gap-2 px-4 py-2 bg-[#DAF374] text-black rounded-lg hover:bg-[#c5dd60] transition-colors"
            >
              <FaPlus size={16} />
              <span>Thêm mới</span>
            </button>
          </div>

          <div className="flex gap-6 overflow-hidden">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B61FF]"></div>
              </div>
            ) : (
              <div className={`${selectedPosition ? 'w-[40%]' : 'flex-1'} overflow-y-auto pb-6 ${selectedPosition ? 'pr-4' : ''}`}>
                <div className={`${
                  selectedPosition 
                    ? 'space-y-4' 
                    : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                }`}>
                  {positions.map((position) => (
                    <div
                      key={position._id}
                      className={`bg-white rounded-[10px] p-4 border transition-colors cursor-pointer relative ${
                        selectedPosition?._id === position._id ? 'border-[#7B61FF]' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={(e) => handleCardClick(e, position)}
                    >
                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(position.status)}`}>
                          {position.status}
                        </span>
                      </div>

                      {selectedPosition?._id === position._id ? (
                        // Layout khi có position được chọn - áp dụng cho tất cả card
                        <>
                          {/* Avatar and Info */}
                          <div className="flex items-start gap-3 mb-4">
                            <div className="w-10 h-10 bg-[#F4F1FE] rounded-lg flex items-center justify-center">
                              <span className="text-[#7B61FF] text-lg font-medium">
                                {position.title.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1">
                              <div className="text-xs text-gray-500 mb-1">
                                ID YCTD: {shortenId(position._id)}
                              </div>
                              <h3 className="text-base font-medium text-gray-900 mb-1">
                                {position.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {position.department}
                              </p>
                            </div>
                            <Dropdown
                              menu={getDropdownItems(position)}
                              trigger={['click']}
                              placement="bottomRight"
                            >
                              <button 
                                className="text-gray-400 hover:text-gray-600 p-1 bg-white action-button"
                                onClick={(e) => e.stopPropagation()} 
                              >
                                <MoreOutlined />
                              </button>
                            </Dropdown>
                          </div>

                          {/* Tags Row */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-full">
                              <BarChartOutlined className="text-gray-400" />
                              <span className="text-xs text-gray-600">{position.level}</span>
                            </div>
                            <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-full">
                              <RiseOutlined className="text-gray-400" />
                              <span className="text-xs text-gray-600">{position.experience}</span>
                            </div>
                            <span className="px-2 py-1 bg-gray-50 rounded-full text-xs text-gray-600">
                              {position.type}
                            </span>
                            <span className="px-2 py-1 bg-gray-50 rounded-full text-xs text-gray-600">
                              {position.mode}
                            </span>
                          </div>
                        </>
                      ) : (
                        // Layout mặc định khi không có position nào được chọn
                        <>
                          {/* ID */}
                          <div className="text-xs text-gray-500 mb-2">
                            ID YCTD: {shortenId(position._id)}
                          </div>

                          {/* Title and Department */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-base font-medium text-gray-900 mb-1">
                                {position.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {position.department}
                              </p>
                            </div>
                            <Dropdown
                              menu={getDropdownItems(position)}
                              trigger={['click']}
                              placement="bottomRight"
                            >
                              <button 
                                className="text-gray-400 hover:text-gray-600 p-1 bg-white action-button"
                                onClick={(e) => e.stopPropagation()} 
                              >
                                <MoreOutlined />
                              </button>
                            </Dropdown>
                          </div>

                          {/* Level and Experience */}
                          <div className="flex flex-col gap-2 mb-4">
                            <div className="flex items-center gap-2">
                              <BarChartOutlined className="text-gray-400" />
                              <span className="text-sm text-gray-600">{position.level}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <RiseOutlined className="text-gray-400" />
                              <span className="text-sm text-gray-600">{position.experience}</span>
                            </div>
                          </div>
                        </>
                      )}

                      {/* Type and Mode */}
                      <div className="flex gap-2 mb-4">
                        <span className="px-2 py-1 bg-gray-50 rounded-full text-xs text-gray-600">
                          {position.type}
                        </span>
                        <span className="px-2 py-1 bg-gray-50 rounded-full text-xs text-gray-600">
                          {position.mode}
                        </span>
                      </div>

                      {/* Salary and Applicants */}
                      <div className="flex flex-col gap-2">
                        <div className="text-[#7B61FF] font-medium">đ {position.salary}</div>
                        <div 
                          className="text-sm text-gray-500 cursor-pointer hover:text-[#7B61FF] applicants-count flex items-center gap-1"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            navigate(`/positions/${position._id}/candidates`);
                          }}
                        >
                          <UserOutlined className="text-gray-400" />
                          {position.applicants} ứng viên
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Position Detail Panel */}
            {selectedPosition && (
              <div className="w-[60%] bg-white rounded-lg p-6 overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-xs bg-[#F4F1FE] text-[#7B61FF] px-2 py-1 rounded-md inline-block mb-2">
                      ID VTTD: {selectedPosition._id}
                    </div>
                    <h2 className="text-xl font-semibold mb-1">{selectedPosition.title}</h2>
                  </div>
                  <div className="flex gap-2">
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: '1',
                            label: 'Còn tuyển',
                            onClick: () => handleUpdateStatus(selectedPosition._id, 'Còn tuyển')
                          },
                          {
                            key: '2',
                            label: 'Tạm dừng',
                            onClick: () => handleUpdateStatus(selectedPosition._id, 'Tạm dừng')
                          },
                          {
                            key: '3',
                            label: 'Đã đủ',
                            onClick: () => handleUpdateStatus(selectedPosition._id, 'Đã đủ')
                          }
                        ]
                      }}
                      trigger={['click']}
                      placement="bottomRight"
                    >
                      <button className="px-3 py-1 bg-[#DAF374] text-black rounded-lg text-sm">
                        {selectedPosition.status}
                      </button>
                    </Dropdown>
                    <Dropdown
                      menu={{
                        items: [
                          {
                            key: '1',
                            label: 'Tải xuống DOCX',
                            onClick: () => handleDownloadJD('docx')
                          },
                          {
                            key: '2',
                            label: 'Tải xuống PDF',
                            onClick: () => handleDownloadJD('pdf')
                          }
                        ]
                      }}
                      trigger={['click']}
                      placement="bottomRight"
                    >
                      <Button 
                        icon={<DownloadOutlined />} 
                        className="bg-[#7B61FF] text-white hover:bg-[#6A50E0]"
                      >
                        Tải xuống JD
                      </Button>
                    </Dropdown>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Level</div>
                    <div className="font-medium">{selectedPosition.level}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Kinh nghiệm</div>
                    <div className="font-medium">{selectedPosition.experience}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Hình thức làm việc</div>
                    <div className="font-medium">{selectedPosition.type}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Mô hình làm việc</div>
                    <div className="font-medium">{selectedPosition.mode}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Mức lương</div>
                    <div className="font-medium text-[#7B61FF]">đ {selectedPosition.salary}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Địa điểm làm việc</div>
                    <div className="font-medium">
                      {getFullAddress(selectedPosition.mainLocation, selectedPosition.otherLocations).map((address, index) => (
                        <div key={index} className="mb-2">{address}</div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Mô tả công việc</h3>
                    <div className="text-sm whitespace-pre-line">{selectedPosition.description}</div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Yêu cầu ứng viên</h3>
                    <div className="text-sm whitespace-pre-line">{selectedPosition.requirements}</div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Quyền lợi</h3>
                    <div className="text-sm whitespace-pre-line">{selectedPosition.benefits}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 px-2 bg-white p-4 rounded-lg">
            <div className="text-sm text-gray-600">
              Hiển thị {positions.length} vị trí
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-black bg-white text-black hover:bg-gray-50 disabled:opacity-50"
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded border border-black ${
                    page === currentPage
                      ? 'bg-[#DAF374] text-black border-[#DAF374]'
                      : 'bg-white text-black hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-black bg-white text-black hover:bg-gray-50 disabled:opacity-50"
              >
                →
              </button>
            </div>
          </div>
        </Content>
      </Layout>

      <Modal
        title={<div className="text-lg">Xoá vị trí tuyển dụng</div>}
        open={deleteModalVisible}
        onOk={handleDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setPositionToDelete(null);
        }}
        okText="Xoá"
        cancelText="Huỷ"
        okButtonProps={{ 
          danger: true,
          className: 'bg-[#EF4444] hover:bg-[#DC2626] text-white' 
        }}
        cancelButtonProps={{
          className: 'border-gray-200 text-gray-700'
        }}
        className="custom-delete-modal"
      >
        <p className="text-base mb-2">Bạn có chắc muốn xoá vị trí này không?</p>
        {positionToDelete && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F4F1FE] text-[#7B61FF] rounded-lg flex items-center justify-center text-lg font-medium">
                {positionToDelete.title.charAt(0)}
              </div>
              <div>
                <h4 className="font-medium text-[#1A1A1A]">{positionToDelete.title}</h4>
                <p className="text-sm text-gray-500">{positionToDelete.department}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Positions; 