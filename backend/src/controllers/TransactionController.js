const Transaction = require("../models/Transaction");

// Tạo giao dịch mới
exports.createTransaction = async (req, res) => {
  try {
    const { product, from, to, date, status } = req.body;

    const transaction = new Transaction({
      product,
      from,
      to,
      date,
      status,
    });

    await transaction.save();
    res.status(201).json({ message: "Transaction created", transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy tất cả giao dịch
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("product")
      .populate("from")
      .populate("to");

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy giao dịch theo ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate("product")
      .populate("from")
      .populate("to");

    if (!transaction) return res.status(404).json({ message: "Not found" });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật giao dịch
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!transaction) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Transaction updated", transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa giao dịch
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
