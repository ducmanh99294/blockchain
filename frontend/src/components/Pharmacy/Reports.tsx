// pages/PharmacyReports.js
import React, { useState } from 'react';
import '../../assets/css/Pharmacy/reports.css';


const PharmacyReports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('month'); // day, week, month
  const [reportType, setReportType] = useState('revenue'); // revenue, products, inventory

  // Dữ liệu mẫu báo cáo
  const [reportsData, _setReportsData] = useState({
    revenue: {
      daily: [1200000, 1850000, 2200000, 1750000, 2500000, 3000000, 2800000],
      weekly: [12500000, 11800000, 13200000, 14500000, 15600000, 14800000, 15200000],
      monthly: [285000000, 275000000, 290000000, 265000000, 310000000, 295000000]
    },
    products: [
      {
        id: 1,
        name: "Panadol Extra",
        sold: 1245,
        revenue: 118275000,
        stock: 15,
        blockchain: 'verified',
        growth: 15.2
      },
      {
        id: 2,
        name: "Vitamin C 1000mg",
        sold: 892,
        revenue: 133800000,
        stock: 5,
        blockchain: 'verified',
        growth: 8.7
      },
      {
        id: 3,
        name: "Amoxicillin 500mg",
        sold: 345,
        revenue: 29325000,
        stock: 0,
        blockchain: 'pending',
        growth: -2.3
      },
      {
        id: 4,
        name: "Omeprazole 20mg",
        sold: 567,
        revenue: 62370000,
        stock: 25,
        blockchain: 'verified',
        growth: 12.1
      },
      {
        id: 5,
        name: "Kem dưỡng da Eucerin",
        sold: 432,
        revenue: 95040000,
        stock: 20,
        blockchain: 'not_verified',
        growth: 5.4
      }
    ],
    inventory: {
      totalProducts: 156,
      lowStock: 8,
      outOfStock: 3,
      needRestock: 5,
      totalValue: 185000000
    },
    blockchainComparison: {
      verified: {
        products: 85,
        revenue: 875000000,
        avgSale: 10294117,
        growth: 12.4
      },
      non_verified: {
        products: 71,
        revenue: 425000000,
        avgSale: 5985915,
        growth: 3.2
      }
    }
  });

  // Format tiền
  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  // Format số
  const formatNumber = (num: any) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  // Lấy dữ liệu biểu đồ theo timeRange
  const getChartData = () => {
    const data = reportsData.revenue[timeRange === 'day' ? 'daily' : timeRange === 'week' ? 'weekly' : 'monthly'];
    const labels = timeRange === 'day' 
      ? ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
      : timeRange === 'week'
      ? ['Tuần 1', 'Tuần 2', 'Tuần 3', 'Tuần 4', 'Tuần 5', 'Tuần 6', 'Tuần 7']
      : ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'];

    return { data, labels };
  };

  const { data: chartData, labels: chartLabels } = getChartData();
  const maxValue = Math.max(...chartData);

  // Tính toán tổng doanh thu
  const totalRevenue = chartData.reduce((sum, value) => sum + value, 0);
  const avgRevenue = totalRevenue / chartData.length;

  // Hiển thị trạng thái blockchain
  const renderBlockchainStatus = (status: any) => {
    switch (status) {
      case 'verified':
        return <span className="blockchain-badge verified">✅ Verified</span>;
      case 'pending':
        return <span className="blockchain-badge pending">⏳ Pending</span>;
      default:
        return <span className="blockchain-badge not-verified">❌ Not Verified</span>;
    }
  };

  // Hiển thị tăng trưởng
  const renderGrowth = (growth: any) => {
    const isPositive = growth >= 0;
    return (
      <span className={`growth ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? '↗' : '↘'} {Math.abs(growth)}%
      </span>
    );
  };

  return (
    <div className="reports-page">
      <div className="reports-container">
        {/* Header */}
        <div className="reports-header">
          <div className="header-left">
            <h1>Báo Cáo Doanh Thu & Phân Tích</h1>
            <p>Phân tích hiệu suất kinh doanh với dữ liệu blockchain</p>
          </div>
          <div className="header-right">
            <div className="stats">
              <div className="stat">
                <span className="stat-number">{formatPrice(totalRevenue)}</span>
                <span className="stat-label">Tổng doanh thu</span>
              </div>
              <div className="stat">
                <span className="stat-number">{formatPrice(avgRevenue)}</span>
                <span className="stat-label">Trung bình</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="filter-section">
          <div className="filter-group">
            <label>Thời gian:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${timeRange === 'day' ? 'active' : ''}`}
                onClick={() => setTimeRange('day')}
              >
                Ngày
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
          </div>

          <div className="filter-group">
            <label>Loại báo cáo:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${reportType === 'revenue' ? 'active' : ''}`}
                onClick={() => setReportType('revenue')}
              >
                Doanh thu
              </button>
              <button
                className={`filter-btn ${reportType === 'products' ? 'active' : ''}`}
                onClick={() => setReportType('products')}
              >
                Sản phẩm
              </button>
              <button
                className={`filter-btn ${reportType === 'inventory' ? 'active' : ''}`}
                onClick={() => setReportType('inventory')}
              >
                Tồn kho
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="reports-content">
          {/* Biểu đồ doanh thu */}
          {reportType === 'revenue' && (
            <div className="chart-section">
              <div className="chart-card">
                <div className="chart-header">
                  <h2>Biểu đồ Doanh thu</h2>
                  <span className="chart-subtitle">
                    {timeRange === 'day' ? 'Theo ngày' : timeRange === 'week' ? 'Theo tuần' : 'Theo tháng'}
                  </span>
                </div>
                <div className="chart-container">
                  <div className="chart-bars">
                    {chartData.map((value, index) => (
                      <div key={index} className="chart-bar-container">
                        <div
                          className="chart-bar"
                          style={{ height: `${(value / maxValue) * 100}%` }}
                        >
                          <span className="bar-value">{formatPrice(value)}</span>
                        </div>
                        <span className="bar-label">{chartLabels[index]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Blockchain Comparison */}
              <div className="comparison-card">
                <h3>So sánh Doanh thu: Verified vs Non-verified</h3>
                <div className="comparison-grid">
                  <div className="comparison-item verified">
                    <h4>Sản phẩm Verified</h4>
                    <div className="comparison-stats">
                      <div className="stat">
                        <span className="value">{reportsData.blockchainComparison.verified.products}</span>
                        <span className="label">Sản phẩm</span>
                      </div>
                      <div className="stat">
                        <span className="value">{formatPrice(reportsData.blockchainComparison.verified.revenue)}</span>
                        <span className="label">Doanh thu</span>
                      </div>
                      <div className="stat">
                        <span className="value">{formatPrice(reportsData.blockchainComparison.verified.avgSale)}</span>
                        <span className="label">Trung bình</span>
                      </div>
                      <div className="stat">
                        <span className="value">{renderGrowth(reportsData.blockchainComparison.verified.growth)}</span>
                        <span className="label">Tăng trưởng</span>
                      </div>
                    </div>
                  </div>

                  <div className="comparison-item non-verified">
                    <h4>Sản phẩm Non-verified</h4>
                    <div className="comparison-stats">
                      <div className="stat">
                        <span className="value">{reportsData.blockchainComparison.non_verified.products}</span>
                        <span className="label">Sản phẩm</span>
                      </div>
                      <div className="stat">
                        <span className="value">{formatPrice(reportsData.blockchainComparison.non_verified.revenue)}</span>
                        <span className="label">Doanh thu</span>
                      </div>
                      <div className="stat">
                        <span className="value">{formatPrice(reportsData.blockchainComparison.non_verified.avgSale)}</span>
                        <span className="label">Trung bình</span>
                      </div>
                      <div className="stat">
                        <span className="value">{renderGrowth(reportsData.blockchainComparison.non_verified.growth)}</span>
                        <span className="label">Tăng trưởng</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="comparison-insights">
                  <h4>📊 Nhận định:</h4>
                  <p>
                    Sản phẩm được xác minh blockchain có doanh thu cao hơn{' '}
                    <strong>
                      {Math.round((reportsData.blockchainComparison.verified.avgSale / reportsData.blockchainComparison.non_verified.avgSale - 1) * 100)}%
                    </strong>{' '}
                    so với sản phẩm chưa xác minh, chứng tỏ khách hàng ưa chuộng tính minh bạch.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Top sản phẩm bán chạy */}
          {reportType === 'products' && (
            <div className="products-section">
              <div className="products-card">
                <h2>Top Sản phẩm Bán chạy</h2>
                <div className="products-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Đã bán</th>
                        <th>Doanh thu</th>
                        <th>Tồn kho</th>
                        <th>Blockchain</th>
                        <th>Tăng trưởng</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportsData.products.map(product => (
                        <tr key={product.id}>
                          <td>
                            <div className="product-cell">
                              <span className="product-name">{product.name}</span>
                            </div>
                          </td>
                          <td>
                            <span className="sold-count">{formatNumber(product.sold)}</span>
                          </td>
                          <td>
                            <span className="revenue-amount">{formatPrice(product.revenue)}</span>
                          </td>
                          <td>
                            <div className="stock-cell">
                              <span className={`stock-status ${product.stock === 0 ? 'out' : product.stock <= 10 ? 'low' : 'good'}`}>
                                {product.stock}
                              </span>
                            </div>
                          </td>
                          <td>
                            {renderBlockchainStatus(product.blockchain)}
                          </td>
                          <td>
                            {renderGrowth(product.growth)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Performance Insights */}
              <div className="insights-card">
                <h3>Phân tích Hiệu suất</h3>
                <div className="insights-grid">
                  <div className="insight-item">
                    <h4>🚀 Sản phẩm Verified bán chạy nhất</h4>
                    <p>
                      {reportsData.products.filter(p => p.blockchain === 'verified').length}/
                      {reportsData.products.length} sản phẩm verified nằm trong top bán chạy
                    </p>
                  </div>
                  <div className="insight-item">
                    <h4>💰 Chênh lệch doanh thu</h4>
                    <p>
                      Sản phẩm verified có doanh thu trung bình cao hơn{' '}
                      {Math.round((
                        reportsData.products.filter(p => p.blockchain === 'verified')
                          .reduce((sum, p) => sum + (p.revenue / p.sold), 0) /
                        reportsData.products.filter(p => p.blockchain === 'verified').length
                      ) / (
                        reportsData.products.filter(p => p.blockchain !== 'verified')
                          .reduce((sum, p) => sum + (p.revenue / p.sold), 0) /
                        reportsData.products.filter(p => p.blockchain !== 'verified').length
                      ) * 100 - 100)}%
                    </p>
                  </div>
                  <div className="insight-item">
                    <h4>📈 Tăng trưởng ưu thế</h4>
                    <p>
                      Sản phẩm verified có tốc độ tăng trưởng trung bình{' '}
                      {Math.round(
                        reportsData.products.filter(p => p.blockchain === 'verified')
                          .reduce((sum, p) => sum + p.growth, 0) /
                        reportsData.products.filter(p => p.blockchain === 'verified').length
                      )}% so với {Math.round(
                        reportsData.products.filter(p => p.blockchain !== 'verified')
                          .reduce((sum, p) => sum + p.growth, 0) /
                        reportsData.products.filter(p => p.blockchain !== 'verified').length
                      )}% của non-verified
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tồn kho */}
          {reportType === 'inventory' && (
            <div className="inventory-section">
              <div className="inventory-card">
                <h2>Quản lý Tồn kho</h2>
                <div className="inventory-stats">
                  <div className="inventory-stat">
                    <span className="stat-number">{reportsData.inventory.totalProducts}</span>
                    <span className="stat-label">Tổng sản phẩm</span>
                  </div>
                  <div className="inventory-stat warning">
                    <span className="stat-number">{reportsData.inventory.lowStock}</span>
                    <span className="stat-label">Sắp hết hàng</span>
                  </div>
                  <div className="inventory-stat danger">
                    <span className="stat-number">{reportsData.inventory.outOfStock}</span>
                    <span className="stat-label">Hết hàng</span>
                  </div>
                  <div className="inventory-stat">
                    <span className="stat-number">{formatPrice(reportsData.inventory.totalValue)}</span>
                    <span className="stat-label">Tổng giá trị</span>
                  </div>
                </div>

                <div className="inventory-table">
                  <h3>Sản phẩm cần chú ý</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Tồn kho</th>
                        <th>Trạng thái</th>
                        <th>Blockchain</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportsData.products
                        .filter(product => product.stock <= 10)
                        .map(product => (
                          <tr key={product.id}>
                            <td>
                              <span className="product-name">{product.name}</span>
                            </td>
                            <td>
                              <span className={`stock-amount ${product.stock === 0 ? 'out' : 'low'}`}>
                                {product.stock}
                              </span>
                            </td>
                            <td>
                              <span className={`stock-status ${product.stock === 0 ? 'out' : 'low'}`}>
                                {product.stock === 0 ? 'Hết hàng' : 'Sắp hết'}
                              </span>
                            </td>
                            <td>
                              {renderBlockchainStatus(product.blockchain)}
                            </td>
                            <td>
                              <button className="action-btn restock">
                                Đặt hàng
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Blockchain Inventory Analysis */}
              <div className="analysis-card">
                <h3>Phân tích Tồn kho theo Blockchain</h3>
                <div className="analysis-content">
                  <div className="analysis-chart">
                    <div className="chart-row">
                      <span className="chart-label">Verified Products</span>
                      <div className="chart-bar-horizontal">
                        <div 
                          className="chart-fill verified"
                          style={{ width: '70%' }}
                        >
                          <span>70% Tồn kho ổn định</span>
                        </div>
                      </div>
                    </div>
                    <div className="chart-row">
                      <span className="chart-label">Non-verified Products</span>
                      <div className="chart-bar-horizontal">
                        <div 
                          className="chart-fill non-verified"
                          style={{ width: '45%' }}
                        >
                          <span>45% Tồn kho ổn định</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="analysis-insights">
                    <h4>📈 Nhận định:</h4>
                    <ul>
                      <li>Sản phẩm verified có tỷ lệ tồn kho ổn định cao hơn 25%</li>
                      <li>Non-verified products thường xuyên rơi vào tình trạng hết hàng</li>
                      <li>Khách hàng ưa chuộng sản phẩm verified dẫn đến nhu cầu ổn định hơn</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="export-section">
          <h3>Xuất báo cáo</h3>
          <div className="export-buttons">
            <button className="export-btn">
              📄 Xuất PDF
            </button>
            <button className="export-btn">
              📊 Xuất Excel
            </button>
            <button className="export-btn">
              ⛓️ Xuất Blockchain Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyReports;