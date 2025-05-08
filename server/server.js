require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Item = require("./models/Item");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Create (Tambah Item)
app.post("/items", async (req, res) => {
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
      status,      // optional, default: "Aktif"
      keterangan,  // optional
      image        // optional
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error adding item:", error);
    res.status(500).json({ message: "Failed to add item", error });
  }
});

// Read (Ambil semua item)
app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items", error });
  }
});

// Update (Perbarui item)
app.put("/items/:id", async (req, res) => {
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

// Delete (Hapus item)
app.delete("/items/:id", async (req, res) => {
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

// Endpoint dasar
app.get("/", (req, res) => {
  res.send("Backend Inventaris aktif ✅");
});

// Jalankan server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server berjalan di port ${PORT}`));
