const Shipping = require("../models/Shipping");

// Lấy phương thức vận chuyển
exports.getAllMethodShipping = async (req, res) => {
  try {
    const shippings = await Shipping.find({ status: "active" });
    res.json(shippings);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};