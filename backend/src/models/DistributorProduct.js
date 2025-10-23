// models/DistributorProduct.js
const e = require("express");
const mongoose = require("mongoose");

const DistributorProductSchema = new mongoose.Schema({
  // Thông tin nhà phân phối
  distributor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Distributor", 
    required: true 
  },
  
  // Thông tin chung của sản phẩm
  name: { type: String, required: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  brand: { type: String },
  image: [{ type: String }],
  usage : { type: String }, // hướng dẫn sử dụng
  price: { type: Number, default: 0 }, // giá gốc đề xuất từ distributor
  stock: { type: Number, default: 0 }, // số lượng trong kho
  expiryDate: { type: Date }, // ngày hết hạn
  status: { 
    type: String, 
    enum: ["pending", "verified", "not_verified"], 
    default: "not_verified" 
  },
  
  imagesOrigin: [{ type: String }], 
  originInfo: { type: String },

    // Blockchain 
  blockchainTx: { type: String },     
  ipfsCidString: { type: String },    

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DistributorProduct", DistributorProductSchema);