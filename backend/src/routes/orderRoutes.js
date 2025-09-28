const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");

// Tạo đơn hàng
router.post("/", orderController.createOrder);

// Lấy danh sách đơn hàng theo user
router.get("/user/:userId", orderController.getOrdersByUser);

// Lấy chi tiết đơn hàng
router.get("/:orderId", orderController.getOrderById);

// Cập nhật trạng thái đơn hàng
router.put("/:id/status", orderController.updateOrderStatus);

// Hủy đơn hàng
router.put("/:orderId/cancel", orderController.cancelOrder);

// Xóa đơn hàng
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
