import React, { useState, useEffect } from 'react';
import { 
  FaChartLine, FaChartBar, FaChartPie, FaMoneyBillWave, 
  FaBox, FaClipboardCheck, FaTimesCircle, FaShieldAlt,
  FaCalendarAlt, FaFilter, FaDownload, FaSyncAlt
} from 'react-icons/fa';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import '../../assets/css/Distributor/report.css';

const DistributorReports = () => {
  const [revenueData, setRevenueData] = useState([]);
  const [timeRange, setTimeRange] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [blockchainComparison, setBlockchainComparison] = useState([]);

  // Màu sắc cho biểu đồ
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Giả lập dữ liệu báo cáo
  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = () => {
    setLoading(true);
    
    // Giả lập dữ liệu
    setTimeout(() => {
      // Dữ liệu doanh thu theo thời gian
      const mockRevenueData = timeRange === 'monthly' ? [
        { month: 'Tháng 1', revenue: 125000000, orders: 45, blockchainRevenue: 85000000, nonBlockchainRevenue: 40000000 },
        { month: 'Tháng 2', revenue: 145000000, orders: 52, blockchainRevenue: 105000000, nonBlockchainRevenue: 40000000 },
        { month: 'Tháng 3', revenue: 165000000, orders: 58, blockchainRevenue: 125000000, nonBlockchainRevenue: 40000000 },
        { month: 'Tháng 4', revenue: 185000000, orders: 65, blockchainRevenue: 145000000, nonBlockchainRevenue: 40000000 },
        { month: 'Tháng 5', revenue: 205000000, orders: 72, blockchainRevenue: 165000000, nonBlockchainRevenue: 40000000 },
        { month: 'Tháng 6', revenue: 225000000, orders: 78, blockchainRevenue: 185000000, nonBlockchainRevenue: 40000000 },
        { month: 'Tháng 7', revenue: 245000000, orders: 85, blockchainRevenue: 205000000, nonBlockchainRevenue: 40000000 },
        { month: 'Tháng 8', revenue: 265000000, orders: 92, blockchainRevenue: 225000000, nonBlockchainRevenue: 40000000 },
        { month: 'Tháng 9', revenue: 285000000, orders: 98, blockchainRevenue: 245000000, nonBlockchainRevenue: 40000000 },
        { month: 'Tháng 10', revenue: 305000000, orders: 105, blockchainRevenue: 265000000, nonBlockchainRevenue: 40000000 },
        { month: 'Tháng 11', revenue: 325000000, orders: 112, blockchainRevenue: 285000000, nonBlockchainRevenue: 40000000 },
        { month: 'Tháng 12', revenue: 345000000, orders: 118, blockchainRevenue: 305000000, nonBlockchainRevenue: 40000000 },
      ] : [
        { week: 'Tuần 1', revenue: 75000000, orders: 25, blockchainRevenue: 55000000, nonBlockchainRevenue: 20000000 },
        { week: 'Tuần 2', revenue: 80000000, orders: 28, blockchainRevenue: 60000000, nonBlockchainRevenue: 20000000 },
        { week: 'Tuần 3', revenue: 85000000, orders: 32, blockchainRevenue: 65000000, nonBlockchainRevenue: 20000000 },
        { week: 'Tuần 4', revenue: 90000000, orders: 35, blockchainRevenue: 70000000, nonBlockchainRevenue: 20000000 },
      ];

      // Sản phẩm bán chạy
      const topProducts = [
        { name: 'Paracetamol 500mg', sales: 12500, revenue: 150000000 },
        { name: 'Amoxicillin 250mg', sales: 9800, revenue: 181300000 },
        { name: 'Vitamin C 1000mg', sales: 8500, revenue: 80750000 },
        { name: 'Metformin 500mg', sales: 7200, revenue: 97200000 },
        { name: 'Aspirin 500mg', sales: 6500, revenue: 81250000 },
      ];

      // Thống kê đơn hàng
      const orderStats = {
        total: 285,
        completed: 250,
        cancelled: 15,
        pending: 10,
        processing: 10,
        completionRate: 87.7
      };

      // Lịch sử giao dịch blockchain
      const blockchainHistory = [
        { date: '2023-10-15', action: 'Xác thực lô hàng', product: 'Paracetamol 500mg', txHash: '0x4a8c5d87a2b3c9e1f0d8e7c2b3a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1' },
        { date: '2023-10-14', action: 'Tạo đơn hàng', pharmacy: 'Nhà thuốc Minh Anh', txHash: '0x5b9c6d87a2b3c9e1f0d8e7c2b3a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1' },
        { date: '2023-10-13', action: 'Xác thực lô hàng', product: 'Amoxicillin 250mg', txHash: '0x6c1d7e87a2b3c9e1f0d8e7c2b3a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1' },
        { date: '2023-10-12', action: 'Cập nhật trạng thái', order: 'ORD-2023-102', txHash: '0x7d2e8f87a2b3c9e1f0d8e7c2b3a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1' },
        { date: '2023-10-11', action: 'Tạo đơn hàng', pharmacy: 'Nhà thuốc Hồng Phúc', txHash: '0x8e3f9087a2b3c9e1f0d8e7c2b3a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1' },
      ];

      // So sánh doanh thu blockchain vs non-blockchain
      const blockchainVsNonBlockchain = [
        { name: 'Sản phẩm đã xác thực', value: 75, revenue: 265000000 },
        { name: 'Sản phẩm chưa xác thực', value: 25, revenue: 40000000 },
      ];

      setRevenueData(mockRevenueData);
      setStats({
        totalRevenue: 3450000000,
        avgOrderValue: 1250000,
        topProducts,
        orderStats,
        blockchainHistory,
        blockchainVsNonBlockchain
      });
      
      setBlockchainComparison([
        { metric: 'Tăng trưởng doanh thu', blockchain: '+28.5%', nonBlockchain: '+5.2%' },
        { metric: 'Tỷ lệ hoàn thành đơn hàng', blockchain: '94.8%', nonBlockchain: '82.3%' },
        { metric: 'Tỷ lệ sản phẩm trả về', blockchain: '0.8%', nonBlockchain: '3.5%' },
        { metric: 'Số lượng đơn hàng lặp lại', blockchain: '72.4%', nonBlockchain: '45.6%' },
      ]);

      setLoading(false);
    }, 1000);
  };

  // Định dạng số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Custom tooltip cho biểu đồ
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${timeRange === 'monthly' ? 'Tháng' : 'Tuần'}: ${label}`}</p>
          <p className="intro" style={{ color: '#0088FE' }}>
            Doanh thu: {formatCurrency(payload[0].value)}
          </p>
          <p className="intro" style={{ color: '#00C49F' }}>
            Đơn hàng: {payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom tooltip cho biểu đồ so sánh
  const ComparisonTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${payload[0].name}: ${payload[0].value}%`}</p>
          <p className="intro">
            Doanh thu: {formatCurrency(payload[0].payload.revenue)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Xử lý xuất báo cáo
  const handleExportReport = () => {
    // Giả lập xuất báo cáo
    alert('Tính năng xuất báo cáo đang được phát triển!');
  };

  // Xử lý lọc theo ngày
  const handleDateFilter = () => {
    if (startDate && endDate) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        alert(`Đã lọc dữ liệu từ ${startDate} đến ${endDate}`);
      }, 1000);
    }
  };

  return (
    <div className="reports">
      <header className="page-header">
        <h1><FaChartLine /> Báo cáo Doanh thu</h1>
        <p>Phân tích hiệu suất kinh doanh và lợi ích của blockchain</p>
      </header>

      {/* Bộ lọc và điều khiển */}
      <div className="report-controls">
        <div className="time-filter">
          <button 
            className={timeRange === 'monthly' ? 'btn btn-primary' : 'btn btn-outline'}
            onClick={() => setTimeRange('monthly')}
          >
            Theo tháng
          </button>
          <button 
            className={timeRange === 'weekly' ? 'btn btn-primary' : 'btn btn-outline'}
            onClick={() => setTimeRange('weekly')}
          >
            Theo tuần
          </button>
        </div>
        
        <div className="date-filter">
          <div className="filter-group">
            <label>Từ ngày:</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>Đến ngày:</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleDateFilter}
            disabled={!startDate || !endDate}
          >
            <FaFilter /> Lọc
          </button>
        </div>
        
        <div className="report-actions">
          <button className="btn btn-outline" onClick={fetchReportData}>
            <FaSyncAlt /> Làm mới
          </button>
          <button className="btn btn-primary" onClick={handleExportReport}>
            <FaDownload /> Xuất báo cáo
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : (
        <>
          {/* Tổng quan doanh thu */}
          <div className="revenue-overview">
            <div className="stat-card">
              <div className="stat-icon total">
                <FaMoneyBillWave />
              </div>
              <div className="stat-info">
                <h3>{formatCurrency(stats.totalRevenue || 0)}</h3>
                <p>Tổng doanh thu</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon avg">
                <FaChartLine />
              </div>
              <div className="stat-info">
                <h3>{formatCurrency(stats.avgOrderValue || 0)}</h3>
                <p>Giá trị đơn hàng trung bình</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon completed">
                <FaClipboardCheck />
              </div>
              <div className="stat-info">
                <h3>{stats.orderStats?.completed || 0}</h3>
                <p>Đơn hàng thành công</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon cancelled">
                <FaTimesCircle />
              </div>
              <div className="stat-info">
                <h3>{stats.orderStats?.cancelled || 0}</h3>
                <p>Đơn hàng bị hủy</p>
              </div>
            </div>
          </div>

          {/* Biểu đồ doanh thu theo thời gian */}
          <div className="chart-section">
            <h2><FaChartLine /> Doanh thu theo thời gian</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey={timeRange === 'monthly' ? 'month' : 'week'} />
                  <YAxis 
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#0088FE" 
                    name="Doanh thu" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#00C49F" 
                    name="Số đơn hàng" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* So sánh doanh thu blockchain vs non-blockchain */}
          <div className="comparison-section">
            <h2><FaShieldAlt /> So sánh doanh thu: Sản phẩm đã xác thực vs Chưa xác thực</h2>
            <div className="comparison-charts">
              <div className="pie-chart">
                <h3>Phân bổ doanh thu</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.blockchainVsNonBlockchain || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.blockchainVsNonBlockchain?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<ComparisonTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="bar-chart">
                <h3>Doanh thu chi tiết</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={timeRange === 'monthly' ? 'month' : 'week'} />
                    <YAxis 
                      tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} 
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="blockchainRevenue" name="Sản phẩm đã xác thực" fill="#0088FE" />
                    <Bar dataKey="nonBlockchainRevenue" name="Sản phẩm chưa xác thực" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="comparison-table">
              <h3>Chỉ số hiệu suất so sánh</h3>
              <table>
                <thead>
                  <tr>
                    <th>Chỉ số</th>
                    <th>Sản phẩm đã xác thực</th>
                    <th>Sản phẩm chưa xác thực</th>
                  </tr>
                </thead>
                <tbody>
                  {blockchainComparison.map((item, index) => (
                    <tr key={index}>
                      <td>{item.metric}</td>
                      <td className="positive">{item.blockchain}</td>
                      <td className="negative">{item.nonBlockchain}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sản phẩm bán chạy */}
          <div className="top-products-section">
            <h2><FaChartBar /> Top sản phẩm bán chạy</h2>
            <div className="products-chart">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.topProducts || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} 
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={150}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip 
                    formatter={(value) => formatCurrency(value)} 
                  />
                  <Legend />
                  <Bar dataKey="revenue" name="Doanh thu" fill="#0088FE" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Thống kê đơn hàng */}
          <div className="order-stats-section">
            <h2><FaClipboardCheck /> Thống kê đơn hàng</h2>
            <div className="stats-grid">
              <div className="stats-card">
                <h3>Tổng số đơn hàng</h3>
                <div className="stat-number">{stats.orderStats?.total || 0}</div>
              </div>
              <div className="stats-card">
                <h3>Đơn hàng thành công</h3>
                <div className="stat-number success">{stats.orderStats?.completed || 0}</div>
                <div className="stat-percentage">{stats.orderStats?.completionRate || 0}%</div>
              </div>
              <div className="stats-card">
                <h3>Đơn hàng bị hủy</h3>
                <div className="stat-number danger">{stats.orderStats?.cancelled || 0}</div>
              </div>
              <div className="stats-card">
                <h3>Đang xử lý</h3>
                <div className="stat-number warning">{stats.orderStats?.processing + stats.orderStats?.pending || 0}</div>
              </div>
            </div>
          </div>

          {/* Lịch sử giao dịch blockchain */}
          <div className="blockchain-history">
            <h2><FaShieldAlt /> Lịch sử giao dịch blockchain gần đây</h2>
            <div className="history-table">
              <table>
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Hành động</th>
                    <th>Chi tiết</th>
                    <th>Transaction Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.blockchainHistory?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.date}</td>
                      <td>{item.action}</td>
                      <td>
                        {item.product && `Sản phẩm: ${item.product}`}
                        {item.pharmacy && `Nhà thuốc: ${item.pharmacy}`}
                        {item.order && `Đơn hàng: ${item.order}`}
                      </td>
                      <td className="tx-hash">{item.txHash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DistributorReports;