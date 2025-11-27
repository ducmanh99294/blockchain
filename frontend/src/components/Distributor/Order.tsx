import React, { useState, useEffect } from 'react';
import { 
  FaClipboardList, FaSearch, FaEye, FaTruck, 
  FaCheckCircle, FaClock, FaFileAlt, FaShieldAlt,
  FaStore, FaBoxOpen
} from 'react-icons/fa';
import '../../assets/css/Distributor/order.css';

const DistributorOrder: React.FC = () => {
  const [orders, setOrders] = useState<any>([]);
  const [filteredOrders, setFilteredOrders] = useState<any>([]);([]);
  const [searchTerm, setSearchTerm] = useState<any>([]);('');
  const [selectedOrder, setSelectedOrder] = useState<any>([]);(null);
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(false);

  const API = 'http://localhost:3000'
  const userId = localStorage.getItem("userId")
  // Giả lập dữ liệu đơn hàng
  useEffect(() => {
    const mockOrders = [
      {
        id: "ORD-2023-001",
        pharmacy: "Nhà thuốc Minh Anh",
        pharmacyAddress: "123 Đường Láng, Hà Nội",
        status: "pending",
        orderDate: "2023-10-15",
        totalAmount: 18500000,
        items: [
          { product: "Paracetamol 500mg", quantity: 100, price: 120000, total: 12000000 },
          { product: "Amoxicillin 250mg", quantity: 50, price: 185000, total: 9250000 }
        ],
        transactionHash: null,
        cid: null,
        expectedDelivery: "2023-10-20",
        notes: "Giao hàng trong giờ hành chính"
      },
      {
        id: "ORD-2023-002",
        pharmacy: "Nhà thuốc Hồng Phúc",
        pharmacyAddress: "456 Đường Giải Phóng, Hà Nội",
        status: "processing",
        orderDate: "2023-10-14",
        totalAmount: 24500000,
        items: [
          { product: "Vitamin C 1000mg", quantity: 150, price: 95000, total: 14250000 },
          { product: "Metformin 500mg", quantity: 70, price: 135000, total: 9450000 }
        ],
        transactionHash: "0x8d9c5d87a2b3c9e1f0d8e7c2b3a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1",
        cid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
        expectedDelivery: "2023-10-18",
        notes: "Gọi điện trước khi giao hàng"
      },
      {
        id: "ORD-2023-003",
        pharmacy: "Nhà thuốc Bảo Châu",
        pharmacyAddress: "789 Đường Lê Văn Lương, Hà Nội",
        status: "shipped",
        orderDate: "2023-10-13",
        totalAmount: 12700000,
        items: [
          { product: "Paracetamol 500mg", quantity: 70, price: 120000, total: 8400000 },
          { product: "Vitamin C 1000mg", quantity: 40, price: 95000, total: 3800000 }
        ],
        transactionHash: "0x7a2c6d87a2b3c9e1f0d8e7c2b3a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1",
        cid: "QmY7yz7pX9z2cJ4KnLwHCnL72vedxjQkDDP1mXWo6uco",
        expectedDelivery: "2023-10-16",
        notes: "Nhận hàng tại kho sau"
      },
      {
        id: "ORD-2023-004",
        pharmacy: "Nhà thuốc An Khang",
        pharmacyAddress: "321 Đường Nguyễn Trãi, Hà Nội",
        status: "completed",
        orderDate: "2023-10-10",
        totalAmount: 31800000,
        items: [
          { product: "Amoxicillin 250mg", quantity: 120, price: 185000, total: 22200000 },
          { product: "Metformin 500mg", quantity: 70, price: 135000, total: 9450000 }
        ],
        transactionHash: "0x6b1c5d87a2b3c9e1f0d8e7c2b3a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1",
        cid: "QmZ3pz7pX9z2cJ4KnLwHCnL72vedxjQkDDP1mXWo6uco",
        expectedDelivery: "2023-10-13",
        deliveryDate: "2023-10-12",
        notes: "Đã giao hàng thành công"
      }
    ];
    fetchOrders();    
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API}/api/order/distributor/${userId}`)
      if(!res.ok) {
        console.log("err");
      }
      const data = await res.json();
      setOrders(data);
      setFilteredOrders(data)
    } catch (err) {
      console.error("err: ", err);
    }
  }
  // Xử lý tìm kiếm và lọc
  useEffect(() => {
    let filtered = orders;
    
    // Lọc theo trạng thái
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order: any) => order.status === statusFilter);
    }
    
    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      filtered = filtered.filter((order: any) => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.pharmacyId.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  // Xem chi tiết đơn hàng
  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Xác nhận đơn hàng và đẩy lên blockchain
  const handleConfirmOrder = async (orderId: any) => {
    setActionLoading(true);
    
    // Giả lập gọi API để xác nhận đơn hàng
    try {
      // Giả lập thời gian xử lý
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Cập nhật trạng thái đơn hàng
      const updatedOrders = orders.map((order: any) => 
        order.id === orderId ? {
          ...order, 
          status: "processing",
          transactionHash: "0x" + Math.random().toString(16).substr(2, 64),
          cid: "Qm" + Math.random().toString(16).substr(2, 42)
        } : order
      );
      
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Lỗi khi xác nhận đơn hàng:", error);
    } finally {
      setActionLoading(false);
    }
  };

  // Cập nhật trạng thái giao hàng
const handleUpdateStatus = async (orderId: any, newStatus: any) => {
  console.log()
  setActionLoading(true);
  try {
    const res = await fetch(`${API}/api/pharmacy/order/${orderId._id}`, {
      method: "PUT",
      headers: { 
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({status: newStatus})
    });

    if (!res.ok) {
      console.log("err");
      return;
    }

    // Lấy dữ liệu đơn hàng vừa cập nhật (giả sử API trả về đơn hàng mới)
    const updatedOrder = await res.json();
    console.log(updatedOrder)
    if (newStatus === "completed") {
      // Tạo PharmacyProduct cho từng item trong đơn
      for (const item of updatedOrder.items) {
        const productBody = {
          masterProduct: item.distributorProductId,
          pharmacy: updatedOrder.pharmacyId,
          price: item.price,
          discountPrice: 0,
          quantity: item.quantity,
          prescription: false, 
          available: false,
        };
        console.log(JSON.stringify(productBody,null,2))
        const createProductRes = await fetch(`${API}/api/product/pharmacy`, {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(productBody)
        });

        if (!createProductRes.ok) {
          console.error("Lỗi khi tạo sản phẩm cho pharmacy", await createProductRes.text());
        }
      }
    }

    const updatedOrders = orders.map((order: any) => 
      order._id === orderId._id ? {
        ...order, 
        status: newStatus,
        ...(newStatus === "completed" ? { 
          deliveryDate: new Date().toISOString().split('T')[0], 
        } : {})
      } : order
    );

    setOrders(updatedOrders);

  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái:", error);
  } finally {
    setActionLoading(false);
  }
};

  // Định dạng số tiền
  const formatCurrency = (amount: any) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Định dạng ngày
  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Hiển thị trạng thái đơn hàng
  const renderStatus = (status: any) => {
    switch(status) {
      case "pending":
        return <span className="status pending"><FaClock /> Chờ xác nhận</span>;
      case "processing":
        return <span className="status processing"><FaBoxOpen /> Đang xử lý</span>;
      case "shipped":
        return <span className="status shipped"><FaTruck /> Đang giao</span>;
      case "completed":
        return <span className="status completed"><FaCheckCircle /> Hoàn thành</span>;
      default:
        return <span className="status unknown">Không xác định</span>;
    }
  };

  // Lấy số lượng đơn hàng theo trạng thái
  const getOrderCountByStatus = (status: any) => {
    if (orders) {
      return orders.filter((order: any) => order.status === status).length;
    }
  };

  console.log(orders)
  return (
    <div className="order-management">
      <header className="page-header">
        <h1><FaClipboardList /> Quản lý Đơn hàng từ Nhà thuốc</h1>
        <p>Theo dõi và quản lý các đơn nhập hàng từ nhà thuốc với xác thực blockchain</p>
      </header>

      <div className="order-stats">
        <div className="stat-card">
          <div className="stat-icon total">
            <FaClipboardList />
          </div>
          <div className="stat-info">
            <h3>{orders.length}</h3>
            <p>Tổng đơn hàng</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">
            <FaClock />
          </div>
          <div className="stat-info">
            <h3>{getOrderCountByStatus('pending')}</h3>
            <p>Chờ xác nhận</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon processing">
            <FaBoxOpen />
          </div>
          <div className="stat-info">
            <h3>{getOrderCountByStatus('processing')}</h3>
            <p>Đang xử lý</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon completed">
            <FaCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{getOrderCountByStatus('completed')}</h3>
            <p>Đã hoàn thành</p>
          </div>
        </div>
      </div>

      <div className="controls">
        <div className="search-box">
          <FaSearch />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo ID hoặc tên nhà thuốc..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <label>Lọc theo trạng thái:</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ xác nhận</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipped">Đang giao</option>
            <option value="completed">Hoàn thành</option>
          </select>
        </div>
      </div>

      <div className="orders-table">
        <div className="table-header">
          <div>ID đơn hàng</div>
          <div>Nhà thuốc</div>
          <div>Ngày đặt</div>
          <div>Tổng tiền</div>
          <div>Trạng thái</div>
          <div>Thao tác</div>
        </div>
        <div className="table-body">
          {filteredOrders.length > 0  && filteredOrders.map((order: any) => (
            <div key={order._id} className="table-row">
              <div className="order-id">{order._id}</div>
              <div className="pharmacy-info">
                <div className="pharmacy-name">{order.pharmacyId.username}</div>
                <div className="pharmacy-address">{order.pharmacyAddress}</div>
              </div>
              <div className="order-date">{formatDate(order.createdAt)}</div>
              <div className="order-total">{formatCurrency(order.totalPrice)}</div>
              <div className="order-status">{renderStatus(order.status)}</div>
              <div className="order-actions">
                <button 
                  className="btn btn-outline"
                  onClick={() => handleViewDetails(order)}
                >
                  <FaEye /> Chi tiết
                </button>
                
                {order.status === "pending" && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleUpdateStatus(order, "processing")}
                    disabled={actionLoading}
                  >
                    <FaShieldAlt /> Xác nhận
                  </button>
                )}
                
                {order.status === "processing" && (
                  <button 
                    className="btn btn-warning"
                    onClick={() => handleUpdateStatus(order, "shipped")}
                    disabled={actionLoading}
                  >
                    <FaTruck /> Giao hàng
                  </button>
                )}
                
                {order.status === "shipped" && (
                  <button 
                    className="btn btn-success"
                    onClick={() => handleUpdateStatus(order, "completed")}
                    disabled={actionLoading}
                  >
                    <FaCheckCircle /> Hoàn thành
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal chi tiết đơn hàng */}
      {showModal && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Chi tiết đơn hàng {selectedOrder.id}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="order-detail">
                <div className="order-info">
                  <div className="info-section">
                    <h3><FaStore /> Thông tin nhà thuốc</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="label">Tên nhà thuốc:</span>
                        <span className="value">{selectedOrder.pharmacyId.username}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Địa chỉ:</span>
                        <span className="value">{selectedOrder.pharmacyAddress}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-section">
                    <h3><FaClipboardList /> Thông tin đơn hàng</h3>
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="label">Ngày đặt:</span>
                        <span className="value">{formatDate(selectedOrder.createdAt)}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Trạng thái:</span>
                        <span className="value">{renderStatus(selectedOrder.status)}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Dự kiến giao:</span>
                        <span className="value">{formatDate(selectedOrder.expectedDelivery)}</span>
                      </div>
                      {selectedOrder.deliveryDate && (
                        <div className="info-item">
                          <span className="label">Ngày giao:</span>
                          <span className="value">{formatDate(selectedOrder.deliveryDate)}</span>
                        </div>
                      )}
                      <div className="info-item">
                        <span className="label">Ghi chú:</span>
                        <span className="value">{selectedOrder.notes || "Không có ghi chú"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="info-section">
                    <h3><FaBoxOpen /> Sản phẩm đặt hàng</h3>
                    <div className="order-items">
                      <div className="items-header">
                        <div>Sản phẩm</div>
                        <div>Số lượng</div>
                        <div>Đơn giá</div>
                        <div>Thành tiền</div>
                      </div>
                      {selectedOrder.items.map((item: any, index: any) => (
                        <div key={index} className="item-row">
                          <div className="product-name">{item.name}</div>
                          <div className="quantity">{item.quantity}</div>
                          <div className="price">{formatCurrency(item.price)}</div>
                          <div className="total">{formatCurrency(item.price * item.quantity)}</div>
                        </div>
                      ))}
                      <div className="items-footer">
                        <div className="grand-total">
                          Tổng cộng: {formatCurrency(selectedOrder.totalPrice)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {(selectedOrder.transactionHash || selectedOrder.cid) && (
                    <div className="info-section">
                      <h3><FaShieldAlt /> Thông tin Blockchain</h3>
                      <div className="info-grid">
                        {selectedOrder.transactionHash && (
                          <div className="info-item full-width">
                            <span className="label">Transaction Hash:</span>
                            <span className="value hash">{selectedOrder.transactionHash}</span>
                            <button className="btn btn-outline btn-small">
                              <FaShieldAlt /> Kiểm tra
                            </button>
                          </div>
                        )}
                        {selectedOrder.cid && (
                          <div className="info-item full-width">
                            <span className="label">CID IPFS:</span>
                            <span className="value cid">{selectedOrder.cid}</span>
                            <button className="btn btn-outline btn-small">
                              <FaFileAlt /> Xem chứng từ
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Đóng</button>
              
              {selectedOrder.status === "pending" && (
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setShowModal(false);
                    handleConfirmOrder(selectedOrder.id);
                  }}
                  disabled={actionLoading}
                >
                  <FaShieldAlt /> Xác nhận đơn hàng
                </button>
              )}
              
              {selectedOrder.status === "processing" && (
                <button 
                  className="btn btn-warning"
                  onClick={() => {
                    setShowModal(false);
                    handleUpdateStatus(selectedOrder.id, "shipped");
                  }}
                  disabled={actionLoading}
                >
                  <FaTruck /> Cập nhật đang giao
                </button>
              )}
              
              {selectedOrder.status === "shipped" && (
                <button 
                  className="btn btn-success"
                  onClick={() => {
                    setShowModal(false);
                    handleUpdateStatus(selectedOrder.id, "completed");
                  }}
                  disabled={actionLoading}
                >
                  <FaCheckCircle /> Xác nhận hoàn thành
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DistributorOrder;