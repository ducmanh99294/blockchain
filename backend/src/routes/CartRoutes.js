const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartController");


// CRUD routes
// router.get("/:id", cartController.getCertificates);
router.get("/:userId", cartController.getCart);
router.post("/:userId/add", cartController.addToCart);
router.put("/user/:userId/item/:productId", cartController.updateQuantity);
router.delete("/user/:userId/item/:productId", cartController.deleteCart);

// -----------------PharmacyCart-----------------
router.get("/pharmacy/:userId", cartController.getPharmacyCart);
router.post("/pharmacy/:userId/add", cartController.addToPharmacyCart);
router.put("/pharmacy/:userId/:productId", cartController.updateQuantityPharmacy);
router.delete("/pharmacy/:userId/:productId", cartController.deletePharmacyCart);

module.exports = router;
