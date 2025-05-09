const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  nama_aset: { type: String, required: true },
  kategori: { type: String, required: true },
  lokasi: { type: String, required: true },
  tahun_perolehan: {
    type: Number,
    required: true,
    min: 1900, // Opsional: batas minimum tahun
    max: new Date().getFullYear() // Opsional: tidak boleh lebih dari tahun sekarang
  },
  sumber_perolehan: { type: String, required: true },
  kondisi: {
    type: String,
    enum: ['Baik', 'Buruk', 'Rusak'],
    required: true
  },
  kelayakan: {
    type: String,
    enum: ['Layak', 'Tidak Layak'],
    required: true
  },
  jumlah_unit: {
    type: Number,
    required: true,
    min: 1 // Tidak boleh 0 atau negatif
  },
  penanggung_jawab: { type: String, required: true },
  status: {
    type: String,
    enum: ['Disimpan', 'Dipinjam', 'Dibuanh', 'Hilang'],
    default: 'Disimpan'
  },
  keterangan: { type: String },
  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Item", itemSchema);
