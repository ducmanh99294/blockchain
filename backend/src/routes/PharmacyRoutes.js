const express = require("express");
const router = express.Router();
const pharmacyController = require("../controllers/PharmacyController")
const auth = require("../middleware/auth");

// Auth routes
router.get("/", pharmacyController.getAllPharmacies);
router.get("/:id", pharmacyController.getPharmacyById);
router.put("/:id", pharmacyController.updatePharmacy);
// router.delete("/:id", pharmacyController.deletePharmacy);

module.exports = router;
