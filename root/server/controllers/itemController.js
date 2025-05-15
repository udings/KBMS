const Item = require("../models/Item");
const QRCode = require("qrcode");

// CREATE item dan generate QR code
exports.createItem = async (req, res) => {
  try {
    const item = new Item(req.body);
    const saved = await item.save();

    const qrLink = `http://localhost:3000/item/${saved._id}`;
    const qrCode = await QRCode.toDataURL(qrLink); // generate image base64

    saved.qr_url = qrLink;
    await saved.save();

    res.status(201).json({ ...saved.toObject(), qr_image: qrCode });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET semua item
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET item berdasarkan ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item tidak ditemukan" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE item
exports.updateItem = async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE item
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Item tidak ditemukan" });
    res.json({ message: "Item berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
