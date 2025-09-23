const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/TransactionController");

// CRUD routes
router.post("/", transactionController.createTransaction);
router.get("/", transactionController.getTransactions);
router.get("/:id", transactionController.getTransactionById);
router.put("/:id", transactionController.updateTransaction);
router.delete("/:id", transactionController.deleteTransaction);

module.exports = router;

