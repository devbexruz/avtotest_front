import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../../utils/Backend";
import c from "../../utils/latinToCyrillic";

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
        console.error(c.t("Statistikani olishda xatolik:"), error);
      } finally {
        setLoading(false);
      }
    };
    fetchStatistics();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-neutral-500">
        {c.t("Yuklanmoqda...")}
      </div>
    );

  if (!stats)
    return (
      <div className="text-center text-neutral-600 py-10">
        {c.t("Statistika topilmadi 😕")}
      </div>
    );

  return (
    <div id='main_container' className="pb-100 pt-30 bg-neutral-800 flex justify-center items-center p-6">
      <div className="bg-neutral-700 shadow-lg p-8 w-full max-w-2xl border border-neutral-500">
        <h1 className="text-3xl font-bold text-neutral-200 text-center mb-6">
          {c.t("📊 Umumiy statistika")}
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center">
          <div className="bg-blue-500 border border-neutral-500 p-4">
            <p className="text-neutral-50 text-sm">{c.t("Jami testlar")}</p>
            <p className="text-2xl font-bold text-neutral-100">{stats.total_tests}</p>
          </div>

          <div className="bg-green-500 border border-neutral-500 p-4">
            <p className="text-neutral-50 text-sm">{c.t("To‘g‘ri javoblar")}</p>
            <p className="text-2xl font-bold text-neutral-100">{stats.total_correct}</p>
          </div>

          <div className="bg-red-500 border border-neutral-500 p-4">
            <p className="text-neutral-50 text-sm">{c.t("Noto‘g‘ri javoblar")}</p>
            <p className="text-2xl font-bold text-neutral-100">{stats.total_incorrect}</p>
          </div>

          <div className="bg-yellow-500 border border-neutral-500 p-4 col-span-2 sm:col-span-1">
            <p className="text-neutral-50 text-sm">{c.t("O‘rtacha ball")}</p>
            <p className="text-2xl font-bold text-neutral-100">{stats.average_score}</p>
          </div>

          <div className="bg-purple-500 border border-neutral-500 p-4">
            <p className="text-neutral-50 text-sm">{c.t("O‘rtacha foiz")}</p>
            <p className="text-2xl font-bold text-neutral-100">{stats.average_percent}%</p>
          </div>

          <div className="bg-orange-500 border border-neutral-500 p-4">
            <p className="text-neutral-50 text-sm">{c.t("Eng yuqori ball")}</p>
            <p className="text-2xl font-bold text-neutral-100">{stats.best_score}</p>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
          >
            {c.t("⬅️ Ortga")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
