require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Item = require("./models/Item");

const app = express();
app.use(express.json()); // Penting untuk parsing JSON dari body request

// ===== Middleware =====
const allowedOrigins = [
  "https://kbms-chi.vercel.app",
  "https://inventaris-hksyoy0d5-udinss-projects.vercel.app",
  "https://kbms-53oqofyqm-udinss-projects.vercel.app",


app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for this origin"));
    }
  }
}));

// ===== JWT Authentication Middleware =====
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Token tidak ditemukan" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token tidak valid" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Token tidak valid" });
  }
}

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== Routes =====

// ➕ Create Item (Authenticated)
app.post("/items", verifyToken, async (req, res) => {
  const {
    nama_aset,
    kategori,
    lokasi,
    tahun_perolehan,
    sumber_perolehan,
    kondisi,
    kelayakan,
    jumlah_unit,
    penanggung_jawab,
    status,
    keterangan,
    image
  } = req.body;

  try {
    const newItem = new Item({
      nama_aset,
      kategori,
      lokasi,
      tahun_perolehan,
      sumber_perolehan,
      kondisi,
      kelayakan,
      jumlah_unit,
      penanggung_jawab,
      status,
      keterangan,
      image
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Failed to add item", error });
  }
});

// 📄 Get All Items (Public)
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items", error });
  }
});

// ✏️ Update Item (Authenticated)
app.put("/items/:id", verifyToken, async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: "Item tidak ditemukan" });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui item", error });
  }
});

// 🗑️ Delete Item (Authenticated)
app.delete("/items/:id", verifyToken, async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: "Item tidak ditemukan" });
    }
    res.status(200).json({ message: "Item berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus item", error });
  }
});

// 🔐 Auth Routes
app.use('/api/auth', require('./routes/authRoutes'));

// 🏠 Root Endpoint
app.get("/", (req, res) => {
  res.send("Backend Inventaris aktif ✅");
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server berjalan di port ${PORT}`));
