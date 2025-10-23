const express = require("express");
const router = express.Router();
const distributorController = require("../controllers/DistributorController");
const auth = require("../middleware/auth");

// Auth routes
router.get("/", distributorController.getAllDistributors);
router.get("/products", distributorController.getAllDistributorsProducts);
router.get("/:id", distributorController.getDistributorById);
router.put("/:id", distributorController.updateDistributor);
router.get("/:distributorId/products", distributorController.getDistributorProducts);
router.put("/products/:id", distributorController.updateDistributorProduct);

module.exports = router;
