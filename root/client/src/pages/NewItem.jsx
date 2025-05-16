import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NewItem() {
  console.log("🔥 NewItem terbaru dimuat");
  const [nama_aset, setNamaAset] = useState("");
  const [kategori, setKategori] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [status, setStatus] = useState("Disimpan");
  const [kondisi, setKondisi] = useState("Baik");
  const [kelayakan, setKelayakan] = useState("Layak");
  const [tahun_perolehan, setTahunPerolehan] = useState("");
  const [sumber_perolehan, setSumberPerolehan] = useState("");
  const [jumlah_unit, setJumlahUnit] = useState(1);
  const [penanggung_jawab, setPenanggungJawab] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    // Upload ke Cloudinary jika ada file gambar
    if (imageFile) {
      const data = new FormData();
      data.append("file", imageFile);
      data.append("upload_preset", "unsigned_preset"); // Ganti jika preset kamu berbeda

      try {
        const cloudinaryRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dptgahuw9/image/upload",
          data
        );
        imageUrl = cloudinaryRes.data.secure_url;
      } catch (err) {
        console.error("❌ Gagal upload gambar ke Cloudinary:", err);
        alert("Gagal upload gambar. Coba lagi.");
        return;
      }
    }

    // Validasi data wajib
    if (!nama_aset || !kategori || !lokasi || !tahun_perolehan || !penanggung_jawab) {
      alert("Mohon lengkapi semua data wajib (nama, kategori, lokasi, tahun, penanggung jawab).");
      return;
    }

    const payload = {
      nama_aset,
      kategori,
      lokasi,
      status,
      kondisi,
      kelayakan,
      tahun_perolehan: parseInt(tahun_perolehan, 10),
      sumber_perolehan,
      jumlah_unit: parseInt(jumlah_unit, 10),
      penanggung_jawab,
      keterangan,
      image: imageUrl,
    };

    console.log("📦 Mengirim data:", payload);

    try {
      const response = await axios.post(
        "https://kbms-production.up.railway.app/items", // Ganti jika endpoint berbeda
        payload
      );
      console.log("✅ Item berhasil ditambahkan:", response.data);
      navigate("/items");
    } catch (error) {
      console.error("❌ Gagal menambahkan item:", error);
      if (error.response) {
        console.error("Detail error:", error.response.data);
        alert(`Gagal menambahkan item: ${error.response.data.message || 'Terjadi kesalahan pada server'}`);
      } else {
        alert("Terjadi kesalahan saat mengirim data.");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Add New Stock</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama Aset */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Nama Barang</label>
          <input
            type="text"
            value={nama_aset}
            onChange={(e) => setNamaAset(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Kategori</label>
          <input
            type="text"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>

        {/* Lokasi */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Lokasi</label>
          <input
            type="text"
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>

        {/* Kondisi */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Kondisi</label>
          <select
            value={kondisi}
            onChange={(e) => setKondisi(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          >
            <option value="Baik">Baik</option>
            <option value="Buruk">Buruk</option>
            <option value="Rusak">Rusak</option>
          </select>
        </div>

        {/* Kelayakan */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Layak/Tidak Layak</label>
          <select
            value={kelayakan}
            onChange={(e) => setKelayakan(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          >
            <option value="Layak">Layak</option>
            <option value="Tidak Layak">Tidak Layak</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          >
            <option value="Disimpan">Disimpan</option>
            <option value="Dipinjam">Dipinjam</option>
            <option value="Dibuang">Dibuang</option>
            <option value="Hilang">Hilang</option>
          </select>
        </div>

        {/* Tahun Perolehan */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tahun Perolehan</label>
          <input
            type="number"
            value={tahun_perolehan}
            onChange={(e) => setTahunPerolehan(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>

        {/* Sumber Perolehan */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Sumber Perolehan</label>
          <input
            type="text"
            value={sumber_perolehan}
            onChange={(e) => setSumberPerolehan(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>

        {/* Jumlah Unit */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Jumlah Unit</label>
          <input
            type="number"
            value={jumlah_unit}
            onChange={(e) => setJumlahUnit(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>

        {/* Penanggung Jawab */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Penanggung Jawab</label>
          <input
            type="text"
            value={penanggung_jawab}
            onChange={(e) => setPenanggungJawab(e.target.value)}
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>

        {/* Keterangan */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Keterangan</label>
          <input
            type="text"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>

        {/* Upload Gambar */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Gambar</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="mt-1 w-full"
          />
        </div>

        {/* Tombol Submit */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Tambah Item
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewItem;
