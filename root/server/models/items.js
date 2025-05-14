const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const QRCode = require("qrcode");

router.post("/", async (req, res) => {
  const item = new Item(req.body);
  const saved = await item.save();
  const qrLink = `http://localhost:3000/item/${saved._id}`;
  const qrCode = await QRCode.toDataURL(qrLink);

  saved.qr_url = qrLink;
  await saved.save();

  res.json({ ...saved.toObject(), qr_image: qrCode });
});

router.get("/", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

router.get("/:id", async (req, res) => {
  const item = await Item.findById(req.params.id);
  res.json(item);
});

module.exports = router;
