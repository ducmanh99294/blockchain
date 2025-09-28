const express = require("express");
const router = express.Router();
const shippingController = require("../controllers/ShippingController")

router.get("/", shippingController.getAllMethodShipping);

module.exports = router;