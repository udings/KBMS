import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold text-blue-600">Ini Tampilan Utama</h1>
        <button
          onClick={() => navigate("/items")}
          className="w-32 h-10 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          Pencet ini
        </button>
      </div>
    </div>
  );
}

export default Home;
