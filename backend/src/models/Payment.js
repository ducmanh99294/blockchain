const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: String,
  description: String,
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });

module.exports = mongoose.model("Payment", PaymentSchema);
