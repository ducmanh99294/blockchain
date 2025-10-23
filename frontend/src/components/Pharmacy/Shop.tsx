import React, { useState, useEffect } from 'react';
import { 
  FaSearch, FaShoppingCart, FaFilter, FaSortAmountDown,
  FaShieldAlt, FaBox, FaStore, FaClipboardList,
  FaTimes, FaPlus, FaMinus, FaCheckCircle,
  FaLink,
  FaImage,
  FaCube
} from 'react-icons/fa';
import { ethers } from 'ethers';
import '../../assets/css/Pharmacy/shop.css';
import quanLiThuocABI from './../../abi/quanLiThuoc.json';


const PharmacyShop = () => {
  const [products, setProducts] = useState<any>([]);
  const [filteredProducts, setFilteredProducts] = useState<any>([]);
  const [cart, setCart] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<any>('');
  const [selectedCategory, setSelectedCategory] = useState<any>('all');
  const [sortBy, setSortBy] = useState<any>('name');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const [showBlockchainModal, setShowBlockchainModal] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<any>(null);
  const [blockchainData, setBlockchainData] = useState<any>(null);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const API = 'http://localhost:3000'
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  // Giả lập dữ liệu sản phẩm
  useEffect(() => {
    fetchProducts();
  }, []);

  // Xử lý tìm kiếm và lọc
  useEffect(() => {
    let filtered = products;

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo danh mục
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sắp xếp
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stock':
          return b.stock - a.stock;
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortBy, products]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/api/distributor/products`);
      if (!res.ok) {
        throw new Error('Lỗi khi lấy danh sách sản phẩm');
      }
      const data = await res.json();
      const availableProducts = data.filter(p => p.status === 'verified' && p.stock > 0);
      setProducts(availableProducts);
      setFilteredProducts(availableProducts);
    } catch (error) {
      console.error(error);
    }
  };

  const openBlockchainDetails = async (product: any) => {
    // 1. Mở modal và hiển thị loading
    setSelectedProductForModal(product); // Dùng state riêng để modal không bị giật
    setShowBlockchainModal(true);
    setIsFetchingData(true);
    setBlockchainData(null); // Xóa dữ liệu cũ

    try {
      if (!window.ethereum) {
        alert("Vui lòng cài đặt MetaMask!");
        throw new Error("MetaMask not found");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, quanLiThuocABI.abi, provider);

      const productId = "0x" + product._id;
      
      console.log(`Đang truy vấn Blockchain cho ID: ${productId}`);
      
      const data = await contract.xemThongTinThuoc(productId);

      const formattedData = {
        nguonGoc: data.nguonGoc,
        ipfsHash: data.ipfsHash,
        giaBanSi: data.giaBanSi.toString(),
        nhaPhanPhoi: data.nhaPhanPhoi,
      };

      console.log("Dữ liệu trả về từ Contract:", formattedData);
      setBlockchainData(formattedData);

    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ Blockchain:", error);
      alert("Không thể tải dữ liệu xác thực từ Blockchain.");
    } finally {
      setIsFetchingData(false);
    }
  };

  // Thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    
    if (existingItem) {
      if (existingItem.quantity + 1 <= product.stock) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
      }
    } else {
      setCart([...cart, { ...product, quantity: product.minOrder }]);
    }
  };

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateQuantity = (productId, newQuantity) => {
    const product = products.find(p => p._id === productId);
    
    if (newQuantity >= product.minOrder && newQuantity <= product.stock) {
      setCart(cart.map(item =>
        item._id === productId
          ? { ...item, quantity: newQuantity }
          : item
      ));
    } else if (newQuantity === 0) {
      // Nếu số lượng về 0, xóa khỏi giỏ
      removeFromCart(productId);
    }
  }; 

  const removeFromCart = (productId: any) => {
    setCart(cart.filter(item => item._id !== productId));
  };

  // Tính tổng tiền
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.wholesalePrice * item.quantity), 0);
  };

  // Tính tổng số lượng
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Định dạng số tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Xử lý đặt hàng
  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    // Ở đây sẽ gọi API để tạo đơn hàng
    alert('Đơn hàng đã được gửi thành công!');
    setCart([]);
    setShowCheckout(false);
    setShowCart(false);
  };

  // Danh mục sản phẩm
  const categories = [
    { value: 'all', label: 'Tất cả danh mục' },
    { value: 'giadung', label: 'Thuốc gia dụng' },
    { value: 'khangsinh', label: 'Kháng sinh' },
    { value: 'tpc', label: 'Thực phẩm chức năng' },
    { value: 'tieuduong', label: 'Tiểu đường' },
    { value: 'tieuhoa', label: 'Tiêu hóa' }
  ];

  return (
    <div className="pharmacy-shop">
      {/* Header */}
      <header className="shop-header">
        <div className="header-content">
          <div className="logo">
            <FaStore />
            <span>Pharmacy Wholesale</span>
          </div>
          <div className="header-actions">
            <button 
              className="cart-btn"
              onClick={() => setShowCart(true)}
            >
              <FaShoppingCart />
              <span className="cart-count">{getTotalItems()}</span>
              <span className="cart-total">{formatCurrency(getTotalPrice())}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="shop-controls">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm thuốc, nhà sản xuất..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <FaFilter />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <FaSortAmountDown />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sắp xếp theo tên</option>
              <option value="price">Giá thấp đến cao</option>
              <option value="price-desc">Giá cao đến thấp</option>
              <option value="stock">Tồn kho nhiều</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map(product => (
         <div key={product._id} className="product-card"> {/* 11. Sửa 'id' -> '_id' */}
            <div className="product-image">
              <img src={product.image[0]} alt={product.name} /> {/* 11. Sửa 'image' -> 'image[0]' */}
              {/* 11. Sửa 'isBlockchainVerified' -> 'status' */}
              {product.status === 'verified' && ( 
                <div className="blockchain-badge" title="Đã xác thực blockchain">
                  <FaShieldAlt />
                </div>
              )}
            </div>

            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-description">{product.description}</p>
              
              <div className="product-manufacturer">
                <FaBox />
                {/* 11. Giả sử manufacturer được populate */}
                {product.manufacturer?.name || 'Không rõ'} 
              </div>

              <div className="product-details">
                <div className="detail-item">
                  <span>Hạn sử dụng:</span>
                  <span>{new Date(product.expiryDate).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="detail-item">
                  <span>Số lô:</span>
                  <span>{product.batchNumber || product._id.slice(-6)}</span> {/* 11. Sửa 'batchNumber' */}
                </div>
                <div className="detail-item">
                  <span>Tồn kho:</span>
                  <span>{product.stock.toLocaleString()} sản phẩm</span>
                </div>
              </div>

              {/* 12. SỬA LẠI NÚT XEM CHỨNG TỪ */}
              {product.status === 'verified' && ( 
                <div className="blockchain-info">
                  <FaShieldAlt />
                  <span>Đã xác thực nguồn gốc</span>
                  <button 
                    className="btn-link"
                    onClick={() => openBlockchainDetails(product)} // GỌI HÀM MỚI
                  >
                    Xem chứng từ
                  </button>
                </div>
              )}
            </div>

            <div className="product-pricing">
              <div className="price-section">
                <div className="wholesale-price">
                  Giá bán sỉ: <strong>{formatCurrency(product.price)}</strong> {/* 11. Sửa tên trường */}
                </div>
              </div>

              <button
                className="btn btn-primary add-to-cart"
                onClick={() => addToCart(product)}
                disabled={product.stock === 0} // Sửa logic disable
              >
                <FaPlus />
                Thêm vào đơn
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Shopping Cart Sidebar */}
      {showCart && (
      <div className="cart-sidebar">
        <div className="cart-header">
                {/* ... */}
        </div>

        <div className="cart-content">
          {cart.length === 0 ? (
            <div className="empty-cart">{/* ... */}</div>
          ) : (
            <>
        <div className="cart-items">
          {cart.map(item => (
            <div key={item._id} className="cart-item"> 
              <div className="item-info">
          <h4>{item.name}</h4>
          <p className="item-manufacturer">{item.manufacturer?.name}</p>
          <div className="item-price">
            {formatCurrency(item.price)}/sản phẩm
          </div>
              </div>

              <div className="quantity-controls">
          <button
            onClick={() => updateQuantity(item._id, item.quantity - 1)} 
            disabled={item.quantity <= 1} // Sửa logic minOrder
          >
            <FaMinus />
          </button>
          <span>{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
            disabled={item.quantity >= item.stock}
          >
            <FaPlus />
          </button>
              </div>
              <div className="item-total">
            {formatCurrency(item.giaBanSi * item.quantity)}
              </div>

              <button
          className="remove-btn"
          onClick={() => removeFromCart(item._id)}
              >
          <FaTimes />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">{/* ... */}</div>
        <div className="cart-actions">{/* ... */}</div>
            </>
          )}
        </div>
      </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="modal-overlay">
          <div className="checkout-modal">
            <div className="modal-header">
              <h3>Xác nhận đơn hàng</h3>
              <button className="close-btn" onClick={() => setShowCheckout(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="order-summary">
                <h4>Chi tiết đơn hàng</h4>
                {cart.map(item => (
                  <div key={item._id} className="order-item">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{formatCurrency(item.giaBanSi * item.quantity)}</span>
                  </div>
                ))}
                <div className="order-total">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(getTotalPrice())}</span>
                </div>
              </div>

              <div className="shipping-info">
                <h4>Thông tin giao hàng</h4>
                <div className="form-group">
                  <label>Địa chỉ nhà thuốc:</label>
                  <input type="text" defaultValue="123 Đường Láng, Hà Nội" />
                </div>
                <div className="form-group">
                  <label>Ghi chú:</label>
                  <textarea placeholder="Ghi chú cho đơn hàng..." />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowCheckout(false)}
              >
                Hủy
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCheckout}
              >
                <FaCheckCircle />
                Xác nhận đặt hàng
              </button>
            </div>
          </div>
        </div>
      )}

      {showBlockchainModal && selectedProductForModal && (
        <div className="modal-overlay">
          <div className="blockchain-modal">
            <div className="modal-header">
              <h3>Chi tiết Xác thực Blockchain</h3>
              <button className="close-btn" onClick={() => setShowBlockchainModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <h4>{selectedProductForModal.name}</h4>
              <p className="product-manufacturer">
                <FaBox /> {selectedProductForModal.manufacturer?.name || 'Không rõ'}
              </p>

              {isFetchingData ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <p>Đang tải dữ liệu từ Blockchain...</p>
                </div>
              ) : blockchainData ? (
                <div className="blockchain-details">
                  <div className="detail-row">
                    <span><FaCube /> Nhà phân phối (On-chain):</span>
                    <span className="address">{blockchainData.nhaPhanPhoi.slice(0, 10)}...</span>
                  </div>
                  <div className="detail-row">
                    <span><FaClipboardList /> Nguồn gốc (On-chain):</span>
                    <span>{blockchainData.nguonGoc}</span>
                  </div>
                  <div className="detail-row">
                    <span><FaLink /> Transaction Hash:</span>
                    <a 
                      href={`https://sepolia.etherscan.io/tx/${selectedProductForModal.blockchainTx}`} 
                      target="_blank" rel="noopener noreferrer"
                    >
                      Xem trên Etherscan
                    </a>
                  </div>

                  <div className="ipfs-section">
                    <strong><FaImage /> Chứng từ IPFS:</strong>
                    <div className="ipfs-links">
                      {JSON.parse(blockchainData.ipfsHash).map((cid: string) => (
                        <a 
                          key={cid} 
                          href={`https://ipfs.io/ipfs/${cid}`} 
                          target="_blank" rel="noopener noreferrer"
                        >
                          Xem chứng từ {cid.slice(0, 10)}...
                        </a>
                      ))}
                    </div>
                  </div>
                  
                </div>
              ) : (
                <p className="error">Không thể tải dữ liệu.</p>
              )}
            </div>
            
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowBlockchainModal(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PharmacyShop;