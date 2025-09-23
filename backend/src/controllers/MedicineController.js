const medicine = require("../models/Medicine");

// Tạo lô thuốc mới
exports.createMedicine = async (req, res) => {
  try {
    const { name, description, manufactureDate, expiryDate, manufacturer, ipfsHash, qrCode } = req.body;

    const newMedicine = new medicine({
      name,
      description,
      manufactureDate,
      expiryDate,
      manufacturer,
      ipfsHash,
      qrCode
    });

    await newMedicine.save();
    res.status(201).json({ message: "Drug batch created successfully", batch: newMedicine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách tất cả lô thuốc
exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await medicine.find().populate("manufacturer", "name email role");
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lấy chi tiết 1 lô thuốc theo ID
exports.getMedicineById = async (req, res) => {
  try {
    const batch = await medicine.findById(req.params.id).populate("manufacturer", "name email role");
    if (!batch) return res.status(404).json({ message: "not found" });
    res.json(batch);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật lô thuốc
exports.updateMedicine = async (req, res) => {
  try {
    const updatedMedicine = await medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedMedicine) return res.status(404).json({ message: "Drug batch not found" });
    res.json({ message: "Drug batch updated", batch: updatedMedicine });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Xóa lô thuốc
exports.deleteMedicine = async (req, res) => {
  try {
    const deletedMedicine = await medicine.findByIdAndDelete(req.params.id);
    if (!deletedMedicine) return res.status(404).json({ message: "Drug batch not found" });
    res.json({ message: "Drug batch deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
