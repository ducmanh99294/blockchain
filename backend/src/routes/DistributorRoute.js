const express = require("express");
const router = express.Router();
const distributorController = require("../controllers/DistributorController");
const auth = require("../middleware/auth");

// Auth routes
router.post("/register/distributor", distributorController.registerDistributor);

module.exports = router;
