const Event = require("../models/Event");

// Lấy tất cả event
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("products");
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Tạo mới event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, image, startDate, endDate, products, discount } = req.body;
    const event = new Event({ title, description, image, startDate, endDate, products, discount });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Cập nhật event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndUpdate(id, req.body, { new: true }).populate("products");
    if (!event) return res.status(404).json({ message: "Event không tồn tại" });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Xóa event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ message: "Event không tồn tại" });
    res.json({ message: "Đã xóa event" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
