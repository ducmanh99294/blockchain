const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");
const auth = require("../middleware/auth");

// Auth routes
router.get("/profile", auth, userController.getProfile);
router.get("/", userController.getAllUser);                  
router.post("/", userController.addUser);                
router.put("/:id", userController.updateUser);           
router.patch("/:id/ban", userController.banUser);        
router.patch("/:id/unban", userController.unbanUser);   
router.post("/logout", userController.logout);

module.exports = router;
