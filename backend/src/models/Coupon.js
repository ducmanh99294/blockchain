const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true 
},
  discount: { 
    type: Number, 
    required: true 
},
  type: { 
    type: String, 
    enum: ["percent", "fixed", "shipping"], 
    required: true 
},
  minOrder: { 
    type: Number, 
    default: 0 
},
  description: String,
  expiryDate: Date
}, { timestamps: true });

module.exports = mongoose.model("Coupon", CouponSchema);
