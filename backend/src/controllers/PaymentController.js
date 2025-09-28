const Payment = require("../models/Payment");

// Lấy phương thức thanh toán
exports.getAllMethodPayment = async (req, res) => {
  try {
    const payments = await Payment.find({ status: "active" });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};