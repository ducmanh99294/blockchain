const Order = require("../models/Order");
const Shipping = require("../models/Shipping");
const Coupon = require("../models/Coupon");
const Product = require("../models/Product");
const { get } = require("mongoose");

const OrderController = {
  // ✅ Tạo đơn hàng
  async createOrder(req, res) {
    try {
      const { userId, items, shippingInfo, shippingMethod, paymentMethod, coupon } = req.body;

      // 1. Tính subtotal từ items
      let subtotal = 0;
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findById(item.productId);
        if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

        orderItems.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity
        });

        subtotal += product.price * item.quantity;
      }

      // 2. Lấy shipping fee
      const shipping = await Shipping.findById(shippingMethod);
      if (!shipping) return res.status(404).json({ message: "Phương thức giao hàng không tồn tại" });

      let shippingFee = shipping.price;

      // 3. Áp dụng coupon (nếu có)
      let discount = 0;
      let couponDoc = null;
      if (coupon) {
        couponDoc = await Coupon.findById(coupon);
        if (!couponDoc) return res.status(404).json({ message: "Mã giảm giá không tồn tại" });

        if (couponDoc.type === "percent") {
          discount = (subtotal * couponDoc.discount) / 100;
        } else if (couponDoc.type === "fixed") {
          discount = couponDoc.discount;
        } else if (couponDoc.type === "shipping") {
          discount = shippingFee;
        }
      }

      // 4. Tính totalPrice
      const totalPrice = Math.max(0, subtotal + shippingFee - discount);

      // 5. Tạo order
      const newOrder = new Order({
        userId,
        items: orderItems,
        shippingInfo,
        shippingMethod,
        paymentMethod,
        coupon: couponDoc ? couponDoc._id : null,
        subtotal,
        shippingFee,
        discount,
        totalPrice
      });

      await newOrder.save();
      res.status(201).json(newOrder);
    } catch (error) {
      console.error("❌ Lỗi tạo đơn hàng:", error);
      res.status(500).json({ message: "Lỗi server", error });
    }
  },

  // ✅ Lấy tất cả đơn hàng (admin)
  async getAllOrders(req, res) {
    try {
      const orders = await Order.find()
      .populate("paymentMethod", "name")
      .populate("userId", "name email")
      .populate("shippingMethod", "name price")
      .populate("coupon", "code discount type")
      .populate({
        path: "items.productId",
        select: "name price pharmacy",
        populate: { path: "pharmacy", select: "pharmacyName" } // lấy tên nhà thuốc
      });
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
    }
  },

  // ✅ Lấy đơn hàng theo userId
  async getOrdersByUser(req, res) {
    try {
      const orders = await Order.find({ userId: req.params.userId })
        .populate("paymentMethod", "name")
        .populate("shippingMethod", "name price")
        .populate({
        path: "items.productId",
        select: "name price pharmacy",
        populate: { path: "pharmacy", select: "pharmacyName" } 
      })
        .populate("coupon", "code discount type");
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
    }
  },

  // ✅ Lấy chi tiết đơn hàng
  async getOrderById(req, res) {
    try {
      const order = await Order.findById(req.params.id)
        .populate("paymentMethod", "name")
        .populate("userId", "name email")
        .populate({
        path: "items.productId",
        select: "name price pharmacy",
        populate: { path: "pharmacy", select: "pharmacyName" } 
        })
        .populate("shippingMethod", "name price")
        .populate("coupon", "code discount type");

      if (!order) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
    }
  },

async getOrderByPharmacy(req, res) {
  try {
    const pharmacyId = req.params.pharmacyId;

    // Lấy tất cả đơn hàng + populate product + pharmacy
    const orders = await Order.find()
      .populate("paymentMethod", "name")
      .populate("userId", "name email")
      .populate({
        path: "items.productId",
        select: "name price pharmacy",
        populate: { path: "pharmacy", select: "pharmacyName" } 
      })
      .populate("shippingMethod", "name price")
      .populate("coupon", "code discount type");

    const filteredOrders = orders.filter(order =>
      order.items.some(item => 
        item.productId?.Pharmacy?._id.toString() === pharmacyId
      )
    );

    res.json(filteredOrders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error });
  }
},

  async getOrderByDistributor(req, res) {
    try {
      const orders = await Order.find({ distributorId: req.params.distributorId })
        .populate("paymentMethod", "name")
        .populate("userId", "name email")
        .populate("items.productId", "name price")
        .populate("shippingMethod", "name price")
        .populate("coupon", "code discount type");
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
    }
  },



  // ✅ Cập nhật đơn hàng (status, trackingNumber, cancelReason)
  async updateOrder(req, res) {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedOrder) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
    }
  },

  // ✅ Xóa đơn hàng
  async deleteOrder(req, res) {
    try {
      const deleted = await Order.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
      res.json({ message: "Xóa đơn hàng thành công" });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
    }
  },
  
  async getLatestOrdersByPharmacy(req, res) {
    try {
      const { pharmacyId } = req.params;
      const limit = parseInt(req.query.limit) || 5;

      const orders = await Order.find({ pharmacyId })
        .sort({ createdAt: -1 })   // sắp xếp giảm dần
        .limit(limit);             // giới hạn số lượng

      res.json(orders);
    } catch (err) {
      res.status(500).json({ message: "Error fetching latest orders", error: err.message });
    }
  }

};



module.exports = OrderController;
