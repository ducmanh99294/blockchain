const mongoose = require("mongoose");
const Pharmacy = require("./Pharmacy");

const ProductSchema = new mongoose.Schema({
  pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: "Pharmacy", required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  quantity: { type: Number, default: 0 },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  brand: { type: String },
  image: [{ type: String }], // danh sách link ảnh
  rating: { 
    type: Number,
    max: 5,
    min: 0, 
    default: 0
  },
  prescription: { 
    type: Boolean, 
    default: false 
  },
  usage : { type: String }, // hướng dẫn sử dụng
  distributor: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Distributor", 
    required: true 
  },
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  sellCount: { type: Number, default: 0 },
  // 📌 Blockchain integration
  blockchainHash: { type: String },   // hash sản phẩm trên blockchain
  blockchainTx: { type: String },     // transaction hash khi ghi on-chain
  cid: { type: String },              // CID IPFS nếu có lưu file/metadata

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", ProductSchema);
