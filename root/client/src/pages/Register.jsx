import { useState } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "https://kbms-production.up.railway.app";

function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "user", // default role bisa diubah sesuai kebutuhan
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const res = await axios.post(`${API}/api/auth/register`, form);
      setMessage(res.data.message || "Registrasi berhasil!");
      setForm({ username: "", password: "", role: "user" });
    } catch (err) {
      setError(
        err.response?.data?.message || "Terjadi kesalahan saat registrasi."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

      {message && <p className="mb-4 text-green-600">{message}</p>}
      {error && <p className="mb-4 text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1 font-semibold">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
            autoComplete="username"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
            autoComplete="new-password"
          />
        </div>

        {/* Optional: Role selector if you want to allow role assignment */}
        {/* 
        <div>
          <label htmlFor="role" className="block mb-1 font-semibold">
            Role
          </label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="developer">Developer</option>
          </select>
        </div>
        */}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
