// pages/PharmacySupplierOrders.js
import React, { useState } from 'react';
import '../../assets/css/Pharmacy/supplier.css';


const PharmacySupplierOrders: React.FC = () => {
  const [activeTab, setActiveTab] = useState('catalog'); // catalog, orders
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // Dữ liệu mẫu sản phẩm từ nhà phân phối
  const [supplierProducts, _setSupplierProducts] = useState([
    {
      id: 'SP001',
      name: "Panadol Extra",
      description: "Giảm đau, hạ sốt nhanh chóng",
      image: "https://via.placeholder.com/200x200/4CAF50/ffffff?text=Panadol+Extra",
      importPrice: 65000,
      retailPrice: 95000,
      distributor: "Công ty Dược phẩm Việt Nam",
      minOrder: 10,
      stock: 500,
      batchNumber: "BATCH-2024-001",
      expiryDate: "2025-12-31",
      blockchain: {
        status: 'verified',
        transactionHash: '0x4a7c1b9e2f8d3a6b5c4e8f7a2b3c6d9e1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c9',
        ipfsCID: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
        batchHash: '0x8d3a6b5c4e8f7a2b3c6d9e1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c94a7c1b9e2'
      }
    },
    {
      id: 'SP002',
      name: "Vitamin C 1000mg",
      description: "Bổ sung Vitamin C, tăng cường sức đề kháng",
      image: "https://via.placeholder.com/200x200/FF9800/ffffff?text=Vitamin+C",
      importPrice: 105000,
      retailPrice: 150000,
      distributor: "Công ty TNHH Dược phẩm ABC",
      minOrder: 5,
      stock: 300,
      batchNumber: "BATCH-2024-002",
      expiryDate: "2025-06-30",
      blockchain: {
        status: 'verified',
        transactionHash: '0x8b3c6d9e1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c94a7c1b9e2f8d3a6b5c4e8f7',
        ipfsCID: 'QmYH5g2W8Kp4L3m2N1B6V7C9X8Z2Q1W4E5R6T7Y8U9I0O1P2',
        batchHash: '0x6d9e1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c94a7c1b9e2f8d3a6b5c4e8f7a2b3'
      }
    },
    {
      id: 'SP003',
      name: "Amoxicillin 500mg",
      description: "Kháng sinh điều trị nhiễm khuẩn",
      image: "https://via.placeholder.com/200x200/9C27B0/ffffff?text=Amoxicillin",
      importPrice: 55000,
      retailPrice: 85000,
      distributor: "Công ty Dược phẩm Quốc tế",
      minOrder: 20,
      stock: 200,
      batchNumber: "BATCH-2024-003",
      expiryDate: "2024-12-31",
      prescription: true,
      blockchain: {
        status: 'pending',
        transactionHash: '0x3c6d9e1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c94a7c1b9e2f8d3a6b5c4e8f7a2',
        ipfsCID: 'QmZ2X4Y6W8Kp4L3m2N1B6V7C9X8Z2Q1W4E5R6T7Y8U9I0O1P2',
        batchHash: '0x9e1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c94a7c1b9e2f8d3a6b5c4e8f7a2b3c6'
      }
    },
    {
      id: 'SP004',
      name: "Omeprazole 20mg",
      description: "Điều trị trào ngược dạ dày",
      image: "https://via.placeholder.com/200x200/607D8B/ffffff?text=Omeprazole",
      importPrice: 75000,
      retailPrice: 110000,
      distributor: "Công ty Dược phẩm Medico",
      minOrder: 15,
      stock: 150,
      batchNumber: "BATCH-2024-004",
      expiryDate: "2024-11-30",
      blockchain: {
        status: 'verified',
        transactionHash: '0x1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c94a7c1b9e2f8d3a6b5c4e8f7a2b3c6d9',
        ipfsCID: 'QmD4X6Y8W0Kp4L3m2N1B6V7C9X8Z2Q1W4E5R6T7Y8U9I0O1P2',
        batchHash: '0x5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c94a7c1b9e2f8d3a6b5c4e8f7a2b3c6d9e1'
      }
    }
  ]);

  // Dữ liệu mẫu đơn nhập hàng
  const [importOrders, setImportOrders] = useState([
    {
      id: 'IO-2024-001',
      distributor: "Công ty Dược phẩm Việt Nam",
      orderDate: "2024-03-10T14:30:00",
      status: 'received',
      totalAmount: 1950000,
      items: [
        {
          productId: 'SP001',
          name: "Panadol Extra",
          quantity: 30,
          importPrice: 65000,
          image: "https://via.placeholder.com/60x60/4CAF50/ffffff?text=Panadol"
        }
      ],
      blockchain: {
        orderHash: '0xa7c1b9e2f8d3a6b5c4e8f7a2b3c6d9e1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c9',
        receiveHash: '0xb9e2f8d3a6b5c4e8f7a2b3c6d9e1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c94a7c',
        status: 'completed'
      }
    },
    {
      id: 'IO-2024-002',
      distributor: "Công ty TNHH Dược phẩm ABC",
      orderDate: "2024-03-12T09:15:00",
      status: 'shipped',
      totalAmount: 525000,
      items: [
        {
          productId: 'SP002',
          name: "Vitamin C 1000mg",
          quantity: 5,
          importPrice: 105000,
          image: "https://via.placeholder.com/60x60/FF9800/ffffff?text=Vitamin+C"
        }
      ],
      blockchain: {
        orderHash: '0xc1b9e2f8d3a6b5c4e8f7a2b3c6d9e1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c94a',
        receiveHash: '',
        status: 'shipped'
      }
    },
    {
      id: 'IO-2024-003',
      distributor: "Công ty Dược phẩm Quốc tế",
      orderDate: "2024-03-14T16:45:00",
      status: 'pending',
      totalAmount: 1100000,
      items: [
        {
          productId: 'SP003',
          name: "Amoxicillin 500mg",
          quantity: 20,
          importPrice: 55000,
          image: "https://via.placeholder.com/60x60/9C27B0/ffffff?text=Amoxicillin"
        }
      ],
      blockchain: {
        orderHash: '0xd3a6b5c4e8f7a2b3c6d9e1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c94a7c1b9e2',
        receiveHash: '',
        status: 'pending'
      }
    }
  ]);

  // Format tiền
  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  // Format ngày
  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Hiển thị trạng thái blockchain
  const renderBlockchainStatus = (status: any) => {
    switch (status) {
      case 'verified':
        return <span className="blockchain-badge verified">✅ Verified</span>;
      case 'pending':
        return <span className="blockchain-badge pending">⏳ Pending</span>;
      default:
        return <span className="blockchain-badge">❌ Not Verified</span>;
    }
  };

  // Hiển thị trạng thái đơn hàng
  const renderOrderStatus = (status: any) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge pending">⏳ Chờ xác nhận</span>;
      case 'shipped':
        return <span className="status-badge shipped">🚚 Đang giao</span>;
      case 'received':
        return <span className="status-badge received">✅ Đã nhận</span>;
      default:
        return <span className="status-badge">Unknown</span>;
    }
  };

  // Mở modal đặt hàng
  const openOrderModal = (product: any) => {
    setSelectedProduct(product);
    setQuantity(product.minOrder);
    setShowOrderModal(true);
  };

  // Đặt hàng từ nhà phân phối
  const placeOrder = async () => {
    if (!selectedProduct || quantity < selectedProduct.minOrder) {
      alert(`Số lượng tối thiểu là ${selectedProduct.minOrder}`);
      return;
    }

    // Giả lập gọi API đặt hàng và ghi blockchain
    alert(`Đang đặt hàng và ghi lên blockchain...`);

    // Simulate blockchain transaction
    setTimeout(() => {
      const newOrder = {
        id: `IO-2024-${String(importOrders.length + 1).padStart(3, '0')}`,
        distributor: selectedProduct.distributor,
        orderDate: new Date().toISOString(),
        status: 'pending',
        totalAmount: selectedProduct.importPrice * quantity,
        items: [
          {
            productId: selectedProduct.id,
            name: selectedProduct.name,
            quantity: quantity,
            importPrice: selectedProduct.importPrice,
            image: selectedProduct.image
          }
        ],
        blockchain: {
          orderHash: '0x' + Math.random().toString(16).substr(2, 64),
          receiveHash: '',
          status: 'pending'
        }
      };

      setImportOrders([newOrder, ...importOrders]);
      setShowOrderModal(false);
      alert('Đã đặt hàng thành công! Đơn hàng đã được ghi lên blockchain.');
    }, 2000);
  };

  // Mở modal xác nhận nhận hàng
  const openReceiveModal = (order: any) => {
    setSelectedProduct(order);
    setShowReceiveModal(true);
  };

  // Xác nhận đã nhận hàng
  const confirmReceipt = async () => {
    if (!selectedProduct) return;

    // Giả lập gọi API xác nhận và ghi blockchain
    alert(`Đang xác nhận nhận hàng và ghi lên blockchain...`);

    // Simulate blockchain transaction
    setTimeout(() => {
      const updatedOrders = importOrders.map(order =>
        order.id === selectedProduct.id
          ? {
              ...order,
              status: 'received',
              blockchain: {
                ...order.blockchain,
                receiveHash: '0x' + Math.random().toString(16).substr(2, 64),
                status: 'completed'
              }
            }
          : order
      );

      setImportOrders(updatedOrders);
      setShowReceiveModal(false);
      alert('Đã xác nhận nhận hàng! Giao dịch đã được ghi lên blockchain.');
    }, 2000);
  };

  return (
    <div className="supplier-orders-page">
      <div className="management-container">
        {/* Header */}
        <div className="management-header">
          <div className="header-left">
            <h1>Nhập Hàng từ Nhà Phân Phối</h1>
            <p>Quản lý đơn nhập hàng với minh bạch blockchain</p>
          </div>
          <div className="header-right">
            <div className="stats">
              <div className="stat">
                <span className="stat-number">{importOrders.length}</span>
                <span className="stat-label">Tổng đơn nhập</span>
              </div>
              <div className="stat">
                <span className="stat-number">
                  {importOrders.filter(o => o.status === 'pending').length}
                </span>
                <span className="stat-label">Chờ xử lý</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            📦 Danh mục Nhà phân phối
          </button>
          <button
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            📋 Đơn nhập hàng
          </button>
        </div>

        {/* Danh mục sản phẩm từ nhà phân phối */}
        {activeTab === 'catalog' && (
          <div className="supplier-catalog">
            <h2>Danh mục Sản phẩm từ Nhà phân phối</h2>
            <div className="products-grid">
              {supplierProducts.map(product => (
                <div key={product.id} className="supplier-product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    <div className="product-badges">
                      {product.prescription && (
                        <span className="prescription-badge">💊 Kê đơn</span>
                      )}
                      {renderBlockchainStatus(product.blockchain.status)}
                    </div>
                  </div>

                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    
                    <div className="product-details">
                      <div className="detail-row">
                        <span>Giá nhập:</span>
                        <span className="import-price">{formatPrice(product.importPrice)}</span>
                      </div>
                      <div className="detail-row">
                        <span>Giá bán lẻ:</span>
                        <span className="retail-price">{formatPrice(product.retailPrice)}</span>
                      </div>
                      <div className="detail-row">
                        <span>Nhà phân phối:</span>
                        <span className="distributor">{product.distributor}</span>
                      </div>
                      <div className="detail-row">
                        <span>Số lô:</span>
                        <span>{product.batchNumber}</span>
                      </div>
                      <div className="detail-row">
                        <span>HSD:</span>
                        <span>{formatDate(product.expiryDate)}</span>
                      </div>
                      <div className="detail-row">
                        <span>Tồn kho NCC:</span>
                        <span>{product.stock} sản phẩm</span>
                      </div>
                      <div className="detail-row">
                        <span>Đặt tối thiểu:</span>
                        <span>{product.minOrder} sản phẩm</span>
                      </div>
                    </div>

                    {/* Blockchain Information */}
                    <div className="blockchain-info">
                      <h4>Thông tin Blockchain</h4>
                      <div className="blockchain-links">
                        <a
                          href={`https://ipfs.io/ipfs/${product.blockchain.ipfsCID}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="blockchain-link"
                        >
                          📄 Chứng từ lô hàng
                        </a>
                        <a
                          href={`https://etherscan.io/tx/${product.blockchain.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="blockchain-link"
                        >
                          ⛓️ Hash lô hàng
                        </a>
                        <a
                          href={`https://etherscan.io/tx/${product.blockchain.batchHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="blockchain-link"
                        >
                          🔍 Batch Verification
                        </a>
                      </div>
                    </div>

                    <button
                      className="order-btn"
                      onClick={() => openOrderModal(product)}
                    >
                      🛒 Đặt hàng
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Đơn nhập hàng */}
        {activeTab === 'orders' && (
          <div className="import-orders">
            <h2>Lịch sử Đơn nhập hàng</h2>
            <div className="orders-list">
              {importOrders.length === 0 ? (
                <div className="empty-orders">
                  <div className="empty-icon">📦</div>
                  <h3>Chưa có đơn nhập hàng</h3>
                  <p>Hãy đặt hàng từ nhà phân phối để bắt đầu</p>
                </div>
              ) : (
                importOrders.map(order => (
                  <div key={order.id} className="import-order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h3 className="order-id">#{order.id}</h3>
                        <div className="distributor-info">
                          <span className="distributor-name">{order.distributor}</span>
                          <span className="order-date">{formatDate(order.orderDate)}</span>
                        </div>
                      </div>
                      <div className="order-meta">
                        {renderOrderStatus(order.status)}
                        <span className="order-amount">{formatPrice(order.totalAmount)}</span>
                      </div>
                    </div>

                    <div className="order-content">
                      <div className="order-items">
                        {order.items.map(item => (
                          <div key={item.productId} className="order-item">
                            <img src={item.image} alt={item.name} />
                            <div className="item-info">
                              <h4>{item.name}</h4>
                              <p>Số lượng: {item.quantity}</p>
                              <p>Giá nhập: {formatPrice(item.importPrice)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Blockchain Information */}
                      <div className="blockchain-info">
                        <h4>Thông tin Blockchain</h4>
                        <div className="blockchain-details">
                          <div className="blockchain-row">
                            <span>Order Hash:</span>
                            <a
                              href={`https://etherscan.io/tx/${order.blockchain.orderHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="blockchain-link"
                            >
                              {order.blockchain.orderHash.slice(0, 16)}... ↗
                            </a>
                          </div>
                          {order.blockchain.receiveHash && (
                            <div className="blockchain-row">
                              <span>Receive Hash:</span>
                              <a
                                href={`https://etherscan.io/tx/${order.blockchain.receiveHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="blockchain-link"
                              >
                                {order.blockchain.receiveHash.slice(0, 16)}... ↗
                              </a>
                            </div>
                          )}
                          <div className="blockchain-row">
                            <span>Trạng thái:</span>
                            <span className={`status-${order.blockchain.status}`}>
                              {order.blockchain.status === 'completed' ? '✅ Hoàn thành' :
                               order.blockchain.status === 'shipped' ? '🚚 Đang giao' : '⏳ Chờ xử lý'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="order-footer">
                      <div className="order-actions">
                        {order.status === 'shipped' && (
                          <button
                            className="action-btn receive"
                            onClick={() => openReceiveModal(order)}
                          >
                            ✅ Xác nhận nhận hàng
                          </button>
                        )}
                        {order.status === 'pending' && (
                          <span className="status-text">Đang chờ nhà phân phối xác nhận</span>
                        )}
                        {order.status === 'received' && (
                          <span className="status-text completed">Đã nhận hàng và xác minh blockchain</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Modal đặt hàng */}
        {showOrderModal && selectedProduct && (
          <div className="modal-overlay">
            <div className="order-modal">
              <div className="modal-header">
                <h2>Đặt hàng từ Nhà phân phối</h2>
                <button className="close-btn" onClick={() => setShowOrderModal(false)}>×</button>
              </div>

              <div className="modal-content">
                <div className="product-info">
                  <img src={selectedProduct.image} alt={selectedProduct.name} />
                  <div>
                    <h3>{selectedProduct.name}</h3>
                    <p>{selectedProduct.distributor}</p>
                    <p>Giá nhập: {formatPrice(selectedProduct.importPrice)}</p>
                    <p>Tồn kho NCC: {selectedProduct.stock} sản phẩm</p>
                  </div>
                </div>

                <div className="order-form">
                  <label>
                    Số lượng đặt hàng (tối thiểu: {selectedProduct.minOrder})
                    <input
                      type="number"
                      min={selectedProduct.minOrder}
                      max={selectedProduct.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                    />
                  </label>

                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Thành tiền:</span>
                      <span>{formatPrice(selectedProduct.importPrice * quantity)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Phí giao dịch blockchain:</span>
                      <span>~0.001 ETH</span>
                    </div>
                    <div className="summary-row total">
                      <span>Tổng cộng:</span>
                      <span>{formatPrice(selectedProduct.importPrice * quantity)}</span>
                    </div>
                  </div>

                  <div className="blockchain-notice">
                    <p>⚠️ Đơn hàng sẽ được ghi lên blockchain và không thể hủy bỏ</p>
                    <p>📦 Thời gian giao hàng dự kiến: 3-5 ngày làm việc</p>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="action-btn cancel" onClick={() => setShowOrderModal(false)}>
                    Hủy
                  </button>
                  <button className="action-btn confirm" onClick={placeOrder}>
                    ⛓️ Xác nhận đặt hàng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal xác nhận nhận hàng */}
        {showReceiveModal && selectedProduct && (
          <div className="modal-overlay">
            <div className="receive-modal">
              <div className="modal-header">
                <h2>Xác nhận nhận hàng</h2>
                <button className="close-btn" onClick={() => setShowReceiveModal(false)}>×</button>
              </div>

              <div className="modal-content">
                <div className="order-info">
                  <h3>Đơn hàng #{selectedProduct.id}</h3>
                  <p>Nhà phân phối: {selectedProduct.distributor}</p>
                  <p>Ngày đặt: {formatDate(selectedProduct.orderDate)}</p>
                </div>

                <div className="receive-checklist">
                  <h4>Kiểm tra hàng hóa:</h4>
                  <label className="check-item">
                    <input type="checkbox" />
                    <span>Đúng số lượng và chủng loại hàng hóa</span>
                  </label>
                  <label className="check-item">
                    <input type="checkbox" />
                    <span>Chất lượng hàng hóa đạt yêu cầu</span>
                  </label>
                  <label className="check-item">
                    <input type="checkbox" />
                    <span>Hạn sử dụng phù hợp</span>
                  </label>
                  <label className="check-item">
                    <input type="checkbox" />
                    <span>Thông tin trên bao bì đầy đủ</span>
                  </label>
                </div>

                <div className="blockchain-notice">
                  <p>🔐 Việc xác nhận sẽ được ghi vĩnh viễn lên blockchain</p>
                  <p>⛓️ Transaction hash sẽ được tạo để xác minh</p>
                  <p>💰 Phí gas: ~0.002 ETH</p>
                </div>

                <div className="modal-actions">
                  <button className="action-btn cancel" onClick={() => setShowReceiveModal(false)}>
                    Hủy
                  </button>
                  <button className="action-btn confirm" onClick={confirmReceipt}>
                    ✅ Xác nhận đã nhận hàng
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

export default PharmacySupplierOrders;