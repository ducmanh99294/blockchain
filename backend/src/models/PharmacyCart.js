const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      distributorProductId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "DistributorProduct", 
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

module.exports = mongoose.model("PharmacyCart", CartSchema);
