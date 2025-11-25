import React, { useState, useEffect } from 'react';
import { PinataSDK } from "pinata-web3";
import { 
  FaBox, FaPlus, FaSearch, FaEye, FaCloudUploadAlt, 
  FaCheckCircle, FaClock, FaFileAlt, FaShieldAlt 
} from 'react-icons/fa';
import '../../assets/css/Distributor/products.css';
import quanLiThuocABI from './../../abi/quanLiThuoc.json';
import { ethers } from 'ethers';

const DistributorProduct: React.FC = () => {
  const [products, setProducts] = useState<any>([]);
  const [categories, setCategories] = useState<any>([]);
  const [filteredProducts, setFilteredProducts] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<any>('');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [showModalAdd, setShowModalAdd] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [originInfo, setOriginInfo] = useState<any>({});
  const [originImages, setOriginImages] = useState<any | File[]>([]);

  const [formdata, setFormdata] = useState<any>({
    name: "",
    description: "",
    category: "",
    brand: "",
    image: [],  
    usage: "",   
    price: 0,
    stock: 0
  });
  const [loading, setLoading] = useState(false);

  const distributorId = localStorage.getItem('userId');
  const token = localStorage.getItem('token')
  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

  const pinata = new PinataSDK({
  pinataJwt: import.meta.env.VITE_PINATA_JWT,
  pinataGateway: "orange-efficient-liger-682.mypinata.cloud",
});
  // Giả lập dữ liệu sản phẩm
  useEffect(() => {
    fetchCategories();
    fetchDistributorProducts();
    
    setFilteredProducts(products);
  }, []);

  // Xử lý tìm kiếm
  useEffect(() => {
    const filtered = products.filter((product: any) => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  // Xem chi tiết sản phẩm
  const handleViewDetails = (product: any) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Đăng ký lên blockchain
  const handleOpenRegisterModal = (product: any) => {
    setSelectedProduct(product);
    setShowRegisterModal(true);
  };

  const handleRegisterToBlockchain = async (
    product: any,          
    originImages: File[],  
    originInfo: string     
  ) => {
    
    // Kiểm tra đầu vào
    if (!originInfo.trim()) {
      alert("Vui lòng nhập thông tin nguồn gốc!");
      return;
    }
    if (!originImages || originImages.length === 0) {
      alert("Vui lòng chọn ít nhất 1 hình ảnh chứng từ!");
      return;
    }
    if (!product || !product._id || product.price === undefined) {
      alert("Lỗi: Dữ liệu sản phẩm (ID hoặc Giá) bị thiếu.");
      return;
    }

    // setLoading(true); 
    try {
      console.log("Đang tải hình ảnh lên IPFS...");
      const uploadedCIDs: string[] = [];
      for (const file of originImages) {
        const uploadRes = await pinata.upload.file(file);
        const ipfsHash = uploadRes.IpfsHash || (uploadRes as any).cid;
        uploadedCIDs.push(ipfsHash);
      }
      const imageCIDString = uploadedCIDs.join(",");
      console.log("Uploaded CIDs:", imageCIDString);

      // 2. Kết nối MetaMask
      if (!(window as any).ethereum) {
        alert("Vui lòng cài đặt MetaMask trước!");
        // setLoading(false);
        return;
      }

      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();

      // Khởi tạo contract
      const contract = new ethers.Contract(
        contractAddress,  
        quanLiThuocABI.abi, 
        signer
      );

      const productId = "0x" + product._id;
      const giaBanSiString = product.price.toString();

      // 4. Gọi hàm contract với đúng 4 tham số
      const tx = await contract.xacThucNguonGoc(
        productId,
        giaBanSiString,
        originInfo,
        imageCIDString
      );

      console.log(`Đang chờ giao dịch (tx: ${tx.hash})...`);
      await tx.wait();

      // 5. (Rất nên làm) Cập nhật lại Mongo
      await fetch(`http://localhost:3000/api/distributor/products/${product._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          blockchainTx: tx.hash,      
          ipfsCidString: imageCIDString,
          originInfo: originInfo,
            imagesOrigin: originImages.map(f => f.name),
          status: "verified"
        })
      });
      
      alert(" Đăng ký và xác thực sản phẩm lên blockchain thành công!");

    } catch (error) {
      console.error("Lỗi đăng ký/xác thực blockchain:", error);
      alert("❌ Đăng ký/xác thực thất bại! Kiểm tra console.");
    } finally {
      // (Tùy chọn) Tắt cờ loading
      // setLoading(false);
    }
  };
  // Định dạng số tiền
  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Hiển thị trạng thái blockchain
  const renderStatus = (status: any) => {
    switch(status) {
      case "verified":
        return <span className="status verified"><FaCheckCircle /> Đã xác thực</span>;
      case "pending":
        return <span className="status pending"><FaClock /> ⏳ Đang xử lý</span>;
      default:
        return <span className="status not-verified"><FaClock /> ❌ Chưa xác thực</span>;
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/category", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      } else {
        console.error("Failed to fetch categories:", await res.text());
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchDistributorProducts = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/distributor/${distributorId}/products`, {  
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } else {
        console.error("Failed to fetch distributor products:", await res.text());
      }
    } catch (error) {
      console.error("Error fetching distributor products:", error);
    }
  };

  const handleAddProduct = async () => {
    setLoading(true);
    console.log(JSON.stringify({
        ...formdata,
        distributor: distributorId,
      },null,2));
    try {
      const res = await fetch("http://localhost:3000/api/product/distributor", {
        method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...formdata,
        distributor: distributorId,
      }),
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setProducts([...products, data.product]);
      setShowModalAdd(false);
  } catch (error) {
    console.error("Error adding product:", error);
  } finally {
    setLoading(false);
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
        <button className="btn btn-primary" onClick={() => setShowModalAdd(true)}>
          <FaPlus /> Thêm sản phẩm
        </button>
      </div>

      <div className="products-grid">
        {filteredProducts.map((product: any) => (
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
                  onClick={() => handleOpenRegisterModal(product)}
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
                      <span className="value">{selectedProduct.distributor.companyName}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Số lô:</span>
                      <span className="value">{selectedProduct._id.slice(1,6)}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Hạn sử dụng:</span>
                      <span className="value">{selectedProduct.expiryDate}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Số giấy phép:</span>
                      <span className="value">{selectedProduct.distributor.licenseNumber}</span>
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
                    handleRegisterToBlockchain(selectedProduct, originImages[0], originInfo);
                  }}
                >
                  <FaCloudUploadAlt /> Đăng ký lên Blockchain
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {showRegisterModal && selectedProduct && (
        <div className="modal-overlay">
          <div className="modal">
            {/* ===== Header ===== */}
            <div className="modal-header">
              <h2>Đăng ký sản phẩm lên Blockchain</h2>
              <button
                className="close-btn"
                onClick={() => setShowRegisterModal(false)}
              >
                ×
              </button>
            </div>

            {/* ===== Body ===== */}
            <div className="modal-body">
              <div className="blockchain-registration">
                <div className="registration-info">
                  <h3>{selectedProduct.name}</h3>
                  <p>
                    Bạn sắp thực hiện đăng ký thông tin sản phẩm này lên blockchain.
                    Thao tác này sẽ:
                  </p>
                  <ul>
                    <li>Tạo hash duy nhất cho metadata sản phẩm</li>
                    <li>Lưu thông tin nguồn gốc lên IPFS</li>
                    <li>Ghi giao dịch xác thực lên blockchain</li>
                    <li>Đánh dấu sản phẩm là "Đã xác thực nguồn gốc"</li>
                  </ul>

                  {/* Nhập thông tin nguồn gốc */}
                  <div className="form-group mt-3">
                    <label>Thông tin nguồn gốc xuất xứ:</label>
                    <textarea
                      placeholder="Nhập mô tả nguồn gốc, nơi sản xuất, số lô, giấy phép..."
                      value={originInfo}
                      onChange={(e) => setOriginInfo(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="form-group mt-3">
                    <label>Tải lên hình ảnh chứng từ:</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={(e) => setOriginImages(Array.from(e.target.files || []))} 
                    />
                    {originImages.length > 0 && <p>📎 {originImages.map((img: any) => img.name).join(", ")}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* ===== Footer ===== */}
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowRegisterModal(false)}
              >
                Hủy bỏ
              </button>
              <button
                className="btn btn-primary"
                onClick={async () => {
                  if (!originInfo.trim()) {
                    alert("Vui lòng nhập thông tin nguồn gốc trước khi đăng ký!");
                    return;
                  }
                  await handleRegisterToBlockchain(selectedProduct, originImages, originInfo);
                  setShowRegisterModal(false);
                }}
              >
                <FaCloudUploadAlt /> Xác nhận đăng ký
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalAdd && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Thêm sản phẩm mới</h2>
              <button className="close-btn" onClick={() => setShowModalAdd(false)}>×</button>
            </div>

            <div className="modal-body">
              <div className="add-product-form">
                
                {/* Tên sản phẩm */}
                <div className="form-group">
                  <label>Tên sản phẩm:</label>
                  <input 
                    type="text"
                    value={formdata.name}
                    onChange={(e) => setFormdata({ ...formdata, name: e.target.value })}
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                {/* Mô tả */}
                <div className="form-group">
                  <label>Mô tả:</label>
                  <textarea
                    value={formdata.description}
                    onChange={(e) => setFormdata({ ...formdata, description: e.target.value })}
                    placeholder="Nhập mô tả chi tiết"
                  />
                </div>

                {/* Danh mục */}
                <div className="form-group">
                  <label>Danh mục:</label>
                  <select
                    value={formdata.category}
                    onChange={(e) => setFormdata({ ...formdata, category: e.target.value })}
                  >
                    <option value="">-- Chọn danh mục --</option>
                    {categories.map((cat: any) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Thương hiệu */}
                <div className="form-group">
                  <label>Thương hiệu:</label>
                  <input 
                    type="text"
                    value={formdata.brand}
                    onChange={(e) => setFormdata({ ...formdata, brand: e.target.value })}
                    placeholder="Nhập thương hiệu"
                  />
                </div>

                {/* Giá */}
                <div className="form-group">
                  <label>Giá:</label>
                  <input 
                    type="number"
                    value={formdata.price}
                    onChange={(e) => setFormdata({ ...formdata, price: +e.target.value })}
                    placeholder="Nhập giá"
                  />
                </div>

                {/* Kho */}
                <div className="form-group">
                  <label>Kho:</label>
                  <input 
                    type="number"
                    value={formdata.stock}
                     onChange={(e) => setFormdata({ ...formdata, stock: Number(e.target.value) })}
                    placeholder="Nhập số lượng trong kho"
                  />
                </div>

                {/* Hướng dẫn sử dụng */}
                <div className="form-group">
                  <label>Hướng dẫn sử dụng:</label>
                  <textarea
                    value={formdata.usage}
                    onChange={(e) => setFormdata({ ...formdata, usage: e.target.value })}
                    placeholder="Ví dụ: Uống 2 lần mỗi ngày..."
                  />
                </div>

                {/* Ảnh (nhiều link, cách nhau dấu phẩy) */}
                <div className="form-group">
                  <label>Ảnh sản phẩm (URL):</label>
                  <input
                    type="text"
                    value={formdata.image.join(", ")}
                    onChange={(e) => {
                      const imgs = e.target.value.split(",").map((s) => s.trim());
                      setFormdata({ ...formdata, image: imgs });
                    }}
                    placeholder="Nhập nhiều link ảnh, cách nhau bằng dấu phẩy"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModalAdd(false)}>
                Hủy bỏ
              </button>

              <button className="btn btn-primary" onClick={handleAddProduct} disabled={loading}>
                {loading ? "Đang thêm..." : "Thêm sản phẩm"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default DistributorProduct;