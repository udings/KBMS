import { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "https://kbms-production.up.railway.app";
console.log("\u2705 Loaded API URL:", API);

function ItemList() {
  const [items, setItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedItem, setEditedItem] = useState({});
  const [selectedKategori, setSelectedKategori] = useState("Semua");

  const token = localStorage.getItem("token");

  const opsiPenanggungJawab = [...new Set(items.map((item) => item.penanggung_jawab).filter(Boolean))];
  const opsiKondisi = ["Baik", "Buruk", "Rusak"];
  const opsiKelayakan = ["Layak", "Tidak Layak"];
  const opsiStatus = ["Digunakan", "Disimpan", "Dipinjam", "Hilang"];
  const opsiKategori = ["Semua", ...new Set(items.map((item) => item.kategori).filter(Boolean))];

  const [selectedImage, setSelectedImage] = useState(null);

  const filteredItems = items.filter(item => selectedKategori === "Semua" || item.kategori === selectedKategori);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`${API}/items`, { headers });
        setItems(res.data);
      } catch (err) {
        console.error("\u274C Gagal mengambil data barang:", err);
        if (err.response?.status === 401) {
          alert("Token tidak valid atau sesi telah berakhir. Silakan login ulang.");
        }
      }
    };

    fetchItems();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus item ini?")) return;
    if (!token) {
      alert("Anda harus login dulu untuk menghapus item.");
      return;
    }
    try {
      await axios.delete(`${API}/items/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error("\u274C Gagal menghapus item:", err);
      if (err.response?.status === 401) {
        alert("Token tidak valid atau sesi telah berakhir. Silakan login ulang.");
      }
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditedItem({ ...item });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditedItem({});
  };

  const handleSaveEdit = async () => {
    if (!token) {
      alert("Anda harus login dulu untuk mengedit item.");
      return;
    }
    try {
      const dataToSend = {
        ...editedItem,
        jumlah_unit: Number(editedItem.jumlah_unit),
      };
      const res = await axios.put(`${API}/items/${editingId}`, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems((prev) =>
        prev.map((item) => (item._id === editingId ? res.data : item))
      );
      handleCancelEdit();
    } catch (err) {
      console.error("\u274C Gagal menyimpan perubahan:", err);
      if (err.response?.status === 401) {
        alert("Token tidak valid atau sesi telah berakhir. Silakan login ulang.");
      }
    }
  };

  const handleChange = (e) => {
    setEditedItem({ ...editedItem, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-between mb-4 gap-2">
        <h1 className="text-xl font-bold text-blue-600">In Stock</h1>
        <div className="space-x-2 flex flex-wrap">
          <button onClick={() => (window.location.href = "/")} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Home</button>

          {token && (
            <>
              <button onClick={() => (window.location.href = "/items/new")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">New Stock</button>
              <button onClick={() => { setEditMode((prev) => !prev); setDeleteMode(false); setEditingId(null); }} className={`${editMode ? "bg-yellow-500" : "bg-yellow-400"} text-white px-4 py-2 rounded hover:bg-yellow-600`}>
                {editMode ? "Exit Edit Mode" : "Edit Mode"}
              </button>
              <button onClick={() => { setDeleteMode((prev) => !prev); setEditMode(false); setEditingId(null); }} className={`${deleteMode ? "bg-red-500" : "bg-red-400"} text-white px-4 py-2 rounded hover:bg-red-600`}>
                {deleteMode ? "Exit Delete Mode" : "Delete Mode"}
              </button>
            </>
          )}

          {token ? (
            <button onClick={() => { localStorage.removeItem("token"); window.location.reload(); }} className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800">Logout</button>
          ) : (
            <button onClick={() => (window.location.href = "/login")} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Login</button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Filter Kategori:</label>
        <select value={selectedKategori} onChange={(e) => setSelectedKategori(e.target.value)} className="border px-2 py-1 rounded">
          {opsiKategori.map((kategori) => (
            <option key={kategori} value={kategori}>{kategori}</option>
          ))}
        </select>
      </div>

      {/* Desktop */}
      {/* Ini yang terbaru */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full bg-white border border-gray-200 rounded shadow-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              {["Aksi", "Nama Barang", "Kategori", "Lokasi", "Kondisi", "Kelayakan", "Jumlah Unit", "Tahun", "Sumber", "Status", "Keterangan", "Penanggung Jawab", "Gambar"].map((head) => (
                <th key={head} className="py-2 px-4 text-center">{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item._id}>
                <td className="py-2 px-4 text-center">
  <div className="flex justify-center gap-2">
    {editingId === item._id ? (
      <>
        <button onClick={handleSaveEdit} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">Simpan</button>
        <button onClick={handleCancelEdit} className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500">Batal</button>
      </>
    ) : (
      <>
        {editMode && token && (
          <button onClick={() => handleEditClick(item)} className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500">Edit</button>
        )}
        {deleteMode && token && (
          <button onClick={() => handleDelete(item._id)} className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500">Delete</button>
        )}
      </>
    )}
  </div>
</td>
                {["nama_aset", "kategori", "lokasi", "kondisi", "kelayakan", "jumlah_unit", "tahun_perolehan", "sumber_perolehan", "status", "keterangan", "penanggung_jawab"].map((field) => (
                  <td key={field} className="py-2 px-4 text-center">
                    {editingId === item._id ? (
                      field === "jumlah_unit" || field === "tahun_perolehan" ? (
                        <input type="number" name={field} value={editedItem[field] || ""} onChange={handleChange} className="border px-2 py-1 w-full" />
                      ) : ["kondisi", "kelayakan", "status", "penanggung_jawab"].includes(field) ? (
                        <select name={field} value={editedItem[field] || ""} onChange={handleChange} className="border px-2 py-1 w-full">
                          <option value="">-- Pilih --</option>
                          {(field === "kondisi" ? opsiKondisi : field === "kelayakan" ? opsiKelayakan : field === "status" ? opsiStatus : opsiPenanggungJawab).map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input type="text" name={field} value={editedItem[field] || ""} onChange={handleChange} className="border px-2 py-1 w-full" />
                      )
                    ) : (
                      item[field]
                    )}
                  </td>
                ))}
                <td className="py-2 px-4 text-center">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.nama_aset}
                      onClick={() => setSelectedImage(item.image)}
                      className="w-full h-40 object-cover rounded mt-2 cursor-pointer hover:scale-105 transition"/>
                  ) : (
                    <p>No Image</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {filteredItems.map((item) => (
          <div key={item._id} className="border p-4 rounded shadow-sm bg-white">
            <div className="flex justify-between mb-2">
              <h2 className="font-semibold text-lg">{item.nama_aset}</h2>
              <div className="flex gap-2">
                {editingId === item._id ? (
            <>
              <button onClick={handleSaveEdit} className="text-sm bg-green-500 text-white px-2 py-1 rounded">Simpan</button>
              <button onClick={handleCancelEdit} className="text-sm bg-gray-400 text-white px-2 py-1 rounded">Batal</button>
            </>
          ) : (
            <>
              {editMode && token && (
                <button onClick={() => handleEditClick(item)} className="text-sm bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
              )}
              {deleteMode && token && (
                <button onClick={() => handleDelete(item._id)} className="text-sm bg-red-400 text-white px-2 py-1 rounded">Delete</button>
              )}
            </>
          )}
        </div>
      </div>
            <div className="text-sm space-y-1">
  {["kategori", "lokasi", "kondisi", "kelayakan", "jumlah_unit", "tahun_perolehan", "sumber_perolehan", "status", "keterangan", "penanggung_jawab"].map((field) => (
    <div key={field}>
      <strong>{field.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}:</strong>{" "}
      {editingId === item._id ? (
        ["jumlah_unit", "tahun_perolehan"].includes(field) ? (
          <input
            type="number"
            name={field}
            value={editedItem[field] || ""}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        ) : ["kondisi", "kelayakan", "status", "penanggung_jawab"].includes(field) ? (
          <select
            name={field}
            value={editedItem[field] || ""}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          >
            <option value="">-- Pilih --</option>
            {(field === "kondisi"
              ? opsiKondisi
              : field === "kelayakan"
              ? opsiKelayakan
              : field === "status"
              ? opsiStatus
              : opsiPenanggungJawab
            ).map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            name={field}
            value={editedItem[field] || ""}
            onChange={handleChange}
            className="border px-2 py-1 rounded w-full"
          />
        )
      ) : (
        item[field]
      )}
    </div>
  ))}
</div>

            {item.image && (
  <img
    src={item.image}
    alt={item.nama_aset}
    onClick={() => setSelectedImage(item.image)}
    className="w-full h-32 object-cover rounded mt-2 cursor-pointer hover:scale-105 transition"
  />
)}

          </div>
        ))}
      </div>
      {selectedImage && (
  <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
    <div className="bg-white p-4 rounded shadow-lg max-w-3xl w-full relative">
      <button
        onClick={() => setSelectedImage(null)}
        className="absolute top-2 right-2 text-gray-700 hover:text-black text-2xl font-bold"
      >
        &times;
      </button>
      <img src={selectedImage} alt="Detail" className="w-full h-auto rounded" />
    </div>
  </div>
)}
    </div>
  );
}

export default ItemList;