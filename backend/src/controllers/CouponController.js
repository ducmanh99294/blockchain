const Coupon = require("../models/Coupon");

// Lấy toàn bộ coupon
exports.getAllCoupon = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getCouponByCode = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) return res.status(400).json({ message: "Vui lòng nhập mã coupon" });

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) return res.status(404).json({ message: "Mã giảm giá không tồn tại" });

    // Kiểm tra hết hạn
    if (coupon.expiryDate && coupon.expiryDate < new Date()) {
      return res.status(400).json({ message: "Mã giảm giá đã hết hạn" });
    }

    res.json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cập nhật coupon (Admin)
exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ message: "Không tìm thấy coupon" });
    res.json(coupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa coupon (Admin)
exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) return res.status(404).json({ message: "Không tìm thấy coupon" });
    res.json({ message: "Xóa coupon thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};