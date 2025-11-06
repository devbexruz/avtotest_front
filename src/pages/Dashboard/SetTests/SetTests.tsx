import { useNavigate } from "react-router-dom";
import server from "../../../utils/Backend"; // sizning server util faylingiz
import c from "../../../utils/latinToCyrillic";


const SetTests = () => {
  const navigate = useNavigate();

  // 🔹 Tanlash mumkin bo‘lgan test sonlari
  const testCounts = [20, 40, 60, 80, 100, 120];

// 🔹 Test boshlash
  const handleSelect = async (count: number) => {
    try {
      // API ga POST so‘rov yuboramiz
      const res = await server.requestPost<{ id: number }>("/start_tests/start_settest/", {
        count: count,
      });

      // Masalan, backend natijani shunday qaytaradi: { "result_id": 15 }
      const resultId = res.id;

      if (resultId) {
        navigate(`/testresult/${resultId}`); // test yechish sahifasiga yo‘naltiramiz
      } else {
        alert("Testlar Yetarli emas!");
      }
    } catch (err) {
      console.error("Testni boshlashda xatolik:", err);
      alert("Testni boshlashda xatolik yuz berdi!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full text-center">
        {/* Ortga qaytish */}
        <div className="mb-8 text-left">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition"
          >
            {c.t("⬅️ Ortga")}
          </button>
        </div>

        {/* Header */}
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          {c.t("Sozlamali testlar")}
        </h1>
        <p className="text-gray-600 mb-10 text-lg">
          {c.t("Sizga kerakli testlar sonini tanlang")}
        </p>

        {/* Tugmalar grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {testCounts.map((count, i) => (
            <button
              key={i}
              onClick={() => handleSelect(count)}
              className="relative bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold h-32 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 flex flex-col justify-center items-center"
            >
              <div className="text-5xl font-bold">{count}</div>
              <div className="text-sm opacity-90">{c.t("ta test")}</div>

              <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 hover:opacity-20 transition-all duration-300"></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SetTests;
