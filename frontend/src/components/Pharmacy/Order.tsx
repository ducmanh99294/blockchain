// pages/PharmacyOrderManagement.js
import React, { useState } from 'react';
import '../../assets/css/Pharmacy/order.css';

const PharmacyOrder = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Dữ liệu mẫu đơn hàng
  const [orders, setOrders] = useState([
    {
      id: 'MED123456',
      customer: {
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        email: 'nguyenvana@email.com'
      },
      status: 'pending',
      orderDate: '2024-03-15T10:30:00',
      totalAmount: 345000,
      shippingAddress: {
        name: 'Nguyễn Văn A',
        phone: '0901234567',
        address: '123 Đường Nguyễn Văn Linh, P. Tân Thuận Đông, Q.7, TP.HCM'
      },
      paymentMethod: 'cod',
      shippingMethod: 'standard',
      items: [
        {
          id: 1,
          name: "Panadol Extra",
          price: 95000,
          quantity: 2,
          image: "https://via.placeholder.com/60x60/4CAF50/ffffff?text=Panadol",
          blockchain: {
            status: 'verified',
            transactionHash: '0x4a7c1b9e2f8d3a6b5c4e8f7a2b3c6d9e1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c9',
            ipfsCID: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco'
          }
        },
        {
          id: 2,
          name: "Vitamin C 1000mg",
          price: 150000,
          quantity: 1,
          image: "https://via.placeholder.com/60x60/FF9800/ffffff?text=Vitamin+C",
          blockchain: {
            status: 'verified',
            transactionHash: '0x8b3c6d9e1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c94a7c1b9e2f8d3a6b5c4e8f7',
            ipfsCID: 'QmYH5g2W8Kp4L3m2N1B6V7C9X8Z2Q1W4E5R6T7Y8U9I0O1P2'
          }
        }
      ]
    },
    {
      id: 'MED123457',
      customer: {
        name: 'Trần Thị B',
        phone: '0907654321',
        email: 'tranthib@email.com'
      },
      status: 'shipping',
      orderDate: '2024-03-14T15:45:00',
      totalAmount: 220000,
      shippingAddress: {
        name: 'Trần Thị B',
        phone: '0907654321',
        address: '456 Đường Nguyễn Huệ, P. Bến Nghé, Q.1, TP.HCM'
      },
      paymentMethod: 'momo',
      shippingMethod: 'express',
      trackingNumber: 'SPX123456789',
      items: [
        {
          id: 3,
          name: "Kem dưỡng da Eucerin",
          price: 220000,
          quantity: 1,
          image: "https://via.placeholder.com/60x60/E91E63/ffffff?text=Eucerin",
          blockchain: {
            status: 'verified',
            transactionHash: '0x3c6d9e1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c94a7c1b9e2f8d3a6b5c4e8f7a2',
            ipfsCID: 'QmZ2X4Y6W8Kp4L3m2N1B6V7C9X8Z2Q1W4E5R6T7Y8U9I0O1P2'
          }
        }
      ]
    },
    {
      id: 'MED123458',
      customer: {
        name: 'Lê Văn C',
        phone: '0912345678',
        email: 'levanc@email.com'
      },
      status: 'completed',
      orderDate: '2024-03-13T09:15:00',
      completedDate: '2024-03-13T16:30:00',
      totalAmount: 185000,
      shippingAddress: {
        name: 'Lê Văn C',
        phone: '0912345678',
        address: '789 Đường Lê Lợi, P. Bến Thành, Q.1, TP.HCM'
      },
      paymentMethod: 'banking',
      shippingMethod: 'standard',
      items: [
        {
          id: 4,
          name: "Amoxicillin 500mg",
          price: 85000,
          quantity: 1,
          image: "https://via.placeholder.com/60x60/9C27B0/ffffff?text=Amoxicillin",
          prescription: true,
          blockchain: {
            status: 'pending',
            transactionHash: '0x9e1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c94a7c1b9e2f8d3a6b5c4e8f7a2b3',
            ipfsCID: 'QmC3X5Y7W9Kp4L3m2N1B6V7C9X8Z2Q1W4E5R6T7Y8U9I0O1P2'
          }
        }
      ]
    },
    {
      id: 'MED123459',
      customer: {
        name: 'Phạm Thị D',
        phone: '0923456789',
        email: 'phamthid@email.com'
      },
      status: 'cancelled',
      orderDate: '2024-03-12T14:20:00',
      cancelledDate: '2024-03-12T15:30:00',
      totalAmount: 270000,
      shippingAddress: {
        name: 'Phạm Thị D',
        phone: '0923456789',
        address: '321 Đường Cách Mạng Tháng 8, P. Bến Thành, Q.1, TP.HCM'
      },
      paymentMethod: 'cod',
      shippingMethod: 'standard',
      cancelReason: 'Khách hàng hủy',
      items: [
        {
          id: 5,
          name: "Calcium D3",
          price: 135000,
          quantity: 2,
          image: "https://via.placeholder.com/60x60/FF5722/ffffff?text=Calcium+D3",
          blockchain: {
            status: 'verified',
            transactionHash: '0x1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c94a7c1b9e2f8d3a6b5c4e8f7a2b3c6',
            ipfsCID: 'QmD4X6Y8W0Kp4L3m2N1B6V7C9X8Z2Q1W4E5R6T7Y8U9I0O1P2'
          }
        }
      ]
    }
  ]);

  // Format tiền
  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  // Format ngày
  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Lọc đơn hàng theo trạng thái
  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  // Hiển thị trạng thái đơn hàng
  const renderOrderStatus = (status: any) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge pending">⏳ Chờ xác nhận</span>;
      case 'shipping':
        return <span className="status-badge shipping">🚚 Đang giao</span>;
      case 'completed':
        return <span className="status-badge completed">✅ Hoàn thành</span>;
      case 'cancelled':
        return <span className="status-badge cancelled">❌ Đã hủy</span>;
      default:
        return <span className="status-badge">Unknown</span>;
    }
  };

  // Hiển thị trạng thái blockchain
  const renderBlockchainStatus = (status: any) => {
    switch (status) {
      case 'verified':
        return <span className="blockchain-badge verified">✅ Verified</span>;
      case 'pending':
        return <span className="blockchain-badge pending">⏳ Pending</span>;
      default:
        return <span className="blockchain-badge">❌ Not Verified</span>;
    }
  };

  // Cập nhật trạng thái đơn hàng
  const updateOrderStatus = (orderId: any, newStatus: any) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        const updatedOrder = { ...order, status: newStatus };
        
        // Thêm timestamp khi cập nhật trạng thái
        if (newStatus === 'shipping') {
          // updatedOrder.shippingDate = new Date().toISOString();
        } else if (newStatus === 'completed') {
          updatedOrder.completedDate = new Date().toISOString();
        }
        
        return updatedOrder;
      }
      return order;
    });
    
    setOrders(updatedOrders);
    alert(`Đã cập nhật trạng thái đơn hàng ${orderId} thành ${newStatus}`);
  };

  // Mở modal chi tiết
  const openOrderDetail = (order: any) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  // Đóng modal
  const closeOrderDetail = () => {
    setShowDetailModal(false);
    setSelectedOrder(null);
  };

  // Hiển thị nút hành động theo trạng thái
  const renderActionButtons = (order: any) => {
    switch (order.status) {
      case 'pending':
        return (
          <button
            className="action-btn confirm"
            onClick={() => updateOrderStatus(order.id, 'shipping')}
          >
            ✅ Xác nhận đơn
          </button>
        );
      case 'shipping':
        return (
          <button
            className="action-btn complete"
            onClick={() => updateOrderStatus(order.id, 'completed')}
          >
            📦 Hoàn tất
          </button>
        );
      case 'completed':
        return (
          <span className="completed-text">Đơn hàng đã hoàn thành</span>
        );
      case 'cancelled':
        return (
          <span className="cancelled-text">Đơn hàng đã hủy</span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="order-management-page">
      <div className="management-container">
        {/* Header */}
        <div className="management-header">
          <div className="header-left">
            <h1>Quản Lý Đơn Hàng</h1>
            <p>Theo dõi và quản lý đơn hàng từ khách hàng</p>
          </div>
          <div className="header-right">
            <div className="stats">
              <div className="stat">
                <span className="stat-number">{orders.length}</span>
                <span className="stat-label">Tổng đơn</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  {orders.filter(o => o.status === 'pending').length}
                </span>
                <span className="stat-label">Chờ xác nhận</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bộ lọc */}
        <div className="filter-section">
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => setFilterStatus('all')}
            >
              Tất cả
            </button>
            <button
              className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
              onClick={() => setFilterStatus('pending')}
            >
              ⏳ Chờ xác nhận
            </button>
            <button
              className={`filter-btn ${filterStatus === 'shipping' ? 'active' : ''}`}
              onClick={() => setFilterStatus('shipping')}
            >
              🚚 Đang giao
            </button>
            <button
              className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
              onClick={() => setFilterStatus('completed')}
            >
              ✅ Hoàn thành
            </button>
            <button
              className={`filter-btn ${filterStatus === 'cancelled' ? 'active' : ''}`}
              onClick={() => setFilterStatus('cancelled')}
            >
              ❌ Đã hủy
            </button>
          </div>
        </div>

        {/* Danh sách đơn hàng */}
        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-icon">📦</div>
              <h3>Không có đơn hàng nào</h3>
              <p>Hiện không có đơn hàng nào phù hợp với bộ lọc</p>
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3 className="order-id">#{order.id}</h3>
                    <div className="customer-info">
                      <span className="customer-name">{order.customer.name}</span>
                      <span className="customer-phone">{order.customer.phone}</span>
                    </div>
                  </div>
                  <div className="order-meta">
                    {renderOrderStatus(order.status)}
                    <span className="order-date">{formatDate(order.orderDate)}</span>
                  </div>
                </div>

                <div className="order-content">
                  <div className="order-items-preview">
                    {order.items.slice(0, 3).map(item => (
                      <div key={item.id} className="item-preview">
                        <img src={item.image} alt={item.name} />
                        <span>{item.name} × {item.quantity}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="more-items">+{order.items.length - 3} sản phẩm khác</div>
                    )}
                  </div>

                  <div className="order-total">
                    <span className="total-label">Tổng tiền:</span>
                    <span className="total-amount">{formatPrice(order.totalAmount)}</span>
                  </div>
                </div>

                <div className="order-footer">
                  <div className="order-actions">
                    <button
                      className="action-btn view-details"
                      onClick={() => openOrderDetail(order)}
                    >
                      👁️ Xem chi tiết
                    </button>
                    {renderActionButtons(order)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal chi tiết đơn hàng */}
        {showDetailModal && selectedOrder && (
          <div className="modal-overlay">
            <div className="order-detail-modal">
              <div className="modal-header">
                <h2>Chi tiết đơn hàng #{selectedOrder.id}</h2>
                <button className="close-btn" onClick={closeOrderDetail}>×</button>
              </div>

              <div className="modal-content">
                {/* Thông tin chung */}
                <div className="detail-section">
                  <h3>Thông tin chung</h3>
                  <div className="detail-grid">
                    <div className="detail-row">
                      <span className="label">Trạng thái:</span>
                      <span className="value">{renderOrderStatus(selectedOrder.status)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Ngày đặt:</span>
                      <span className="value">{formatDate(selectedOrder.orderDate)}</span>
                    </div>
                    {selectedOrder.shippingDate && (
                      <div className="detail-row">
                        <span className="label">Ngày giao:</span>
                        <span className="value">{formatDate(selectedOrder.shippingDate)}</span>
                      </div>
                    )}
                    {selectedOrder.completedDate && (
                      <div className="detail-row">
                        <span className="label">Ngày hoàn thành:</span>
                        <span className="value">{formatDate(selectedOrder.completedDate)}</span>
                      </div>
                    )}
                    {selectedOrder.cancelledDate && (
                      <div className="detail-row">
                        <span className="label">Ngày hủy:</span>
                        <span className="value">{formatDate(selectedOrder.cancelledDate)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Thông tin khách hàng */}
                <div className="detail-section">
                  <h3>Thông tin khách hàng</h3>
                  <div className="detail-grid">
                    <div className="detail-row">
                      <span className="label">Họ tên:</span>
                      <span className="value">{selectedOrder.customer.name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">SĐT:</span>
                      <span className="value">{selectedOrder.customer.phone}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Email:</span>
                      <span className="value">{selectedOrder.customer.email}</span>
                    </div>
                  </div>
                </div>

                {/* Địa chỉ giao hàng */}
                <div className="detail-section">
                  <h3>Địa chỉ giao hàng</h3>
                  <div className="address-card">
                    <p><strong>{selectedOrder.shippingAddress.name}</strong></p>
                    <p>{selectedOrder.shippingAddress.phone}</p>
                    <p>{selectedOrder.shippingAddress.address}</p>
                  </div>
                </div>

                {/* Phương thức thanh toán & vận chuyển */}
                <div className="detail-section">
                  <h3>Phương thức</h3>
                  <div className="detail-grid">
                    <div className="detail-row">
                      <span className="label">Thanh toán:</span>
                      <span className="value">
                        {selectedOrder.paymentMethod === 'cod' ? 'COD (Thanh toán khi nhận hàng)' :
                         selectedOrder.paymentMethod === 'momo' ? 'Ví MoMo' :
                         selectedOrder.paymentMethod === 'banking' ? 'Chuyển khoản' : 'Thẻ tín dụng'}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Vận chuyển:</span>
                      <span className="value">
                        {selectedOrder.shippingMethod === 'standard' ? 'Giao hàng tiêu chuẩn' : 'Giao hàng nhanh'}
                      </span>
                    </div>
                    {selectedOrder.trackingNumber && (
                      <div className="detail-row">
                        <span className="label">Mã vận đơn:</span>
                        <span className="value">{selectedOrder.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="detail-section">
                  <h3>Sản phẩm ({selectedOrder.items.length})</h3>
                  <div className="order-items-detail">
                    {selectedOrder.items.map((item: any) => (
                      <div key={item.id} className="order-item-detail">
                        <img src={item.image} alt={item.name} />
                        <div className="item-info">
                          <h4>{item.name}</h4>
                          <p>Số lượng: {item.quantity}</p>
                          <p>Giá: {formatPrice(item.price)}</p>
                          <p>Thành tiền: {formatPrice(item.price * item.quantity)}</p>
                          
                          {/* Thông tin blockchain */}
                          <div className="blockchain-info">
                            <p>Xác minh nguồn gốc: {renderBlockchainStatus(item.blockchain.status)}</p>
                            {item.blockchain.transactionHash && (
                              <a
                                href={`https://etherscan.io/tx/${item.blockchain.transactionHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="blockchain-link"
                              >
                                🔗 Kiểm tra trên Blockchain Explorer
                              </a>
                            )}
                            {item.blockchain.ipfsCID && (
                              <a
                                href={`https://ipfs.io/ipfs/${item.blockchain.ipfsCID}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="blockchain-link"
                              >
                                📄 Xem chứng từ gốc trên IPFS
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tổng tiền */}
                <div className="detail-section total-section">
                  <div className="total-row">
                    <span className="label">Tổng cộng:</span>
                    <span className="total-amount">{formatPrice(selectedOrder.totalAmount)}</span>
                  </div>
                </div>

                {/* Nút hủy đơn (nếu đang chờ xác nhận) */}
                {selectedOrder.status === 'pending' && (
                  <div className="modal-actions">
                    <button
                      className="action-btn cancel-order"
                      onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    >
                      ❌ Hủy đơn hàng
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyOrder;