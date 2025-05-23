import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/background.jpg"; 

function Home() {
  const navigate = useNavigate();

  const handleExternalLink = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="flex flex-col items-center gap-4 bg-white bg-opacity-80 p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-blue-600">Ini Tampilan Utama</h1>
        <button
          onClick={() => navigate("/items")}
          className="w-32 h-10 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          Aset KBMS
        </button>

        <button
          onClick={() => handleExternalLink("https://linktr.ee/kbms_diaspora2025")}
          className="w-32 h-10 bg-indigo-600 text-white rounded-xl hover:bg-green-700 transition"
        >
          Linktree KBMS Diaspora
        </button>

      </div>
    </div>
  );
}

export default Home;
