const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

// 🟢 Đăng ký
exports.register = async (req, res) => {
  try {
    const { name, username, email, password, phone, address} = req.body;

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

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
      address,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔵 Đăng nhập
exports.login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Kiểm tra user
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid username or password" });

    // So sánh password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

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