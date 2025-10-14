const User = require("../models/Users");
const Pharmacy = require("../models/Pharmacy");
const Distributor = require("../models/Distributor");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

exports.registerUser = async (req, res) => {
  try {
    const { name, username, email, password, phone, dateOfBirth, gender } = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    // Kiểm tra username đã tồn tại chưa
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user mới
    const newUser = new User({
      name,
      username,
      email,
      password: hashedPassword,
      phone,
      dateOfBirth,
      gender,
      role: "user"
    });

    await newUser.save();

    // Tạo token luôn cho tiện
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.status(201).json({
      message: "Đăng ký user thành công",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        dateOfBirth: newUser.dateOfBirth,
        gender: newUser.gender
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.registerPharmacy = async (req, res) => {
  try {
    const { email, password, name, licenseNumber, pharmacyName, address, phone } = req.body;

    // 1. Tạo User với role = "pharmacy"
    const user = new User({
      email,
      password, // nhớ hash password
      name,      
      role: "pharmacy"
    });
    await user.save();

    // 2. Tạo Pharmacy gắn với userId
    const pharmacy = new Pharmacy({
      userId: user._id,
      licenseNumber,
      pharmacyName,
      address,
      phone
    });
    await pharmacy.save();

    res.status(201).json({ message: "Pharmacy registered successfully", user, pharmacy });
  } catch (err) {
    console.error("Register Pharmacy Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.registerDistributor = async (req, res) => {
  try {
    const { email, password, name, companyName, licenseNumber, phone, address } = req.body;

    // 1. Tạo User với role = "distributor"
    const user = new User({
      email,
      password, // nhớ hash trước khi save
      name,
      role: "distributor"
    });
    await user.save();

    // 2. Tạo Distributor gắn với userId
    const distributor = new Distributor({
      userId: user._id,
      companyName,
      licenseNumber,
      phone,
      address
    });
    await distributor.save();

    res.status(201).json({
      message: "Distributor registered successfully",
      user,
      distributor
    });
  } catch (err) {
    console.error("Register Distributor Error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Kiểm tra user
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid username or password" });

    // So sánh password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

    if (role !== user.role) {
      return res.status(403).json({ message: "Sai vai trò đăng nhập" });
    }
    // Tạo token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    let extraInfo = null;
    if (role === "pharmacy") {
      extraInfo = await Pharmacy.findOne({ userId: user._id });
    } else if (role === "distributor") {
      extraInfo = await Distributor.findOne({ userId: user._id });
    }

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};