// pages/PharmacyDashboard.js
import React, { useState, useEffect } from 'react';
import '../../assets/css/Pharmacy/home.css';
import { useNavigate } from 'react-router-dom';


const PharmacyHome = () => {
  type TimeRange = 'today' | 'week' | 'month';
  const [timeRange, setTimeRange] = useState<TimeRange>('today');
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // Dữ liệu mẫu - sẽ thay bằng API sau
  const [dashboardData, setDashboardData] = useState({
    revenue: {
      today: 12500000,
      yesterday: 9800000,
      thisMonth: 285000000,
      lastMonth: 245000000,
      trend: 'up' // up, down
    },
    orders: {
      new: 12,
      processing: 8,
      completed: 45,
      cancelled: 2
    },
    inventory: {
      totalProducts: 156,
      lowStock: 8,
      outOfStock: 3,
      needRestock: 5
    },
    performance: {
      conversionRate: 68,
      averageOrderValue: 250000,
      customerSatisfaction: 4.7
    }
  });

  // Dữ liệu tồn kho
  const [inventoryItems, setInventoryItems] = useState([
    {
      id: 1,
      name: "Panadol Extra",
      category: "Giảm đau",
      currentStock: 15,
      minStock: 20,
      price: 95000,
      status: "low", // normal, low, out
      lastUpdated: "2024-03-15"
    },
    {
      id: 2,
      name: "Vitamin C 1000mg",
      category: "Vitamin",
      currentStock: 5,
      minStock: 15,
      price: 150000,
      status: "low",
      lastUpdated: "2024-03-15"
    },
    {
      id: 3,
      name: "Amoxicillin 500mg",
      category: "Kháng sinh",
      currentStock: 0,
      minStock: 10,
      price: 85000,
      status: "out",
      lastUpdated: "2024-03-14"
    },
    {
      id: 4,
      name: "Omeprazole 20mg",
      category: "Tiêu hóa",
      currentStock: 25,
      minStock: 15,
      price: 110000,
      status: "normal",
      lastUpdated: "2024-03-15"
    }
  ]);

  // Đơn hàng mới
  const [recentOrders, setRecentOrders] = useState([
    {
      id: 'MED123460',
      customer: 'Nguyễn Văn B',
      amount: 345000,
      status: 'new',
      time: '10 phút trước',
      items: ['Panadol Extra', 'Vitamin C']
    },
    {
      id: 'MED123461',
      customer: 'Trần Thị C',
      amount: 220000,
      status: 'new',
      time: '25 phút trước',
      items: ['Kem dưỡng da Eucerin']
    },
    {
      id: 'MED123462',
      customer: 'Lê Văn D',
      amount: 185000,
      status: 'processing',
      time: '1 giờ trước',
      items: ['Amoxicillin 500mg']
    }
  ]);

  // Thống kê doanh thu theo thời gian (mẫu)
  const revenueData = {
    today: [1200000, 1850000, 2200000, 1750000, 2500000, 3000000],
    week: [12500000, 11800000, 13200000, 14500000, 15600000, 14800000, 15200000],
    month: [285000000, 275000000, 290000000, 265000000]
  };

  // Load dữ liệu khi thay đổi timeRange
  useEffect(() => {
    // Giả lập fetch data
    console.log('Loading data for:', timeRange);
  }, [timeRange]);

  // Format tiền
  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  // Tính phần trăm thay đổi
  const calculateChangePercent = (current: any, previous: any) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  // Lấy doanh thu theo timeRange
  const getRevenueData = () => {
    switch (timeRange) {
      case 'today':
        return {
          current: dashboardData.revenue.today,
          previous: dashboardData.revenue.yesterday,
          label: 'Hôm nay'
        };
      case 'month':
        return {
          current: dashboardData.revenue.thisMonth,
          previous: dashboardData.revenue.lastMonth,
          label: 'Tháng này'
        };
      default:
        return {
          current: dashboardData.revenue.today,
          previous: dashboardData.revenue.yesterday,
          label: 'Hôm nay'
        };
    }
  };

  const revenue = getRevenueData();
  const changePercent = calculateChangePercent(revenue.current, revenue.previous);
  const isPositive = revenue.current >= revenue.previous;

  return (
    <div className="pharmacy-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="header-left">
            <h1>Tổng Quan Nhà Thuốc</h1>
            <p>Chào mừng trở lại, Nhà Thuốc Minh Anh</p>
          </div>
          <div className="header-right">
            <div className="date-filter">
              <button 
                className={`filter-btn ${timeRange === 'today' ? 'active' : ''}`}
                onClick={() => setTimeRange('today')}
              >
                Hôm nay
              </button>
              <button 
                className={`filter-btn ${timeRange === 'week' ? 'active' : ''}`}
                onClick={() => setTimeRange('week')}
              >
                Tuần
              </button>
              <button 
                className={`filter-btn ${timeRange === 'month' ? 'active' : ''}`}
                onClick={() => setTimeRange('month')}
              >
                Tháng
              </button>
            </div>
            <div className="notification-bell">
              <span className="bell-icon">🔔</span>
              <span className="notification-count">3</span>
            </div>
          </div>
        </div>

        {/* Thống kê chính */}
        <div className="stats-grid">
          {/* Doanh thu */}
          <div className="stat-card revenue">
            <div className="stat-icon">💰</div>
            <div className="stat-info">
              <h3>Doanh thu {revenue.label}</h3>
              <div className="stat-value">{formatPrice(revenue.current)}</div>
              <div className={`stat-change ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? '↗' : '↘'} {changePercent}% so với {timeRange === 'today' ? 'hôm qua' : 'tháng trước'}
              </div>
            </div>
          </div>

          {/* Đơn hàng mới */}
          <div className="stat-card orders">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>Đơn hàng mới</h3>
              <div className="stat-value">{dashboardData.orders.new}</div>
              <div className="stat-subtext">{dashboardData.orders.processing} đang xử lý</div>
            </div>
          </div>

          {/* Tồn kho */}
          <div className="stat-card inventory">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Tồn kho</h3>
              <div className="stat-value">{dashboardData.inventory.lowStock + dashboardData.inventory.outOfStock}</div>
              <div className="stat-subtext">Sản phẩm cần chú ý</div>
            </div>
          </div>

          {/* Hiệu suất */}
          <div className="stat-card performance">
            <div className="stat-icon">⭐</div>
            <div className="stat-info">
              <h3>Đánh giá</h3>
              <div className="stat-value">{dashboardData.performance.customerSatisfaction}/5</div>
              <div className="stat-subtext">{dashboardData.performance.conversionRate}% tỷ lệ chuyển đổi</div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Cột trái - Biểu đồ và cảnh báo */}
          <div className="content-left">
            {/* Biểu đồ doanh thu đơn giản */}
            <div className="chart-card">
              <div className="chart-header">
                <h3>Doanh thu {timeRange === 'today' ? 'theo giờ' : timeRange === 'week' ? 'theo ngày' : 'theo tuần'}</h3>
                <button className="view-report-btn">Xem báo cáo →</button>
              </div>
              <div className="chart-placeholder">
                <div className="chart-bars">
                  {revenueData[timeRange].map((value, index) => (
                    <div
                      key={index}
                      style={{ height: `${(value / Math.max(...revenueData[timeRange as TimeRange])) * 100}%` }}
                    ></div>
                  ))}
                </div>
                <div className="chart-labels">
                  {timeRange === 'today' ? (
                    ['8h', '10h', '12h', '14h', '16h', '18h']
                  ) : timeRange === 'week' ? (
                    ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
                  ) : (
                    ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4']
                  ).map(label => (
                    <span key={label}>{label}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Cảnh báo tồn kho */}
            <div className="alerts-card">
              <div className="alerts-header">
                <h3>⚠️ Cảnh báo tồn kho</h3>
                <span className="badge">{dashboardData.inventory.lowStock + dashboardData.inventory.outOfStock}</span>
              </div>
              <div className="alerts-list">
                {inventoryItems.filter(item => item.status !== 'normal').map(item => (
                  <div key={item.id} className="alert-item">
                    <div className="alert-info">
                      <h4>{item.name}</h4>
                      <p>Tồn kho: {item.currentStock} (Tối thiểu: {item.minStock})</p>
                    </div>
                    <div className={`alert-status ${item.status}`}>
                      {item.status === 'low' ? 'Sắp hết' : 'Hết hàng'}
                    </div>
                  </div>
                ))}
              </div>
              <button className="view-inventory-btn" onClick={()=>navigate("/pharmacy/products")}>Quản lý tồn kho →</button>
            </div>
          </div>

          {/* Cột phải - Đơn hàng và thông báo */}
          <div className="content-right">
            {/* Đơn hàng mới nhất */}
            <div className="orders-card">
              <div className="orders-header">
                <h3>📦 Đơn hàng mới nhất</h3>
                <button className="view-all-btn">Xem tất cả →</button>
              </div>
              <div className="orders-list">
                {recentOrders.map(order => (
                  <div key={order.id} className="order-item">
                    <div className="order-info">
                      <h4>#{order.id}</h4>
                      <p>{order.customer} • {formatPrice(order.amount)}</p>
                      <span className="order-items">{order.items.join(', ')}</span>
                    </div>
                    <div className="order-meta">
                      <span className="order-time">{order.time}</span>
                      <span className={`order-status ${order.status}`}>
                        {order.status === 'new' ? 'Mới' : 'Đang xử lý'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Thông báo quan trọng */}
            <div className="notifications-card">
              <div className="notifications-header">
                <h3>🔔 Thông báo quan trọng</h3>
              </div>
              <div className="notifications-list">
                <div className="notification-item urgent">
                  <div className="notification-icon">⚠️</div>
                  <div className="notification-content">
                    <h4>Đơn hàng cần xác nhận</h4>
                    <p>Bạn có 3 đơn hàng mới cần xác nhận trong 30 phút</p>
                    <span className="notification-time">5 phút trước</span>
                  </div>
                </div>
                <div className="notification-item info">
                  <div className="notification-icon">ℹ️</div>
                  <div className="notification-content">
                    <h4>Cập nhật thông tin sản phẩm</h4>
                    <p>Vitamin C 1000mg cần cập nhật thông tin mới</p>
                    <span className="notification-time">2 giờ trước</span>
                  </div>
                </div>
                <div className="notification-item success">
                  <div className="notification-icon">✅</div>
                  <div className="notification-content">
                    <h4>Đơn hàng đã hoàn thành</h4>
                    <p>5 đơn hàng đã được giao thành công</p>
                    <span className="notification-time">3 giờ trước</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hành động nhanh */}
            <div className="quick-actions-card">
              <h3>⚡ Hành động nhanh</h3>
              <div className="action-buttons">
                <button className="action-btn">
                  <span className="action-icon">➕</span>
                  Thêm sản phẩm
                </button>
                <button className="action-btn">
                  <span className="action-icon">📊</span>
                  Xem báo cáo
                </button>
                <button className="action-btn">
                  <span className="action-icon">📦</span>
                  Quản lý đơn
                </button>
                <button className="action-btn">
                  <span className="action-icon">🔄</span>
                  Cập nhật tồn kho
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyHome;