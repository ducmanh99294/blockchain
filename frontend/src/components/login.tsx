import React, { useState } from 'react';
import '../assets/css/login.css';

const Login: React.FC = () => {
  const [activeRole, setActiveRole] = useState('user');
  const [animationState, setAnimationState] = useState('normal'); // normal, collapsing, expanding
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');


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

  // const handleLogin = (e: any) => {
  //   e.preventDefault();
  //   alert(`Đăng nhập với vai trò: ${getRoleLabel(activeRole)}`);
  // };

    const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`http://localhost:3000/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.username, 
          password: formData.password,
          role: activeRole
        })
      });
      const data = await response.json();
      console.log(data);
      if (!response.ok) {
        setError(data.message || "Đăng nhập thất bại");
      } else {
        setSuccess("Đăng nhập thành công!");
        // lưu token để dùng cho các request sau
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role);
        localStorage.setItem("userId", data.user.id);
        // ví dụ điều hướng sang trang dashboard
        if (data.user.role === "user") {
          window.location.href = "/";
        } else if (data.user.role === "pharmacy") {
          window.location.href = "/pharmacy";
        } else if (data.user.role === "distributor") {
          window.location.href = "/distributor";
        }
      }
    } catch (err) {
      setError("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };
  // const getRoleLabel = (role: any) => {
  //   switch(role) {
  //     case 'user': return 'Người dùng';
  //     case 'pharmacy': return 'Nhà thuốc';
  //     case 'distributor': return 'Đơn vị vận chuyển';
  //     default: return 'Người dùng';
  //   }
  // };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">MedChain</h1>
          <p className="login-subtitle">Hệ thống phân phối thuốc dựa trên Blockchain</p>
        </div>
        
        <div className="role-selector">
          <div 
            className={`role-btn ${activeRole === 'user' ? 'active' : ''}`} 
            onClick={() => handleRoleSelect('user')}
          >
            <div className="role-icon">👤</div>
            <span>Người dùng</span>
          </div>
          <div 
            className={`role-btn ${activeRole === 'pharmacy' ? 'active' : ''}`} 
            onClick={() => handleRoleSelect('pharmacy')}
          >
            <div className="role-icon">💊</div>
            <span>Nhà thuốc</span>
          </div>
          <div 
            className={`role-btn ${activeRole === 'distributor' ? 'active' : ''}`} 
            onClick={() => handleRoleSelect('distributor')}
          >
            <div className="role-icon">🚚</div>
            <span>Vận chuyển</span>
          </div>
        </div>
        
        <div className={`form-container ${animationState}`}>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">Tên đăng nhập</label>
              <input 
                type="text" 
                id="username" 
                name="username"
                className="form-control" 
                placeholder="Nhập email" 
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Mật khẩu</label>
              <input 
                type="password" 
                id="password" 
                name="password"
                className="form-control" 
                placeholder="Nhập mật khẩu" 
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-check">
              <input 
                type="checkbox" 
                id="remember" 
                name="remember"
                className="form-check-input" 
                checked={formData.remember}
                onChange={handleInputChange}
              />
              <label htmlFor="remember" className="form-check-label">Ghi nhớ đăng nhập</label>
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}
          
          <div className="login-footer">
            <p>Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
            <p><a href="#forgot">Quên mật khẩu?</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;