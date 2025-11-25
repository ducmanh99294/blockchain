import { useState, useEffect } from 'react';
import { 
  FaSearch, FaShoppingCart, FaFilter, FaSortAmountDown,
  FaShieldAlt, FaBox, FaStore, FaClipboardList,
  FaTimes, FaPlus, FaMinus, FaCheckCircle,
  FaLink,
  FaImage,
  FaCube,
  FaCreditCard
} from 'react-icons/fa';
import { ethers } from 'ethers';
import '../../assets/css/Pharmacy/shop.css';
import quanLiThuocABI from './../../abi/quanLiThuoc.json';


const PharmacyShop = () => {
  const [products, setProducts] = useState<any>([]);
  const [filteredProducts, setFilteredProducts] = useState<any>([]);
  const [cart, setCart] = useState<any>([]);
  const [shippingNotes, setShippingNotes] = useState("");
  const [payment, setPayment] = useState<any>([]);
  const [shippingMethods, setShippingMethods] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<any>('');
  const [sortBy, setSortBy] = useState<any>('name');
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [shippingInfo, setShippingInfo] = useState<any>({   
    fullName: "",
    phone: "",
    address: "",
    ward: "",
    district: "",
    city: "",
  });

  const [selectedPayment, setSelectedPayment] = useState("");
  const [selectedShipping, setSelectedShipping] = useState("");
  const [showBlockchainModal, setShowBlockchainModal] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<any>(null);
  const [blockchainData, setBlockchainData] = useState<any>(null);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const API = 'http://localhost:3000'
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  // Giả lập dữ liệu sản phẩm
  useEffect(() => {
    fetchProducts();
    fetchCart();
    fetchMethodPayment();
    fetchMethodShipping();
  }, []);

  // Xử lý tìm kiếm và lọc
  useEffect(() => {
    let filtered = products;

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter((product: any) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sắp xếp
    filtered = [...filtered].sort((a: any, b: any) => {
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
  }, [searchTerm, sortBy, products]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API}/api/distributor/products`);
      if (!res.ok) {
        throw new Error('Lỗi khi lấy danh sách sản phẩm');
      }
      const data = await res.json();
      const availableProducts = data.filter((p: any) => p.status === 'verified' && p.stock > 0);
      setProducts(availableProducts);
      setFilteredProducts(availableProducts);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMethodPayment = async () => {
    try {
      const res = await fetch(`${API}/api/payment`)
      if(!res.ok){
        console.log("err")
      }
      const data = await res.json();
      setPayment(data);
    } catch (err) {
      console.log(err)
    }
  }

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API}/api/cart/pharmacy/${userId}`)
      if(!res.ok) {
        console.log("err");
      }
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.log(err)
    }
  }

  const fetchMethodShipping = async () => {
    try {
      const res = await fetch(`${API}/api/shipping`)
      if (!res.ok) {console.log("err")}
      const data = await res.json();
      setShippingMethods(data)
    } catch (err) {
      console.log(err)
    }
  }

  const openBlockchainDetails = async (product: any) => {
    // Mở modal và hiển thị loading
    setSelectedProductForModal(product); // Dùng state riêng để modal không bị giật
    setShowBlockchainModal(true);
    setIsFetchingData(true);
    setBlockchainData(null); // Xóa dữ liệu cũ

    try {
      if (!(window as any).ethereum) {
        alert("Vui lòng cài đặt MetaMask!");
        throw new Error("MetaMask not found");
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
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
  const addToCart = async (product: any) => {
    try {
      const res = await fetch(`${API}/api/cart/pharmacy/${userId}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          distributorProductId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
        })
      });
      if(!res.ok) {
        console.log("err")
      }
      const data = await res.json();
      setCart(data);
      console.log("success")
    } catch (err) {
      console.log(err);
    }
  };
  // Cập nhật số lượng sản phẩm trong giỏ hàng
  const updateQuantity = async (product: any, newQuantity: any) => {
    console.log("product", product)
    const productId = product.distributorProductId?._id || product.distributorProductId;
    try {
      const res = await fetch(`${API}/api/cart/pharmacy/${userId}/${productId}`,{
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({        
          quantity: newQuantity
        })
      })
      if(!res.ok){
        console.log("err");
        return;
      }
      const data = await res.json();
      setCart(data);

    } catch (err) {
      console.log(err);
    }
  }; 

  const removeFromCart = async (product: any) => {
    const productId = product.distributorProductId?._id || product.distributorProductId;
    window.confirm("bạn có chắc bỏ sản phẩm này ra khỏi giỏ hàng chứ")
        try {
      const res = await fetch(`${API}/api/cart/pharmacy/${userId}/${productId}`,{
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        }
      })
      if(!res.ok){
        console.log("err");
        return;
      }
      const data = await res.json();
        setCart(data);
    } catch (err) {
      console.log(err);
    }
  };

  const getTotalPrice = () => {
    if (!cart || !cart.items || !Array.isArray(cart.items)) {
      return 0;
    }
    return cart.items.reduce((total: any, item: any) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    if (!cart || !cart.items || !Array.isArray(cart.items)) {
      return 0;
    }
    return cart.items.reduce((total: any, item: any) => total + item.quantity, 0);
  };

  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleCheckout = async () => {
    if (!cart || !cart.items || cart.items.length === 0) {
      alert("Giỏ hàng của bạn đang trống!");
      return;
    }

    if (!selectedShipping || !selectedPayment) {
      alert("Vui lòng chọn phương thức vận chuyển và thanh toán.");
      return;
    }

    const subtotal = getTotalPrice();
    const totalPrice = subtotal;

    const orderItems = cart.items.map((item: any) => ({
      distributorProductId: item.distributorProductId._id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    if (selectedPayment === "69119adc5a8a0343f7799523") {

      try {
        if (!(window as any).ethereum) {
          alert("Vui lòng cài đặt MetaMask trước!");
          return;
        }

        //-----------------------------------------------
        // 1. Kết nối ví
        //-----------------------------------------------
        const accounts = await (window as any).ethereum.request({
          method: "eth_requestAccounts"
        });
        const sender = accounts[0];

        //-----------------------------------------------
        // 2. Tạo provider & signer & contract
        //-----------------------------------------------
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          quanLiThuocABI.abi,
          signer
        );

        //-----------------------------------------------
        // 3. Lặp qua từng sản phẩm và mua trên blockchain
        //-----------------------------------------------
        for (const item of cart.items) {
            const productId = "0x" + item.distributorProductId._id;  // convert ObjectId -> hex

          // Lấy thông tin thuốc từ blockchain
          const info = await contract.xemThongTinThuoc(productId);
          const giaBanSi = info.giaBanSi; // BigInt

          //-----------------------------------------------
          // 4. Gửi giao dịch mua thuốc
          //-----------------------------------------------
          const tx = await contract.muaChoNhaThuoc(productId, {
            value: giaBanSi
          });

          console.log("Đang chờ xác nhận giao dịch...");
          await tx.wait();
          console.log("Thanh toán blockchain xong:", tx.hash);
        }

        alert("Thanh toán ETH thành công!");

      } catch (err) {
        console.error("Lỗi thanh toán ETH:", err);
        alert("Thanh toán ETH thất bại!");
        return;
      }
    }

    // =============== TẠO ĐƠN HÀNG BACKEND ==================
    try {
      const res = await fetch(`${API}/api/pharmacy/order/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pharmacyId: userId,
          items: orderItems,
          shippingInfo: shippingInfo,
          shippingMethod: selectedShipping,
          paymentMethod: selectedPayment,
          subtotal: subtotal,
          shippingFee: 0,
          totalPrice: totalPrice
        })
      });

      if (!res.ok) {
        alert("Tạo đơn hàng thất bại!");
        return;
      }

      alert("Đơn hàng đã được gửi thành công!");
      setCart(null);
      setShowCheckout(false);
      setShowCart(false);

    } catch (err) {
      console.log(err);
    }
  };

    // console.log(products)

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
        {filteredProducts.map((product: any) => (
         <div key={product._id} className="product-card"> {/* 11. Sửa 'id' -> '_id' */}
            <div className="product-image">
              <img src={product.image} alt={product.name} /> {/* 11. Sửa 'image' -> 'image[0]' */}
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
        <div className="modal-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-sidebar" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <h3>
                <FaShoppingCart />
                Đơn hàng của bạn
              </h3>
              <button className="close-btn" onClick={() => setShowCart(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="cart-content">
              {(!cart || !cart.items || cart.items.length === 0) ? (
                <div className="empty-cart">
                  <FaShoppingCart />
                  <p>Giỏ hàng của bạn đang trống</p>
                </div>
              ) : (
                <div className="cart-items">
                  {cart.items.map((item: any) => (
                    <div key={item._id || item.distributorProductId._id} className="cart-item">
                      <div className="item-info">
                        <h4>{item.name}</h4>
                        <p className="item-manufacturer">
                          {item.manufacturer?.name}
                        </p>
                        <div className="item-price">
                          {formatCurrency(item.price)}/sản phẩm
                        </div>
                      </div>

                      <div className="quantity-controls">
                        <button
                          onClick={() => updateQuantity(item, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item, item.quantity + 1)}
                          disabled={item.quantity >= item.distributorProductId?.stock}
                        >
                          <FaPlus />
                        </button>
                      </div>

                      <div className="item-total">
                        {formatCurrency(item.price * item.quantity)}
                      </div>

                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart && cart.items && cart.items.length > 0 && (
              <>
                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Tạm tính ({getTotalItems()} sản phẩm)</span>
                    <span>{formatCurrency(getTotalPrice())}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Tổng cộng</span>
                    <span>{formatCurrency(getTotalPrice())}</span>
                  </div>
                </div>

                <div className="cart-actions">
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => setShowCheckout(true)}
                  >
                    <FaCreditCard /> Tiến hành thanh toán
                  </button>
                </div>
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
                {cart && cart.items && cart.items.map((item: any) => (
                  <div key={item._id} className="order-item">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                <div className="order-total">
                  <span>Tổng cộng:</span>
                  <span>{formatCurrency(getTotalPrice())}</span>
                </div>
              </div>

        <div className="shipping-info">
          <h4>Thông tin giao hàng & Thanh toán</h4>
          
          <div className="form-group">
            <label>Địa chỉ nhà thuốc:</label>
            <input 
              placeholder="123 xo viet nghe tinh..." 
              type="text" 
              value={shippingInfo.address}
              onChange={(e) => setShippingInfo(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Ghi chú:</label>
            <textarea 
              placeholder="Ghi chú cho đơn hàng..." 
              value={shippingNotes}
              onChange={(e) => setShippingNotes(e.target.value)}
            />
          </div>

          {/* THÊM DROPDOWN CHO SHIPPING */}
          <div className="form-group">
            <label>Phương thức vận chuyển:</label>
            <select 
              value={selectedShipping}
              onChange={(e) => setSelectedShipping(e.target.value)}
            >
              <option value="">-- Chọn vận chuyển --</option>
              {shippingMethods.map((method: any) => (
                <option key={method._id} value={method._id}>
                  {method.name} - {formatCurrency(method.price)}
                </option>
              ))}
            </select>
          </div>

          {/* THÊM DROPDOWN CHO PAYMENT */}
          <div className="form-group">
            <label>Phương thức thanh toán:</label>
            <select 
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value)}
            >
              <option value="">-- Chọn thanh toán --</option>
              {payment.map((method: any) => (
                <option key={method._id} value={method._id}>
                  {method.name}
                </option>
              ))}
            </select>
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