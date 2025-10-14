const express = require("express");
const router = express.Router();
const productController = require("../controllers/ProductController");

// CRUD cho sản phẩm
router.post("/", productController.createProduct);
router.get("/recommend", productController.getRecommendedProducts);
router.get("/lastest", productController.getLatestProducts);
router.get("/random", productController.getRandomProducts);
router.get("/pharmacy/:pharmacyId", productController.getProductsByPharmacy);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);


module.exports = router;
