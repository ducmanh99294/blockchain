// Register.js
import React, { useState } from 'react';
import '../assets/css/register.css';

const Register: React.FC = () => {
  const [activeRole, setActiveRole] = useState('user');
  const [animationState, setAnimationState] = useState('normal'); // normal, collapsing, expanding
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    address: '',
    agreeToTerms: false
  });

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

  const handleSubmit = (e: any) => {
    e.preventDefault();
    
    // Kiểm tra mật khẩu trùng khớp
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    
    // Kiểm tra điều khoản
    if (!formData.agreeToTerms) {
      alert("Bạn cần đồng ý với điều khoản sử dụng!");
      return;
    }
    
    // Xử lý đăng ký dựa trên role được chọn
    alert(`Đăng ký thành công với vai trò: ${getRoleLabel(activeRole)}`);
    console.log('Dữ liệu đăng ký:', { ...formData, role: activeRole });
  };

  const getRoleLabel = (role :any) => {
    switch(role) {
      case 'user': return 'Người dùng';
      case 'pharmacy': return 'Nhà thuốc';
      case 'transporter': return 'Đơn vị vận chuyển';
      default: return 'Người dùng';
    }
  };

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
            className={`role-btn ${activeRole === 'transporter' ? 'active' : ''} ${animationState !== 'normal' ? 'disabled' : ''}`} 
            onClick={() => handleRoleSelect('transporter')}
          >
            <div className="role-icon">🚚</div>
            <span>Vận chuyển</span>
          </div>
        </div>
        
        <div className={`form-container ${animationState}`}>
          <form className="register-form" onSubmit={handleSubmit}>
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
                Tôi đồng ý với <a href="#terms">điều khoản sử dụng</a> và <a href="#privacy">chính sách bảo mật</a>
              </label>
            </div>
            
            <button type="submit" className="register-btn">
              Đăng Ký
            </button>
          </form>
          
          <div className="register-footer">
            <p>Đã có tài khoản? <a href="/login">Đăng nhập ngay</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;