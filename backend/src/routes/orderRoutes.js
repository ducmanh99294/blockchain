const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");

// Tạo đơn hàng
router.post("/", OrderController.createOrder);

// Lấy tất cả đơn hàng (admin)
router.get("/", OrderController.getAllOrders);

// Lấy đơn hàng theo userId
router.get("/user/:userId", OrderController.getOrdersByUser);

// Lấy đơn hàng theo pharmacyId
router.get("/pharmacy/:pharmacyId", OrderController.getOrderByPharmacy);

// Lấy đơn hàng theo distributorId
router.get("/distributor/:distributorId", OrderController.getOrderByDistributor);

// Lấy đơn hàng mới nhất theo pharmacyId
router.get("/pharmacy/:pharmacyId/latest", OrderController.getLatestOrdersByPharmacy);
// Lấy chi tiết đơn hàng
router.get("/:id", OrderController.getOrderById);

// Cập nhật đơn hàng (ví dụ cập nhật status)
router.put("/:id", OrderController.updateOrder);

// Xóa đơn hàng
router.delete("/:id", OrderController.deleteOrder);

// -----------------PharmacyOrder-----------------
router.post("/pharmacy/create", OrderController.createPharmacyOrder);

// Lấy tất cả đơn hàng
router.get("/pharmacy/all", OrderController.getAllPharmacyOrders);

module.exports = router;
