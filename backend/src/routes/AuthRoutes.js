const express = require("express");
const router = express.Router();
const authController = require("../controllers/AuthController")

router.post("/register", authController.registerUser);
router.post("/register/pharmacy", authController.registerPharmacy);
router.post("/register/distributor", authController.registerDistributor);
router.post("/login", authController.login);

module.exports = router;