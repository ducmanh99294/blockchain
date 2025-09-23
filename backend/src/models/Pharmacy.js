const mongoose = require("mongoose");

const PharmacySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // liên kết đến User
    required: true,
    unique: true   // 1 user chỉ có 1 pharmacy
  },
  licenseNumber: { // số giấy phép kinh doanh
    type: String,
    required: true,
    unique: true
  },
  pharmacyName: { // tên nhà thuốc
    type: String,
    required: true
  },
  address: {
    street: String,
    ward: String,
    district: String,
    city: String
  },
  phone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["open", "close"],
    default: "open"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Pharmacy", PharmacySchema);
