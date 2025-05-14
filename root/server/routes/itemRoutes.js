// server/routes/itemRoutes.js
const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// CREATE Item
router.post("/", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all Items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ Item by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item tidak ditemukan" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE Item
router.put("/:id", async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE Item
router.delete("/:id", async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
