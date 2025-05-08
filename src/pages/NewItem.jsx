import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NewItem() {
  const [nama_aset, setNamaAset] = useState("");
  const [kategori, setKategori] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [status, setStatus] = useState("Pending");
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
    if (imageFile) {
      const data = new FormData();
      data.append("file", imageFile);
      data.append("upload_preset", "unsigned_preset");

      try {
        const cloudinaryRes = await axios.post(
          "https://api.cloudinary.com/v1_1/dptgahuw9/image/upload", // Ganti dengan cloud name Anda
          data
        );
        imageUrl = cloudinaryRes.data.secure_url;
      } catch (err) {
        console.error("Cloudinary upload failed", err);
        return;
      }
    }

    try {
      await axios.post("http://localhost:5000/items", {
        nama_aset,
        kategori,
        lokasi,
        status,
        kondisi,
        kelayakan,
        tahun_perolehan,
        sumber_perolehan,
        jumlah_unit,
        penanggung_jawab,
        keterangan,
        image: imageUrl,
      });
      navigate("/items");
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Add New Stock</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div>
          <label className="block text-sm font-medium text-gray-700">Kategori</label>
          <input
            type="text"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Lokasi</label>
          <input
            type="text"
            value={lokasi}
            onChange={(e) => setLokasi(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
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
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          >
            <option value="Pending">Disimpan</option>
            <option value="Completed">Dipinjam</option>
            <option value="In Progress">Dibuang</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Tahun Perolehan</label>
          <input
            type="number"
            value={tahun_perolehan}
            onChange={(e) => setTahunPerolehan(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Sumber Perolehan</label>
          <input
            type="text"
            value={sumber_perolehan}
            onChange={(e) => setSumberPerolehan(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Jumlah Unit</label>
          <input
            type="number"
            value={jumlah_unit}
            onChange={(e) => setJumlahUnit(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Penanggung Jawab</label>
          <input
            type="text"
            value={penanggung_jawab}
            onChange={(e) => setPenanggungJawab(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Keterangan</label>
          <input
            type="text"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            className="mt-1 p-2 w-full border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className="mt-1 w-full"
          />
        </div>
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
