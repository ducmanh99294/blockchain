// pages/Checkout.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/User/checkout.css';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  
  // Dữ liệu mẫu giỏ hàng
  const [cartItems] = useState([
    {
      id: 1,
      name: "Panadol Extra",
      price: 95000,
      originalPrice: 120000,
      image: "https://via.placeholder.com/60x60/4CAF50/ffffff?text=Panadol",
      quantity: 2,
      prescription: false
    },
    {
      id: 2,
      name: "Vitamin C 1000mg",
      price: 150000,
      originalPrice: 180000,
      image: "https://via.placeholder.com/60x60/FF9800/ffffff?text=Vitamin+C",
      quantity: 1,
      prescription: false
    }
  ]);

  // Thông tin giao hàng
  const [shippingInfo, setShippingInfo] = useState({
    fullName: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'nguyenvana@email.com',
    address: '123 Đường Nguyễn Văn Linh',
    city: 'Quận 7',
    district: 'TP. Hồ Chí Minh',
    ward: 'Phường Tân Thuận Đông',
    note: ''
  });

  // Phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [agreeToTerms, setAgreeToTerms] = useState(true);

  // Phương thức vận chuyển
  const shippingMethods = [
    {
      id: 'standard',
      name: 'Giao hàng tiêu chuẩn',
      price: 15000,
      time: '3-5 ngày',
      description: 'Giao hàng trong giờ hành chính'
    },
    {
      id: 'express',
      name: 'Giao hàng nhanh',
      price: 30000,
      time: '1-2 ngày',
      description: 'Giao hàng hỏa tốc'
    }
  ];

  const [selectedShipping] = useState('standard');

  // Phương thức thanh toán
  const paymentMethods = [
    {
      id: 'cod',
      name: 'Thanh toán khi nhận hàng',
      icon: '💰',
      description: 'Trả tiền mặt khi nhận được hàng'
    },
    {
      id: 'momo',
      name: 'Ví MoMo',
      icon: '📱',
      description: 'Thanh toán qua ứng dụng MoMo'
    },
    {
      id: 'banking',
      name: 'Chuyển khoản ngân hàng',
      icon: '🏦',
      description: 'Chuyển khoản qua Internet Banking'
    },
    {
      id: 'visa',
      name: 'Thẻ Visa/Mastercard',
      icon: '💳',
      description: 'Thanh toán bằng thẻ quốc tế'
    }
  ];

  // Tính toán tổng tiền
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shippingFee = shippingMethods.find(method => method.id === selectedShipping)?.price || 0;
    const total = subtotal + shippingFee;
    
    return { subtotal, shippingFee, total };
  };

  const { subtotal, shippingFee, total } = calculateTotals();

  // Xử lý thay đổi thông tin
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý đặt hàng
  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      alert('Vui lòng đồng ý với điều khoản và điều kiện');
      return;
    }

    // Tạo đơn hàng
    const orderData = {
      orderId: `MED${Date.now()}`,
      items: cartItems,
      shippingInfo,
      paymentMethod,
      shippingMethod: selectedShipping,
      totals: calculateTotals(),
      orderDate: new Date().toISOString(),
      status: 'pending'
    };

    // Lưu đơn hàng (trong thực tế sẽ gọi API)
    localStorage.setItem('lastOrder', JSON.stringify(orderData));
    
    // Chuyển đến trang xác nhận
    navigate('/user/orders', { state: orderData });
  };

  // Định dạng tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Thanh Toán & Đặt Hàng</h1>
          <div className="checkout-steps">
            <div className="step active">1. Giỏ hàng</div>
            <div className="step active">2. Thanh toán</div>
            <div className="step">3. Hoàn tất</div>
          </div>
        </div>

        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <div className="checkout-content">
            {/* Thông tin giao hàng */}
            <div className="checkout-section">
              <h2>Thông tin giao hàng</h2>
              <div className="form-grid">
                <div className="form-group">
                  <label>Họ và tên *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={shippingInfo.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Địa chỉ *</label>
                  <input
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Thành phố *</label>
                  <select
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="TP. Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Quận/Huyện *</label>
                  <select
                    name="district"
                    value={shippingInfo.district}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Quận 7">Quận 7</option>
                    <option value="Quận 1">Quận 1</option>
                    <option value="Quận 3">Quận 3</option>
                    <option value="Quận Bình Thạnh">Quận Bình Thạnh</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Phường/Xã *</label>
                  <select
                    name="ward"
                    value={shippingInfo.ward}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Phường Tân Thuận Đông">Phường Tân Thuận Đông</option>
                    <option value="Phường Tân Thuận Tây">Phường Tân Thuận Tây</option>
                    <option value="Phường Tân Phong">Phường Tân Phong</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Ghi chú (tùy chọn)</label>
                  <textarea
                    name="note"
                    value={shippingInfo.note}
                    onChange={handleInputChange}
                    placeholder="Ghi chú về đơn hàng, vị trí giao hàng..."
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="checkout-section">
              <h2>Phương thức thanh toán</h2>
              <div className="payment-methods">
                {paymentMethods.map(method => (
                  <label key={method.id} className="payment-method">
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                    />
                    <div className="payment-content">
                      <span className="payment-icon">{method.icon}</span>
                      <div className="payment-info">
                        <span className="payment-name">{method.name}</span>
                        <span className="payment-description">{method.description}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Xác nhận đơn hàng */}
            <div className="checkout-section">
              <h2>Xác nhận đơn hàng</h2>
              <div className="order-review">
                <div className="order-items">
                  {cartItems.map(item => (
                    <div key={item.id} className="order-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>Số lượng: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Phí vận chuyển:</span>
                    <span>{formatPrice(shippingFee)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Tổng cộng:</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                <label className="terms-checkbox">
                  <input
                    type="checkbox"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Tôi đồng ý với <a href="#terms">điều khoản và điều kiện</a> của MedChain
                </label>
              </div>
            </div>
          </div>

          {/* Thanh toán sidebar */}
          <div className="checkout-sidebar">
            <div className="order-summary-card">
              <h3>Tóm tắt đơn hàng</h3>
              
              <div className="summary-items">
                {cartItems.map(item => (
                  <div key={item.id} className="summary-item">
                    <span className="item-name">{item.name} × {item.quantity}</span>
                    <span className="item-price">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="total-row">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="total-row">
                  <span>Phí vận chuyển:</span>
                  <span>{formatPrice(shippingFee)}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button type="submit" className="place-order-btn">
                Đặt hàng
              </button>

              <p className="security-note">
                🔒 Thanh toán an toàn. Thông tin của bạn được bảo mật.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;