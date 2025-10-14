// Register.js
import React, { useState } from 'react';
import '../assets/css/register.css';

const Register: React.FC = () => {
  const [activeRole, setActiveRole] = useState('user');
  const [animationState, setAnimationState] = useState('normal'); // normal, collapsing, expanding
  const [formData, setFormData] = useState<any>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    phone: "",
    address: "",
    licenseNumber: "",
    pharmacyName: "",
    companyName: "",
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const API = 'http://localhost:3000'
  const handleRoleSelect = (role: any) => {
    if (role === activeRole || animationState !== 'normal') return;
    
    // Bắt đầu animation thu form lại
    setAnimationState('collapsing');
    
    // Sau khi thu form lại, thay đổi role và bắt đầu animation mở rộng
    setTimeout(() => {
      setActiveRole(role);
      setAnimationState('expanding');
      
      // Kết thúc animation
      setTimeout(() => {
        setAnimationState('normal');
      }, 500);
    }, 500);
  };

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegister = async (e: any) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (!formData.agreeToTerms) {
      setAgreeToTerms(true)
      return;
    }

    setLoading(true);

    try {
      let endpoint = `${API}/api/users/register`;
      const body: any = {
        name: formData.fullName,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
      };

      if (activeRole === "pharmacy") {
        endpoint = `${API}/api/users/register/pharmacy`;
        body.licenseNumber = formData.licenseNumber;
        body.pharmacyName = formData.pharmacyName;
      } else if (activeRole === "distributor") {
        endpoint = `${API}/api/users/register/distributor`;
        body.licenseNumber = formData.licenseNumber;
        body.companyName = formData.companyName;
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đăng ký thất bại");

      alert("Đăng ký thành công!");
      console.log("User đã đăng ký:", data);

    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // const getRoleLabel = (role :any) => {
  //   switch(role) {
  //     case 'user': return 'Người dùng';
  //     case 'pharmacy': return 'Nhà thuốc';
  //     case 'distributor': return 'Đơn vị vận chuyển';
  //     default: return 'Người dùng';
  //   }
  // };    

return (
  <div className="register-container">
    <div className="register-card">
      <div className="register-header">
        <h1>Đăng Ký Tài Khoản</h1>
        <p>Tham gia hệ thống phân phối thuốc MedChain</p>
      </div>
      
      <div className="role-selector">
        <div 
          className={`role-btn ${activeRole === 'user' ? 'active' : ''} ${animationState !== 'normal' ? 'disabled' : ''}`} 
          onClick={() => handleRoleSelect('user')}
        >
          <div className="role-icon">👤</div>
          <span>Người dùng</span>
        </div>
        <div 
          className={`role-btn ${activeRole === 'pharmacy' ? 'active' : ''} ${animationState !== 'normal' ? 'disabled' : ''}`} 
          onClick={() => handleRoleSelect('pharmacy')}
        >
          <div className="role-icon">💊</div>
          <span>Nhà thuốc</span>
        </div>
        <div 
          className={`role-btn ${activeRole === 'distributor' ? 'active' : ''} ${animationState !== 'normal' ? 'disabled' : ''}`} 
          onClick={() => handleRoleSelect('distributor')}
        >
          <div className="role-icon">🏢</div>
          <span>Nhà phân phối</span>
        </div>
      </div>

      <div className={`form-container ${animationState}`}>
        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-scrollable">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">Họ và tên</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-control"
                  placeholder="Nhập họ và tên đầy đủ"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  placeholder="Chọn tên đăng nhập"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Nhập địa chỉ email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Số điện thoại</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  placeholder="Nhập số điện thoại"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address" className="form-label">Địa chỉ</label>
              <input
                type="text"
                id="address"
                name="address"
                className="form-control"
                placeholder="Nhập địa chỉ chi tiết"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Dynamic Fields cho Nhà thuốc */}
            {activeRole === 'pharmacy' && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="pharmacyName" className="form-label">Tên nhà thuốc</label>
                  <input
                    type="text"
                    id="pharmacyName"
                    name="pharmacyName"
                    className="form-control"
                    placeholder="Nhập tên nhà thuốc"
                    value={formData.pharmacyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="licenseNumber" className="form-label">Số giấy phép</label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    className="form-control"
                    placeholder="Nhập số giấy phép kinh doanh"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* Dynamic Fields cho Nhà phân phối */}
            {activeRole === 'distributor' && (
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="companyName" className="form-label">Tên công ty</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    className="form-control"
                    placeholder="Nhập tên công ty"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="licenseNumber" className="form-label">Số giấy phép</label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    className="form-control"
                    placeholder="Nhập số giấy phép kinh doanh"
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="password" className="form-label">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Tạo mật khẩu"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className="form-control"
                  placeholder="Nhập lại mật khẩu"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                className="form-check-input"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
              />
              <label htmlFor="agreeToTerms" className="form-check-label">
                Tôi đồng ý với <a href="#terms">điều khoản sử dụng</a> và{" "}
                <a href="#privacy">chính sách bảo mật</a>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className={`register-btn ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Đang đăng ký...
                </>
              ) : (
                "Đăng ký"
              )}
            </button>
          </div>
          <br />
          {agreeToTerms ? "Vui lòng chấp nhận điều khoản" : ""}
        </form>

        <div className="register-footer">
          <p>
            Đã có tài khoản? <a href="/login">Đăng nhập ngay</a>
          </p>
        </div>
      </div>
    </div>
  </div>
);
}

export default Register;