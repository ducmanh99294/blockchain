// pages/OrderHistory.js
import React, { useEffect, useState } from 'react';
import '../../assets/css/User/history.css';

const History: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [currentReviewProduct, setCurrentReviewProduct] = useState<any>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  const API = "http://localhost:3000";
  const userId = localStorage.getItem("userId");

  useEffect(()=>{
    if(userId) (
    fetchOrders()
    )
  }, [userId])
  
  const fetchOrders = async () => {
      try {
        const res = await fetch(`${API}/api/order/user/${userId}`);
        const data = await res.json();
        
        console.log(data)
        setAllOrders(data);
        setOrders(data);
      } catch (err) {
        console.log('err', err)
      } finally {
        setLoading(false);
      }
    }

  console.log()
  // Trạng thái đơn hàng
  const statusConfig: { [key: string]: { label: any; color: any; icon: any } } = {
    pending: { label: 'Đang xử lý', color: '#ff9800', icon: '⏳' },
    shipping: { label: 'Đang giao', color: '#2196f3', icon: '🚚' },
    completed: { label: 'Hoàn thành', color: '#4caf50', icon: '✅' },
    cancelled: { label: 'Đã hủy', color: '#f44336', icon: '❌' }
  };


  // Định dạng tiền
  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  // Định dạng ngày
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Xem chi tiết đơn hàng
  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    console.log(order)
  };

  // Đóng chi tiết
  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  // Mua lại
  const reorder = (order: any) => {
    if (confirm(`Bạn có muốn mua lại đơn hàng ${order._id}?`)) {
      // Ở đây có thể gọi API addToCart
      alert("Đã thêm sản phẩm vào giỏ hàng!");
    }
  };

  // Mở modal đánh giá
  const openReviewModal = (product: any) => {
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
      if (order.items.some((item: any) => item._id === currentReviewProduct._id)) {
        return {
          ...order,
          items: order.items.map((item: any) =>
            item._id === currentReviewProduct._id
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

  // Hủy đơn hàng (call API)
  const cancelOrder = async (orderId: string) => {
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return;
    try {
      await fetch(`${API}/api/order/${orderId}/cancel`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Người dùng hủy" }),
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId
            ? { ...order, status: "cancelled", cancelReason: "Người dùng hủy" }
            : order
        )
      );
      alert("Đã hủy đơn hàng thành công!");
    } catch (err) {
      console.error("Lỗi khi hủy đơn hàng:", err);
    }
  };

  // Lọc đơn hàng theo trạng thái
  const filterOrders = (status: string) => {
    setActiveFilter(status);
    if (status === "all") {
      setOrders(allOrders);
    } else {
      setOrders(allOrders.filter((o) => o.status === status));
    }
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
          <button 
            className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} 
            onClick={() => filterOrders('all')}>
            Tất cả
          </button>
          <button 
            className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`} 
            onClick={() => filterOrders('pending')}>
            Đang xử lý
          </button>         
          <button 
            className={`filter-btn ${activeFilter === 'shipping' ? 'active' : ''}`} 
            onClick={() => filterOrders('shipping')}>
            Đang giao
          </button>          
          <button 
            className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`} 
            onClick={() => filterOrders('completed')}>
            Hoàn thành
          </button>          
          <button 
            className={`filter-btn ${activeFilter === 'cancelled' ? 'active' : ''}`} 
            onClick={() => filterOrders('cancelled')}>
            Đã hủy
          </button>

        </div>
        
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Đang tải sản phẩm...</p>
          </div>
    ) : (
    <>
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
              const status = statusConfig[order?.status];
              return (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <span className="order-id">Mã đơn: {order._id}</span>
                      <span className="order-date">{formatDate(order.createdAt)}</span>
                    </div>
                    <div 
                      className="order-status"
                      style={{ color: status?.color, borderColor: status?.color }}
                    >
                      {status?.icon} {status?.label}
                    </div>
                  </div>

                  <div className="order-items-preview">
                    {order.items.slice(0, 3).map((item: any) => (
                      <div key={item._id} className="preview-item">
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
                      Tổng tiền: <strong>{formatPrice(order.totalPrice)}</strong>
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
                          onClick={() => cancelOrder(order._id)}
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
                    <strong>{selectedOrder._id}</strong>
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
                  <p><strong>{selectedOrder.shippingInfo.name}</strong></p>
                  <p>{selectedOrder.shippingInfo.phone}</p>
                  <p>{selectedOrder.shippingInfo.address}</p>
                </div>

                <div className="payment-info">
                  <h3>Phương thức thanh toán</h3>
                  <p>
                    {selectedOrder.paymentMethod.name}
                  </p>
                </div>

                <div className="order-items-detail">
                  <h3>Sản phẩm ({selectedOrder.items.length})</h3>
                  {selectedOrder.items.map((item: any) => (
                    <div key={item._id} className="detail-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p>Số lượng: {item.quantity}</p>
                        <p className="item-price">{formatPrice(item.price * item.quantity)}</p>
                        
                        {selectedOrder.status === 'completed' && (
                          <div className="review-section">
                            {item.productId.rating > 0 ? (
                              <div className="existing-review">
                                <div className="rating">
                                  {'⭐'.repeat(item.productId.rating)}
                                  {'☆'.repeat(5 - item.productId.rating)}
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
                    <span>{formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="total-row">
                    <span>Phí vận chuyển:</span>
                    <span>{formatPrice(selectedOrder.shippingMethod.price)}</span>
                  </div>
                  <div className="total-row grand-total">
                    <span>Tổng cộng:</span>
                    <span>{formatPrice(selectedOrder.totalPrice)}</span>
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
                    rows={4}
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
    </>
      )} 

        
      </div>
    </div>
  );
};

export default History;