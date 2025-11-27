const Cart = require("../models/Cart");
const PharmacyCart = require("../models/PharmacyCart");

// Lấy giỏ hàng của user
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate({
        path: "items.productId",
        populate: {
          path: "masterProduct",
          // Bạn có thể chọn select những trường cần thiết, ví dụ:
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
        }
      });

    res.json(cart || { userId: req.params.userId, items: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Thêm sản phẩm vào giỏ
exports.addToCart = async (req, res) => {
  const { productId, name, price, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) cart = new Cart({ userId: req.params.userId, items: [] });

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" })
  }
};

// Cập nhật số lượng
exports.updateQuantity = async (req, res) => {
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

    const item = cart.items.find(i => i.productId.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    item.quantity = quantity;
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Xóa sản phẩm khỏi giỏ
exports.deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });

    cart.items = cart.items.filter(i => i.productId.toString() !== req.params.productId);
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(404).json({ message: "Lỗi server" });
  }
};

// -----------------PharmacyCartController.js-----------------
exports.getPharmacyCart = async (req, res) => {
  try {
    const cart = await PharmacyCart.findOne({ userId: req.params.userId })
       
      .populate("items.distributorProductId"); 
      
    res.json(cart || { userId: req.params.userId, items: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Thêm sản phẩm vào giỏ
exports.addToPharmacyCart = async (req, res) => {
  const { distributorProductId, name, price, quantity } = req.body;
  try {
    let cart = await PharmacyCart.findOne({ userId: req.params.userId });
    if (!cart) cart = new Cart({ userId: req.params.userId, items: [] });

     
    const existingItem = cart.items.find(item => item.distributorProductId.toString() === distributorProductId);
    if (existingItem) {
      existingItem.quantity += (quantity || 1); // Thêm số lượng (hoặc 1 nếu không có)
    } else {
      cart.items.push({ distributorProductId, name, price, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.error(err); // Nên log lỗi ra
    res.status(500).json({ message: "Lỗi server: " + err.message });
  }
};

// Cập nhật số lượng
exports.updateQuantityPharmacy = async (req, res) => {
  const { quantity } = req.body;
  try {
    const cart = await PharmacyCart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    const item = cart.items.find(i => i.distributorProductId.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.distributorProductId")
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Xóa sản phẩm khỏi giỏ
exports.deletePharmacyCart = async (req, res) => {
  try {
    const cart = await PharmacyCart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Không tìm thấy giỏ hàng" });
    cart.items = cart.items.filter(i => i.distributorProductId.toString() !== req.params.productId);
    await cart.save();
    await cart.populate("items.distributorProductId")
    res.json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" }); 
  }
};