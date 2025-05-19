import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NewItem() {
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

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    if (userRole !== "developer") {
      alert("Anda tidak memiliki akses untuk menambahkan item.");
      navigate("/not-authorized");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    if (imageFile) {
      const data = new FormData();
      data.append("file", imageFile);
      data.append("upload_preset", "unsigned_preset"); // Ganti sesuai preset Cloudinary Anda

      try {
        const cloudinaryRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dptgahuw9/image/upload",
          data
        );
        imageUrl = cloudinaryRes.data.secure_url;
      } catch (err) {
        console.error("Gagal upload gambar:", err);
        alert("Gagal upload gambar.");
        return;
      }
    }

    if (!nama_aset || !kategori || !lokasi || !tahun_perolehan || !penanggung_jawab) {
      alert("Mohon lengkapi semua data wajib.");
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

    try {
      await axios.post("https://kbms-production.up.railway.app/items", payload);
      alert("Item berhasil ditambahkan.");
      navigate("/items");
    } catch (error) {
      console.error("Gagal menambahkan item:", error);
      if (error.response) {
        alert(`Gagal menambahkan item: ${error.response.data.message || 'Kesalahan server'}`);
      } else {
        alert("Terjadi kesalahan saat mengirim data.");
      }
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Tambah Data Aset</h1>
      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="block text-sm font-medium">Nama Aset *</label>
          <input type="text" value={nama_aset} onChange={(e) => setNamaAset(e.target.value)} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Kategori *</label>
          <input type="text" value={kategori} onChange={(e) => setKategori(e.target.value)} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Lokasi *</label>
          <input type="text" value={lokasi} onChange={(e) => setLokasi(e.target.value)} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border p-2 rounded">
            <option value="Disimpan">Disimpan</option>
            <option value="Dipinjam">Dipinjam</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Kondisi</label>
          <select value={kondisi} onChange={(e) => setKondisi(e.target.value)} className="w-full border p-2 rounded">
            <option value="Baik">Baik</option>
            <option value="Rusak">Rusak</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Kelayakan</label>
          <select value={kelayakan} onChange={(e) => setKelayakan(e.target.value)} className="w-full border p-2 rounded">
            <option value="Layak">Layak</option>
            <option value="Tidak Layak">Tidak Layak</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Tahun Perolehan *</label>
          <input type="number" value={tahun_perolehan} onChange={(e) => setTahunPerolehan(e.target.value)} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Sumber Perolehan</label>
          <input type="text" value={sumber_perolehan} onChange={(e) => setSumberPerolehan(e.target.value)} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Jumlah Unit</label>
          <input type="number" value={jumlah_unit} min="1" onChange={(e) => setJumlahUnit(e.target.value)} className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Penanggung Jawab *</label>
          <input type="text" value={penanggung_jawab} onChange={(e) => setPenanggungJawab(e.target.value)} required className="w-full border p-2 rounded" />
        </div>

        <div>
          <label className="block text-sm font-medium">Keterangan</label>
          <textarea value={keterangan} onChange={(e) => setKeterangan(e.target.value)} className="w-full border p-2 rounded" rows={3}></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium">Upload Gambar</label>
          <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="w-full border p-2 rounded" />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Tambah Item
        </button>
      </form>
    </div>
  );
}

export default NewItem;
