require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ===== Middleware =====
app.use(cors({
  origin: "https://kbms-chi.vercel.app", // frontend vercel URL kamu
}));
app.use(express.json());

// ===== MongoDB Connection =====
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ===== Routes =====
const itemRoutes = require("./routes/ItemRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/api/items", itemRoutes);   // 📦 item route pakai prefix /api/items
app.use("/api/auth", authRoutes);    // 🔐 auth route

// 🏠 Root Endpoint
app.get("/", (req, res) => {
  res.send("Backend Inventaris aktif ✅");
});

// ===== Start Server =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server berjalan di port ${PORT}`));
