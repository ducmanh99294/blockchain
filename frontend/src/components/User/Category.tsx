// pages/CategorySearch.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../../assets/css/User/category.css';

const CategorySearch: React.FC = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [prescriptionFilter, setPrescriptionFilter] = useState('all');

  // Dữ liệu mẫu - sẽ thay bằng API sau
  const sampleProducts = [
    {
      id: 1,
      name: "Panadol Extra",
      description: "Giảm đau, hạ sốt nhanh chóng, hiệu quả cho các cơn đau nhẹ đến trung bình",
      price: 95000,
      originalPrice: 120000,
      image: "https://via.placeholder.com/300x300/4CAF50/ffffff?text=Panadol+Extra",
      category: 'pain',
      prescription: false,
      sales: 1245,
      rating: 4.8,
      stock: 50,
      manufacturer: "GSK",
      expiryDate: "12/2024"
    },
    {
      id: 2,
      name: "Vitamin C 1000mg",
      description: "Bổ sung Vitamin C, tăng cường sức đề kháng, chống oxy hóa",
      price: 150000,
      originalPrice: 180000,
      image: "https://via.placeholder.com/300x300/FF9800/ffffff?text=Vitamin+C",
      category: 'vitamin',
      prescription: false,
      sales: 892,
      rating: 4.6,
      stock: 100,
      manufacturer: "Nature's Bounty",
      expiryDate: "06/2025"
    },
    {
      id: 3,
      name: "Sirop ho Prospan",
      description: "Giảm ho hiệu quả cho cả gia đình, chiết xuất từ thảo dược",
      price: 125000,
      originalPrice: 150000,
      image: "https://via.placeholder.com/300x300/2196F3/ffffff?text=Prospan",
      category: 'cough',
      prescription: false,
      sales: 756,
      rating: 4.7,
      stock: 30,
      manufacturer: "Engelhard",
      expiryDate: "09/2024"
    },
    {
      id: 4,
      name: "Amoxicillin 500mg",
      description: "Kháng sinh điều trị nhiễm khuẩn, cần kê đơn",
      price: 85000,
      image: "https://via.placeholder.com/300x300/9C27B0/ffffff?text=Amoxicillin",
      category: 'antibiotic',
      prescription: true,
      sales: 345,
      rating: 4.3,
      stock: 25,
      manufacturer: "Pfizer",
      expiryDate: "03/2024"
    },
    {
      id: 5,
      name: "Omeprazole 20mg",
      description: "Điều trị trào ngược dạ dày, giảm tiết acid",
      price: 110000,
      image: "https://via.placeholder.com/300x300/607D8B/ffffff?text=Omeprazole",
      category: 'digestive',
      prescription: true,
      sales: 567,
      rating: 4.4,
      stock: 40,
      manufacturer: "AstraZeneca",
      expiryDate: "11/2024"
    },
    {
      id: 6,
      name: "Calcium D3",
      description: "Bổ sung canxi và vitamin D3 cho xương chắc khỏe",
      price: 135000,
      originalPrice: 160000,
      image: "https://via.placeholder.com/300x300/FF5722/ffffff?text=Calcium+D3",
      category: 'supplement',
      prescription: false,
      sales: 978,
      rating: 4.9,
      stock: 60,
      manufacturer: "Kirkland",
      expiryDate: "08/2025"
    },
    {
      id: 7,
      name: "Kem dưỡng da Eucerin",
      description: "Dưỡng ẩm chuyên sâu, phục hồi da tổn thương",
      price: 220000,
      originalPrice: 250000,
      image: "https://via.placeholder.com/300x300/E91E63/ffffff?text=Eucerin",
      category: 'skincare',
      prescription: false,
      sales: 432,
      rating: 4.7,
      stock: 20,
      manufacturer: "Eucerin",
      expiryDate: "05/2025"
    },
    {
      id: 8,
      name: "Metformin 500mg",
      description: "Điều trị đái tháo đường type 2, cần kê đơn",
      price: 95000,
      image: "https://via.placeholder.com/300x300/795548/ffffff?text=Metformin",
      category: 'diabetes',
      prescription: true,
      sales: 234,
      rating: 4.2,
      stock: 35,
      manufacturer: "Merck",
      expiryDate: "02/2024"
    }
  ];

  const categories = [
    { id: 'all', name: 'Tất cả', icon: '🏠' },
    { id: 'pain', name: 'Giảm đau', icon: '🥴' },
    { id: 'vitamin', name: 'Vitamin', icon: '💊' },
    { id: 'cough', name: 'Thuốc ho', icon: '😷' },
    { id: 'antibiotic', name: 'Kháng sinh', icon: '🦠' },
    { id: 'digestive', name: 'Tiêu hóa', icon: '🍃' },
    { id: 'supplement', name: 'Thực phẩm chức năng', icon: '🌿' },
    { id: 'skincare', name: 'Chăm sóc da', icon: '✨' },
    { id: 'diabetes', name: 'Tiểu đường', icon: '🩸' }
  ];

  useEffect(() => {
    // Giả lập load data từ API
    setTimeout(() => {
      setProducts(sampleProducts);
      setFilteredProducts(sampleProducts);
      setLoading(false);
    }, 500);

    // Lấy query parameters từ URL
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    const category = searchParams.get('category');

    if (query) {
      setSearchTerm(query);
    }
    if (category) {
      setSelectedCategory(category);
    }
  }, [location]);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, selectedCategory, sortBy, priceRange, prescriptionFilter, products]);

  const filterAndSortProducts = () => {
    let filtered = [...products];

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

  const handleSearch = (e) => {
    e.preventDefault();
    filterAndSortProducts();
  };

  const handleAddToCart = (productId) => {
    alert(`Đã thêm sản phẩm ${productId} vào giỏ hàng`);
    // Logic thêm vào giỏ hàng sẽ được implement sau
  };

  const handleQuickView = (product) => {
    alert(`Xem nhanh: ${product.name}`);
    // Có thể mở modal chi tiết sản phẩm
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  return (
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
                    key={category.id}
                    className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
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
                {selectedCategory !== 'all' && ` trong "${categories.find(c => c.id === selectedCategory)?.name}"`}
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
                filteredProducts.map(product => (
                  <div key={product.id} className="product-card">
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
                          {product.stock > 0 ? `Còn ${product.stock} sp` : 'Hết hàng'}
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
                          onClick={() => handleAddToCart(product.id)}
                          disabled={product.stock === 0}
                        >
                          {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
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
    </div>
  );
};

export default CategorySearch;