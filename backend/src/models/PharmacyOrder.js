const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  pharmacyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  items: [
    {
      distributorProductId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "DistributorProduct", 
        required: true 
      },
      name: String,        // snapshot tên SP
      price: Number,       // snapshot giá SP tại thời điểm mua
      quantity: { type: Number, default: 1 }
    }
  ],
  shippingInfo: {
    fullName: String,
    phone: String,
    address: String,
    ward: String,
    district: String,
    city: String
  },
  shippingMethod: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Shipping", 
    required: true 
  },
  paymentMethod: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Payment", 
    required: true 
  },
  subtotal: { type: Number, required: true },      // tổng tiền hàng
  shippingFee: { type: Number, default: 0 },       // phí ship (snapshot)
  discount: { type: Number, default: 0 },          // số tiền giảm giá
  totalPrice: { type: Number, required: true },    // tổng cuối cùng sau giảm giá + phí ship
  status: { 
    type: String, 
    enum: ["pending", "paid", "shipping", "completed", "cancelled"], 
    default: "pending" 
  },
  trackingNumber: { type: String }, 
  cancelReason: { type: String },
},{ timestamps: true });

module.exports = mongoose.model("PharmacyOrder", OrderSchema);
