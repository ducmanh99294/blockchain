// pages/Account.js
import React, { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/User/account.css';

const Account: React.FC = () => {
//   const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>("");

  // Địa chỉ giao hàng
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Nhà riêng',
      fullName: 'Nguyễn Văn A',
      phone: '0901234567',
      address: '123 Đường Nguyễn Văn Linh',
      city: 'TP. Hồ Chí Minh',
      district: 'Quận 7',
      ward: 'Phường Tân Thuận Đông',
      isDefault: true
    },
    {
      id: 2,
      name: 'Công ty',
      fullName: 'Nguyễn Văn A',
      phone: '0907654321',
      address: '456 Đường Nguyễn Huệ',
      city: 'TP. Hồ Chí Minh',
      district: 'Quận 1',
      ward: 'Phường Bến Nghé',
      isDefault: false
    }
  ]);

  // Phương thức thanh toán
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      cardNumber: '**** **** **** 1234',
      cardHolder: 'NGUYEN VAN A',
      expiryDate: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'momo',
      phone: '0901234567',
      isDefault: false
    }
  ]);

  // FAQ
  const faqs = [
    {
      question: 'Làm thế nào để đổi mật khẩu?',
      answer: 'Truy cập mục "Bảo mật" và chọn "Đổi mật khẩu" để cập nhật mật khẩu mới.'
    },
    {
      question: 'Làm thế nào để thay đổi địa chỉ giao hàng?',
      answer: 'Vào mục "Địa chỉ" và chọn "Thêm địa chỉ mới" hoặc "Chỉnh sửa" địa chỉ hiện có.'
    },
    {
      question: 'Tôi có thể hủy đơn hàng sau khi đặt không?',
      answer: 'Có, bạn có thể hủy đơn hàng trong vòng 1 giờ sau khi đặt hoặc khi đơn hàng chưa được xử lý.'
    },
    {
      question: 'Làm thế nào để theo dõi đơn hàng?',
      answer: 'Vào mục "Lịch sử đơn hàng" để xem trạng thái và thông tin vận chuyển của đơn hàng.'
    }
  ];

  const [expandedFaq, setExpandedFaq] = useState<any>(null);

  // Xử lý cập nhật thông tin
// cập nhật state local khi nhập
const handleUpdateUser = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setUserData((prev: any) => ({
    ...prev,
    [name]: value
  }));
};

