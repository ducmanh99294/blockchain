const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  items: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Product", 
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
  coupon: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Coupon", 
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
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
