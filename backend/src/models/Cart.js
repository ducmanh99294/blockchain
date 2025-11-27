const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "PharmacyProduct", 
        required: true
     },
      name: String,
      price: Number,
      quantity: { 
        type: Number, 
        default: 1 
    },
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Cart", CartSchema);
