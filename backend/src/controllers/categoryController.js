const Category = require("../models/Category");
const Product = require("../models/Product")
// Lấy tất cả category
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    const result = await Promise.all(
      categories.map(async (cat) => {
        const count = await Product.countDocuments({ category: cat._id });
        return { ...cat.toObject(), productCount: count };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo mới category
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: "Category không tồn tại" });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ message: "Category không tồn tại" });
    res.json({ message: "Đã xóa category" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
