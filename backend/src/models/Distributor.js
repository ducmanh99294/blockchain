const mongoose = require("mongoose");

const DistributorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",   // liên kết đến User
    required: true,
    unique: true
  },
  companyName: {  // tên công ty phân phối
    type: String,
    required: true
  },
  licenseNumber: { // số giấy phép kinh doanh phân phối
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    street: String,
    ward: String,
    district: String,
    city: String
  },
  products: [{  // danh sách sản phẩm mà nhà phân phối cung cấp
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }],
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Distributor", DistributorSchema);
