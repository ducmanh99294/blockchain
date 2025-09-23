import React, { useState, useEffect } from 'react';
import { 
  FaUser, FaBuilding, FaShieldAlt, FaHistory, 
  FaCreditCard, FaUsers, FaEdit, FaSave,
  FaCopy, FaExternalLinkAlt, FaQrcode
} from 'react-icons/fa';
import '../../assets/css/Distributor/account.css';

const Account = () => {
  const [distributorInfo, setDistributorInfo] = useState({});
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [staffMembers, setStaffMembers] = useState([]);
  const [blockchainHistory, setBlockchainHistory] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // Giả lập dữ liệu nhà phân phối
  useEffect(() => {
    const mockDistributor = {
      id: "DIST-2023-001",
      name: "Công ty Dược phẩm ABC",
      address: "123 Đường Láng, Đống Đa, Hà Nội",
      businessLicense: "GPKD-123456789",
      licenseIssueDate: "2020-05-15",
      licenseExpiryDate: "2025-05-15",
      taxCode: "0123456789",
      phone: "024 1234 5678",
      email: "info@duocphamabc.com",
      website: "www.duocphamabc.com",
      blockchainWallet: "0x742d35Cc6634C893292Ce8bB6239C002Ad8e6b59",
      walletBalance: "4.75 ETH",
      createdAt: "2020-06-01"
    };

    const mockStaff = [
      {
        id: 1,
        name: "Nguyễn Văn A",
        email: "nva@duocphamabc.com",
        role: "Quản lý",
        permissions: ["Xem báo cáo", "Quản lý đơn hàng", "Quản lý sản phẩm"],
        status: "active",
        lastLogin: "2023-10-15 14:30:25"
      },
      {
        id: 2,
        name: "Trần Thị B",
        email: "ttb@duocphamabc.com",
        role: "Nhân viên",
        permissions: ["Xem báo cáo", "Quản lý đơn hàng"],
        status: "active",
        lastLogin: "2023-10-14 09:15:42"
      },
      {
        id: 3,
        name: "Lê Văn C",
        email: "lvc@duocphamabc.com",
        role: "Kế toán",
        permissions: ["Xem báo cáo", "Quản lý thanh toán"],
        status: "inactive",
        lastLogin: "2023-10-10 11:20:35"
      }
    ];

    const mockBlockchainHistory = [
      {
        id: 1,
        date: "2023-10-15 14:22:18",
        action: "Xác thực lô hàng",
        details: "BATCH-2023-001 - Paracetamol 500mg",
        txHash: "0x4a8c5d87a2b3c9e1f0d8e7c2b3a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1",
        status: "confirmed",
        block: 19567243
      },
      {
        id: 2,
        date: "2023-10-14 11:40:05",
        action: "Tạo đơn hàng",
        details: "ORD-2023-102 - Nhà thuốc Minh Anh",
        txHash: "0x5b9c6d87a2b3c9e1f0d8e7c2b3a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1",
        status: "confirmed",
        block: 19562189
      },
      {
        id: 3,
        date: "2023-10-13 09:55:37",
        action: "Đăng ký sản phẩm",
        details: "Vitamin C 1000mg - CID: QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
        txHash: "0x6c1d7e87a2b3c9e1f0d8e7c2b3a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1",
        status: "confirmed",
        block: 19558321
      },
      {
        id: 4,
        date: "2023-10-12 16:30:12",
        action: "Cập nhật trạng thái",
        details: "ORD-2023-101 - Đã giao hàng",
        txHash: "0x7d2e8f87a2b3c9e1f0d8e7c2b3a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1",
        status: "pending",
        block: 19554218
      }
    ];

    const mockPaymentMethods = [
      {
        id: 1,
        type: "bank",
        bankName: "Vietcombank",
        accountNumber: "0123456789",
        accountHolder: "Công ty Dược phẩm ABC",
        branch: "Chi nhánh Hà Nội",
        isDefault: true
      },
      {
        id: 2,
        type: "bank",
        bankName: "BIDV",
        accountNumber: "9876543210",
        accountHolder: "Công ty Dược phẩm ABC",
        branch: "Chi nhánh Đống Đa",
        isDefault: false
      },
      {
        id: 3,
        type: "ewallet",
        provider: "Momo",
        accountNumber: "0912345678",
        accountHolder: "Nguyễn Văn A",
        isDefault: false
      }
    ];

    setDistributorInfo(mockDistributor);
    setStaffMembers(mockStaff);
    setBlockchainHistory(mockBlockchainHistory);
    setPaymentMethods(mockPaymentMethods);
  }, []);

  // Xử lý chỉnh sửa thông tin
  const handleEdit = () => {
    setEditing(true);
  };

  const handleSave = () => {
    setEditing(false);
    // Ở đây sẽ gọi API để lưu thông tin
    alert('Thông tin đã được cập nhật!');
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDistributorInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Sao chép địa chỉ ví
  const copyWalletAddress = () => {
    navigator.clipboard.writeText(distributorInfo.blockchainWallet);
    alert('Đã sao chép địa chỉ ví!');
  };

  // Định dạng ngày
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  // Định dạng ngày giờ
  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN');
  };

  // Hiển thị trạng thái giao dịch
  const renderStatus = (status) => {
    switch(status) {
      case "confirmed":
        return <span className="status confirmed">Đã xác nhận</span>;
      case "pending":
        return <span className="status pending">Đang chờ</span>;
      default:
        return <span className="status unknown">Không xác định</span>;
    }
  };

  return (
    <div className="account">
      <header className="page-header">
        <h1><FaUser /> Tài khoản Nhà phân phối</h1>
        <p>Quản lý thông tin và cài đặt tài khoản của bạn</p>
      </header>

      <div className="account-tabs">
        <button 
          className={activeTab === 'profile' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('profile')}
        >
          <FaUser /> Thông tin công ty
        </button>
        <button 
          className={activeTab === 'blockchain' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('blockchain')}
        >
          <FaShieldAlt /> Blockchain
        </button>
        <button 
          className={activeTab === 'payment' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('payment')}
        >
          <FaCreditCard /> Thanh toán
        </button>
        <button 
          className={activeTab === 'staff' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('staff')}
        >
          <FaUsers /> Quản lý nhân sự
        </button>
      </div>

      <div className="tab-content">
        {/* Tab thông tin công ty */}
        {activeTab === 'profile' && (
          <div className="profile-tab">
            <div className="section-header">
              <h2><FaBuilding /> Thông tin công ty</h2>
              {!editing ? (
                <button className="btn btn-primary" onClick={handleEdit}>
                  <FaEdit /> Chỉnh sửa
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="btn btn-secondary" onClick={handleCancel}>
                    Hủy
                  </button>
                  <button className="btn btn-primary" onClick={handleSave}>
                    <FaSave /> Lưu thay đổi
                  </button>
                </div>
              )}
            </div>

            <div className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Tên công ty</label>
                  <input
                    type="text"
                    name="name"
                    value={distributorInfo.name || ''}
                    onChange={handleInputChange}
                    disabled={!editing}
                  />
                </div>
                <div className="form-group">
                  <label>Mã số thuế</label>
                  <input
                    type="text"
                    name="taxCode"
                    value={distributorInfo.taxCode || ''}
                    onChange={handleInputChange}
                    disabled={!editing}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Địa chỉ</label>
                <input
                  type="text"
                  name="address"
                  value={distributorInfo.address || ''}
                  onChange={handleInputChange}
                  disabled={!editing}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Số điện thoại</label>
                  <input
                    type="text"
                    name="phone"
                    value={distributorInfo.phone || ''}
                    onChange={handleInputChange}
                    disabled={!editing}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={distributorInfo.email || ''}
                    onChange={handleInputChange}
                    disabled={!editing}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="text"
                    name="website"
                    value={distributorInfo.website || ''}
                    onChange={handleInputChange}
                    disabled={!editing}
                  />
                </div>
                <div className="form-group">
                  <label>Ngày thành lập</label>
                  <input
                    type="text"
                    value={formatDate(distributorInfo.createdAt) || ''}
                    disabled
                  />
                </div>
              </div>

              <div className="license-info">
                <h3>Giấy phép kinh doanh</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Số giấy phép</label>
                    <input
                      type="text"
                      name="businessLicense"
                      value={distributorInfo.businessLicense || ''}
                      onChange={handleInputChange}
                      disabled={!editing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Ngày cấp</label>
                    <input
                      type="text"
                      value={formatDate(distributorInfo.licenseIssueDate) || ''}
                      disabled
                    />
                  </div>
                  <div className="form-group">
                    <label>Ngày hết hạn</label>
                    <input
                      type="text"
                      value={formatDate(distributorInfo.licenseExpiryDate) || ''}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab blockchain */}
        {activeTab === 'blockchain' && (
          <div className="blockchain-tab">
            <div className="section-header">
              <h2><FaShieldAlt /> Thông tin Blockchain</h2>
            </div>

            <div className="wallet-info">
              <h3>Ví Blockchain</h3>
              <div className="wallet-address">
                <span>{distributorInfo.blockchainWallet}</span>
                <div className="wallet-actions">
                  <button className="btn btn-outline btn-small" onClick={copyWalletAddress}>
                    <FaCopy /> Sao chép
                  </button>
                  <button className="btn btn-outline btn-small">
                    <FaQrcode /> QR Code
                  </button>
                  <button className="btn btn-outline btn-small">
                    <FaExternalLinkAlt /> Xem trên Explorer
                  </button>
                </div>
              </div>
              <div className="wallet-balance">
                Số dư: <strong>{distributorInfo.walletBalance}</strong>
              </div>
            </div>

            <div className="transaction-history">
              <h3><FaHistory /> Lịch sử giao dịch gần đây</h3>
              <div className="history-table">
                <table>
                  <thead>
                    <tr>
                      <th>Thời gian</th>
                      <th>Hành động</th>
                      <th>Chi tiết</th>
                      <th>Block</th>
                      <th>Trạng thái</th>
                      <th>Transaction Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blockchainHistory.map((transaction) => (
                      <tr key={transaction.id}>
                        <td>{formatDateTime(transaction.date)}</td>
                        <td>{transaction.action}</td>
                        <td>{transaction.details}</td>
                        <td>{transaction.block}</td>
                        <td>{renderStatus(transaction.status)}</td>
                        <td className="tx-hash">
                          {transaction.txHash}
                          <button className="btn-icon" title="Xem trên Explorer">
                            <FaExternalLinkAlt />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab thanh toán */}
        {activeTab === 'payment' && (
          <div className="payment-tab">
            <div className="section-header">
              <h2><FaCreditCard /> Phương thức thanh toán</h2>
              <button className="btn btn-primary">
                Thêm phương thức
              </button>
            </div>

            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <div key={method.id} className={`payment-card ${method.isDefault ? 'default' : ''}`}>
                  <div className="payment-header">
                    <h3>
                      {method.type === 'bank' ? method.bankName : method.provider}
                      {method.isDefault && <span className="default-badge">Mặc định</span>}
                    </h3>
                    <div className="payment-actions">
                      <button className="btn btn-outline btn-small">
                        Chỉnh sửa
                      </button>
                      {!method.isDefault && (
                        <button className="btn btn-outline btn-small">
                          Đặt mặc định
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="payment-details">
                    {method.type === 'bank' ? (
                      <>
                        <div className="detail-item">
                          <span className="label">Số tài khoản:</span>
                          <span className="value">{method.accountNumber}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Chủ tài khoản:</span>
                          <span className="value">{method.accountHolder}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Chi nhánh:</span>
                          <span className="value">{method.branch}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="detail-item">
                          <span className="label">Số điện thoại:</span>
                          <span className="value">{method.accountNumber}</span>
                        </div>
                        <div className="detail-item">
                          <span className="label">Chủ tài khoản:</span>
                          <span className="value">{method.accountHolder}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab quản lý nhân sự */}
        {activeTab === 'staff' && (
          <div className="staff-tab">
            <div className="section-header">
              <h2><FaUsers /> Quản lý nhân sự</h2>
              <button className="btn btn-primary">
                Thêm nhân viên
              </button>
            </div>

            <div className="staff-list">
              <table>
                <thead>
                  <tr>
                    <th>Tên nhân viên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Quyền</th>
                    <th>Trạng thái</th>
                    <th>Đăng nhập cuối</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {staffMembers.map((staff) => (
                    <tr key={staff.id}>
                      <td className="staff-name">{staff.name}</td>
                      <td>{staff.email}</td>
                      <td>{staff.role}</td>
                      <td>
                        <div className="permissions">
                          {staff.permissions.map((permission, index) => (
                            <span key={index} className="permission-tag">{permission}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span className={`status ${staff.status}`}>
                          {staff.status === 'active' ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                        </span>
                      </td>
                      <td>{formatDateTime(staff.lastLogin)}</td>
                      <td>
                        <div className="staff-actions">
                          <button className="btn btn-outline btn-small">
                            Chỉnh sửa
                          </button>
                          <button className="btn btn-outline btn-small">
                            {staff.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;