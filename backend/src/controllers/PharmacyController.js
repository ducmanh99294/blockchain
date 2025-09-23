const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const Pharmacy = require("../models/Pharmacy");


// 🔑 Đăng ký nhà thuốc
exports.registerPharmacy = async (req, res) => {
  try {
    const { name, email, password, phone, pharmacyName, licenseNumber, address } = req.body;

    // check email tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email đã tồn tại" });

    // tạo user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      username: email,
      email,
      password: hashedPassword,
      phone,
      role: "pharmacy"
    });
    await newUser.save();

    // tạo pharmacy
    const newPharmacy = new Pharmacy({
      userId: newUser._id,
      pharmacyName,
      licenseNumber,
      address,
      phone
    });
    await newPharmacy.save();

    res.status(201).json({ message: "Đăng ký nhà thuốc thành công", user: newUser, pharmacy: newPharmacy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};