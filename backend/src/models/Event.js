const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },       // tên sự kiện
    description: { type: String },                 // mô tả
    image: { type: String },                       // ảnh banner
    startDate: { type: Date, required: true },     // ngày bắt đầu
    endDate: { type: Date, required: true },       // ngày kết thúc
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // sản phẩm áp dụng
    discount: { type: Number, default: 0 },        // % giảm giá
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
