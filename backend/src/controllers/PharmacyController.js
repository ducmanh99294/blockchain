const Pharmacy = require("../models/Pharmacy");
const PharmacyProduct = require('../models/PharmacyProduct');

exports.getAllPharmacies = async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find().populate('userId', 'name email phone');
    res.status(200).json(pharmacies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getPharmacyById = async (req, res) => {
  try {
    const { id } = req.params;
    const pharmacy = await Pharmacy.findById(id).populate('userId', 'email');
    if (!pharmacy) return res.status(404).json({ message: "Nhà thuốc không tồn tại" });
    res.status(200).json(pharmacy);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.updatePharmacy = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPharmacy = await Pharmacy.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedPharmacy) {
      return res.status(404).json({ error: "Pharmacy not found" });
    }

    res.json(updatedPharmacy);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

