// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract QuanLyThuoc is Ownable {
    constructor() Ownable(msg.sender) {}

    struct Thuoc {
        uint256 id; 
        string nguonGoc;
        string ipfsHash;
        address nhaPhanPhoi; 
        address nhaThuoc;
        address nguoiTieuDung;
        uint256 giaBanSi;
        uint256 giaBanLe;
        bool duocXacThuc;
        bool daBanChoNhaThuoc;
        bool daBanChoNguoiTieuDung;
    }

    mapping(uint256 => Thuoc) public danhSachThuoc;
    
    event XacThucNguonGoc(uint256 id, string nguonGoc, string ipfsHash, address nhaPhanPhoi);
    event BanChoNhaThuoc(uint256 id, address nhaThuoc, uint256 gia);
    event BanChoNguoiTieuDung(uint256 id, address nguoiTieuDung, uint256 gia);

    /**
     * @dev Đăng ký sản phẩm (đã tối ưu)
     * Chỉ lưu các thông tin cần thiết cho logic on-chain.
     */
    function xacThucNguonGoc(
        uint256 id,
        uint256 giaBanSi,
        string memory nguonGoc,
        string memory ipfsHash
    ) public {
        require(danhSachThuoc[id].nhaPhanPhoi == address(0), "ID san pham nay da duoc dang ky");
        require(giaBanSi > 0, "Gia ban si phai lon hon 0");

        danhSachThuoc[id] = Thuoc({
            id: id,
            nguonGoc: nguonGoc,
            ipfsHash: ipfsHash,
            nhaPhanPhoi: msg.sender,
            nhaThuoc: address(0),
            nguoiTieuDung: address(0),
            giaBanSi: giaBanSi,
            giaBanLe: 0,
            duocXacThuc: true,
            daBanChoNhaThuoc: false,
            daBanChoNguoiTieuDung: false
        });

        emit XacThucNguonGoc(id, nguonGoc, ipfsHash, msg.sender);
    }

    //
    // --- CÁC HÀM KHÁC GIỮ NGUYÊN ---
    // (Vì chúng ta đã giữ lại giaBanSi nên chúng vẫn hoạt động)
    //

    function muaChoNhaThuoc(uint256 id) public payable {
        Thuoc storage t = danhSachThuoc[id];
        require(t.nhaPhanPhoi != address(0), "San pham khong ton tai"); 
        require(!t.daBanChoNhaThuoc, "Thuoc da duoc ban cho nha thuoc");
        require(msg.value == t.giaBanSi, "Sai so tien gui vao");

        payable(t.nhaPhanPhoi).transfer(msg.value);
        t.nhaThuoc = msg.sender;
        t.daBanChoNhaThuoc = true;

        emit BanChoNhaThuoc(id, msg.sender, msg.value);
    }

    function datGiaBanLe(uint256 id, uint256 giaBanLe) public {
        Thuoc storage t = danhSachThuoc[id];
        require(t.nhaThuoc == msg.sender, "Chi nha thuoc moi duoc dat gia");
        require(t.daBanChoNhaThuoc, "Thuoc chua duoc mua tu distributor");
        require(giaBanLe > t.giaBanSi, "Gia ban le phai lon hon gia ban si");
        t.giaBanLe = giaBanLe;
    }

    function muaTuNguoiTieuDung(uint256 id) public payable {
        Thuoc storage t = danhSachThuoc[id];
        require(t.giaBanLe > 0, "Nha thuoc chua dat gia ban le");
        require(!t.daBanChoNguoiTieuDung, "Thuoc da duoc ban cho nguoi tieu dung");
        require(msg.value == t.giaBanLe, "Sai so tien gui vao");

        payable(t.nhaThuoc).transfer(msg.value);
        t.nguoiTieuDung = msg.sender;
        t.daBanChoNguoiTieuDung = true;

        emit BanChoNguoiTieuDung(id, msg.sender, msg.value);
    }

    function xemThongTinThuoc(uint256 id)
        public
        view
        returns (Thuoc memory)
    {
        return danhSachThuoc[id];
    }
}