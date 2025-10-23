import React, { useState } from 'react';
import { 
  FaShieldAlt, 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt,
  FaFacebook, 
  FaTwitter, 
  FaLinkedin, 
  FaYoutube,
  FaArrowUp,
  FaQrcode,
  FaFileContract,
  FaUserShield
} from 'react-icons/fa';
import '../assets/css/footer.css';


const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      // Giả lập gửi email
      console.log('Subscribed with email:', email);
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Main Footer Content */}
        <div className="footer-main">
          
          {/* Company Info */}
          <div className="footer-section company-info">
            <div className="footer-logo">
              <FaShieldAlt />
              <span>MediChain</span>
            </div>
            <p className="footer-description">
              Hệ thống phân phối thuốc minh bạch bằng công nghệ Blockchain. 
              Đảm bảo nguồn gốc xuất xứ và chất lượng sản phẩm từ nhà sản xuất 
              đến tay người tiêu dùng.
            </p>
            <div className="contact-info">
              <div className="contact-item">
                <FaPhone />
                <span>024 1234 5678</span>
              </div>
              <div className="contact-item">
                <FaEnvelope />
                <span>support@medichain.vn</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt />
                <span>123 Đường Láng, Đống Đa, Hà Nội</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Liên kết nhanh</h3>
            <ul className="footer-links">
              <li><a href="/about">Về chúng tôi</a></li>
              <li><a href="/services">Dịch vụ</a></li>
              <li><a href="/solutions">Giải pháp</a></li>
              <li><a href="/pricing">Bảng giá</a></li>
              <li><a href="/contact">Liên hệ</a></li>
            </ul>
          </div>

          {/* For Distributors */}
          <div className="footer-section">
            <h3 className="footer-title">Cho Nhà phân phối</h3>
            <ul className="footer-links">
              <li><a href="/distributor/dashboard">Dashboard</a></li>
              <li><a href="/distributor/products">Quản lý sản phẩm</a></li>
              <li><a href="/distributor/orders">Đơn hàng</a></li>
              <li><a href="/distributor/batches">Quản lý lô hàng</a></li>
              <li><a href="/distributor/reports">Báo cáo</a></li>
            </ul>
          </div>

          {/* For Pharmacies */}
          <div className="footer-section">
            <h3 className="footer-title">Cho Nhà thuốc</h3>
            <ul className="footer-links">
              <li><a href="/pharmacy/shop">Mua hàng</a></li>
              <li><a href="/pharmacy/orders">Đơn hàng của tôi</a></li>
              <li><a href="/pharmacy/inventory">Quản lý tồn kho</a></li>
              <li><a href="/pharmacy/trace">Truy xuất nguồn gốc</a></li>
              <li><a href="/pharmacy/support">Hỗ trợ</a></li>
            </ul>
          </div>

          {/* Blockchain & Newsletter */}
          <div className="footer-section">
            <h3 className="footer-title">Blockchain & Bản tin</h3>
            
            <div className="blockchain-features">
              <div className="feature-item">
                <FaShieldAlt />
                <span>Xác thực nguồn gốc</span>
              </div>
              <div className="feature-item">
                <FaQrcode />
                <span>Mã QR truy xuất</span>
              </div>
              <div className="feature-item">
                <FaFileContract />
                <span>Hợp đồng thông minh</span>
              </div>
              <div className="feature-item">
                <FaUserShield />
                <span>Bảo mật dữ liệu</span>
              </div>
            </div>

            <div className="newsletter">
              <h4>Đăng ký nhận bản tin</h4>
              <form onSubmit={handleSubscribe} className="newsletter-form">
                <input
                  type="email"
                  placeholder="Email của bạn..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">
                  Đăng ký
                </button>
              </form>
              {isSubscribed && (
                <div className="subscription-success">
                  Cảm ơn bạn đã đăng ký!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="copyright">
              <p>&copy; {currentYear} MediChain. Tất cả quyền được bảo lưu.</p>
            </div>
            
            <div className="legal-links">
              <a href="/privacy">Chính sách bảo mật</a>
              <a href="/terms">Điều khoản sử dụng</a>
              <a href="/cookies">Cookie Policy</a>
            </div>
            
            <div className="social-links">
              <a href="#" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="#" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="#" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="#" aria-label="YouTube">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button className="scroll-to-top" onClick={scrollToTop}>
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer;