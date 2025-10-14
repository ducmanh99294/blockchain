// pages/UserHome.js
import React, { useEffect, useState } from 'react';
// import { useAuth } from '../context/AuthContext';
import '../../assets/css/User/home.css';

const Home: React.FC = () => {
//   const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState<any>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [randomProducts, setRandomProducts] = useState<any[]>([]);
  const [recommendProducts, setRecommendProducts] = useState<any[]>([]);
  const API = 'http://localhost:3000'
  const userId = localStorage.getItem('userId')
  // Dữ liệu mẫu - sẽ thay bằng API sau
  // const bannerData = {
  //   title: "Ưu đãi đặc biệt mùa thu",
  //   description: "Giảm giá lên đến 30% cho các sản phẩm chăm sóc sức khỏe",
  //   image: "https://via.placeholder.com/1200x400/1a3a6c/ffffff?text=Khuyến+Mãi+Đặc+Biệt",
  //   ctaText: "Mua ngay"
  // };

  // const categories = [
  //   { id: 'cold', name: 'Thuốc cảm', icon: '🤧', count: 24 },
  //   { id: 'cough', name: 'Thuốc ho', icon: '😷', count: 18 },
  //   { id: 'vitamin', name: 'Vitamin', icon: '💊', count: 32 },
  //   { id: 'pain', name: 'Giảm đau', icon: '🥴', count: 15 },
  //   { id: 'digestive', name: 'Tiêu hóa', icon: '🍃', count: 22 },
  //   { id: 'skin', name: 'Da liễu', icon: '✨', count: 19 }
  // ];c

  // const featuredProducts = [
  //   {
  //     id: 1,
  //     name: "Panadol Extra",
  //     description: "Giảm đau, hạ sốt nhanh chóng",
  //     price: 95000,
  //     originalPrice: 120000,
  //     image: "https://via.placeholder.com/200x200/4CAF50/ffffff?text=Panadol",
  //     rating: 4.8,
  //     category: 'pain'
  //   },
  //   {
  //     id: 2,
  //     name: "Vitamin C 1000mg",
  //     description: "Tăng cường sức đề kháng",
  //     price: 150000,
  //     originalPrice: 180000,
  //     image: "https://via.placeholder.com/200x200/FF9800/ffffff?text=Vitamin+C",
  //     rating: 4.6,
  //     category: 'vitamin'
  //   },
  //   {
  //     id: 3,
  //     name: "Sirop ho Prospan",
  //     description: "Giảm ho hiệu quả cho cả gia đình",
  //     price: 125000,
  //     originalPrice: 150000,
  //     image: "https://via.placeholder.com/200x200/2196F3/ffffff?text=Prospan",
  //     rating: 4.7,
  //     category: 'cough'
  //   },
  //   {
  //     id: 4,
  //     name: "Tiffy Cold",
  //     description: "Điều trị cảm cúm, ngạt mũi",
  //     price: 85000,
  //     originalPrice: 100000,
  //     image: "https://via.placeholder.com/200x200/9C27B0/ffffff?text=Tiffy",
  //     rating: 4.5,
  //     category: 'cold'
  //   }
  // ];

  // const recommendedProducts = [
  //   {
  //     id: 5,
  //     name: "Omeprazole 20mg",
  //     description: "Điều trị trào ngược dạ dày",
  //     price: 110000,
  //     image: "https://via.placeholder.com/200x200/607D8B/ffffff?text=Omeprazole",
  //     rating: 4.4,
  //     reason: "Dựa trên đơn hàng trước của bạn"
  //   },
  //   {
  //     id: 6,
  //     name: "Calcium D3",
  //     description: "Bổ sung canxi và vitamin D3",
  //     price: 135000,
  //     image: "https://via.placeholder.com/200x200/FF5722/ffffff?text=Calcium+D3",
  //     rating: 4.9,
  //     reason: "Sản phẩm được đánh giá cao"
  //   },
  //   {
  //     id: 7,
  //     name: "Kem dưỡng da Eucerin",
  //     description: "Dưỡng ẩm chuyên sâu",
  //     price: 220000,
  //     image: "https://via.placeholder.com/200x200/E91E63/ffffff?text=Eucerin",
  //     rating: 4.7,
  //     reason: "Phù hợp với nhu cầu chăm sóc da"
  //   }
  // ];

  // const filteredProducts = featuredProducts.filter(product => {
  //   const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        product.description.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
  //   return matchesSearch && matchesCategory;
  // });
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
          {categories.slice(0, 5).map(category => (
            <div 
              key={category._id} 
              className={`category-card ${selectedCategory === category._id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category._id)}
            >
              <div className="category-icon">{category.icon}</div>
              <h3>{category.name}</h3>
              <p>{category.productCount} sản phẩm</p>
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
          {recommendProducts.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                {product.originalPrice && (
                  <span className="discount-badge">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-rating">
                  ⭐ ({product.rating})
              
                </div>
                <div className="product-price">
                  <span className="current-price">{product.price.toLocaleString()}đ</span>
                  {product.originalPrice && (
                    <span className="original-price">{product.originalPrice.toLocaleString()}đ</span>
                  )}
                </div>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product._id)}
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
        <div className="products-grid">
          {recommendProducts.map(product => (
            <div key={product._id} className="product-card">
              <div className="product-image">
                <img src={product.image} alt={product.name} />
                {product.originalPrice && (
                  <span className="discount-badge">
                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                  </span>
                )}
              </div>
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-rating">
                  ⭐ ({product.rating})
              
                </div>
                <div className="product-price">
                  <span className="current-price">{product.price.toLocaleString()}đ</span>
                  {product.originalPrice && (
                    <span className="original-price">{product.originalPrice.toLocaleString()}đ</span>
                  )}
                </div>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => handleAddToCart(product._id)}
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
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
              <img src={product.image} alt={product.name} />
              <div className="recommended-info">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-rating">
                  {'⭐'.repeat(Math.floor(product.rating))}
                </div>
                <div className="product-price">
                  {product.price.toLocaleString()}đ
                </div>
                <p className="recommend-reason">{product.reason}</p>
              </div>
            </div>
          ))}
        </div>
        )}

      </section>
    </div>
  );
};

export default Home;