// models/PharmacyProduct.js
const mongoose = require("mongoose");


const PharmacyProductSchema = new mongoose.Schema({
  // Liên kết đến sản phẩm gốc (quan trọng nhất)
  masterProduct: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "DistributorProduct", 
    required: true 
  },
  
  // Nhà thuốc đang bán sản phẩm này
  pharmacy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Pharmacy", 
    required: true 
  },
  
  // Thông tin bán hàng của nhà thuốc
  price: { type: Number, required: true, default: 0 },
  discountPrice: { type: Number, default: 0 },
  quantity: { type: Number, default: 0 },
  prescription: { type: Boolean, default: false }, // Yêu cầu đơn thuốc

  available: { type: Boolean, default: false },
  // Chỉ số bán hàng
  viewCount: { type: Number, default: 0 },
  likeCount: { type: Number, default: 0 },
  sellCount: { type: Number, default: 0 },

  createdAt: { type: Date, default: Date.now }
});

// Đảm bảo mỗi nhà thuốc chỉ có 1 bản ghi cho 1 sản phẩm gốc
PharmacyProductSchema.index({ masterProduct: 1, pharmacy: 1 }, { unique: true });

module.exports = mongoose.model("PharmacyProduct", PharmacyProductSchema);