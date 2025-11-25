const Product = require("../models/Product");
const Category = require("../models/Category");
const Distributor = require("../models/Distributor");
const DistributorProduct = require('../models/DistributorProduct');
const PharmacyProduct = require("../models/PharmacyProduct");

// Thêm sản phẩm
exports.createDistributorProduct = async (req, res) => {
  try {
    const {distributor,name,description,category,brand,image,usage,price,stock} = req.body;

    const distributorExist = await Distributor.findById(distributor);
    if (!distributorExist) {
      return res.status(404).json({ message: "Nhà phân phối không tồn tại" });
    }

    const newProduct = new DistributorProduct({
      distributor,
      name,
      description,
      category,
      brand,
      image,
      usage,
      price,
      stock,
    });

    await newProduct.save();

    res.status(201).json({
      message: "Tạo sản phẩm thành công (chưa xác thực blockchain)",
      product: newProduct,
    });
  } catch (error) {
    console.error("Lỗi khi tạo sản phẩm:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

exports.createPharmacyProduct = async (req, res) => {
  try {
    const { 
      masterProduct, 
      pharmacy, 
      price, 
      discountPrice, 
      quantity, 
      prescription,
      available
    } = req.body;

    if (!pharmacy) {
      return res.status(400).json({ message: "Missing pharmacy ID" });
    }

    // Tìm xem sản phẩm đã tồn tại chưa
    let existingProduct = await PharmacyProduct.findOne({
      masterProduct,
      pharmacy
    });

    // Nếu có → update (không tạo mới để tránh duplicate)
    if (existingProduct) {
      existingProduct.quantity += quantity;  // cộng dồn số lượng
      existingProduct.price = price;
      existingProduct.discountPrice = discountPrice;
      existingProduct.prescription = prescription;
      existingProduct.available = available;

      await existingProduct.save();

      return res.status(200).json({
        message: "Pharmacy product updated (already existed)",
        product: existingProduct
      });
    }

    // Nếu chưa có → tạo mới
    const newPharmacyProduct = new PharmacyProduct({
      masterProduct,
      pharmacy,
      price,
      discountPrice,
      quantity,
      prescription,
      available
    });

    await newPharmacyProduct.save();

    res.status(201).json({
      message: "Pharmacy product created successfully",
      product: newPharmacyProduct,
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error: " + err.message,
    });
  }
};

// Lấy danh sách sản phẩm
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Lấy chi tiết sản phẩm
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
    const products = await PharmacyProduct.find({ pharmacy: req.params.pharmacyId })
      // .populate("pharmacy", "pharmacyName")
      .populate({
        path: "masterProduct",
        select: "distributor name status image category description usage expiryDate brand blockchainTx ipfsCidString",
        populate: [
          {
            path: "distributor",
            select: "companyName"
          },
          {
            path: "category",
            select: "name"
          }
        ]
      })

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
}

// Sửa sản phẩm
exports.updateProductBlockchainInfo = async (req, res) => {
  try {
    const { blockchainHash, blockchainTx, cid } = req.body;
    const productId = req.params.id;
    const distributorId = req.user.id;

    // 1. Tìm sản phẩm
    const product = await DistributorProduct.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Kiểm tra quyền: Chỉ distributor tạo ra sản phẩm mới được cập nhật
    if (product.distributor.toString() !== distributorId) {
      return res.status(403).json({ message: "User not authorized to update this product" });
    }

    // 3. Cập nhật thông tin blockchain
    product.blockchainHash = blockchainHash;
    product.blockchainTx = blockchainTx;
    product.cid = cid;

    await product.save();

    res.status(200).json({
      message: "Blockchain info updated successfully",
      product: product
    });

  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// Xóa sản phẩm
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