// gọi API khi bấm Lưu thay đổi
const saveUserChanges = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập");
      return;
    }

    const res = await fetch(`http://localhost:3000/api/user/${userData._id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    if (!res.ok) throw new Error("Không thể cập nhật thông tin");

    const updatedUser = await res.json();
    setUserData(updatedUser); // đồng bộ lại với server
    setIsEditing(false);      // tắt chế độ chỉnh sửa
    console.log("✅ User updated:", updatedUser);
  } catch (err) {
    console.error(err);
    alert("Có lỗi khi lưu thông tin");
  }
};


  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:3000/api/user/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/login");
    }
  };

  // Lấy profile khi load trang
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3000/api/user/profile", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (!res.ok) {
          throw new Error("Không thể lấy thông tin user");
        }

        const data = await res.json();
        console.log(data)
        setUserData(data);
      } catch (err) {
        console.error(err);
        navigate("/login"); // Nếu lỗi → chuyển login
      }
    };

    fetchProfile();
  }, [navigate]);

  useEffect(() => {
  if (userData?.addresses) {
    setAddresses(userData.addresses);
  }
}, [userData]);

  // Thêm địa chỉ mới
  const handleAddAddress = async () => {
    const newAddress = {
      id: Date.now().toString(),
      fullName: '',
      phone: '',
      address: '',
      city: '',
      district: '',
      ward: '',
      isDefault: false
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/user/${userData._id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          addresses: [...(userData.addresses || []), newAddress]
        })
      });

      if (!res.ok) throw new Error("Không thể thêm địa chỉ");

      const updatedUser = await res.json();
      console.log("👉 User sau khi thêm:", updatedUser);

      // ✅ Cập nhật lại state ngay từ server
      setUserData((prev: any) => ({
        ...prev!,
        addresses: updatedUser.addresses
      }));

    } catch (err) {
      console.error(err);
      alert("Lỗi khi thêm địa chỉ");
    }
  };

    // Đặt làm địa chỉ mặc định
  const setDefaultAddress = async (id: any) => {
    const updatedAddresses = userData.addresses?.map((addr: any) => {
      return {
        ...addr,
        isDefault: addr.id === id || addr._id === id
      };
    });

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/user/${userData._id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ addresses: updatedAddresses })
      });

      if (!res.ok) throw new Error("Không thể cập nhật địa chỉ mặc định");
      setUserData((prev: any) => ({
        ...prev!,
        addresses: updatedAddresses
      }));
    } catch (err) {
      console.error(err);
      alert("Lỗi khi đặt địa chỉ mặc định");
    }
  };

  // Xóa địa chỉ
  const deleteAddress = async (id: string) => {
    if (addresses.length <= 1) {
      alert("Cần ít nhất một địa chỉ giao hàng");
      return;
    }

    const updatedAddresses = addresses.filter((addr:any) => addr.id !== id);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:3000/api/user/${userData._id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ addresses: updatedAddresses })
      });

      if (!res.ok) throw new Error("Không thể xóa địa chỉ");

      setAddresses(updatedAddresses);
    
    } catch (err) {
      console.error(err);
      alert("Lỗi khi xóa địa chỉ");
    }
  };

  // Thêm phương thức thanh toán
  const handleAddPaymentMethod = () => {
    // Logic thêm phương thức thanh toán mới
    alert('Chức năng thêm phương thức thanh toán sẽ được mở trong popup');
  };

  // Xóa phương thức thanh toán
  const deletePaymentMethod = (id: any) => {
    if (paymentMethods.length <= 1) {
      alert('Cần ít nhất một phương thức thanh toán');
      return;
    }
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
  };

  // Đặt làm phương thức mặc định
  const setDefaultPaymentMethod = (id: any) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
  };

  return (
    <div className="account-page">
      <div className="account-container">
        {/* Sidebar navigation */}
        <div className="account-sidebar">
          <div className="user-profile-card">
            <div className="user-avatar">
              {userData?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <h3>{userData.name}</h3>
              <p>{userData.email}</p>
            </div>
          </div>

          <nav className="account-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              👤 Thông tin cá nhân
            </button>
            <button 
              className={`nav-item ${activeTab === 'address' ? 'active' : ''}`}
              onClick={() => setActiveTab('address')}
            >
              📦 Địa chỉ giao hàng
            </button>
            <button 
              className={`nav-item ${activeTab === 'payment' ? 'active' : ''}`}
              onClick={() => setActiveTab('payment')}
            >
              💳 Phương thức thanh toán
            </button>
            <button 
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              🔒 Bảo mật
            </button>
            <button 
              className={`nav-item ${activeTab === 'support' ? 'active' : ''}`}
              onClick={() => setActiveTab('support')}
            >
              ❓ Hỗ trợ
            </button>
          </nav>

          <button className="back-btn" onClick={()=>navigate('/user/home')}>
            🚪 Quay lại
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            🚪 Đăng xuất
          </button>
        </div>

        {/* Main content */}
        <div className="account-content">
          {/* Thông tin cá nhân */}
          {activeTab === 'profile' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Thông tin cá nhân</h2>
                <button 
                  className="edit-btn"
                  onClick={() => {
                    if (isEditing) {
                      saveUserChanges();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                >
                  {isEditing ? '💾 Lưu thay đổi' : '✏️ Chỉnh sửa'}
                </button>
              </div>

              <div className="profile-form">
                <div className="form-group">
                  <label>Họ và tên</label>
                  <input
                    type="text"
                    name="fullName"
                    value={userData.name}
                    onChange={handleUpdateUser}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={userData.email}
                    disabled
                    className="disabled-input"
                  />
                  <span className="input-note">Email không thể thay đổi</span>
                </div>

                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleUpdateUser}
                    disabled={!isEditing}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Ngày sinh</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={userData.dateOfBirth ? new Date(userData.dateOfBirth).toISOString().split("T")[0] : ""}
                      onChange={handleUpdateUser}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-group">
                    <label>Giới tính</label>
                    <select
                      name="gender"
                      value={userData.gender}
                      onChange={handleUpdateUser}
                      disabled={!isEditing}
                    >
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Địa chỉ giao hàng */}
          {activeTab === 'address' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Địa chỉ giao hàng</h2>
                <button className="add-btn" onClick={handleAddAddress}>
                  ＋ Thêm địa chỉ mới
                </button>
              </div>
              <div className="addresses-list">
                {addresses?.length > 0 ? (
                  addresses.map((address: any) => (
                    <div key={address.id || address._id} className="address-card">
                      <div className="address-header">
                        <h3>{address.name}</h3>
                        {address.isDefault && (
                          <span className="default-badge">Mặc định</span>
                        )}
                      </div>

                      <div className="address-details">
                        <p>
                          <strong>{address.fullName}</strong> | {address.phone}
                        </p>
                        <p>
                          {address.address}, {address.ward}, {address.district},{" "}
                          {address.city}
                        </p>
                      </div>

                      <div className="address-actions">
                        {!address.isDefault && (
                          <button
                            className="action-btn set-default"
                            onClick={() => setDefaultAddress(address.id || address._id)}
                          >
                            Đặt làm mặc định
                          </button>
                        )}
                        <button className="action-btn edit">Chỉnh sửa</button>
                        {!address.isDefault && (
                          <button
                            className="action-btn delete"
                            onClick={() => deleteAddress(address.id || address._id)}
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Chưa có địa chỉ nào</p>
                )}
              </div>
            </div>
          )}


          {/* Phương thức thanh toán */}
          {activeTab === 'payment' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Phương thức thanh toán</h2>
                <button className="add-btn" onClick={handleAddPaymentMethod}>
                  ＋ Thêm phương thức
                </button>
              </div>

              <div className="payment-methods-list">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="payment-card">
                    <div className="payment-header">
                      {method.type === 'card' ? (
                        <div className="payment-icon">💳</div>
                      ) : (
                        <div className="payment-icon">📱</div>
                      )}
                      <div className="payment-info">
                        <h3>
                          {method.type === 'card' ? 'Thẻ tín dụng/ghi nợ' : 'Ví MoMo'}
                        </h3>
                        <p>
                          {method.type === 'card' 
                            ? `${method.cardNumber} - ${method.cardHolder}`
                            : `Số điện thoại: ${method.phone}`
                          }
                        </p>
                        {method.type === 'card' && (
                          <p>Hết hạn: {method.expiryDate}</p>
                        )}
                      </div>
                    </div>

                    <div className="payment-actions">
                      {method.isDefault ? (
                        <span className="default-badge">Mặc định</span>
                      ) : (
                        <>
                          <button
                            className="action-btn set-default"
                            onClick={() => setDefaultPaymentMethod(method.id)}
                          >
                            Đặt làm mặc định
                          </button>
                          <button
                            className="action-btn delete"
                            onClick={() => deletePaymentMethod(method.id)}
                          >
                            Xóa
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="payment-security-note">
                <h4>🔒 Bảo mật thông tin</h4>
                <p>
                  Thông tin thẻ của bạn được mã hóa và bảo mật theo tiêu chuẩn PCI DSS. 
                  Chúng tôi không lưu trữ thông tin thẻ đầy đủ trên hệ thống.
                </p>
              </div>
            </div>
          )}

          {/* Bảo mật */}
          {activeTab === 'security' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Bảo mật tài khoản</h2>
              </div>

              <div className="security-settings">
                <div className="security-card">
                  <h3>🔐 Đổi mật khẩu</h3>
                  <p>Cập nhật mật khẩu mới để bảo vệ tài khoản của bạn</p>
                  <button className="change-password-btn">
                    Đổi mật khẩu
                  </button>
                </div>

                <div className="security-card">
                  <h3>📱 Xác thực 2 yếu tố</h3>
                  <p>Thêm lớp bảo mật bổ sung cho tài khoản của bạn</p>
                  <button className="enable-2fa-btn">
                    Bật xác thực 2 yếu tố
                  </button>
                </div>

                <div className="security-card">
                  <h3>📧 Thông báo bảo mật</h3>
                  <p>Nhận thông báo khi có hoạt động đăng nhập mới</p>
                  <label className="switch">
                    <input type="checkbox" defaultChecked />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Hỗ trợ */}
          {activeTab === 'support' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>Trung tâm hỗ trợ</h2>
              </div>

              <div className="support-options">
                <div className="support-card">
                  <div className="support-icon">📞</div>
                  <h3>Hotline hỗ trợ</h3>
                  <p>1800-1234 (Miễn phí)</p>
                  <p>Thứ 2 - Chủ nhật: 8:00 - 22:00</p>
                  <button className="support-btn">Gọi ngay</button>
                </div>

                <div className="support-card">
                  <div className="support-icon">💬</div>
                  <h3>Chat với chúng tôi</h3>
                  <p>Hỗ trợ trực tuyến 24/7</p>
                  <button className="support-btn">Bắt đầu chat</button>
                </div>

                <div className="support-card">
                  <div className="support-icon">📧</div>
                  <h3>Email hỗ trợ</h3>
                  <p>support@medchain.com</p>
                  <p>Phản hồi trong vòng 24h</p>
                  <button className="support-btn">Gửi email</button>
                </div>
              </div>

              <div className="faq-section">
                <h3>❓ Câu hỏi thường gặp</h3>
                <div className="faq-list">
                  {faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                      <button
                        className="faq-question"
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      >
                        {faq.question}
                        <span className="faq-icon">
                          {expandedFaq === index ? '−' : '+'}
                        </span>
                      </button>
                      {expandedFaq === index && (
                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;