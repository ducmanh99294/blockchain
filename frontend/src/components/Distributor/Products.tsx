import React, { useState, useEffect } from 'react';
import { 
  FaBox, FaPlus, FaSearch, FaEye, FaCloudUploadAlt, 
  FaCheckCircle, FaClock, FaFileAlt, FaShieldAlt 
} from 'react-icons/fa';
import '../../assets/css/Distributor/products.css';


const DistributorProduct = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Giả lập dữ liệu sản phẩm
  useEffect(() => {
    const mockProducts = [
      {
        id: 1,
        name: "Paracetamol 500mg",
        description: "Thuốc giảm đau, hạ sốt",
        image: "https://via.placeholder.com/80x80/4CAF50/FFFFFF?text=P",
        price: 120000,
        stock: 1500,
        expiryDate: "2024-12-31",
        license: "VD-12345-2020",
        cid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
        transactionHash: "0x4a8c5d87a2b3c9e1f0d8e7c2b3a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1",
        status: "verified",
        manufacturer: "Công ty Dược phẩm ABC",
        batchNumber: "B20230501"
      },
      {
        id: 2,
        name: "Amoxicillin 250mg",
        description: "Kháng sinh điều trị nhiễm khuẩn",
        image: "https://via.placeholder.com/80x80/2196F3/FFFFFF?text=A",
        price: 185000,
        stock: 800,
        expiryDate: "2024-10-15",
        license: "VD-54321-2021",
        cid: "QmY7yz7pX9z2cJ4KnLwHCnL72vedxjQkDDP1mXWo6uco",
        transactionHash: null,
        status: "pending",
        manufacturer: "Công ty Dược phẩm XYZ",
        batchNumber: "B20230615"
      },
      {
        id: 3,
        name: "Vitamin C 1000mg",
        description: "Bổ sung vitamin C, tăng sức đề kháng",
        image: "https://via.placeholder.com/80x80/FF9800/FFFFFF?text=V",
        price: 95000,
        stock: 2000,
        expiryDate: "2025-03-20",
        license: "VD-98765-2022",
        cid: null,
        transactionHash: null,
        status: "not_verified",
        manufacturer: "Công ty Dược phẩm Sunshine",
        batchNumber: "B20230720"
      },
      {
        id: 4,
        name: "Metformin 500mg",
        description: "Điều trị đái tháo đường type 2",
        image: "https://via.placeholder.com/80x80/9C27B0/FFFFFF?text=M",
        price: 135000,
        stock: 1200,
        expiryDate: "2024-11-30",
        license: "VD-13579-2021",
        cid: "QmZ3pz7pX9z2cJ4KnLwHCnL72vedxjQkDDP1mXWo6uco",
        transactionHash: "0x5b9c6d87a2b3c9e1f0d8e7c2b3a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1",
        status: "verified",
        manufacturer: "Công ty Dược phẩm Medico",
        batchNumber: "B20230415"
      }
    ];
    
    setProducts(mockProducts);
    setFilteredProducts(mockProducts);
  }, []);

  // Xử lý tìm kiếm
  useEffect(() => {
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Xem chi tiết sản phẩm
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Đăng ký lên blockchain
  const handleRegisterToBlockchain = (product) => {
    setSelectedProduct(product);
    setShowRegisterModal(true);
  };

  // Giả lập đăng ký lên blockchain
  const confirmRegistration = () => {
    // Giả lập cập nhật trạng thái
    const updatedProducts = products.map(p => 
      p.id === selectedProduct.id ? {...p, status: "pending"} : p
    );
    
    setProducts(updatedProducts);
    setShowRegisterModal(false);
    
    // Giả lập sau 3 giây sẽ verified
    setTimeout(() => {
      const verifiedProducts = products.map(p => 
        p.id === selectedProduct.id ? {
          ...p, 
          status: "verified", 
          transactionHash: "0x" + Math.random().toString(16).substr(2, 64)
        } : p
      );
      setProducts(verifiedProducts);
    }, 3000);
  };

  // Định dạng số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Hiển thị trạng thái blockchain
  const renderStatus = (status) => {
    switch(status) {
      case "verified":
        return <span className="status verified"><FaCheckCircle /> ✅ Đã xác thực</span>;
      case "pending":
        return <span className="status pending"><FaClock /> ⏳ Đang xử lý</span>;
      default:
        return <span className="status not-verified"><FaClock /> ❌ Chưa xác thực</span>;
    }
  };

  return (
    <div className="product-management">
      <header className="page-header">
        <h1><FaBox /> Quản lý Sản phẩm</h1>
        <p>Quản lý danh sách sản phẩm và xác thực nguồn gốc trên blockchain</p>
      </header>

      <div className="controls">
        <div className="search-box">
          <FaSearch />
          <input 
            type="text" 
            placeholder="Tìm kiếm sản phẩm..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-primary">
          <FaPlus /> Thêm sản phẩm
        </button>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <div className="product-details">
                <div className="detail-item">
                  <span className="label">Giá bán sỉ:</span>
                  <span className="value">{formatCurrency(product.price)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Tồn kho:</span>
                  <span className="value">{product.stock} sản phẩm</span>
                </div>
                <div className="detail-item">
                  <span className="label">Trạng thái:</span>
                  <span className="value">{renderStatus(product.status)}</span>
                </div>
                {product.cid && (
                  <div className="detail-item">
                    <span className="label">CID IPFS:</span>
                    <span className="value cid">{product.cid.substring(0, 16)}...</span>
                  </div>
                )}
              </div>
            </div>
            <div className="product-actions">
              <button 
                className="btn btn-outline"
                onClick={() => handleViewDetails(product)}
              >
                <FaEye /> Chi tiết
              </button>
              {product.status !== "verified" && (
                <button 
                  className="btn btn-primary"
                  onClick={() => handleRegisterToBlockchain(product)}
                >
                  <FaCloudUploadAlt /> Đăng ký Blockchain
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal chi tiết sản phẩm */}
      {showModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Chi tiết sản phẩm</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="product-detail">
                <div className="detail-image">
                  <img src={selectedProduct.image} alt={selectedProduct.name} />
                </div>
                <div className="detail-info">
                  <h2>{selectedProduct.name}</h2>
                  <p className="description">{selectedProduct.description}</p>
                  
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="label">Nhà sản xuất:</span>
                      <span className="value">{selectedProduct.manufacturer}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Số lô:</span>
                      <span className="value">{selectedProduct.batchNumber}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Hạn sử dụng:</span>
                      <span className="value">{selectedProduct.expiryDate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Số giấy phép:</span>
                      <span className="value">{selectedProduct.license}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Giá bán sỉ:</span>
                      <span className="value">{formatCurrency(selectedProduct.price)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Tồn kho:</span>
                      <span className="value">{selectedProduct.stock} sản phẩm</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Trạng thái blockchain:</span>
                      <span className="value">{renderStatus(selectedProduct.status)}</span>
                    </div>
                    {selectedProduct.cid && (
                      <div className="detail-item full-width">
                        <span className="label">CID IPFS:</span>
                        <span className="value cid">{selectedProduct.cid}</span>
                        <button className="btn btn-outline btn-small">
                          <FaFileAlt /> Xem chứng từ
                        </button>
                      </div>
                    )}
                    {selectedProduct.transactionHash && (
                      <div className="detail-item full-width">
                        <span className="label">Transaction Hash:</span>
                        <span className="value hash">{selectedProduct.transactionHash}</span>
                        <button className="btn btn-outline btn-small">
                          <FaShieldAlt /> Kiểm tra trên blockchain
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Đóng</button>
              {selectedProduct.status !== "verified" && (
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setShowModal(false);
                    handleRegisterToBlockchain(selectedProduct);
                  }}
                >
                  <FaCloudUploadAlt /> Đăng ký lên Blockchain
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal đăng ký blockchain */}
      {showRegisterModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Đăng ký sản phẩm lên Blockchain</h2>
              <button className="close-btn" onClick={() => setShowRegisterModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="blockchain-registration">
                <div className="registration-info">
                  <h3>{selectedProduct.name}</h3>
                  <p>Bạn đang thực hiện đăng ký thông tin sản phẩm lên blockchain. Thao tác này sẽ:</p>
                  <ul>
                    <li>Tạo hash cho thông tin sản phẩm</li>
                    <li>Lưu chứng từ nguồn gốc lên IPFS</li>
                    <li>Ghi dữ liệu lên blockchain</li>
                    <li>Thiết lập sản phẩm như nguồn gốc xác thực cho các nhà thuốc</li>
                  </ul>
                  
                  <div className="registration-docs">
                    <h4>Tài liệu đính kèm:</h4>
                    <div className="doc-list">
                      <div className="doc-item">
                        <FaFileAlt />
                        <span>Giấy phép lưu hành - {selectedProduct.license}.pdf</span>
                      </div>
                      <div className="doc-item">
                        <FaFileAlt />
                        <span>Chứng nhận nguồn gốc - {selectedProduct.batchNumber}.pdf</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowRegisterModal(false)}>Hủy bỏ</button>
              <button className="btn btn-primary" onClick={confirmRegistration}>
                <FaCloudUploadAlt /> Xác nhận đăng ký
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributorProduct;