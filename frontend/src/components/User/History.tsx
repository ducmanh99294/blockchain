// pages/OrderHistory.js
import React, { useState } from 'react';
import '../../assets/css/User/history.css';

const History: React.FC = () => {
  // Dữ liệu mẫu đơn hàng
  const [orders, setOrders] = useState([
    {
      id: 'MED123456',
      date: '2024-03-15T10:30:00',
      status: 'completed',
      items: [
        {
          id: 1,
          name: "Panadol Extra",
          price: 95000,
          image: "https://via.placeholder.com/60x60/4CAF50/ffffff?text=Panadol",
          quantity: 2,
          rating: 4
        },
        {
          id: 2,
          name: "Vitamin C 1000mg",
          price: 150000,
          image: "https://via.placeholder.com/60x60/FF9800/ffffff?text=Vitamin+C",
          quantity: 1,
          rating: 5
        }
      ],
      total: 340000,
      shippingAddress: {
        name: "Nguyễn Văn A",
        phone: "0901234567",
        address: "123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM"
      },
      paymentMethod: 'cod',
      shippingMethod: 'standard'
    },
    {
      id: 'MED123457',
      date: '2024-03-14T15:45:00',
      status: 'shipping',
      items: [
        {
          id: 3,
          name: "Amoxicillin 500mg",
          price: 85000,
          image: "https://via.placeholder.com/60x60/9C27B0/ffffff?text=Amoxicillin",
          quantity: 1,
          rating: 0
        }
      ],
      total: 100000,
      shippingAddress: {
        name: "Nguyễn Văn A",
        phone: "0901234567",
        address: "123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM"
      },
      paymentMethod: 'momo',
      shippingMethod: 'express',
      trackingNumber: 'SPX123456789'
    },
    {
      id: 'MED123458',
      date: '2024-03-13T09:15:00',
      status: 'processing',
      items: [
        {
          id: 4,
          name: "Kem dưỡng da Eucerin",
          price: 220000,
          image: "https://via.placeholder.com/60x60/E91E63/ffffff?text=Eucerin",
          quantity: 1,
          rating: 0
        }
      ],
      total: 235000,
      shippingAddress: {
        name: "Nguyễn Văn A",
        phone: "0901234567",
        address: "123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM"
      },
      paymentMethod: 'banking',
      shippingMethod: 'standard'
    },
    {
      id: 'MED123459',
      date: '2024-03-10T14:20:00',
      status: 'cancelled',
      items: [
        {
          id: 5,
          name: "Calcium D3",
          price: 135000,
          image: "https://via.placeholder.com/60x60/FF5722/ffffff?text=Calcium+D3",
          quantity: 2,
          rating: 0
        }
      ],
      total: 270000,
      shippingAddress: {
        name: "Nguyễn Văn A",
        phone: "0901234567",
        address: "123 Đường Nguyễn Văn Linh, Quận 7, TP.HCM"
      },
      paymentMethod: 'cod',
      shippingMethod: 'standard',
      cancelReason: 'Thay đổi nhu cầu mua hàng'
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentReviewProduct, setCurrentReviewProduct] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  // Trạng thái đơn hàng
  const statusConfig = {
    processing: { label: 'Đang xử lý', color: '#ff9800', icon: '⏳' },
    shipping: { label: 'Đang giao', color: '#2196f3', icon: '🚚' },
    completed: { label: 'Hoàn thành', color: '#4caf50', icon: '✅' },
    cancelled: { label: 'Đã hủy', color: '#f44336', icon: '❌' }
  };

  // Định dạng tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  // Định dạng ngày
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Xem chi tiết đơn hàng
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  // Đóng chi tiết
  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  // Mua lại
  const reorder = (order) => {
    if (confirm(`Bạn có muốn mua lại đơn hàng ${order.id}?`)) {
      // Logic thêm vào giỏ hàng
      alert('Đã thêm sản phẩm vào giỏ hàng!');
    }
  };

  // Mở modal đánh giá
  const openReviewModal = (product) => {
    setCurrentReviewProduct(product);
    setReviewRating(product.rating || 0);
    setReviewComment('');
    setShowReviewModal(true);
  };

  // Gửi đánh giá
  const submitReview = () => {
    if (reviewRating === 0) {
      alert('Vui lòng chọn số sao đánh giá!');
      return;
    }

    // Cập nhật đánh giá
    setOrders(orders.map(order => {
      if (order.items.some(item => item.id === currentReviewProduct.id)) {
        return {
          ...order,
          items: order.items.map(item =>
            item.id === currentReviewProduct.id
              ? { ...item, rating: reviewRating, reviewComment }
              : item
          )
        };
      }
      return order;
    }));

    alert('Cảm ơn bạn đã đánh giá sản phẩm!');
    setShowReviewModal(false);
  };

  // Hủy đơn hàng
  const cancelOrder = (orderId) => {
    if (confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
      setOrders(orders.map(order =>
        order.id === orderId
          ? { ...order, status: 'cancelled', cancelReason: 'Người dùng hủy' }
          : order
      ));
      alert('Đã hủy đơn hàng thành công!');
    }
  };

  // Lọc đơn hàng theo trạng thái
  const filterOrders = (status) => {
    // Trong thực tế sẽ call API
    console.log('Filter by:', status);
  };

  return (
    <div className="order-history-page">
      <div className="order-history-container">
        <div className="order-history-header">
          <h1>Lịch Sử Đơn Hàng</h1>
          <p>Xem và quản lý các đơn hàng của bạn</p>
        </div>

        {/* Bộ lọc */}
        <div className="order-filters">
          <button className="filter-btn active" onClick={() => filterOrders('all')}>
            Tất cả
          </button>
          <button className="filter-btn" onClick={() => filterOrders('processing')}>
            Đang xử lý
          </button>
          <button className="filter-btn" onClick={() => filterOrders('shipping')}>
            Đang giao
          </button>
          <button className="filter-btn" onClick={() => filterOrders('completed')}>
            Hoàn thành
          </button>
          <button className="filter-btn" onClick={() => filterOrders('cancelled')}>
            Đã hủy
          </button>
        </div>

        {/* Danh sách đơn hàng */}
        <div className="orders-list">
          {orders.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-icon">📦</div>
              <h3>Chưa có đơn hàng nào</h3>
              <p>Hãy mua sắm và quay lại xem lịch sử đơn hàng của bạn</p>
              <button 
                className="shop-now-btn"
                onClick={() => window.location.href = '/category'}
              >
                Mua sắm ngay
              </button>
            </div>
          ) : (
            orders.map(order => {
              const status = statusConfig[order.status];
              return (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <span className="order-id">Mã đơn: {order.id}</span>
                      <span className="order-date">{formatDate(order.date)}</span>
                    </div>
                    <div 
                      className="order-status"
                      style={{ color: status.color, borderColor: status.color }}
                    >
                      {status.icon} {status.label}
                    </div>
                  </div>

                  <div className="order-items-preview">
                    {order.items.slice(0, 3).map(item => (
                      <div key={item.id} className="preview-item">
                        <img src={item.image} alt={item.name} />
                        <span>{item.name} × {item.quantity}</span>
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="more-items">
                        +{order.items.length - 3} sản phẩm khác
                      </div>
                    )}
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      Tổng tiền: <strong>{formatPrice(order.total)}</strong>
                    </div>
                    <div className="order-actions">
                      <button 
                        className="action-btn view-details"
                        onClick={() => viewOrderDetails(order)}
                      >
                        Xem chi tiết
                      </button>
                      
                      {order.status === 'completed' && (
                        <button 
                          className="action-btn reorder"
                          onClick={() => reorder(order)}
                        >
                          Mua lại
                        </button>
                      )}
                      
                      {order.status === 'processing' && (
                        <button 
                          className="action-btn cancel"
                          onClick={() => cancelOrder(order.id)}
                        >
                          Hủy đơn
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal chi tiết đơn hàng */}
        {selectedOrder && (
          <div className="modal-overlay">
            <div className="order-detail-modal">
              <div className="modal-header">
                <h2>Chi tiết đơn hàng</h2>
                <button className="close-btn" onClick={closeOrderDetails}>×</button>
              </div>

              <div className="modal-content">
                <div className="order-summary">
                  <div className="summary-row">
                    <span>Mã đơn hàng:</span>
                    <strong>{selectedOrder.id}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Ngày đặt:</span>
                    <span>{formatDate(selectedOrder.date)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Trạng thái:</span>
                    <span 
                      className="status-badge"
                      style={{ color: statusConfig[selectedOrder.status].color }}
                    >
                      {statusConfig[selectedOrder.status].icon} {statusConfig[selectedOrder.status].label}
                    </span>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <div className="summary-row">
                      <span>Mã vận đơn:</span>
                      <span>{selectedOrder.trackingNumber}</span>
                    </div>
                  )}
                </div>

                <div className="shipping-info">
                  <h3>Thông tin giao hàng</h3>
                  <p><strong>{selectedOrder.shippingAddress.name}</strong></p>
                  <p>{selectedOrder.shippingAddress.phone}</p>
                  <p>{selectedOrder.shippingAddress.address}</p>
                </div>

                <div className="payment-info">
                  <h3>Phương thức thanh toán</h3>
                  <p>
                    {selectedOrder.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 
                     selectedOrder.paymentMethod === 'momo' ? 'Ví MoMo' :
                     selectedOrder.paymentMethod === 'banking' ? 'Chuyển khoản ngân hàng' : 'Thẻ Visa/Mastercard'}
                  </p>
                </div>

                <div className="order-items-detail">
                  <h3>Sản phẩm ({selectedOrder.items.length})</h3>
                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="detail-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p>Số lượng: {item.quantity}</p>
                        <p className="item-price">{formatPrice(item.price * item.quantity)}</p>
                        
                        {selectedOrder.status === 'completed' && (
                          <div className="review-section">
                            {item.rating > 0 ? (
                              <div className="existing-review">
                                <div className="rating">
                                  {'⭐'.repeat(item.rating)}
                                  {'☆'.repeat(5 - item.rating)}
                                </div>
                                {item.reviewComment && (
                                  <p className="review-comment">"{item.reviewComment}"</p>
                                )}
                              </div>
                            ) : (
                              <button 
                                className="review-btn"
                                onClick={() => openReviewModal(item)}
                              >
                                Đánh giá sản phẩm
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-totals">
                  <div className="total-row">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(selectedOrder.total - 15000)}</span>
                  </div>
                  <div className="total-row">
                    <span>Phí vận chuyển:</span>
                    <span>{formatPrice(15000)}</span>
                  </div>
                  <div className="total-row grand-total">
                    <span>Tổng cộng:</span>
                    <span>{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>

                {selectedOrder.status === 'cancelled' && selectedOrder.cancelReason && (
                  <div className="cancellation-info">
                    <h3>Lý do hủy đơn</h3>
                    <p>{selectedOrder.cancelReason}</p>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button className="close-modal-btn" onClick={closeOrderDetails}>
                  Đóng
                </button>
                {selectedOrder.status === 'completed' && (
                  <button 
                    className="reorder-btn"
                    onClick={() => reorder(selectedOrder)}
                  >
                    Mua lại đơn hàng
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal đánh giá */}
        {showReviewModal && (
          <div className="modal-overlay">
            <div className="review-modal">
              <div className="modal-header">
                <h2>Đánh giá sản phẩm</h2>
                <button className="close-btn" onClick={() => setShowReviewModal(false)}>×</button>
              </div>

              <div className="modal-content">
                <div className="review-product">
                  <img src={currentReviewProduct.image} alt={currentReviewProduct.name} />
                  <h4>{currentReviewProduct.name}</h4>
                </div>

                <div className="rating-section">
                  <label>Chọn số sao:</label>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span
                        key={star}
                        className={`star ${star <= reviewRating ? 'active' : ''}`}
                        onClick={() => setReviewRating(star)}
                      >
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>

                <div className="comment-section">
                  <label>Nhận xét (tùy chọn):</label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                    rows="4"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button 
                  className="cancel-btn"
                  onClick={() => setShowReviewModal(false)}
                >
                  Hủy
                </button>
                <button 
                  className="submit-review-btn"
                  onClick={submitReview}
                >
                  Gửi đánh giá
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;