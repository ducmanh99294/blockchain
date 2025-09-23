// pages/Order.js
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/User/order.css';

const Order: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state;

  if (!orderData) {
    navigate('/');
    return null;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
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
              <strong>{orderData.orderId}</strong>
            </div>
            <div className="detail-row">
              <span>Ngày đặt:</span>
              <span>{formatDate(orderData.orderDate)}</span>
            </div>
            <div className="detail-row">
              <span>Phương thức thanh toán:</span>
              <span>
                {orderData.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 
                 orderData.paymentMethod === 'momo' ? 'Ví MoMo' :
                 orderData.paymentMethod === 'banking' ? 'Chuyển khoản ngân hàng' : 'Thẻ Visa/Mastercard'}
              </span>
            </div>
            <div className="detail-row">
              <span>Tổng tiền:</span>
              <strong className="total-amount">
                {formatPrice(orderData.totals.total)}
              </strong>
            </div>
          </div>

          <div className="shipping-info">
            <h3>Thông tin giao hàng</h3>
            <p>{orderData.shippingInfo.fullName}</p>
            <p>{orderData.shippingInfo.phone}</p>
            <p>{orderData.shippingInfo.address}, {orderData.shippingInfo.ward}, {orderData.shippingInfo.district}, {orderData.shippingInfo.city}</p>
            {orderData.shippingInfo.note && (
              <p className="delivery-note">
                <strong>Ghi chú:</strong> {orderData.shippingInfo.note}
              </p>
            )}
          </div>

          <div className="order-items-summary">
            <h3>Sản phẩm đã đặt</h3>
            {orderData.items.map(item => (
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
              onClick={() => navigate('/user/history')}
            >
              Theo dõi đơn hàng
            </button>
            <button 
              className="continue-shopping-btn"
              onClick={() => navigate('/user/category')}
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
  );
};

export default Order;