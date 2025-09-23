// pages/Cart.js
import React, { useState } from 'react';
import '../../assets/css/User/cart.css';

const Cart: React.FC = () => {
  // Dữ liệu mẫu giỏ hàng
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Panadol Extra",
      price: 95000,
      originalPrice: 120000,
      image: "https://via.placeholder.com/100x100/4CAF50/ffffff?text=Panadol",
      quantity: 2,
      prescription: false,
      stock: 50,
      manufacturer: "GSK"
    },
    {
      id: 2,
      name: "Vitamin C 1000mg",
      price: 150000,
      originalPrice: 180000,
      image: "https://via.placeholder.com/100x100/FF9800/ffffff?text=Vitamin+C",
      quantity: 1,
      prescription: false,
      stock: 100,
      manufacturer: "Nature's Bounty"
    },
    {
      id: 3,
      name: "Amoxicillin 500mg",
      price: 85000,
      image: "https://via.placeholder.com/100x100/9C27B0/ffffff?text=Amoxicillin",
      quantity: 1,
      prescription: true,
      stock: 25,
      manufacturer: "Pfizer"
    }
  ]);

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState('momo');
  const [selectedShipping, setSelectedShipping] = useState('standard');

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
    },
    {
      id: 'pickup',
      name: 'Nhận tại nhà thuốc',
      price: 0,
      time: 'Ngay lập tức',
      description: 'Tự đến nhận tại địa chỉ chỉ định'
    }
  ];

  // Phương thức thanh toán
  const paymentMethods = [
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
      id: 'cod',
      name: 'Thanh toán khi nhận hàng',
      icon: '💰',
      description: 'Trả tiền mặt khi nhận được hàng'
    },
    {
      id: 'visa',
      name: 'Thẻ Visa/Mastercard',
      icon: '💳',
      description: 'Thanh toán bằng thẻ quốc tế'
    }
  ];

  // Mã giảm giá
  const coupons = [
    {
      code: 'WELCOME10',
      discount: 10,
      type: 'percent',
      minOrder: 200000,
      description: 'Giảm 10% cho đơn hàng đầu tiên'
    },
    {
      code: 'FREESHIP',
      discount: 0,
      type: 'shipping',
      minOrder: 300000,
      description: 'Miễn phí vận chuyển'
    },
    {
      code: 'MED25',
      discount: 25000,
      type: 'fixed',
      minOrder: 150000,
      description: 'Giảm 25,000đ cho đơn hàng'
    }
  ];

  // Tính toán tổng tiền
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    const selectedShippingMethod = shippingMethods.find(method => method.id === selectedShipping);
    const shippingFee = selectedShippingMethod ? selectedShippingMethod.price : 0;
    
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percent') {
        discount = (subtotal * appliedCoupon.discount) / 100;
      } else if (appliedCoupon.type === 'fixed') {
        discount = appliedCoupon.discount;
      } else if (appliedCoupon.type === 'shipping') {
        discount = shippingFee;
      }
    }
    
    const total = Math.max(0, subtotal + shippingFee - discount);
    
    return { subtotal, shippingFee, discount, total };
  };

  const { subtotal, shippingFee, discount, total } = calculateTotals();

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item =>
      item.id === id ? { ...item, quantity: Math.min(newQuantity, item.stock) } : item
    ));
  };

  // Xóa sản phẩm
  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Áp dụng mã giảm giá
  const handleApplyCoupon = () => {
    const coupon = coupons.find(c => c.code === couponCode.toUpperCase());
    
    if (!coupon) {
      alert('Mã giảm giá không hợp lệ!');
      return;
    }
    
    if (subtotal < coupon.minOrder) {
      alert(`Đơn hàng tối thiểu ${coupon.minOrder.toLocaleString()}đ để áp dụng mã này`);
      return;
    }
    
    setAppliedCoupon(coupon);
    alert(`Áp dụng mã giảm giá thành công: ${coupon.description}`);
  };

  // Xóa mã giảm giá
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
  };

  // Tiến hành thanh toán
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Giỏ hàng của bạn đang trống!');
      return;
    }

    // Kiểm tra thuốc kê đơn
    const prescriptionItems = cartItems.filter(item => item.prescription);
    if (prescriptionItems.length > 0) {
      alert('Đơn hàng có thuốc kê đơn. Vui lòng cung cấp đơn thuốc khi thanh toán.');
    }

    alert('Chuyển đến trang thanh toán...');
    // Chuyển hướng đến trang thanh toán
  };

  // Định dạng tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-header">
            <h1>Giỏ Hàng</h1>
          </div>
          <div className="empty-cart">
            <div className="empty-icon">🛒</div>
            <h2>Giỏ hàng của bạn đang trống</h2>
            <p>Hãy thêm một số sản phẩm để bắt đầu mua sắm</p>
            <button 
              className="continue-shopping-btn"
              onClick={() => window.location.href = '/user/category'}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>Giỏ Hàng</h1>
          <span className="cart-count">{cartItems.length} sản phẩm</span>
        </div>

        <div className="cart-content">
          {/* Danh sách sản phẩm */}
          <div className="cart-items">
            <div className="cart-items-header">
              <span>Sản phẩm</span>
              <span>Đơn giá</span>
              <span>Số lượng</span>
              <span>Thành tiền</span>
              <span>Thao tác</span>
            </div>

            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <img src={item.image} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-manufacturer">{item.manufacturer}</p>
                    {item.prescription && (
                      <span className="prescription-badge">Cần kê đơn</span>
                    )}
                  </div>
                </div>

                <div className="item-price">
                  {item.originalPrice ? (
                    <>
                      <span className="current-price">{formatPrice(item.price)}</span>
                      <span className="original-price">{formatPrice(item.originalPrice)}</span>
                    </>
                  ) : (
                    <span className="current-price">{formatPrice(item.price)}</span>
                  )}
                </div>

                <div className="item-quantity">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-number">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  {formatPrice(item.price * item.quantity)}
                </div>

                <div className="item-actions">
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.id)}
                    title="Xóa sản phẩm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Thanh toán */}
          <div className="cart-summary">
            <div className="summary-card">
              <h3>Tóm tắt đơn hàng</h3>

              {/* Mã giảm giá */}
              <div className="coupon-section">
                <h4>Mã giảm giá</h4>
                {appliedCoupon ? (
                  <div className="applied-coupon">
                    <span className="coupon-code">{appliedCoupon.code}</span>
                    <span className="coupon-description">{appliedCoupon.description}</span>
                    <button 
                      className="remove-coupon-btn"
                      onClick={handleRemoveCoupon}
                    >
                      Xóa
                    </button>
                  </div>
                ) : (
                  <div className="coupon-input">
                    <input
                      type="text"
                      placeholder="Nhập mã giảm giá..."
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="coupon-input-field"
                    />
                    <button 
                      className="apply-coupon-btn"
                      onClick={handleApplyCoupon}
                    >
                      Áp dụng
                    </button>
                  </div>
                )}
              </div>

              {/* Phương thức vận chuyển */}
              <div className="shipping-section">
                <h4>Phương thức vận chuyển</h4>
                <div className="shipping-options">
                  {shippingMethods.map(method => (
                    <label key={method.id} className="shipping-option">
                      <input
                        type="radio"
                        name="shipping"
                        value={method.id}
                        checked={selectedShipping === method.id}
                        onChange={() => setSelectedShipping(method.id)}
                      />
                      <div className="shipping-info">
                        <span className="shipping-name">{method.name}</span>
                        <span className="shipping-time">{method.time}</span>
                        <span className="shipping-price">
                          {method.price > 0 ? formatPrice(method.price) : 'Miễn phí'}
                        </span>
                        <span className="shipping-description">{method.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="payment-section">
                <h4>Phương thức thanh toán</h4>
                <div className="payment-options">
                  {paymentMethods.map(method => (
                    <label key={method.id} className="payment-option">
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={() => setSelectedPayment(method.id)}
                      />
                      <span className="payment-icon">{method.icon}</span>
                      <div className="payment-info">
                        <span className="payment-name">{method.name}</span>
                        <span className="payment-description">{method.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tổng tiền */}
              <div className="totals-section">
                <div className="total-row">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="total-row">
                  <span>Phí vận chuyển:</span>
                  <span>{shippingFee > 0 ? formatPrice(shippingFee) : 'Miễn phí'}</span>
                </div>
                {discount > 0 && (
                  <div className="total-row discount">
                    <span>Giảm giá:</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="total-row grand-total">
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Button thanh toán */}
              <button 
                className="checkout-btn"
                onClick={handleCheckout}
              >
                Tiến hành thanh toán
              </button>

              <p className="security-note">
                🔒 Thanh toán an toàn với MedChain. Thông tin của bạn được bảo mật.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;