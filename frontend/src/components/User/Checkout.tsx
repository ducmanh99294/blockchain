// pages/Checkout.js
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../assets/css/User/checkout.css';

const Checkout: React.FC = () => {
const [cartItems, setCartItems] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [shippingMethods, setShippingMethods] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("");
  const [coupon, setCoupon] = useState<any | null>(null);
  const [shippingInfo, setShippingInfo] = useState<any>({});
  const [agreeToTerms, setAgreeToTerms] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();
  const API = "http://localhost:3000";
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchData();
    if (location.state?.appliedCoupon) {
      setCoupon(location.state.appliedCoupon);
    }
  }, [userId]);

  const fetchData = async () => {
    try {
      const [cartRes, paymentRes, shippingRes] = await Promise.all([
        fetch(`${API}/api/cart/user/${userId}`).then((res) => res.json()),
        fetch(`${API}/api/payment`).then((res) => res.json()),
        fetch(`${API}/api/shipping`).then((res) => res.json()),
      ]);

      setCartItems(Array.isArray(cartRes.items) ? cartRes.items : []);
      setPaymentMethods(Array.isArray(paymentRes) ? paymentRes : []);
      setShippingMethods(Array.isArray(shippingRes) ? shippingRes : []);

      if (Array.isArray(paymentRes) && paymentRes.length > 0) {
        setSelectedPayment(paymentRes[0]._id);
      }
      if (Array.isArray(shippingRes) && shippingRes.length > 0) {
        setSelectedShipping(shippingRes[0]._id);
      }console.log(paymentRes)
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
      setCartItems([]);
      setCoupon([]);
      setPaymentMethods([]);
      setShippingMethods([]);
    }
  };

  // ✅ Tính toán tổng tiền
  const calculateTotals = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );
    const shippingFee =
      shippingMethods.find((m) => m._id === selectedShipping)?.price || 0;
    const discount = coupon ? coupon.discountAmount || 0 : 0;
    const total = subtotal + shippingFee - discount;

    return { subtotal, shippingFee, discount, total };
  };

  const { subtotal, shippingFee, discount, total } = calculateTotals();

// Xử lý thay đổi thông tin shippingInfo
const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;
  setShippingInfo((prev: any) => ({
    ...prev,
    [name]: value
  }));
};

  // ✅ Đặt hàng
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeToTerms) {
      alert("Vui lòng đồng ý với điều khoản và điều kiện");
      return;
    }

    const orderData = {
      userId,
      items: cartItems.map((item) => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        quantity: item.quantity,
      })),
      shippingInfo,
      shippingMethod: selectedShipping, 
      paymentMethod: selectedPayment, 
      coupon: coupon ? coupon._id : null, 
      subtotal,
      shippingFee,
      discount,
      totalPrice: total,
      status: "pending",
    };
    console.log(orderData)
    try {
      const res = await fetch(`${API}/api/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Tạo đơn hàng thất bại");

      const newOrder = await res.json();
      navigate("/user/orders", { state: newOrder._id });
    } catch (err) {
      console.error("Lỗi khi tạo đơn hàng:", err);
      alert("Không thể tạo đơn hàng, vui lòng thử lại");
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("vi-VN").format(price) + "đ";

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
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Phương thức vận chuyển */}
            <div className="shipping-section">
              <h4>Phương thức vận chuyển</h4>
              <div className="shipping-options">
                {shippingMethods.map(method => (
                  <label key={method._id} className="shipping-option">                      <input
                      type="radio"
                      name="shipping"
                      value={method._id}
                      checked={selectedShipping === method._id}
                      onChange={() => setSelectedShipping(method._id)}
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
            <div className="checkout-section">
              <h2>Phương thức thanh toán</h2>
              <div className="payment-methods">
                {paymentMethods.map(method => (
                  <label key={method._id} className="payment-method">
                    <input
                      type="radio"
                      name="payment"
                      value={method._id}
                      checked={selectedPayment === method._id}
                      onChange={() => setSelectedPayment(method._id)}
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
                  {cartItems.map((item: any) => (
                    <div key={item.productId._id} className="order-item">
                      <img src={item.productId.image} alt={item.productId.name} />
                      <div className="item-details">
                        <h4>{item.productId.name}</h4>
                        <p>Số lượng: {item.quantity}</p>
                      </div>
                      <div className="item-price">
                        {formatPrice(item.productId.price * item.quantity)}
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
                {cartItems.map((item: any) => (
                  <div key={item.productId._id} className="summary-item">
                    <span className="item-name">{item.productId.name} × {item.productId.quantity}</span>
                    <span className="item-price">{formatPrice(item.productId.price * item.quantity)}</span>
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