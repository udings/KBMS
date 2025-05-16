const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: "User tidak ditemukan" });
    }

    // Bandingkan password langsung (plaintext)
    if (password !== user.password) {
      return res.status(401).json({ message: "Password salah" });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login gagal", error: err.message });
  }
};

exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username sudah digunakan" });
    }

    // Simpan password langsung tanpa hashing
    const newUser = new User({
      username,
      password, // langsung simpan
      role: role || "user"
    });

    await newUser.save();
    res.status(201).json({ message: "User berhasil dibuat" });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Register gagal", error: err.message });
  }
};
