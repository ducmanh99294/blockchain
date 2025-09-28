const mongoose = require("mongoose");

const ShippingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  time: String,
  description: String,
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("Shipping", ShippingSchema);
