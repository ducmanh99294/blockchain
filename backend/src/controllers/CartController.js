const Cart = require("../models/Cart");

// Lấy giỏ hàng của user
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate("items.productId");
      
    res.json(cart || { userId: req.params.userId, items: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};


// Thêm sản phẩm vào giỏ
exports.addToCart = async (req, res) => {
  const { productId, name, price, quantity, prescription } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) cart = new Cart({ userId: req.params.userId, items: [] });

    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, name, price, quantity, prescription });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    console.log(err)
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