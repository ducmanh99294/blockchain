const Order = require("../models/Order");
const Product = require("../models/Product");

// 🛒 Tạo đơn hàng (Checkout)
exports.createOrder = async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod } = req.body;

    // ✅ Lấy thông tin sản phẩm để tính tổng tiền
    let totalPrice = 0;
    const orderItems = [];

    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const price = product.price; // snapshot giá
      const quantity = item.quantity;

      totalPrice += price * quantity;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price,
        quantity
      });
    }

    const order = new Order({
      userId,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice
    });

    await order.save();

    for (const item of req.body.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { purchaseCount: item.quantity }
      });
    }

    res.status(201).json({ message: "Order created successfully", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 Lấy danh sách đơn hàng của user
exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📦 Lấy chi tiết 1 đơn hàng
exports.getOrderById = async (req, res) => {
  try {
    const orderId = await Order.findById(req.params.orderId).populate("items.productId");
    if (!orderId) return res.status(404).json({ message: "Order not found" });
    res.json(orderId);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔄 Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Xóa đơn hàng (nếu cần)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.orderId,
      { status: "cancelled", cancelReason: req.body.reason || "Người dùng hủy" },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi hủy đơn hàng" });
  }
};