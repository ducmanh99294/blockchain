const Product = require("../models/Product");
const Category = require("../models/Category");

// ➕ Thêm sản phẩm
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, discountPrice, quantity, category, brand, image } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      quantity,
      category,
      brand,
      image,

      // 📌 Blockchain integration
      // blockchainHash: "...", // Tính hash của sản phẩm và lưu
      // blockchainTx: "...",   // Transaction hash khi ghi on-chain
      // cid: "...",            // CID từ IPFS (nếu upload metadata)
    });

    await product.save();

    await Category.findByIdAndUpdate(product.category, { $inc: { productCount: 1 } });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 Lấy danh sách sản phẩm
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔎 Lấy chi tiết sản phẩm
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /products/pharmacy/:pharmacyId
exports.getProductsByPharmacy = async (req, res) => {
  try {
    const products = await Product.find({ pharmacy: req.params.pharmacyId })
      .populate("pharmacy", "pharmacyName")
      .populate("category", "name")
      .populate("distributor", "name");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
}

// ✏️ Sửa sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const updates = req.body;

    // 📌 Blockchain integration
    // Nếu có cập nhật sản phẩm => có thể tạo hash mới và lưu lại
    // updates.blockchainHash = "...";
    // updates.blockchainTx = "...";

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product updated successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkout = async (req, res) => {
  try {
    const { items } = req.body; 
    // items: [{ productId, quantity }]

    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        {
          $inc: { sellCount: item.quantity } // tăng lượt mua
        }
      );
    }

    res.json({ success: true, message: "Đặt hàng thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi checkout" });
  }
};

exports.getRecommendedProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ purchaseCount: -1 })  
      .limit(6);                  
    
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.getLatestProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })   
      .limit(6);                 

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm mới nhất", error: error.message });
  }
};

exports.getRandomProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $sample: { size: 6 } }
    ]);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm ngẫu nhiên", error: error.message });
  }
};
