const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: String,         // snapshot tên SP
      price: Number,        // snapshot giá SP tại thời điểm mua
      quantity: { type: Number, default: 1 }
    }
  ],
  shippingAddress: {
    fullName: String,
    phone: String,
    address: String,
    ward: String,
    district: String,
    city: String
  },
  paymentMethod: { 
    type: String, 
    enum: ["COD", "Banking", "Momo", "Visa"], 
    default: "COD" 
  },
  status: { 
    type: String, 
    enum: ["pending", "paid", "shipping", "completed", "cancelled"], 
    default: "pending" 
  },
  totalPrice: { type: Number, required: true },
  trackingNumber: { type: String }, 
  cancelReason: { type: String },   
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
