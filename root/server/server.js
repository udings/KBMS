require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes"); 
const app = express();

// ======= Middleware JSON Parser =======
app.use(express.json());

// ======= Allowed Origins (frontend yang diizinkan) =======
const allowedOrigins = [
  "https://kbms-chi.vercel.app",
  "https://inventaris-hksyoy0d5-udinss-projects.vercel.app",
];

// ======= CORS Middleware =======
app.use(cors({
  origin: function (origin, callback) {
    console.log("🔍 Incoming Origin:", origin);
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed for this origin: " + origin));
    }
  },
  credentials: true
}));

// ======= Tambahan header CORS manual untuk Railway =======
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// ======= MongoDB Connection =======
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ======= Routes =======
app.use("/api/auth", authRoutes);         // 🔐 Auth Routes
app.use("/api/items", itemRoutes);        // 📦 Item Routes via itemController.js

// 🏠 Root Endpoint
app.get("/", (req, res) => {
  res.send("✅ Backend Inventaris aktif");
});

// ======= Start Server =======
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server berjalan di port ${PORT}`));
