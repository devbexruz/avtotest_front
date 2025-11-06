import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../../utils/Backend";


interface StatisticsData {
  total_tests: number;
  total_correct: number;
  total_incorrect: number;
  total_questions: number;
  average_score: number;
  average_percent: number;
  best_score: number;
}

const Statistics = () => {
  const [stats, setStats] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const res = await server.requestGet<StatisticsData>("/statistics/");
        setStats(res);
      } catch (error) {
        console.error("Statistikani olishda xatolik:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatistics();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Yuklanmoqda...
      </div>
    );

  if (!stats)
    return (
      <div className="text-center text-gray-600 py-10">
        Statistika topilmadi 😕
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
          📊 Umumiy statistika
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-gray-500 text-sm">Jami testlar</p>
            <p className="text-2xl font-bold text-blue-700">{stats.total_tests}</p>
          </div>

          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-gray-500 text-sm">To‘g‘ri javoblar</p>
            <p className="text-2xl font-bold text-green-600">{stats.total_correct}</p>
          </div>

          <div className="bg-red-50 rounded-xl p-4">
            <p className="text-gray-500 text-sm">Noto‘g‘ri javoblar</p>
            <p className="text-2xl font-bold text-red-600">{stats.total_incorrect}</p>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4 col-span-2 sm:col-span-1">
            <p className="text-gray-500 text-sm">O‘rtacha ball</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.average_score}</p>
          </div>

          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-gray-500 text-sm">O‘rtacha foiz</p>
            <p className="text-2xl font-bold text-purple-700">{stats.average_percent}%</p>
          </div>

          <div className="bg-orange-50 rounded-xl p-4">
            <p className="text-gray-500 text-sm">Eng yuqori ball</p>
            <p className="text-2xl font-bold text-orange-600">{stats.best_score}</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
          >
            ⬅️ Ortga
          </button>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
