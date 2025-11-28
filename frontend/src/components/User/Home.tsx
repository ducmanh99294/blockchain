import React, { useEffect, useState } from 'react';
import '../../assets/css/User/home.css';

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState<any>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [randomProducts, setRandomProducts] = useState<any[]>([]);
  const [recommendProducts, setRecommendProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const API = 'http://localhost:3000'
  const userId = localStorage.getItem('userId')

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
      try {
        // gọi API song song
        const [cartRes, categoryRes, eventRes, recommendProductsRes, randomProductsRes] = await Promise.all([
          fetch(`${API}/api/cart/user/${userId}`).then((res) => res.json()),
          fetch(`${API}/api/category`).then((res) => res.json()),
          fetch(`${API}/api/event`).then((res) => res.json()),
          fetch(`${API}/api/product/recommend`).then((res) => res.json()),
          fetch(`${API}/api/product/random`).then((res) => res.json()),
        ]);
        
        if (cartRes && cartRes.items) {
          setCartItems(cartRes.items);
          localStorage.setItem('cartId', cartRes.cartId || '')
        }
        
        if (Array.isArray(categoryRes)) {
          setCategories(categoryRes);
        }

        if (Array.isArray(eventRes)) {
          setEvents(eventRes);
        }

        if (Array.isArray(recommendProductsRes)) {
          setRecommendProducts(recommendProductsRes)
        }        
        
        if (Array.isArray(randomProductsRes)) {
          setRandomProducts(randomProductsRes)
        }

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
  };



  const filteredProducts = recommendProducts.filter(product => {
    const nameMatch =
      product.masterProduct?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const categoryMatch =
      selectedCategory === 'all' ||
      product.masterProduct?.category?._id === selectedCategory;

    return nameMatch && categoryMatch;
  });

  const handleAddToCart = async (productId: string) => {
    try {
      const res = await fetch(`${API}/api/cart/user/${userId}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json();
      if(!userId) {
        console.log('chua dang nhap')
      }
        alert("Đã thêm sản phẩm vào giỏ hàng!");
        setCartItems(data.cart?.items); // cập nhật lại giỏ hàng
        fetchData();
    } catch (error) {
      console.log("Lỗi khi thêm giỏ hàng:", error);
    }
  };

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'cart':
        window.location.href = '/cart';
        break;
      case 'account':
        window.location.href = '/account';
        break;
      case 'history':
        window.location.href = '/history';
        break;
      case 'category':
        window.location.href = '/category';
        break;
      default:
        break;
    }
  };

  const handleViewProductDetail = (product: any) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const renderBlockchainStatus = (status: string) => {
    switch(status) {
      case 'verified':
        return <span className="badge verified">✅ Đã xác minh</span>;
      case 'pending':
        return <span className="badge pending">⏳ Đang xác minh</span>;
      default:
        return <span className="badge not-verified">❌ Chưa xác minh</span>;
    }
  };

  // console.log(recommendProducts)
  return (
    <div className="user-home">
      {/* Banner khuyến mãi */}
      <div className="promo-banner">
        {events.map(event => (
        <>
        <div className="banner-content">  
          <h2>{event.title}</h2>
          <p>{event.description}</p>
          <button className="cta-button">{event.ctaText}</button>
        </div>
        <div className="banner-image">
          <img src={event.image} alt="Khuyến mãi" />
        </div>
        </>
        ))}
      </div>

      {/* Thanh tìm kiếm */}
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm thuốc, sản phẩm y tế..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-button">
            <span className="search-icon" onClick={()=> {handleQuickAction('category')}}>🔍</span>
          </button>
        </div>
      </div>

      {/* Button truy cập nhanh */}
      <div className="quick-actions">
        <button className="quick-action-btn" onClick={() => handleQuickAction('cart')}>
          <span className="action-icon">🛒</span>
          <span className="action-text">Giỏ hàng</span>
          {cartItems?.length > 0 && <span className="cart-badge">{cartItems?.length}</span>}
        </button>
        <button className="quick-action-btn" onClick={() => handleQuickAction('account')}>
          <span className="action-icon">👤</span>
          <span className="action-text">Tài khoản</span>
        </button>
        <button className="quick-action-btn" onClick={() => handleQuickAction('history')}>
          <span className="action-icon">📦</span>
          <span className="action-text">Đơn hàng</span>
        </button>
      </div>

      {/* Danh mục sản phẩm */}
      <section className="categories-section">
        <h2>Danh mục sản phẩm</h2>
            {loading ? (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
      ) : (
      <div className="categories-grid">
        <div
          className={`category-card ${selectedCategory === "all" ? "active" : ""}`}
          onClick={() => setSelectedCategory("all")}
          >
          <div className="category-icon">🏠</div>
          <h3>Tất cả</h3>
        </div>
          {categories.slice(0, 5).map(category => (
            <div 
              key={category._id} 
              className={`category-card ${selectedCategory === category._id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category._id)}
            >
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
              {/* <p>{category.productCount} sản phẩm</p> */}
            </div>
          ))}
        </div>
        )}
        
      </section>

      {/* Sản phẩm nổi bật */}
      <section className="featured-section">
        <h2>Sản phẩm nổi bật</h2>
        {loading ? (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải sản phẩm...</p>
      </div>
      ) : (
      <div className="products-grid">
          {filteredProducts.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img src={product.masterProduct.image} alt={product.masterProduct.name} />
                {product.originalPrice && (
                  <span className="discount-badge">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                )}
                <div className="product-badges">
                  {renderBlockchainStatus(product.masterProduct.status)}
                </div>
              </div>
              <div className="product-info">
                <h3>{product.masterProduct.name}</h3>
                <p>{product.masterProduct.description}</p>
                <div className="product-rating">
                  ⭐ ({product.rating})
                </div>
                <div className="product-price">
                  <span className="current-price">{product.price.toLocaleString()}đ</span>
                  {product.originalPrice && (
                    <span className="original-price">{product.originalPrice.toLocaleString()}đ</span>
                  )}
                </div>
                <div className="product-actions">
                  <button 
                    className="primary-cart-btn"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    Thêm vào giỏ
                  </button>
                  <button 
                    className="view-detail-btn"
                    onClick={() => handleViewProductDetail(product)}
                  >
                    Xem nguồn gốc
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}
      </section>

      {/* Sản phẩm đề xuất */}
      <section className="recommended-section">
        <h2>Gợi ý cho bạn</h2>
        {loading ? (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải sản phẩm...</p>
      </div>
      ) : (
        <div className="recommended-products">
          {randomProducts.map(product => (
            <div key={product._id} className="recommended-card">
              <img src={product.masterProduct.image} alt={product.masterProduct.name} />
              <div className="recommended-info">
                <h3>{product.masterProduct.name}</h3>
                <p>{product.masterProduct.description}</p>
                <div className="product-rating">
                  {'⭐'.repeat(Math.floor(product.rating))}
                </div>
                <div className="product-price">
                  {product.price.toLocaleString()}đ
                </div>
                <div className="product-actions">
                  <button 
                    className="add-to-cart-btn small"
                    onClick={() => handleAddToCart(product._id)}
                  >
                    🛒
                  </button>
                  <button 
                    className="view-detail-btn small"
                    onClick={() => handleViewProductDetail(product)}
                  >
                    🔍
                  </button>
                </div>
                <p className="recommend-reason">{product.reason}</p>
              </div>
            </div>
          ))}
        </div>
        )}
      </section>

      {/* Modal chi tiết sản phẩm */}
      {showProductDetail && selectedProduct && (
        <div className="modal-overlay">
          <div className="product-detail-modal">
            <div className="modal-header">
              <h2>Thông tin nguồn gốc sản phẩm</h2>
              <button className="close-btn" onClick={() => setShowProductDetail(false)}>×</button>
            </div>

            <div className="modal-content">
              <div className="product-main-info">
                <img src={selectedProduct.masterProduct.image} alt={selectedProduct.masterProduct.name} />
                <div className="product-header">
                  <h3>{selectedProduct.masterProduct.name}</h3>
                  <p>{selectedProduct.masterProduct.category?.name}</p>
                  <div className="product-badges">
                    {renderBlockchainStatus(selectedProduct.masterProduct.status)}
                  </div>
                </div>
              </div>

              <div className="product-details-grid">
                <div className="detail-section">
                  <h4>Thông tin sản phẩm</h4>
                  <div className="detail-row">
                    <span>Nhà sản xuất:</span>
                    <span>{selectedProduct.masterProduct.brand || 'Đang cập nhật'}</span>
                  </div>
                  <div className="detail-row">
                    <span>Nhà phân phối:</span>
                    <span>{selectedProduct.masterProduct.distributor?.companyName || 'Đang cập nhật'}</span>
                  </div>
                  <div className="detail-row">
                    <span>Hạn sử dụng:</span>
                    <span>{selectedProduct.masterProduct.expiryDate ? formatDate(selectedProduct.masterProduct.expiryDate) : 'Đang cập nhật'}</span>
                  </div>
                  <div className="detail-row">
                    <span>Giá bán:</span>
                    <span className="product-price">{selectedProduct.price.toLocaleString()}đ</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>Thông tin sử dụng</h4>
                  <div className="detail-row">
                    <span>Công dụng:</span>
                    <span>{selectedProduct.masterProduct.description}</span>
                  </div>
                  <div className="detail-row">
                    <span>Cách dùng:</span>
                    <span>{selectedProduct.masterProduct.usage || 'Theo hướng dẫn của bác sĩ'}</span>
                  </div>
                </div>

                {selectedProduct.masterProduct.status !== 'not_verified' && (
                  <div className="detail-section">
                    <h4>Thông tin Blockchain</h4>
                    {selectedProduct.masterProduct.blockchainTx && (
                      <div className="detail-row">
                        <span>Transaction Hash:</span>
                        <a
                          href={`https://sepolia.etherscan.io/tx/${selectedProduct.masterProduct.blockchainTx}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="blockchain-link"
                        >
                          {selectedProduct.masterProduct.blockchainTx.slice(0, 16)}... ↗
                        </a>
                      </div>
                    )}
                    {selectedProduct.masterProduct.ipfsCidString && (
                      <div className="detail-row">
                        <span>IPFS CID:</span>
                        <a
                          href={`https://ipfs.io/ipfs/${selectedProduct.masterProduct.ipfsCidString}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="blockchain-link"
                        >
                          {selectedProduct.masterProduct.ipfsCidString.slice(0, 16)}... ↗
                        </a>
                      </div>
                    )}
                    <div className="detail-row">
                      <span>Trạng thái:</span>
                      <span className="verification-status">
                        {selectedProduct.masterProduct.status === 'verified' 
                          ? '✅ Đã xác minh tính xác thực' 
                          : '⏳ Đang chờ xác minh'}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-actions">
                <button
                  className="action-btn add-cart"
                  onClick={() => {
                    handleAddToCart(selectedProduct._id);
                    setShowProductDetail(false);
                  }}
                >
                  🛒 Thêm vào giỏ hàng
                </button>
                <button
                  className="action-btn close"
                  onClick={() => setShowProductDetail(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;