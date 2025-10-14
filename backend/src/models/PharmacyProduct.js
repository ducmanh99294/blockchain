const mongoose = require("mongoose");

const PharmacyProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Tham chiếu sản phẩm gốc
      required: true,
    },
    pharmacyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pharmacy", // Thuộc về nhà thuốc nào
      required: true,
    },
    distributorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Distributor", // Nếu có distributor cung cấp
    },

    // Các trường quản lý riêng cho Pharmacy
    stock: { type: Number, default: 0 },        // tồn kho
    minStock: { type: Number, default: 0 },     // tồn kho tối thiểu
    price: { type: Number, required: true },    // giá bán do Pharmacy set
    expiryDate: { type: Date },                 // hạn sử dụng
    batchNumber: { type: String },              // lô sản xuất

    // Blockchain
    blockchainStatus: {
      type: String,
      enum: ["not_registered", "pending", "verified"],
      default: "not_registered",
    },
    transactionHash: { type: String },
    ipfsCID: { type: String },
    registeredDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PharmacyProduct", PharmacyProductSchema);
