const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");
const Pharmacy = require("../models/Pharmacy");
const Distributor = require("../models/Distributor");

// Đăng ký nhà phân phối
exports.registerDistributor = async (req, res) => {
  try {
    const { name, email, password, phone, companyName, licenseNumber, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email đã tồn tại" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      username: email,
      email,
      password: hashedPassword,
      phone,
      role: "distributor"
    });
    await newUser.save();

    const newDistributor = new Distributor({
      userId: newUser._id,
      companyName,
      licenseNumber,
      email,
      phone,
      address
    });
    await newDistributor.save();

    res.status(201).json({ message: "Đăng ký nhà phân phối thành công", user: newUser, distributor: newDistributor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
