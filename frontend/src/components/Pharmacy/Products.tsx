// pages/PharmacyProductManagement.js
import React, { useState } from 'react';
import '../../assets/css/Pharmacy/products.css';

const PharmacyProduct = () => {
  const [viewMode, setViewMode] = useState('grid'); // grid or table
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Dữ liệu mẫu sản phẩm
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Panadol Extra",
      description: "Giảm đau, hạ sốt nhanh chóng, hiệu quả cho các cơn đau nhẹ đến trung bình",
      price: 95000,
      originalPrice: 120000,
      image: "https://via.placeholder.com/200x200/4CAF50/ffffff?text=Panadol+Extra",
      category: "Giảm đau",
      stock: 15,
      minStock: 20,
      manufacturer: "GSK Pharmaceuticals",
      distributor: "Công ty Dược phẩm Việt Nam",
      expiryDate: "2024-12-31",
      usage: "Uống 1-2 viên mỗi 4-6 giờ khi cần",
      sideEffects: "Buồn nôn, chóng mặt nhẹ",
      blockchainStatus: "verified",
      transactionHash: "0x4a7c1b9e2f8d3a6b5c4e8f7a2b3c6d9e1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c9",
      ipfsCID: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
      blockchainTimestamp: "2024-03-10T14:30:00Z",
      registeredDate: "2024-03-01"
    },
    {
      id: 2,
      name: "Vitamin C 1000mg",
      description: "Bổ sung Vitamin C, tăng cường sức đề kháng, chống oxy hóa",
      price: 150000,
      originalPrice: 180000,
      image: "https://via.placeholder.com/200x200/FF9800/ffffff?text=Vitamin+C",
      category: "Vitamin",
      stock: 5,
      minStock: 15,
      manufacturer: "Nature's Bounty Inc.",
      distributor: "Công ty TNHH Dược phẩm ABC",
      expiryDate: "2025-06-30",
      usage: "Uống 1 viên mỗi ngày sau bữa ăn",
      sideEffects: "Tiêu chảy nếu dùng quá liều",
      blockchainStatus: "pending",
      transactionHash: "",
      ipfsCID: "",
      blockchainTimestamp: "",
      registeredDate: "2024-03-15"
    },
    {
      id: 3,
      name: "Amoxicillin 500mg",
      description: "Kháng sinh điều trị nhiễm khuẩn, cần kê đơn",
      price: 85000,
      image: "https://via.placeholder.com/200x200/9C27B0/ffffff?text=Amoxicillin",
      category: "Kháng sinh",
      stock: 0,
      minStock: 10,
      manufacturer: "Pfizer Pharmaceuticals",
      distributor: "Công ty Dược phẩm Quốc tế",
      expiryDate: "2024-03-31",
      usage: "Uống theo chỉ định của bác sĩ",
      sideEffects: "Dị ứng, rối loạn tiêu hóa",
      blockchainStatus: "not_registered",
      transactionHash: "",
      ipfsCID: "",
      blockchainTimestamp: "",
      registeredDate: "2024-03-12"
    },
    {
      id: 4,
      name: "Omeprazole 20mg",
      description: "Điều trị trào ngược dạ dày, giảm tiết acid",
      price: 110000,
      image: "https://via.placeholder.com/200x200/607D8B/ffffff?text=Omeprazole",
      category: "Tiêu hóa",
      stock: 25,
      minStock: 15,
      manufacturer: "AstraZeneca",
      distributor: "Công ty Dược phẩm Medico",
      expiryDate: "2024-11-30",
      usage: "Uống 1 viên mỗi ngày trước bữa ăn",
      sideEffects: "Đau đầu, buồn nôn",
      blockchainStatus: "verified",
      transactionHash: "0x8b3c6d9e1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c94a7c1b9e2f8d3a6b5c4e8f7",
      ipfsCID: "QmYH5g2W8Kp4L3m2N1B6V7C9X8Z2Q1W4E5R6T7Y8U9I0O1P2",
      blockchainTimestamp: "2024-02-28T09:15:00Z",
      registeredDate: "2024-02-20"
    }
  ]);

  // Format tiền
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  // Format ngày
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Hiển thị trạng thái blockchain
  const renderBlockchainStatus = (status) => {
    switch (status) {
      case 'verified':
        return (
          <span className="status-badge verified">
            ✅ Verified
          </span>
        );
      case 'pending':
        return (
          <span className="status-badge pending">
            ⏳ Pending
          </span>
        );
      default:
        return (
          <span className="status-badge not-registered">
            ❌ Not Registered
          </span>
        );
    }
  };

  // Hiển thị trạng thái tồn kho
  const renderStockStatus = (stock, minStock) => {
    if (stock === 0) {
      return <span className="stock-badge out-of-stock">Hết hàng</span>;
    } else if (stock <= minStock) {
      return <span className="stock-badge low-stock">Sắp hết</span>;
    } else {
      return <span className="stock-badge in-stock">Còn hàng</span>;
    }
  };

  // Mở modal chi tiết
  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
  };

  // Mở modal đăng ký blockchain
  const openRegisterModal = (product) => {
    setSelectedProduct(product);
    setShowRegisterModal(true);
  };

  // Đăng ký lên blockchain
  const registerOnBlockchain = async (productId) => {
    // Giả lập gọi API đăng ký blockchain
    alert(`Đang đăng ký sản phẩm ${productId} lên blockchain...`);
    
    // Simulate blockchain registration
    setTimeout(() => {
      setProducts(products.map(product =>
        product.id === productId
          ? {
              ...product,
              blockchainStatus: 'pending',
              transactionHash: '0x' + Math.random().toString(16).substr(2, 64)
            }
          : product
      ));
      alert('Đã gửi yêu cầu đăng ký lên blockchain!');
      setShowRegisterModal(false);
    }, 2000);
  };

  // Xác minh lại trên blockchain
  const verifyOnBlockchain = async (productId) => {
    // Giả lập gọi API xác minh
    alert(`Đang xác minh sản phẩm ${productId} trên blockchain...`);
    
    // Simulate blockchain verification
    setTimeout(() => {
      setProducts(products.map(product =>
        product.id === productId
          ? {
              ...product,
              blockchainStatus: 'verified',
              blockchainTimestamp: new Date().toISOString()
            }
          : product
      ));
      alert('Xác minh thành công! Dữ liệu hợp lệ trên blockchain.');
    }, 1500);
  };

  return (
    <div className="product-management-page">
      <div className="management-container">
        {/* Header */}
        <div className="management-header">
          <div className="header-left">
            <h1>Quản Lý Sản Phẩm</h1>
            <p>Quản lý danh sách sản phẩm và xác minh blockchain</p>
          </div>
          <div className="header-right">
            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                🏠 Grid
              </button>
              <button
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                📋 Table
              </button>
            </div>
            <button className="add-product-btn">
              ＋ Thêm sản phẩm
            </button>
          </div>
        </div>

        {/* Thống kê nhanh */}
        <div className="quick-stats">
          <div className="stat-item">
            <span className="stat-number">{products.length}</span>
            <span className="stat-label">Tổng sản phẩm</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {products.filter(p => p.blockchainStatus === 'verified').length}
            </span>
            <span className="stat-label">Đã xác minh</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {products.filter(p => p.stock === 0).length}
            </span>
            <span className="stat-label">Hết hàng</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">
              {products.filter(p => p.stock > 0 && p.stock <= p.minStock).length}
            </span>
            <span className="stat-label">Sắp hết</span>
          </div>
        </div>

        {/* Danh sách sản phẩm */}
        {viewMode === 'grid' ? (
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                  <div className="product-badges">
                    {renderStockStatus(product.stock, product.minStock)}
                    {renderBlockchainStatus(product.blockchainStatus)}
                  </div>
                </div>

                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-category">{product.category}</p>
                  
                  <div className="product-details">
                    <div className="detail-row">
                      <span>Giá bán:</span>
                      <span className="product-price">{formatPrice(product.price)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Tồn kho:</span>
                      <span>{product.stock} / {product.minStock}</span>
                    </div>
                    <div className="detail-row">
                      <span>Nhà phân phối:</span>
                      <span className="distributor">{product.distributor}</span>
                    </div>
                  </div>

                  <div className="product-actions">
                    <button
                      className="action-btn view-details"
                      onClick={() => openProductDetail(product)}
                    >
                      Xem chi tiết
                    </button>
                    {product.blockchainStatus !== 'verified' && (
                      <button
                        className="action-btn register"
                        onClick={() => openRegisterModal(product)}
                      >
                        {product.blockchainStatus === 'pending' ? 'Kiểm tra' : 'Đăng ký'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="products-table">
            <table>
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Giá bán</th>
                  <th>Tồn kho</th>
                  <th>Nhà phân phối</th>
                  <th>Blockchain</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div className="product-cell">
                        <img src={product.image} alt={product.name} />
                        <div>
                          <div className="product-name">{product.name}</div>
                          <div className="product-category">{product.category}</div>
                        </div>
                      </div>
                    </td>
                    <td>{formatPrice(product.price)}</td>
                    <td>
                      <div className="stock-cell">
                        {product.stock}
                        {renderStockStatus(product.stock, product.minStock)}
                      </div>
                    </td>
                    <td>
                      <span className="distributor">{product.distributor}</span>
                    </td>
                    <td>
                      {renderBlockchainStatus(product.blockchainStatus)}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="action-btn view"
                          onClick={() => openProductDetail(product)}
                          title="Xem chi tiết"
                        >
                          👁️
                        </button>
                        {product.blockchainStatus !== 'verified' && (
                          <button
                            className="action-btn register"
                            onClick={() => openRegisterModal(product)}
                            title={product.blockchainStatus === 'pending' ? 'Kiểm tra trạng thái' : 'Đăng ký blockchain'}
                          >
                            {product.blockchainStatus === 'pending' ? '🔄' : '⛓️'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal chi tiết sản phẩm */}
        {showDetailModal && selectedProduct && (
          <div className="modal-overlay">
            <div className="product-detail-modal">
              <div className="modal-header">
                <h2>Chi tiết sản phẩm</h2>
                <button className="close-btn" onClick={() => setShowDetailModal(false)}>×</button>
              </div>

              <div className="modal-content">
                <div className="product-main-info">
                  <img src={selectedProduct.image} alt={selectedProduct.name} />
                  <div className="product-header">
                    <h3>{selectedProduct.name}</h3>
                    <p>{selectedProduct.category}</p>
                    <div className="product-badges">
                      {renderStockStatus(selectedProduct.stock, selectedProduct.minStock)}
                      {renderBlockchainStatus(selectedProduct.blockchainStatus)}
                    </div>
                  </div>
                </div>

                <div className="product-details-grid">
                  <div className="detail-section">
                    <h4>Thông tin cơ bản</h4>
                    <div className="detail-row">
                      <span>Giá bán:</span>
                      <span>{formatPrice(selectedProduct.price)}</span>
                    </div>
                    <div className="detail-row">
                      <span>Tồn kho:</span>
                      <span>{selectedProduct.stock} (Tối thiểu: {selectedProduct.minStock})</span>
                    </div>
                    <div className="detail-row">
                      <span>Nhà sản xuất:</span>
                      <span>{selectedProduct.manufacturer}</span>
                    </div>
                    <div className="detail-row">
                      <span>Nhà phân phối:</span>
                      <span>{selectedProduct.distributor}</span>
                    </div>
                    <div className="detail-row">
                      <span>HSD:</span>
                      <span>{formatDate(selectedProduct.expiryDate)}</span>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Thông tin sử dụng</h4>
                    <div className="detail-row">
                      <span>Công dụng:</span>
                      <span>{selectedProduct.description}</span>
                    </div>
                    <div className="detail-row">
                      <span>Cách dùng:</span>
                      <span>{selectedProduct.usage}</span>
                    </div>
                    <div className="detail-row">
                      <span>Tác dụng phụ:</span>
                      <span>{selectedProduct.sideEffects}</span>
                    </div>
                  </div>

                  {selectedProduct.blockchainStatus !== 'not_registered' && (
                    <div className="detail-section">
                      <h4>Thông tin Blockchain</h4>
                      {selectedProduct.transactionHash && (
                        <div className="detail-row">
                          <span>Transaction Hash:</span>
                          <a
                            href={`https://etherscan.io/tx/${selectedProduct.transactionHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="blockchain-link"
                          >
                            {selectedProduct.transactionHash.slice(0, 16)}... ↗
                          </a>
                        </div>
                      )}
                      {selectedProduct.ipfsCID && (
                        <div className="detail-row">
                          <span>IPFS CID:</span>
                          <a
                            href={`https://ipfs.io/ipfs/${selectedProduct.ipfsCID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="blockchain-link"
                          >
                            {selectedProduct.ipfsCID.slice(0, 16)}... ↗
                          </a>
                        </div>
                      )}
                      {selectedProduct.blockchainTimestamp && (
                        <div className="detail-row">
                          <span>Xác minh lúc:</span>
                          <span>{new Date(selectedProduct.blockchainTimestamp).toLocaleString('vi-VN')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="modal-actions">
                  <button
                    className="action-btn verify"
                    onClick={() => verifyOnBlockchain(selectedProduct.id)}
                  >
                    🔍 Verify on Blockchain
                  </button>
                  <button
                    className="action-btn close"
                    onClick={() => setShowDetailModal(false)}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal đăng ký blockchain */}
        {showRegisterModal && selectedProduct && (
          <div className="modal-overlay">
            <div className="register-modal">
              <div className="modal-header">
                <h2>Đăng ký lên Blockchain</h2>
                <button className="close-btn" onClick={() => setShowRegisterModal(false)}>×</button>
              </div>

              <div className="modal-content">
                <div className="product-preview">
                  <img src={selectedProduct.image} alt={selectedProduct.name} />
                  <div>
                    <h3>{selectedProduct.name}</h3>
                    <p>{selectedProduct.category}</p>
                  </div>
                </div>

                <div className="registration-info">
                  <h4>Thông tin sẽ được ghi lên blockchain:</h4>
                  <ul>
                    <li>Tên sản phẩm: {selectedProduct.name}</li>
                    <li>Nhà sản xuất: {selectedProduct.manufacturer}</li>
                    <li>Nhà phân phối: {selectedProduct.distributor}</li>
                    <li>Hạn sử dụng: {formatDate(selectedProduct.expiryDate)}</li>
                    <li>Mã sản phẩm: {selectedProduct.id}</li>
                  </ul>

                  <div className="blockchain-note">
                    <p>⚠️ Lưu ý: Dữ liệu một khi đã ghi lên blockchain sẽ không thể thay đổi.</p>
                    <p>Chi phí gas: ~0.002 ETH (ước tính)</p>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    className="action-btn confirm"
                    onClick={() => registerOnBlockchain(selectedProduct.id)}
                  >
                    ⛓️ Xác nhận đăng ký
                  </button>
                  <button
                    className="action-btn cancel"
                    onClick={() => setShowRegisterModal(false)}
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PharmacyProduct;