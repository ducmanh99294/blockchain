const Certificate = require("../models/Certificate");

// Tạo chứng nhận mới
exports.createCertificate = async (req, res) => {
  try {
    const { product, issuedBy, issuedTo, validUntil, details } = req.body;

    const certificate = new Certificate({
      product,
      issuedBy,
      issuedTo,
      validUntil,
      details,
    });

    await certificate.save();
    res.status(201).json({ message: "Certificate created", certificate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy tất cả chứng nhận
exports.getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate("product")
      .populate("issuedBy")
      .populate("issuedTo");
    res.json(certificates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Lấy chứng nhận theo ID
exports.getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id)
      .populate("product")
      .populate("issuedBy")
      .populate("issuedTo");

    if (!certificate) return res.status(404).json({ message: "Not found" });

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cập nhật chứng nhận
exports.updateCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!certificate) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Certificate updated", certificate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Xóa chứng nhận
exports.deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findByIdAndDelete(req.params.id);

    if (!certificate) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Certificate deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
