import { useState, useEffect } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "https://kbms-production.up.railway.app";
console.log("✅ Loaded API URL:", API);

function ItemList() {
  const [items, setItems] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editedItem, setEditedItem] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`${API}/items`, { headers });
        setItems(res.data);
      } catch (err) {
        console.error("❌ Gagal mengambil data barang:", err);
        if (err.response && err.response.status === 401) {
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
      console.error("❌ Gagal menghapus item:", err);
      if (err.response && err.response.status === 401) {
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
      setEditingId(null);
      setEditedItem({});
    } catch (err) {
      console.error("❌ Gagal menyimpan perubahan:", err);
      if (err.response && err.response.status === 401) {
        alert("Token tidak valid atau sesi telah berakhir. Silakan login ulang.");
      }
    }
  };

  const handleChange = (e) => {
    setEditedItem({ ...editedItem, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-xl font-bold text-blue-600">In Stock</h1>
        <div className="space-x-2">
          <button onClick={() => (window.location.href = "/")} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Home
          </button>
          <button onClick={() => (window.location.href = "/items/new")} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            + New Stock
          </button>
          <button
            onClick={() => {
              setEditMode((prev) => !prev);
              setDeleteMode(false);
              setEditingId(null);
            }}
            className={`${editMode ? "bg-yellow-500" : "bg-yellow-400"} text-white px-4 py-2 rounded hover:bg-yellow-600`}
          >
            {editMode ? "Exit Edit Mode" : "Edit Mode"}
          </button>
          <button
            onClick={() => {
              setDeleteMode((prev) => !prev);
              setEditMode(false);
              setEditingId(null);
            }}
            className={`${deleteMode ? "bg-red-500" : "bg-red-400"} text-white px-4 py-2 rounded hover:bg-red-600`}
          >
            {deleteMode ? "Exit Delete Mode" : "Delete Mode"}
          </button>
        </div>
      </div>

      {!token && (
        <p className="mb-4 text-red-600">
          Anda belum login, fitur edit dan hapus tidak tersedia.
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded shadow-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-2 px-4 text-center">Aksi</th>
              <th className="py-2 px-4 text-center">Nama Barang</th>
              <th className="py-2 px-4 text-center">Kategori</th>
              <th className="py-2 px-4 text-center">Lokasi</th>
              <th className="py-2 px-4 text-center">Kondisi</th>
              <th className="py-2 px-4 text-center">Kelayakan</th>
              <th className="py-2 px-4 text-center">Jumlah Unit</th>
              <th className="py-2 px-4 text-center">Penanggung Jawab</th>
              <th className="py-2 px-4 text-center">Gambar</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td className="py-2 px-4 text-center">
                  <div className="flex justify-center gap-2">
                    {editingId === item._id ? (
                      <>
                        <button onClick={handleSaveEdit} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
                          Simpan
                        </button>
                        <button onClick={handleCancelEdit} className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500">
                          Batal
                        </button>
                      </>
                    ) : (
                      <>
                        {editMode && token && (
                          <button onClick={() => handleEditClick(item)} className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500">
                            Edit
                          </button>
                        )}
                        {deleteMode && token && (
                          <button onClick={() => handleDelete(item._id)} className="bg-red-400 text-white px-2 py-1 rounded hover:bg-red-500">
                            Delete
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </td>
                {[
                  "nama_aset",
                  "kategori",
                  "lokasi",
                  "kondisi",
                  "kelayakan",
                  "jumlah_unit",
                  "penanggung_jawab",
                ].map((field) => (
                  <td key={field} className="py-2 px-4">
                    {editingId === item._id ? (
                      <input
                        type={field === "jumlah_unit" ? "number" : "text"}
                        name={field}
                        value={editedItem[field] || ""}
                        onChange={handleChange}
                        className="border px-2 py-1 w-full"
                      />
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
                      className="w-16 h-16 object-cover rounded-lg mx-auto"
                    />
                  ) : (
                    <p>No Image</p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ItemList;
