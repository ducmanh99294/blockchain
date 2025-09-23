// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract quanLiThuoc {
    struct DrugBatch {
        uint256 batchId;               // ID lô thuốc
        string drugName;               // Tên thuốc
        uint256 manufactureDate;       // Ngày sản xuất (timestamp)
        uint256 expiryDate;            // Hạn sử dụng (timestamp)
        address manufacturer;          // Địa chỉ ví nhà sản xuất
        address currentOwner;          // Chủ sở hữu hiện tại
        string ipfsHash;               // Hash metadata ngoài chuỗi (IPFS)
        bool exists;                   // Kiểm tra lô có tồn tại hay không
    }

    struct TransferHistory {
        address from;
        address to;
        uint256 timestamp;
    }

    mapping(uint256 => DrugBatch) public batches; // batchId → thông tin lô thuốc
    mapping(uint256 => TransferHistory[]) public batchTransfers; // lịch sử giao dịch

    uint256 public nextBatchId = 1;

    event BatchCreated(uint256 batchId, string drugName, address manufacturer);
    event BatchTransferred(uint256 batchId, address from, address to);

    // Tạo lô thuốc mới (chỉ manufacturer gọi)
    function createBatch(
        string memory _drugName,
        uint256 _manufactureDate,
        uint256 _expiryDate,
        string memory _ipfsHash
    ) public {
        batches[nextBatchId] = DrugBatch({
            batchId: nextBatchId,
            drugName: _drugName,
            manufactureDate: _manufactureDate,
            expiryDate: _expiryDate,
            manufacturer: msg.sender,
            currentOwner: msg.sender,
            ipfsHash: _ipfsHash,
            exists: true
        });

        emit BatchCreated(nextBatchId, _drugName, msg.sender);
        nextBatchId++;
    }

    // Chuyển quyền sở hữu (Manufacturer → Pharmacy → Consumer)
    function transferBatch(uint256 _batchId, address _to) public {
        require(batches[_batchId].exists, "Batch does not exist");
        require(batches[_batchId].currentOwner == msg.sender, "Not batch owner");

        batches[_batchId].currentOwner = _to;
        batchTransfers[_batchId].push(
            TransferHistory(msg.sender, _to, block.timestamp)
        );

        emit BatchTransferred(_batchId, msg.sender, _to);
    }

    // Lấy lịch sử giao dịch của lô thuốc
    function getTransferHistory(uint256 _batchId) 
        public view returns (TransferHistory[] memory) 
    {
        return batchTransfers[_batchId];
    }
}
