// pages/PharmacyAccount.js
import React, { useState } from 'react';
import '../../assets/css/Pharmacy/account.css';


const PharmacyAccount: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile'); // profile, blockchain, payment, staff
  const [isEditing, setIsEditing] = useState(false);

  // Dữ liệu mẫu nhà thuốc
  const [pharmacyData, setPharmacyData] = useState({
    name: "Nhà Thuốc Minh Anh",
    licenseNumber: "GPKD-123456",
    address: "123 Đường Nguyễn Văn Linh, P. Tân Thuận Đông, Q.7, TP.HCM",
    phone: "028 3842 1234",
    email: "contact@nhathuocminhanh.com",
    owner: "Nguyễn Văn A",
    taxCode: "0312345678",
    establishedDate: "2015-06-15",
    businessType: "Nhà thuốc Đông Dược",
    operatingHours: "7:00 - 22:00 hàng ngày"
  });

  // Thông tin blockchain
  const [blockchainData, setBlockchainData] = useState({
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    network: "Polygon Mainnet",
    balance: "2.45 MATIC",
    transactionCount: 127,
    verified: true,
    verificationDate: "2024-01-15"
  });

  // Lịch sử giao dịch blockchain
  const [blockchainTransactions, setBlockchainTransactions] = useState([
    {
      hash: "0x4a7c1b9e2f8d3a6b5c4e8f7a2b3c6d9e1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c9",
      type: "product_registration",
      description: "Đăng ký lô thuốc Panadol Extra",
      amount: "0.002 MATIC",
      date: "2024-03-15T10:30:00",
      status: "confirmed",
      block: 42315678
    },
    {
      hash: "0x8b3c6d9e1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c94a7c1b9e2f8d3a6b5c4e8f7",
      type: "order_confirmation",
      description: "Xác nhận đơn hàng #MED123456",
      amount: "0.0015 MATIC",
      date: "2024-03-14T15:45:00",
      status: "confirmed",
      block: 42314523
    },
    {
      hash: "0x3c6d9e1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c94a7c1b9e2f8d3a6b5c4e8f7a2",
      type: "supplier_order",
      description: "Đặt hàng nhà phân phối",
      amount: "0.003 MATIC",
      date: "2024-03-12T09:15:00",
      status: "pending",
      block: 42312345
    },
    {
      hash: "0x9e1f5a8b7c4d3e2f9a6b5c8e7f4a3b2d1c94a7c1b9e2f8d3a6b5c4e8f7a2b3c6",
      type: "verification",
      description: "Xác minh thuốc kháng sinh",
      amount: "0.001 MATIC",
      date: "2024-03-10T14:20:00",
      status: "confirmed",
      block: 42309876
    }
  ]);

  // Phương thức thanh toán
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'bank',
      bankName: "Vietcombank",
      accountNumber: "0123456789",
      accountHolder: "NHA THUOC MINH ANH",
      branch: "Chi nhánh TP.HCM",
      isDefault: true
    },
    {
      id: 2,
      type: 'momo',
      phone: "0901234567",
      name: "Nguyễn Văn A",
      isDefault: false
    },
    {
      id: 3,
      type: 'bank',
      bankName: "BIDV",
      accountNumber: "9876543210",
      accountHolder: "NHA THUOC MINH ANH",
      branch: "Chi nhánh Q.7",
      isDefault: false
    }
  ]);

  // Nhân sự
  const [staffMembers, setStaffMembers] = useState([
    {
      id: 1,
      name: "Nguyễn Thị B",
      email: "nguyenthib@nhathuocminhanh.com",
      role: "Dược sĩ",
      phone: "0901122334",
      status: "active",
      joinDate: "2023-01-15",
      permissions: ["view_products", "manage_orders", "view_reports"]
    },
    {
      id: 2,
      name: "Trần Văn C",
      email: "tranvanc@nhathuocminhanh.com",
      role: "Quản lý",
      phone: "0902233445",
      status: "active",
      joinDate: "2022-06-20",
      permissions: ["full_access"]
    },
    {
      id: 3,
      name: "Lê Thị D",
      email: "lethid@nhathuocminhanh.com",
      role: "Nhân viên bán hàng",
      phone: "0903344556",
      status: "inactive",
      joinDate: "2024-02-10",
      permissions: ["view_products", "manage_orders"]
    }
  ]);

  // Format ngày
  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format datetime
  const formatDateTime = (dateString: any) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Xử lý thay đổi thông tin
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setPharmacyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Hiển thị trạng thái giao dịch
  const renderTransactionStatus = (status: any) => {
    switch (status) {
      case 'confirmed':
        return <span className="status-badge confirmed">✅ Đã xác nhận</span>;
      case 'pending':
        return <span className="status-badge pending">⏳ Đang chờ</span>;
      default:
        return <span className="status-badge">Unknown</span>;
    }
  };

  // Hiển thị loại giao dịch
  const renderTransactionType = (type: any) => {
    switch (type) {
      case 'product_registration':
        return "Đăng ký sản phẩm";
      case 'order_confirmation':
        return "Xác nhận đơn hàng";
      case 'supplier_order':
        return "Đặt hàng NCC";
      case 'verification':
        return "Xác minh thuốc";
      default:
        return type;
    }
  };

  // Sao chép địa chỉ ví
  const copyWalletAddress = () => {
    navigator.clipboard.writeText(blockchainData.walletAddress);
    alert('Đã sao chép địa chỉ ví!');
  };

  // Thêm phương thức thanh toán
  const addPaymentMethod = () => {
    // Logic thêm phương thức thanh toán mới
    alert('Chức năng thêm phương thức thanh toán');
  };

  // Thêm nhân viên
  const addStaffMember = () => {
    // Logic thêm nhân viên mới
    alert('Chức năng thêm nhân viên');
  };

  return (
    <div className="pharmacy-account-page">
      <div className="account-container">
        {/* Header */}
        <div className="account-header">
          <div className="header-left">
            <h1>Tài Khoản Nhà Thuốc</h1>
            <p>Quản lý thông tin và cài đặt nhà thuốc</p>
          </div>
          <div className="header-right">
            <div className="pharmacy-status">
              <span className="status-badge verified">✅ Đã xác minh</span>
              <span className="blockchain-status">⛓️ Kết nối Blockchain</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            🏢 Thông tin Nhà thuốc
          </button>
          <button
            className={`tab-btn ${activeTab === 'blockchain' ? 'active' : ''}`}
            onClick={() => setActiveTab('blockchain')}
          >
            ⛓️ Blockchain
          </button>
          <button
            className={`tab-btn ${activeTab === 'payment' ? 'active' : ''}`}
            onClick={() => setActiveTab('payment')}
          >
            💳 Thanh toán
          </button>
          <button
            className={`tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
            onClick={() => setActiveTab('staff')}
          >
            👥 Nhân sự
          </button>
        </div>

        {/* Main Content */}
        <div className="account-content">
          {/* Thông tin nhà thuốc */}
          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="profile-card">
                <div className="card-header">
                  <h2>Thông tin Nhà thuốc</h2>
                  <button 
                    className="edit-btn"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    {isEditing ? '💾 Lưu thay đổi' : '✏️ Chỉnh sửa'}
                  </button>
                </div>

                <div className="profile-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Tên nhà thuốc *</label>
                      <input
                        type="text"
                        name="name"
                        value={pharmacyData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>Số giấy phép KD *</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={pharmacyData.licenseNumber}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Địa chỉ *</label>
                    <input
                      type="text"
                      name="address"
                      value={pharmacyData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Điện thoại *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={pharmacyData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={pharmacyData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Chủ sở hữu *</label>
                      <input
                        type="text"
                        name="owner"
                        value={pharmacyData.owner}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>Mã số thuế *</label>
                      <input
                        type="text"
                        name="taxCode"
                        value={pharmacyData.taxCode}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Ngày thành lập</label>
                      <input
                        type="date"
                        name="establishedDate"
                        value={pharmacyData.establishedDate}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="form-group">
                      <label>Loại hình kinh doanh</label>
                      <select
                        name="businessType"
                        value={pharmacyData.businessType}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      >
                        <option value="Nhà thuốc Đông Dược">Nhà thuốc Đông Dược</option>
                        <option value="Nhà thuốc Tây">Nhà thuốc Tây</option>
                        <option value="Quầy thuốc">Quầy thuốc</option>
                        <option value="Công ty Dược phẩm">Công ty Dược phẩm</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Giờ hoạt động</label>
                    <input
                      type="text"
                      name="operatingHours"
                      value={pharmacyData.operatingHours}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="VD: 7:00 - 22:00 hàng ngày"
                    />
                  </div>

                  {isEditing && (
                    <div className="form-actions">
                      <button className="save-btn">Lưu thay đổi</button>
                      <button 
                        className="cancel-btn"
                        onClick={() => setIsEditing(false)}
                      >
                        Hủy
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Documents */}
              <div className="documents-card">
                <h3>📄 Tài liệu kinh doanh</h3>
                <div className="documents-list">
                  <div className="document-item">
                    <span className="document-name">Giấy phép kinh doanh</span>
                    <span className="document-status verified">✅ Đã tải lên</span>
                    <button className="view-btn">Xem</button>
                  </div>
                  <div className="document-item">
                    <span className="document-name">Giấy chứng nhận đủ điều kiện</span>
                    <span className="document-status verified">✅ Đã tải lên</span>
                    <button className="view-btn">Xem</button>
                  </div>
                  <div className="document-item">
                    <span className="document-name">Chứng chỉ hành nghề dược</span>
                    <span className="document-status pending">⏳ Chờ xác minh</span>
                    <button className="upload-btn">Tải lên</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Blockchain */}
          {activeTab === 'blockchain' && (
            <div className="blockchain-section">
              <div className="blockchain-card">
                <h2>Thông tin Blockchain</h2>
                <div className="wallet-info">
                  <div className="wallet-address">
                    <label>Địa chỉ ví:</label>
                    <div className="address-display">
                      <span className="address">{blockchainData.walletAddress}</span>
                      <button 
                        className="copy-btn"
                        onClick={copyWalletAddress}
                        title="Sao chép địa chỉ"
                      >
                        📋
                      </button>
                    </div>
                  </div>

                  <div className="wallet-details">
                    <div className="detail-item">
                      <span className="label">Mạng lưới:</span>
                      <span className="value">{blockchainData.network}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Số dư:</span>
                      <span className="value">{blockchainData.balance}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Số giao dịch:</span>
                      <span className="value">{blockchainData.transactionCount}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Trạng thái xác minh:</span>
                      <span className="value verified">✅ Đã xác minh</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Ngày xác minh:</span>
                      <span className="value">{formatDate(blockchainData.verificationDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="wallet-actions">
                  <button className="action-btn">
                    💰 Nạp tiền
                  </button>
                  <button className="action-btn">
                    🔑 Quản lý khóa
                  </button>
                  <button className="action-btn">
                    🔄 Chuyển mạng
                  </button>
                </div>
              </div>

              {/* Transaction History */}
              <div className="transactions-card">
                <h3>Lịch sử Giao dịch Blockchain</h3>
                <div className="transactions-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Mã giao dịch</th>
                        <th>Loại</th>
                        <th>Mô tả</th>
                        <th>Phí</th>
                        <th>Thời gian</th>
                        <th>Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {blockchainTransactions.map((tx, index) => (
                        <tr key={index}>
                          <td>
                            <a
                              href={`https://polygonscan.com/tx/${tx.hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="tx-link"
                              title="Xem trên PolygonScan"
                            >
                              {tx.hash.slice(0, 12)}... ↗
                            </a>
                          </td>
                          <td>{renderTransactionType(tx.type)}</td>
                          <td>{tx.description}</td>
                          <td>{tx.amount}</td>
                          <td>{formatDateTime(tx.date)}</td>
                          <td>{renderTransactionStatus(tx.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="table-actions">
                  <button className="view-all-btn">
                    Xem tất cả giao dịch
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Thanh toán */}
          {activeTab === 'payment' && (
            <div className="payment-section">
              <div className="payment-card">
                <div className="card-header">
                  <h2>Phương thức Thanh toán</h2>
                  <button 
                    className="add-btn"
                    onClick={addPaymentMethod}
                  >
                    ＋ Thêm phương thức
                  </button>
                </div>

                <div className="payment-methods">
                  {paymentMethods.map(method => (
                    <div key={method.id} className="payment-method">
                      <div className="method-icon">
                        {method.type === 'bank' ? '🏦' : '📱'}
                      </div>
                      <div className="method-info">
                        <h4>{method.type === 'bank' ? method.bankName : 'Ví MoMo'}</h4>
                        <p>
                          {method.type === 'bank' 
                            ? `Số tài khoản: ${method.accountNumber}`
                            : `Số điện thoại: ${method.phone}`
                          }
                        </p>
                        <p>{method.type === 'bank' ? `Chủ tài khoản: ${method.accountHolder}` : `Tên: ${method.name}`}</p>
                        {method.type === 'bank' && <p>Chi nhánh: {method.branch}</p>}
                      </div>
                      <div className="method-actions">
                        {method.isDefault && (
                          <span className="default-badge">Mặc định</span>
                        )}
                        <button className="edit-btn">Sửa</button>
                        {!method.isDefault && (
                          <button className="delete-btn">Xóa</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Settings */}
              <div className="settings-card">
                <h3>Cài đặt Thanh toán</h3>
                <div className="settings-list">
                  <div className="setting-item">
                    <label>Tự động chuyển tiền về ngân hàng</label>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>Ngưỡng tự động chuyển tiền</label>
                    <select defaultValue="1000000">
                      <option value="500000">500,000đ</option>
                      <option value="1000000">1,000,000đ</option>
                      <option value="5000000">5,000,000đ</option>
                    </select>
                  </div>
                  <div className="setting-item">
                    <label>Chấp nhận thanh toán crypto</label>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Nhân sự */}
          {activeTab === 'staff' && (
            <div className="staff-section">
              <div className="staff-card">
                <div className="card-header">
                  <h2>Quản lý Nhân sự</h2>
                  <button 
                    className="add-btn"
                    onClick={addStaffMember}
                  >
                    ＋ Thêm nhân viên
                  </button>
                </div>

                <div className="staff-list">
                  {staffMembers.map(staff => (
                    <div key={staff.id} className="staff-member">
                      <div className="member-avatar">
                        {staff.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="member-info">
                        <h4>{staff.name}</h4>
                        <p>{staff.role}</p>
                        <p>{staff.email}</p>
                        <p>{staff.phone}</p>
                        <span className={`status ${staff.status}`}>
                          {staff.status === 'active' ? '🟢 Đang hoạt động' : '🔴 Ngừng hoạt động'}
                        </span>
                      </div>
                      <div className="member-actions">
                        <button className="edit-btn">Sửa</button>
                        <button className="permissions-btn">Quyền</button>
                        {staff.status === 'active' ? (
                          <button className="deactivate-btn">Vô hiệu hóa</button>
                        ) : (
                          <button className="activate-btn">Kích hoạt</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Permissions Guide */}
              <div className="permissions-card">
                <h3>Hướng dẫn Phân quyền</h3>
                <div className="permissions-list">
                  <div className="permission-item">
                    <h4>👀 Xem sản phẩm</h4>
                    <p>Xem danh sách sản phẩm và thông tin chi tiết</p>
                  </div>
                  <div className="permission-item">
                    <h4>📦 Quản lý đơn hàng</h4>
                    <p>Tạo, xử lý và theo dõi đơn hàng</p>
                  </div>
                  <div className="permission-item">
                    <h4>📊 Xem báo cáo</h4>
                    <p>Truy cập báo cáo doanh thu và tồn kho</p>
                  </div>
                  <div className="permission-item">
                    <h4>⚙️ Quản lý sản phẩm</h4>
                    <p>Thêm, sửa thông tin sản phẩm</p>
                  </div>
                  <div className="permission-item">
                    <h4>🔐 Full Access</h4>
                    <p>Truy cập toàn bộ hệ thống</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats Footer */}
        <div className="stats-footer">
          <div className="stat-item">
            <span className="stat-number">{staffMembers.length}</span>
            <span className="stat-label">Nhân viên</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{blockchainTransactions.length}</span>
            <span className="stat-label">Giao dịch blockchain</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{paymentMethods.length}</span>
            <span className="stat-label">Phương thức thanh toán</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{blockchainData.transactionCount}</span>
            <span className="stat-label">Tổng giao dịch</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyAccount;