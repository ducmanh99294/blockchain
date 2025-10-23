import { useState, useEffect } from 'react';
import { 
  FaUser, FaSignOutAlt, FaCog, FaStore, 
  FaBoxes, FaChartLine, FaClipboardList, FaShieldAlt,
  FaShoppingCart, FaHistory, FaHome,
  FaSearch,
  FaWallet
} from 'react-icons/fa';
import '../assets/css/header.css';
import { ethers } from 'ethers';


const Header = () => {
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [walletAddress, setWalletAddress] = useState<any>('');

  const API = 'http://localhost:3000';
  const token = localStorage.getItem('token');
  // Giả lập dữ liệu người dùng và thông báo
  useEffect(() => {
    fetchUser();
    checkWalletConnection();
  }, []);

  // Navigation items theo role
  const getNavigationItems = () => {

    const distributorItems = [
      { path: '/distributor', label: 'Trang chủ', icon: <FaHome />, show: user?.role === 'distributor' },
      { path: '/distributor/products', label: 'Quản lý Sản phẩm', icon: <FaBoxes />, show: user?.role === 'distributor' },
      { path: '/distributor/orders', label: 'Đơn hàng', icon: <FaClipboardList />, show: user?.role === 'distributor' },
      { path: '/distributor/reports', label: 'Báo cáo', icon: <FaChartLine />, show: user?.role === 'distributor' },
      { path: '/distributor/account', label: 'Tài khoản', icon: <FaShieldAlt />, show: user?.role === 'distributor' }
    ];

    const pharmacyItems = [
      { path: '/pharmacy', label: 'Trang chủ', icon: <FaHome />, show: user?.role === 'pharmacy' },
      { path: '/pharmacy/shop', label: 'Mua hàng', icon: <FaShoppingCart />, show: user?.role === 'pharmacy' },
      { path: '/pharmacy/orders', label: 'Đơn hàng của tôi', icon: <FaHistory />, show: user?.role === 'pharmacy' },
      { path: '/pharmacy/products', label: 'Kho', icon: <FaBoxes />, show: user?.role === 'pharmacy' },
      { path: '/pharmacy/account', label: 'Tài khoản', icon: <FaUser />, show: user?.role === 'pharmacy' }
    ];

    const userItems = [
      { path: '/', label: 'Trang chủ', icon: <FaHome />, show: user?.role === 'user' },
      { path: '/category', label: 'Tìm kiếm', icon: <FaSearch />, show: user?.role === 'user' },
      { path: '/cart', label: 'Giỏ hàng', icon: <FaShoppingCart />, show: user?.role === 'user' },
      { path: '/history', label: 'Lịch sử', icon: <FaHistory />, show: user?.role === 'user' },
      { path: '/account', label: 'Tài khoản', icon: <FaUser />, show: user?.role === 'user' },
    ];

    return [
      ...distributorItems,
      ...pharmacyItems,
      ...userItems
    ].filter(item => item.show);
  };

  const fetchUser = async () => {
    try {
    const res = await fetch(`${API}/api/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    setUser(data);
  } catch (error) {
    console.error("Error fetching user:", error);
  }
  };

  // Xử lý đăng xuất
  const handleLogout = () => {
    // Xóa thông tin user khỏi localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    // Chuyển hướng về trang đăng nhập
    window.location.href = '/login';
  };

  const checkWalletConnection = async () => {
    if ((window as any).ethereum) {
      try {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        // Lấy danh sách tài khoản đã được cấp phép
        const accounts = await provider.listAccounts(); 
        if (accounts.length > 0) {
          // provider.listAccounts() trả về Signer object, lấy address
          setWalletAddress(accounts[0].address); 
        }
      } catch (err) {
        console.error("Lỗi tự động kết nối ví: ", err);
      }
    }
  };

  const handleConnectWallet = async () => {
    try {
      if (!(window as any).ethereum) {
        alert("vui lòng cài đặt Metamask để kết nối ví");
        return;
      }
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
    } catch (err) {
      console.error("Lỗi khi kết nối ví:", err);
      alert("Kết nối ví thất bại. Vui lòng thử lại.");
    }
  };
  
  const shortenAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Lấy tên hiển thị theo role
  const getDisplayName = () => {
    if (user?.role === 'pharmacy' && user?.pharmacyName) {
      return user.pharmacyName;
    }
    return user?.name || 'User';
  };

  // Lấy role label
  const getRoleLabel = () => {
    switch(user?.role) {
      case 'distributor':
        return 'Nhà phân phối';
      case 'pharmacy':
        return 'Nhà thuốc';
      case 'user':
        return 'Người dùng';
      default:
        return 'Người dùng';
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo và Brand */}
        <div className="header-brand">
          <div className="logo">
            <FaShieldAlt />
            <span>MediChain</span>
          </div>
          <div className="brand-tagline">Blockchain Pharmaceutical Network</div>
        </div>

        {/* Navigation Menu */}
        <nav className="header-nav">
          <ul className="nav-menu">
            {getNavigationItems().map((item, index) => (
              <li key={index} className="nav-item">
                <a href={item.path} className="nav-link">
                  {item.icon}
                  <span>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Header Actions */}
        {/* Wallet Connect */}
        <div className="header-actions">
          <div className="wallet-connect">
            {walletAddress ? (
              // Đã kết nối
              <button className="wallet-btn connected">
                <FaWallet />
                <span>{shortenAddress(walletAddress)}</span>
              </button>
            ) : (
              // Chưa kết nối
              <button className="wallet-btn" onClick={handleConnectWallet}>
                <FaWallet />
                <span>Kết nối Ví</span>
              </button>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="user-dropdown">
            <button 
              className="user-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img 
                src={user?.avatar} 
                alt={user?.name}
                className="user-avatar"
              />
              <div className="user-info">
                <span className="user-name">{getDisplayName()}</span>
                <span className="user-role">{getRoleLabel()}</span>
              </div>
            </button>

            {showDropdown && (
              <div className="dropdown-menu user-menu">
                <div className="user-profile-preview">
                  <img 
                    src={user?.avatar} 
                    alt={user?.name}
                    className="preview-avatar"
                  />
                  <div className="preview-info">
                    <span className="preview-name">{getDisplayName()}</span>
                    <span className="preview-role">{getRoleLabel()}</span>
                    <span className="preview-email">{user?.email}</span>
                  </div>
                </div>

                <div className="dropdown-divider"></div>
                {user?.role === 'user' && (
                <a href="/account" className="dropdown-item">
                  <FaUser />
                  <span>Thông tin tài khoản</span>
                </a>
                )}

                {user?.role === 'distributor' && (
                  <a href="/distributor/account" className="dropdown-item">
                    <FaCog />
                    <span>Cài đặt nhà phân phối</span>
                  </a>
                )}

                {user?.role === 'pharmacy' && (
                  <a href="/pharmacy/account" className="dropdown-item">
                    <FaStore />
                    <span>Thông tin nhà thuốc</span>
                  </a>
                )}

                <div className="dropdown-divider"></div>

                <a href="/settings" className="dropdown-item">
                  <FaCog />
                  <span>Cài đặt</span>
                </a>

                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt />
                  <span>Đăng xuất</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay để đóng dropdown khi click bên ngoài */}
      {showDropdown && (
        <div 
          className="dropdown-overlay"
          onClick={() => setShowDropdown(false)}
        ></div>
      )}
    </header>
  );
};

export default Header;