const express = require("express");
const router = express.Router();
const cartController = require("../controllers/CartController");

// CRUD routes
// router.get("/:id", cartController.getCertificates);
router.get("/user/:userId", cartController.getCart);
router.post("/user/:userId/add", cartController.addToCart);
router.put("/user/:userId/item/:productId", cartController.updateQuantity);
router.delete("/user/:userId/item/:productId", cartController.deleteCart);

module.exports = router;
