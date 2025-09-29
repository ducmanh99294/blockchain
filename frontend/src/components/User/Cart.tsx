// pages/Cart.js
import React, { useEffect, useState } from 'react';
import '../../assets/css/User/cart.css';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  // Dữ liệu mẫu giỏ hàng
  const [cartItems, setCartItems] = useState<any>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [shippingMethods, setShippingMethods] = useState<any[]>([]);
  const [coupon, setCoupon] = useState<any>([]);
  
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("");
  const API = 'http://localhost:3000'
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

useEffect(() => {
  fetchData();
}, [userId]);

  const fetchData = async () => {
    try {
      const [cartRes, couponRes, paymentRes, shippingRes] = await Promise.all([
        fetch(`${API}/api/cart/user/${userId}`).then(res => res.json()),
        fetch(`${API}/api/coupon`).then(res => res.json()),
        fetch(`${API}/api/payment`).then(res => res.json()),
        fetch(`${API}/api/shipping`).then(res => res.json())
      ]);

      // ✅ cartRes: { userId, items: [] }
      setCartItems(Array.isArray(cartRes.items) ? cartRes.items : []);
      setCoupon(Array.isArray(couponRes) ? couponRes : []);
      setPaymentMethods(Array.isArray(paymentRes) ? paymentRes : []);
      setShippingMethods(Array.isArray(shippingRes) ? shippingRes : []);
      
      if (Array.isArray(paymentRes) && paymentRes.length > 0) {
        setSelectedPayment(paymentRes[0]._id);
      }
      if (Array.isArray(shippingRes) && shippingRes.length > 0) {
        setSelectedShipping(shippingRes[0]._id);
      }
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      // fallback tránh crash UI
      setCartItems([]);
      setCoupon([]);
      setPaymentMethods([]);
      setShippingMethods([]);
    }
  };

  // Tính toán tổng tiền
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total: any, item: any) => total + (item.productId.price * item.quantity), 0);
    
    const selectedShippingMethod = shippingMethods.find(method => method._id === selectedShipping);
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
const handleQuantityChange = async (itemId: string, newQuantity: number) => {
  if (newQuantity < 1) return;
  try {
    const res = await fetch(`${API}/api/cart/user/${userId}/item/${itemId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    if (!res.ok) {
      console.error("Cập nhật thất bại:", await res.text());
      return;
    }

    const updatedItem = await res.json();

    // update lại state giỏ hàng
    setCartItems((prev: any[]) =>
      prev.map((item) =>
        item._id === itemId ? { ...item, quantity: updatedItem.quantity } : item
      )
    );
    fetchData();
  } catch (err) {
    console.log("error: ", err);
  }
};

  // Xóa sản phẩm
  const handleRemoveItem = async (itemId: any) => {
    try {
    const res = await fetch(`${API}/api/cart/user/${userId}/item/${itemId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setCartItems((prev: any[]) => prev.filter(item => item._id !== itemId));
      await fetchData();
    }
  } catch (err) {
    console.error("Lỗi khi xóa:", err);
  }
  };

  // Áp dụng mã giảm giá
const handleApplyCoupon = async () => {
  try {
    const res = await fetch(`${API}/api/coupon/apply?code=${couponCode.toUpperCase()}`);
    const coupon = await res.json();

    if (!res.ok || !coupon) {
      alert("Mã giảm giá không hợp lệ!");
      return;
    }

    if (subtotal < coupon.minOrder) {
      alert(`Đơn hàng tối thiểu ${coupon.minOrder.toLocaleString()}đ để áp dụng mã này`);
      return;
    }

    setAppliedCoupon(coupon);
    alert(`Áp dụng mã giảm giá thành công: ${coupon.description}`);
  } catch (error) {
    console.error("Lỗi áp dụng coupon:", error);
    alert("Không thể áp dụng mã giảm giá");
  }
};

  // Xóa mã giảm giá
  const handleRemoveCoupon = async () => {
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
    const prescriptionItems = cartItems.filter((item: any) => item.prescription);
    if (prescriptionItems.length > 0) {
      alert('Đơn hàng có thuốc kê đơn. Vui lòng cung cấp đơn thuốc khi thanh toán.');
    }

    navigate('/user/checkout');
    // Chuyển hướng đến trang thanh toán
  };

  // Định dạng tiền
  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <div className="cart-page">
      {cartItems.length === 0  ? (
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
   ) : (      
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

            {cartItems.map((item: any) => (
              <div key={item._id} className="cart-item">
                <div className="item-info">
                  <img src={item.productId.image} alt={item.productId.name} className="item-image" />
                  <div className="item-details">
                    <h3 className="item-name">{item.productId.name}</h3>
                    <p className="item-manufacturer">{item.productId.manufacturer}</p>
                    {item.productId.prescription && (
                      <span className="prescription-badge">Cần kê đơn</span>
                    )}
                  </div>
                </div>

                <div className="item-price">
                  {item.productId.discountPrice ? (
                    <>
                      <span className="current-price">{formatPrice(item.productId.discountPrice)}</span>
                      <span className="original-price">{formatPrice(item.productId.price)}</span>
                    </>
                  ) : (
                    <span className="current-price">{formatPrice(item.productId.price)}</span>
                  )}
                </div>

                <div className="item-quantity">
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}
                    disabled={item.productId.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-number">{item.quantity}</span>
                  <button 
                    className="quantity-btn"
                    onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}
                    disabled={item.productId.quantity >= item.productId.stock}
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  {formatPrice(item.productId.price * item.quantity)}
                </div>

                <div className="item-actions">
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item.productId._id)}
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



              {/* Phương thức thanh toán */}
              <div className="payment-section">
                <h4>Phương thức thanh toán</h4>
                <div className="payment-options">
                  {paymentMethods.map(method => (
                    <label key={method._id} className="payment-option">
                      <input
                        type="radio"
                        name="payment"
                        value={method._id}
                        checked={selectedPayment === method._id}
                        onChange={() => setSelectedPayment(method._id)}
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
   )}
    </div>
  );
};

export default Cart;