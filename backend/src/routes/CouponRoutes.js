const express = require("express");
const router = express.Router();
const couponController = require("../controllers/CouponController");

router.get('/', couponController.getAllCoupon);
router.put("/:id", couponController.updateCoupon);
router.delete("/:id", couponController.deleteCoupon);
router.get("/apply", couponController.getCouponByCode);
module.exports = router