import { useState } from "react";
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

  // Ambil token dari localStorage (pastikan sudah login/sudah ada token)
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("Anda harus login dulu untuk menambah item.");
      return;
    }

    let imageUrl = "";
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
        console.error("Cloudinary upload failed", err);
        return;
      }
    }

    try {
      await axios.post(
      "https://kbms-production.up.railway.app/items",
        {
          nama_aset,
          kategori,
          lokasi,
          status,
          kondisi,
          kelayakan,
          tahun_perolehan: Number(tahun_perolehan),
          sumber_perolehan,
          jumlah_unit: Number(jumlah_unit),
          penanggung_jawab,
          keterangan,
          image: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Kirim token di header
          },
        }
      );
      navigate("/items");
    } catch (error) {
      console.error("Error adding item:", error);
      if (error.response && error.response.status === 401) {
        alert("Token tidak valid atau sesi telah berakhir. Silakan login ulang.");
      } else {
        alert("Gagal menambah item.");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Add New Stock</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form input sama seperti sebelumnya */}
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
        {/* ... semua input lainnya tetap sama */}
        {/* ... */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewItem;
