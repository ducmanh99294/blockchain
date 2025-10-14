// pages/Order.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/User/order.css';

const Order: React.FC = () => {
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state;
  const API = "http://localhost:3000";
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (userId && orderId) {
      fetchData();
    } else {
      navigate('/checkout');
    }   
  }, [userId, orderId]);

  const fetchData = async () => {
    try {
      const [orderRes] = await Promise.all([
        fetch(`${API}/api/order/${orderId}`).then((res) => res.json()),
      ]);

      setOrder(orderRes);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      setOrder(null);
    } finally {
    setLoading(false);
  }
  };

  console.log("orderId", orderId);
  console.log("user", userId);
  console.log("order", order);
  
  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <>
    {loading ? (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    ) : (
      <div className="confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-card">
          <div className="confirmation-header">
            <div className="success-icon">✅</div>
            <h1>Đặt Hàng Thành Công!</h1>
            <p>Cảm ơn bạn đã đặt hàng tại MedChain</p>
          </div>

          <div className="order-details">
            <div className="detail-row">
              <span>Mã đơn hàng:</span>
              <strong>{order.orderId}</strong>
            </div>
            <div className="detail-row">
              <span>Ngày đặt:</span>
              <span>{formatDate(order.createdAt)}</span>
            </div>
            <div className="detail-row">
              <span>Phương thức thanh toán:</span>
              <span>
                {order.paymentMethod?.name}
              </span>
            </div>
            <div className="detail-row">
              <span>Tổng tiền:</span>
              <strong className="total-amount">
                {formatPrice(order?.totalPrice)}
              </strong>
            </div>
          </div>

          <div className="shipping-info">
            <h3>Thông tin giao hàng</h3>
            <p>{order.shippingInfo.fullName}</p>
            <p>{order.shippingInfo.phone}</p>
            <p>{order.shippingInfo.address}, {order.shippingInfo.ward}, {order.shippingInfo.district}, {order.shippingInfo.city}</p>
            {order.shippingInfo.note && (
              <p className="delivery-note">
                <strong>Ghi chú:</strong> {order.shippingInfo.note}
              </p>
            )}
          </div>

          <div className="order-items-summary">
            <h3>Sản phẩm đã đặt</h3>
            {order.items.map((item: any) => (
              <div key={item.id} className="order-item">
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>Số lượng: {item.quantity}</p>
                  <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="confirmation-actions">
            <button 
              className="track-order-btn"
              onClick={() => navigate('/history')}
            >
              Theo dõi đơn hàng
            </button>
            <button 
              className="continue-shopping-btn"
              onClick={() => navigate('/category')}
            >
              Tiếp tục mua sắm
            </button>
          </div>

          <div className="support-info">
            <p>📞 Cần hỗ trợ? Liên hệ: 1800-1234 (Miễn phí)</p>
            <p>🕒 Giờ làm việc: 8:00 - 22:00 hàng ngày</p>
          </div>
        </div>
      </div>
    </div>
  )}
    </>
  );
};

export default Order;