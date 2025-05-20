import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewItem = () => {
  const navigate = useNavigate();
  const [itemData, setItemData] = useState({
    nama: "",
    kode: "",
    kategori: "",
    kondisi: "",
    kelayakan: "Layak", // default enum
    status: "Disimpan", // default enum
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData({ ...itemData, [name]: value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      return;
    }

    try {
      await axios.post(
        "https://kbms-production.up.railway.app/items",
        itemData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      alert("Item berhasil ditambahkan.");
      navigate("/items");
    } catch (error) {
      console.error("Gagal menambahkan item:", error);
      if (error.response && error.response.data) {
        alert(
          `Gagal menambahkan item: ${error.response.data.message || "Kesalahan server"}`
        );
      } else {
        alert("Terjadi kesalahan saat mengirim data.");
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Tambah Item Baru</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          name="nama"
          placeholder="Nama"
          value={itemData.nama}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="kode"
          placeholder="Kode"
          value={itemData.kode}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="kategori"
          placeholder="Kategori"
          value={itemData.kategori}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="kondisi"
          placeholder="Kondisi"
          value={itemData.kondisi}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <select
          name="kelayakan"
          value={itemData.kelayakan}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="Layak">Layak</option>
          <option value="Tidak Layak">Tidak Layak</option>
        </select>
        <select
          name="status"
          value={itemData.status}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="Disimpan">Disimpan</option>
          <option value="Dipinjam">Dipinjam</option>
          <option value="Dibuang">Dibuang</option>
          <option value="Hilang">Hilang</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tambah Item
        </button>
      </form>
    </div>
  );
};

export default NewItem;
