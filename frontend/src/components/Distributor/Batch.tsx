import React, { useState, useEffect } from 'react';
import { 
  FaBoxes, FaPlus, FaSearch, FaEye, 
  FaCheckCircle, FaClock, FaFileAlt, FaShieldAlt,
  FaShippingFast, FaReceipt, FaHistory, FaQrcode
} from 'react-icons/fa';
import '../../assets/css/Distributor/batch.css';


const DistributorBatch: React.FC = () => {
  const [batches, setBatches] = useState<any>([]);
  const [filteredBatches, setFilteredBatches] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<any>('');
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(false);

  // Giả lập dữ liệu lô hàng
  useEffect(() => {
    const mockBatches = [
      {
        id: "BATCH-2023-001",
        products: [
          { id: "P001", name: "Paracetamol 500mg", quantity: 500, expiryDate: "2024-12-31" },
          { id: "P002", name: "Amoxicillin 250mg", quantity: 300, expiryDate: "2024-10-15" }
        ],
        manufacturer: "Công ty Dược phẩm ABC",
        manufactureDate: "2023-09-01",
        expiryDate: "2024-12-31",
        status: "verified",
        createdDate: "2023-10-10",
        documents: [
          { name: "Giấy chứng nhận chất lượng", cid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" },
          { name: "Giấy kiểm định", cid: "QmY7yz7pX9z2cJ4KnLwHCnL72vedxjQkDDP1mXWo6uco" }
        ],
        transactionHash: "0x4a8c5d87a2b3c9e1f0d8e7c2b3a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1",
        timeline: [
          { status: "created", date: "2023-10-10 08:30:45", description: "Lô hàng được tạo" },
          { status: "verified", date: "2023-10-10 14:22:18", description: "Lô hàng đã xác thực trên blockchain" }
        ],
        destination: "Nhà thuốc Minh Anh - 123 Đường Láng, Hà Nội",
        shippingInfo: {
          carrier: "Công ty Vận chuyển Nhanh",
          trackingNumber: "VN123456789",
          estimatedDelivery: "2023-10-15"
        }
      },
      {
        id: "BATCH-2023-002",
        products: [
          { id: "P003", name: "Vitamin C 1000mg", quantity: 400, expiryDate: "2025-03-20" },
          { id: "P004", name: "Metformin 500mg", quantity: 250, expiryDate: "2024-11-30" }
        ],
        manufacturer: "Công ty Dược phẩm XYZ",
        manufactureDate: "2023-09-15",
        expiryDate: "2025-03-20",
        status: "sent",
        createdDate: "2023-10-12",
        documents: [
          { name: "Giấy chứng nhận chất lượng", cid: "QmZ3pz7pX9z2cJ4KnLwHCnL72vedxjQkDDP1mXWo6uco" }
        ],
        transactionHash: "0x5b9c6d87a2b3c9e1f0d8e7c2b3a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1",
        timeline: [
          { status: "created", date: "2023-10-12 09:15:22", description: "Lô hàng được tạo" },
          { status: "verified", date: "2023-10-12 11:40:05", description: "Lô hàng đã xác thực trên blockchain" },
          { status: "sent", date: "2023-10-13 08:55:37", description: "Lô hàng đã được gửi đi" }
        ],
        destination: "Nhà thuốc Hồng Phúc - 456 Đường Giải Phóng, Hà Nội",
        shippingInfo: {
          carrier: "Công ty Vận chuyển Express",
          trackingNumber: "EX987654321",
          estimatedDelivery: "2023-10-16"
        }
      },
      {
        id: "BATCH-2023-003",
        products: [
          { id: "P001", name: "Paracetamol 500mg", quantity: 600, expiryDate: "2024-12-31" },
          { id: "P005", name: "Aspirin 500mg", quantity: 350, expiryDate: "2024-08-20" }
        ],
        manufacturer: "Công ty Dược phẩm ABC",
        manufactureDate: "2023-09-05",
        expiryDate: "2024-12-31",
        status: "received",
        createdDate: "2023-10-05",
        documents: [
          { name: "Giấy chứng nhận chất lượng", cid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco" },
          { name: "Giấy kiểm định", cid: "QmY7yz7pX9z2cJ4KnLwHCnL72vedxjQkDDP1mXWo6uco" },
          { name: "Phiếu xuất kho", cid: "QmZ3pz7pX9z2cJ4KnLwHCnL72vedxjQkDDP1mXWo6uco" }
        ],
        transactionHash: "0x6c1d7e87a2b3c9e1f0d8e7c2b3a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1",
        timeline: [
          { status: "created", date: "2023-10-05 10:20:15", description: "Lô hàng được tạo" },
          { status: "verified", date: "2023-10-05 15:45:30", description: "Lô hàng đã xác thực trên blockchain" },
          { status: "sent", date: "2023-10-06 09:10:45", description: "Lô hàng đã được gửi đi" },
          { status: "received", date: "2023-10-07 14:30:20", description: "Lô hàng đã được nhận" }
        ],
        destination: "Nhà thuốc Bảo Châu - 789 Đường Lê Văn Lương, Hà Nội",
        shippingInfo: {
          carrier: "Công ty Vận chuyển Nhanh",
          trackingNumber: "VN456789123",
          estimatedDelivery: "2023-10-08",
          actualDelivery: "2023-10-07"
        }
      },
      {
        id: "BATCH-2023-004",
        products: [
          { id: "P006", name: "Omeprazole 20mg", quantity: 200, expiryDate: "2024-09-15" }
        ],
        manufacturer: "Công ty Dược phẩm Medico",
        manufactureDate: "2023-08-20",
        expiryDate: "2024-09-15",
        status: "created",
        createdDate: "2023-10-14",
        documents: [],
        transactionHash: null,
        timeline: [
          { status: "created", date: "2023-10-14 11:05:18", description: "Lô hàng được tạo" }
        ],
        destination: "Nhà thuốc An Khang - 321 Đường Nguyễn Trãi, Hà Nội"
      }
    ];
    
    setBatches(mockBatches);
    setFilteredBatches(mockBatches);
  }, []);

  // Xử lý tìm kiếm và lọc
  useEffect(() => {
    let filtered = batches;
    
    // Lọc theo trạng thái
    if (statusFilter !== 'all') {
      filtered = filtered.filter((batch: any) => batch.status === statusFilter);
    }
    
    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter((batch: any) => 
        batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        batch.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredBatches(filtered);
  }, [searchTerm, statusFilter, batches]);

  // Xem chi tiết lô hàng
  const handleViewDetails = (batch: any) => {
    setSelectedBatch(batch);
    setShowModal(true);
  };

  // Tạo lô hàng mới
  const handleCreateBatch = () => {
    setShowCreateModal(true);
  };

  // Xác thực lô hàng trên blockchain
  const handleVerifyBatch = async (batchId: any) => {
    setActionLoading(true);
    
    // Giả lập gọi API để xác thực lô hàng
    try {
      // Giả lập thời gian xử lý
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Cập nhật trạng thái lô hàng
      const updatedBatches = batches.map((batch: any) => 
        batch.id === batchId ? {
          ...batch, 
          status: "verified",
          transactionHash: "0x" + Math.random().toString(16).substr(2, 64),
          documents: [
            ...batch.documents,
            { name: "Xác nhận blockchain", cid: "Qm" + Math.random().toString(16).substr(2, 42) }
          ],
          timeline: [
            ...batch.timeline,
            { 
              status: "verified", 
              date: new Date().toISOString().replace('T', ' ').substring(0, 19),
              description: "Lô hàng đã xác thực trên blockchain" 
            }
          ]
        } : batch
      );
      
      setBatches(updatedBatches);
    } catch (error) {
      console.error("Lỗi khi xác thực lô hàng:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Cập nhật trạng thái lô hàng
  const handleUpdateStatus = async (batchId: any, newStatus: any) => {
    setActionLoading(true);
    
    // Giả lập gọi API để cập nhật trạng thái
    try {
      // Giả lập thời gian xử lý
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Cập nhật trạng thái lô hàng
      const updatedBatches = batches.map((batch: any) => {
        if (batch.id === batchId) {
          let description = "";
          switch(newStatus) {
            case "sent":
              description = "Lô hàng đã được gửi đi";
              break;
            case "received":
              description = "Lô hàng đã được nhận";
              break;
            default:
              description = "Trạng thái lô hàng được cập nhật";
          }
          
          return {
            ...batch, 
            status: newStatus,
            timeline: [
              ...batch.timeline,
              { 
                status: newStatus, 
                date: new Date().toISOString().replace('T', ' ').substring(0, 19),
                description 
              }
            ]
          };
        }
        return batch;
      });
      
      setBatches(updatedBatches);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Định dạng ngày
  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Định dạng ngày giờ
  const formatDateTime = (dateTimeString: any) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
  };

  // Hiển thị trạng thái lô hàng
  const renderStatus = (status: any) => {
    switch(status) {
      case "created":
        return <span className="status created"><FaClock /> Đã tạo</span>;
      case "verified":
        return <span className="status verified"><FaCheckCircle /> Đã xác thực</span>;
      case "sent":
        return <span className="status sent"><FaShippingFast /> Đã gửi</span>;
      case "received":
        return <span className="status received"><FaReceipt /> Đã nhận</span>;
      default:
        return <span className="status unknown">Không xác định</span>;
    }
  };

  // Hiển thị timeline
  const renderTimeline = (timeline: any) => {
    return (
      <div className="timeline">
        {timeline.map((event: any, index: any) => (
          <div key={index} className="timeline-event">
            <div className="timeline-icon">
              {event.status === "created" && <FaPlus />}
              {event.status === "verified" && <FaShieldAlt />}
              {event.status === "sent" && <FaShippingFast />}
              {event.status === "received" && <FaReceipt />}
            </div>
            <div className="timeline-content">
              <div className="timeline-date">{formatDateTime(event.date)}</div>
              <div className="timeline-description">{event.description}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="batch-management">
      <header className="page-header">
        <h1><FaBoxes /> Quản lý Lô hàng</h1>
        <p>Theo dõi và quản lý các lô hàng với xác thực blockchain toàn diện</p>
      </header>

      <div className="controls">
        <div className="search-box">
          <FaSearch />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo ID lô hàng, nhà sản xuất hoặc địa chỉ..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="controls-right">
          <div className="filter-group">
            <label>Lọc theo trạng thái:</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="created">Đã tạo</option>
              <option value="verified">Đã xác thực</option>
              <option value="sent">Đã gửi</option>
              <option value="received">Đã nhận</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleCreateBatch}>
            <FaPlus /> Tạo lô hàng
          </button>
        </div>
      </div>

      <div className="batches-grid">
        {filteredBatches.map((batch: any) => (
          <div key={batch.id} className="batch-card">
            <div className="batch-header">
              <div className="batch-id">{batch.id}</div>
              <div className="batch-status">{renderStatus(batch.status)}</div>
            </div>
            
            <div className="batch-info">
              <div className="info-item">
                <span className="label">Nhà sản xuất:</span>
                <span className="value">{batch.manufacturer}</span>
              </div>
              <div className="info-item">
                <span className="label">Ngày sản xuất:</span>
                <span className="value">{formatDate(batch.manufactureDate)}</span>
              </div>
              <div className="info-item">
                <span className="label">Hạn sử dụng:</span>
                <span className="value">{formatDate(batch.expiryDate)}</span>
              </div>
              <div className="info-item">
                <span className="label">Điểm đến:</span>
                <span className="value">{batch.destination}</span>
              </div>
              
              <div className="info-item">
                <span className="label">Sản phẩm:</span>
                <div className="products-list">
                  {batch.products.map((product: any, index: any) => (
                    <div key={index} className="product-item">
                      {product.name} (x{product.quantity})
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="batch-actions">
              <button 
                className="btn btn-outline"
                onClick={() => handleViewDetails(batch)}
              >
                <FaEye /> Chi tiết
              </button>
              
              {batch.status === "created" && (
                <button 
                  className="btn btn-primary"
                  onClick={() => handleVerifyBatch(batch.id)}
                  disabled={actionLoading}
                >
                  <FaShieldAlt /> Xác thực Blockchain
                </button>
              )}
              
              {batch.status === "verified" && (
                <button 
                  className="btn btn-warning"
                  onClick={() => handleUpdateStatus(batch.id, "sent")}
                  disabled={actionLoading}
                >
                  <FaShippingFast /> Đánh dấu đã gửi
                </button>
              )}
              
              {batch.status === "sent" && (
                <button 
                  className="btn btn-success"
                  onClick={() => handleUpdateStatus(batch.id, "received")}
                  disabled={actionLoading}
                >
                  <FaReceipt /> Xác nhận đã nhận
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal chi tiết lô hàng */}
      {showModal && selectedBatch && (
        <div className="modal-overlay">
          <div className="modal large-modal">
            <div className="modal-header">
              <h2>Chi tiết lô hàng {selectedBatch.id}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="batch-detail">
                <div className="detail-section">
                  <h3><FaBoxes /> Thông tin cơ bản</h3>
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="label">ID lô hàng:</span>
                      <span className="value">{selectedBatch.id}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Nhà sản xuất:</span>
                      <span className="value">{selectedBatch.manufacturer}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Ngày sản xuất:</span>
                      <span className="value">{formatDate(selectedBatch.manufactureDate)}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Hạn sử dụng:</span>
                      <span className="value">{formatDate(selectedBatch.expiryDate)}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Điểm đến:</span>
                      <span className="value">{selectedBatch.destination}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Trạng thái:</span>
                      <span className="value">{renderStatus(selectedBatch.status)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3><FaQrcode /> Sản phẩm trong lô</h3>
                  <div className="products-table">
                    <div className="table-header">
                      <div>Tên sản phẩm</div>
                      <div>Số lượng</div>
                      <div>Hạn sử dụng</div>
                    </div>
                    {selectedBatch.products.map((product: any, index: any) => (
                      <div key={index} className="table-row">
                        <div className="product-name">{product.name}</div>
                        <div className="quantity">{product.quantity}</div>
                        <div className="expiry">{formatDate(product.expiryDate)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3><FaHistory /> Lịch sử lô hàng</h3>
                  {renderTimeline(selectedBatch.timeline)}
                </div>
                
                {(selectedBatch.documents.length > 0 || selectedBatch.transactionHash) && (
                  <div className="detail-section">
                    <h3><FaShieldAlt /> Thông tin Blockchain</h3>
                    <div className="info-grid">
                      {selectedBatch.transactionHash && (
                        <div className="info-item full-width">
                          <span className="label">Transaction Hash:</span>
                          <span className="value hash">{selectedBatch.transactionHash}</span>
                          <button className="btn btn-outline btn-small">
                            <FaShieldAlt /> Kiểm tra
                          </button>
                        </div>
                      )}
                      {selectedBatch.documents.map((doc: any, index: any) => (
                        <div key={index} className="info-item full-width">
                          <span className="label">{doc.name}:</span>
                          <span className="value cid">{doc.cid}</span>
                          <button className="btn btn-outline btn-small">
                            <FaFileAlt /> Xem tài liệu
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedBatch.shippingInfo && (
                  <div className="detail-section">
                    <h3><FaShippingFast /> Thông tin vận chuyển</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="label">Đơn vị vận chuyển:</span>
                        <span className="value">{selectedBatch.shippingInfo.carrier}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Mã theo dõi:</span>
                        <span className="value">{selectedBatch.shippingInfo.trackingNumber}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Dự kiến giao:</span>
                        <span className="value">{formatDate(selectedBatch.shippingInfo.estimatedDelivery)}</span>
                      </div>
                      {selectedBatch.shippingInfo.actualDelivery && (
                        <div className="info-item">
                          <span className="label">Ngày giao thực tế:</span>
                          <span className="value">{formatDate(selectedBatch.shippingInfo.actualDelivery)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Đóng</button>
              
              {selectedBatch.status === "created" && (
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setShowModal(false);
                    handleVerifyBatch(selectedBatch.id);
                  }}
                  disabled={actionLoading}
                >
                  <FaShieldAlt /> Xác thực Blockchain
                </button>
              )}
              
              {selectedBatch.status === "verified" && (
                <button 
                  className="btn btn-warning"
                  onClick={() => {
                    setShowModal(false);
                    handleUpdateStatus(selectedBatch.id, "sent");
                  }}
                  disabled={actionLoading}
                >
                  <FaShippingFast /> Đánh dấu đã gửi
                </button>
              )}
              
              {selectedBatch.status === "sent" && (
                <button 
                  className="btn btn-success"
                  onClick={() => {
                    setShowModal(false);
                    handleUpdateStatus(selectedBatch.id, "received");
                  }}
                  disabled={actionLoading}
                >
                  <FaReceipt /> Xác nhận đã nhận
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal tạo lô hàng mới */}
      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Tạo lô hàng mới</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="create-batch-form">
                <p>Chức năng tạo lô hàng mới đang được phát triển. Vui lòng thử lại sau.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Đóng</button>
              <button className="btn btn-primary" disabled>Tạo lô hàng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributorBatch;