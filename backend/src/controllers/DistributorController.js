const Distributor = require("../models/Distributor");

exports.getAllDistributors = async (req, res) => {
  try {
    const pharmacies = await Distributor.find().populate('userId', 'name email phone');
    res.status(200).json(pharmacies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getDistributorById = async (req, res) => {
  try {
    const { id } = req.params;
    const distributor = await Distributor.findById(id).populate('userId', 'name email phone');
    if (!distributor) return res.status(404).json({ message: "Nhà thuốc không tồn tại" });
    res.status(200).json(distributor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.updateDistributor = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedDistributor = await Distributor.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedDistributor) {
      return res.status(404).json({ error: "Distributor not found" });
    }

    res.json(updatedDistributor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

