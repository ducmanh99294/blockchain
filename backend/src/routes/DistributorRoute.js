const express = require("express");
const router = express.Router();
const distributorController = require("../controllers/DistributorController");
const auth = require("../middleware/auth");

// Auth routes
router.get("/", distributorController.getAllDistributors);
router.get("/:id", distributorController.getDistributorById);
router.put("/:id", distributorController.updateDistributor);

module.exports = router;
