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
        uint256 giaBanSi;
        uint256 giaBanLe;
        uint256 soLuong;
        bool duocXacThuc;
        bool daBanChoNhaThuoc; // thêm biến này để kiểm tra đúng luồng
    }

    mapping(uint256 => Thuoc) public danhSachThuoc;
    
    event XacThucNguonGoc(uint256 id, string nguonGoc, string ipfsHash, address nhaPhanPhoi);
    event BanChoNhaThuoc(uint256 id, address nhaThuoc, uint256 gia);
    event BanChoNguoiDung(uint256 id, address nguoiDung, uint256 gia);

    function xacThucNguonGoc(
        uint256 id,
        uint256 giaBanSi,
        string memory nguonGoc,
        string memory ipfsHash
    ) public {
        require(danhSachThuoc[id].nhaPhanPhoi == address(0), "ID da ton tai");
        require(giaBanSi > 0, "Gia ban si phai lon hon 0");

        danhSachThuoc[id] = Thuoc({
            id: id,
            nguonGoc: nguonGoc,
            ipfsHash: ipfsHash,
            nhaPhanPhoi: msg.sender,
            nhaThuoc: address(0),
            giaBanSi: giaBanSi,
            giaBanLe: 0,
            soLuong: 0,
            duocXacThuc: true,
            daBanChoNhaThuoc: false
        });

        emit XacThucNguonGoc(id, nguonGoc, ipfsHash, msg.sender);
    }

    function muaChoNhaThuoc(uint256 id) public payable {
        Thuoc storage t = danhSachThuoc[id];
        require(t.nhaPhanPhoi != address(0), "San pham khong ton tai"); 
        require(msg.value == t.giaBanSi, "Sai so tien");

        payable(t.nhaPhanPhoi).transfer(msg.value);
        t.nhaThuoc = msg.sender;
        t.daBanChoNhaThuoc = true;

        emit BanChoNhaThuoc(id, msg.sender, msg.value);
    }

    function muaChoNguoiDung(uint256 id) public payable {
        Thuoc storage t = danhSachThuoc[id];
        require(msg.value == t.giaBanSi, "Sai so tien");

        payable(t.nhaThuoc).transfer(msg.value);
        emit BanChoNguoiDung(id, msg.sender, msg.value);
    }

    function datGiaBanLe(uint256 id, uint256 giaBanLe) public {
        Thuoc storage t = danhSachThuoc[id];
        require(t.nhaThuoc == msg.sender, "Chi nha thuoc moi duoc dat gia");
        require(t.daBanChoNhaThuoc, "Thuoc chua duoc mua tu distributor");
        require(giaBanLe > t.giaBanSi, "Gia ban le phai lon hon gia ban si");

        t.giaBanLe = giaBanLe;
    }

    function xemThongTinThuoc(uint256 id) public view returns (Thuoc memory) {
        return danhSachThuoc[id];
    }
}
