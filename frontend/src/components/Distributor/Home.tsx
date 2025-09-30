import React, { useState, useEffect } from 'react';
import { 
  FaBox, FaClipboardList, FaChartLine, FaLink, 
  FaBell, FaExclamationTriangle, FaCheckCircle 
} from 'react-icons/fa';
import '../../assets/css/Distributor/home.css';

const DistributorHome: React.FC = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: {
      new: 0,
      processing: 0,
      delivered: 0
    },
    revenue: {
      daily: 0,
      monthly: 0
    }
  });

  const [blockchainTransactions, setBlockchainTransactions] = useState<any>([]);
  const [notifications, setNotifications] = useState<any>([]);

  // Giả lập dữ liệu
  useEffect(() => {
    // Dữ liệu thống kê
    setStats({
      products: 142,
      orders: {
        new: 5,
        processing: 12,
        delivered: 28
      },
      revenue: {
        daily: 18500000,
        monthly: 452000000
      }
    });

    // Giao dịch blockchain
    setBlockchainTransactions([
      {
        id: 1,
        hash: '0x4a8c...b7d2',
        product: 'Paracetamol 500mg',
        time: '10 phút trước',
        status: 'verified'
      },
      {
        id: 2,
        hash: '0x9b3f...c6a1',
        product: 'Amoxicillin 250mg',
        time: '45 phút trước',
        status: 'verified'
      },
      {
        id: 3,
        hash: '0x7e2d...f9b4',
        product: 'Vitamin C 1000mg',
        time: '2 giờ trước',
        status: 'pending'
      }
    ]);

    // Thông báo
    setNotifications([
      {
        id: 1,
        type: 'order',
        message: 'Có 3 đơn hàng mới từ nhà thuốc',
        time: '5 phút trước',
        read: false
      },
      {
        id: 2,
        type: 'blockchain',
        message: '2 sản phẩm chưa verify trên blockchain',
        time: '15 phút trước',
        read: false
      },
      {
        id: 3,
        type: 'system',
        message: 'Hệ thống cập nhật phiên bản mới',
        time: '1 giờ trước',
        read: true
      }
    ]);
  }, []);

  // Định dạng số tiền
  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Dashboard Nhà Phân phối Thuốc</h1>
        <div className="header-actions">
          <button className="notification-btn">
            <FaBell />
            {notifications.filter((n: any) => !n.read).length > 0 && (
              <span className="notification-badge">
                {notifications.filter((n: any) => !n.read).length}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Thống kê nhanh */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FaBox />
            </div>
            <div className="stat-info">
              <h3>{stats.products}</h3>
              <p>Sản phẩm đang phân phối</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaClipboardList />
            </div>
            <div className="stat-info">
              <h3>{stats.orders.new + stats.orders.processing + stats.orders.delivered}</h3>
              <p>Tổng đơn nhập từ nhà thuốc</p>
              <div className="order-details">
                <span className="badge new">{stats.orders.new} mới</span>
                <span className="badge processing">{stats.orders.processing} đang xử lý</span>
                <span className="badge delivered">{stats.orders.delivered} đã giao</span>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FaChartLine />
            </div>
            <div className="stat-info">
              <h3>{formatCurrency(stats.revenue.daily)}</h3>
              <p>Doanh thu hôm nay</p>
              <div className="revenue-details">
                <span>Tháng này: {formatCurrency(stats.revenue.monthly)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-main">
          {/* Thông báo */}
          <div className="notifications-section">
            <h2>Thông báo</h2>
            <div className="notifications-list">
              {notifications.map((notification: any) => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                >
                  <div className="notification-icon">
                    {notification.type === 'order' && <FaClipboardList />}
                    {notification.type === 'blockchain' && <FaExclamationTriangle />}
                    {notification.type === 'system' && <FaBell />}
                  </div>
                  <div className="notification-content">
                    <p>{notification.message}</p>
                    <span className="notification-time">{notification.time}</span>
                  </div>
                  {!notification.read && <div className="unread-dot"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Giao dịch blockchain */}
          <div className="blockchain-section">
            <h2>Giao dịch blockchain gần nhất</h2>
            <div className="transactions-list">
              {blockchainTransactions.map((transaction: any) => (
                <div key={transaction.id} className="transaction-item">
                  <div className="transaction-icon">
                    <FaLink />
                  </div>
                  <div className="transaction-info">
                    <div className="transaction-hash">
                      Hash: {transaction.hash}
                    </div>
                    <div className="transaction-product">
                      Sản phẩm: {transaction.product}
                    </div>
                    <div className="transaction-time">
                      {transaction.time}
                    </div>
                  </div>
                  <div className={`transaction-status ${transaction.status}`}>
                    {transaction.status === 'verified' ? (
                      <><FaCheckCircle /> Đã xác thực</>
                    ) : (
                      <><FaExclamationTriangle /> Chờ xác thực</>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributorHome;