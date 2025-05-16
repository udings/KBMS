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

  // 👉 Cek role di awal saat komponen dimount
  useEffect(() => {
    const userRole = localStorage.getItem("role"); // Ganti jika kamu pakai context
    if (userRole !== "developer") {
      alert("Anda tidak memiliki akses untuk menambahkan item.");
      navigate("/not-authorized"); // atau arahkan ke halaman lain
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = "";

    if (imageFile) {
      const data = new FormData();
      data.append("file", imageFile);
      data.append("upload_preset", "unsigned_preset"); // Ganti sesuai preset Cloudinary

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
      const response = await axios.post(
        "https://kbms-production.up.railway.app/items", // Ganti sesuai endpoint
        payload
      );
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
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Add New Stock</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* (form input fields tetap sama seperti sebelumnya) */}
        {/* ... Semua inputan seperti Nama Barang, Lokasi, dsb ... */}

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
