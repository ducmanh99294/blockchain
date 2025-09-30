// pages/CategorySearch.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../assets/css/User/category.css';

const CategorySearch: React.FC = () => {
  const location = useLocation();
  const [products, setProducts] = useState<any>([]);
  const [filteredProducts, setFilteredProducts] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [prescriptionFilter, setPrescriptionFilter] = useState('all');
  const [cartItems, setCartItems] = useState<any>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const API = 'http://localhost:3000'
  const userId = localStorage.getItem('userId')
  const cartId = localStorage.getItem('cartId')

  useEffect(() => {
    if (userId) {
      fetchData();
      setLoading(false);
    }
  }, [userId]);

  const fetchData = async () => {
      try {
        // gọi API song song
        const [categoryRes, productsRes] = await Promise.all([
          fetch(`${API}/api/category`).then((res) => res.json()),
          fetch(`${API}/api/product`).then((res) => res.json()),
        ]);
        
        if (Array.isArray(categoryRes)) {
          setCategories(categoryRes);
        }

        if (Array.isArray(productsRes)) {
          setProducts(productsRes)
        }        

      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
        setCartItems([]);
      }
  };
  
  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, selectedCategory, sortBy, priceRange, prescriptionFilter, products]);

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo danh mục
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Lọc theo kê đơn/không kê đơn
    if (prescriptionFilter !== 'all') {
      const needsPrescription = prescriptionFilter === 'prescription';
      filtered = filtered.filter(product => product.prescription === needsPrescription);
    }

    // Lọc theo khoảng giá
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sắp xếp
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'sales':
        filtered.sort((a, b) => b.sales - a.sales);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        filtered.sort((a, b) => {
          const discountA = a.originalPrice ? (a.originalPrice - a.price) / a.originalPrice : 0;
          const discountB = b.originalPrice ? (b.originalPrice - b.price) / b.originalPrice : 0;
          return discountB - discountA;
        });
        break;
      default:
        // Mặc định sắp xếp theo ID
        filtered.sort((a, b) => a.id - b.id);
    }

    setFilteredProducts(filtered);
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    filterAndSortProducts();
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

  const handleQuickView = (product: any) => {
    alert(`Xem nhanh: ${product.name}`);
    // Có thể mở modal chi tiết sản phẩm
  };

  const formatPrice = (price: any) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  return (
    <>
    {loading ? (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải sản phẩm...</p>
      </div>
      ) : (
        <div className="category-search-page">
      <div className="container">
        {/* Header với search */}
        <div className="search-header">
          <h1>Tìm kiếm Sản phẩm</h1>
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Tìm kiếm thuốc, nhà sản xuất..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <span className="search-icon">🔍</span>
              Tìm kiếm
            </button>
          </form>
        </div>

        <div className="content-wrapper">
          {/* Sidebar filters */}
          <aside className="filters-sidebar">
            <div className="filter-group">
              <h3>Danh mục</h3>
              <div className="category-filters">
                {categories.map(category => (
                  <button
                    key={category._id}
                    className={`category-filter ${selectedCategory === category._id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category._id)}
                  >
                    <span className="category-icon">{category.icon}</span>
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3>Kê đơn</h3>
              <div className="radio-filters">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="prescription"
                    value="all"
                    checked={prescriptionFilter === 'all'}
                    onChange={() => setPrescriptionFilter('all')}
                  />
                  <span className="radio-custom"></span>
                  Tất cả
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="prescription"
                    value="prescription"
                    checked={prescriptionFilter === 'prescription'}
                    onChange={() => setPrescriptionFilter('prescription')}
                  />
                  <span className="radio-custom"></span>
                  Cần kê đơn
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="prescription"
                    value="non-prescription"
                    checked={prescriptionFilter === 'non-prescription'}
                    onChange={() => setPrescriptionFilter('non-prescription')}
                  />
                  <span className="radio-custom"></span>
                  Không kê đơn
                </label>
              </div>
            </div>

            <div className="filter-group">
              <h3>Khoảng giá</h3>
              <div className="price-range">
                <input
                  type="range"
                  min="0"
                  max="1000000"
                  step="10000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="price-slider"
                />
                <div className="price-labels">
                  <span>0đ</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </div>

            <button className="reset-filters" onClick={() => {
              setSelectedCategory('all');
              setPrescriptionFilter('all');
              setPriceRange([0, 1000000]);
              setSortBy('default');
            }}>
              🔄 Xóa bộ lọc
            </button>
          </aside>

          {/* Main content */}
          <main className="products-main">
            <div className="products-header">
              <p className="results-count">
                Tìm thấy {filteredProducts.length} sản phẩm
                {searchTerm && ` cho "${searchTerm}"`}
                {selectedCategory !== 'all' && ` trong "${categories.find(c => c._id === selectedCategory)?.name}"`}
              </p>
              
              <div className="sort-options">
                <label>Sắp xếp theo:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="default">Mặc định</option>
                  <option value="price-asc">Giá: Thấp đến Cao</option>
                  <option value="price-desc">Giá: Cao đến Thấp</option>
                  <option value="sales">Bán chạy nhất</option>
                  <option value="rating">Đánh giá cao</option>
                  <option value="discount">Khuyến mãi tốt nhất</option>
                </select>
              </div>
            </div>

            <div className="products-grid">
              {filteredProducts.length === 0 ? (
                <div className="no-results">
                  <h3>Không tìm thấy sản phẩm phù hợp</h3>
                  <p>Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                </div>
              ) : (
                filteredProducts.map((product: any) => (
                  <div key={product._id} className="product-card">
                    <div className="product-image">
                      <img src={product.image} alt={product.name} />
                      {product.prescription && (
                        <span className="prescription-badge">Kê đơn</span>
                      )}
                      {product.originalPrice && (
                        <span className="discount-badge">
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </span>
                      )}
                      <button 
                        className="quick-view-btn"
                        onClick={() => handleQuickView(product)}
                      >
                        👁️ Xem nhanh
                      </button>
                    </div>
                    
                    <div className="product-info">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-manufacturer">{product.manufacturer}</p>
                      <p className="product-description">{product.description}</p>
                      
                      <div className="product-meta">
                        <span className="product-rating">
                          ⭐ {product.rating} ({product.sales} đã bán)
                        </span>
                        <span className="product-stock">
                          {product.quantity > 0 ? `Còn ${product.quantity} sp` : 'Hết hàng'}
                        </span>
                      </div>

                      <div className="product-price">
                        <span className="current-price">{formatPrice(product.price)}</span>
                        {product.originalPrice && (
                          <span className="original-price">{formatPrice(product.originalPrice)}</span>
                        )}
                      </div>

                      <div className="product-actions">
                        <button 
                          className="add-to-cart-btn"
                          onClick={() => handleAddToCart(product._id)}
                          disabled={product.quantity === 0}
                        >
                          {product.quantity === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                        </button>
                        <button className="wishlist-btn">❤️</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {filteredProducts.length > 0 && (
              <div className="pagination">
                <button className="pagination-btn">← Trước</button>
                <span className="pagination-info">Trang 1 của 1</span>
                <button className="pagination-btn" disabled>Sau →</button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>)}
    </>
  );
};

export default CategorySearch;