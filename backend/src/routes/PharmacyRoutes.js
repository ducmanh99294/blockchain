const express = require("express");
const router = express.Router();
const pharmacyController = require("../controllers/PharmacyController")
const auth = require("../middleware/auth");

// Auth routes
router.post("/register/distributor", pharmacyController.registerPharmacy);

module.exports = router;
