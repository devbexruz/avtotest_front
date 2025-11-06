import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import server from "../../utils/Backend";
import c from "../../utils/latinToCyrillic";

interface Statistics {
  trues: number;
  falses: number;
  ignores: number;
  all: number;
  percentage: number;
}

const TestResult = () => {
  const { result_id } = useParams<{ result_id: string }>();
  const navigate = useNavigate();
  
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatistics = async () => {
    try {
      const data = await server.requestGet<Statistics>(`/result/${result_id}/statistics/`);
      setStatistics(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (result_id) {
      fetchStatistics();
    }
  }, [result_id]);

  if (loading) return <div className="text-center py-4">{c.t("Yuklanmoqda...")}</div>;
  if (!statistics) return <div className="text-center py-4">{c.t("Natija topilmadi")}</div>;

  const { trues, falses, ignores, all, percentage } = statistics;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Ortga va bosh sahifa tugmalari */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-4 py-2 rounded-full shadow-md"
        >
          ⬅ {c.t("Ortga")}
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-green-100 hover:bg-green-200 text-green-700 font-semibold px-4 py-2 rounded-full shadow-md"
        >
          🏠 {c.t("Bosh sahifa")}
        </button>
      </div>

      {/* Asosiy natija kartasi */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {c.t("Test Natijalari")}
        </h1>

        {/* Foiz ko'rsatkichi */}
        <div className="flex justify-center mb-8">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full" viewBox="0 0 120 120">
              {/* Orqa fon */}
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="12"
              />
              {/* Progress */}
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke={percentage >= 70 ? "#10b981" : percentage >= 50 ? "#f59e0b" : "#ef4444"}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${percentage * 3.39} 339`}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-gray-800">
                {percentage}%
              </span>
              <span className="text-sm text-gray-600 mt-1">
                {c.t("To'g'ri javoblar")}
              </span>
            </div>
          </div>
        </div>

        {/* Statistikalar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* To'g'ri javoblar */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{trues}</div>
            <div className="text-sm text-green-800 mt-1">{c.t("To'g'ri")}</div>
          </div>

          {/* Noto'g'ri javoblar */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{falses}</div>
            <div className="text-sm text-red-800 mt-1">{c.t("Noto'g'ri")}</div>
          </div>

          {/* O'tkazib yuborilganlar */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{ignores}</div>
            <div className="text-sm text-yellow-800 mt-1">{c.t("O'tkazib yuborilgan")}</div>
          </div>

          {/* Jami savollar */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{all}</div>
            <div className="text-sm text-blue-800 mt-1">{c.t("Jami")}</div>
          </div>
        </div>

        {/* Progress barlar */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{c.t("To'g'ri javoblar")}</span>
              <span>{trues} / {all}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(trues / all) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{c.t("Noto'g'ri javoblar")}</span>
              <span>{falses} / {all}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-red-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(falses / all) * 100}%` }}
              ></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{c.t("O'tkazib yuborilgan")}</span>
              <span>{ignores} / {all}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(ignores / all) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Baholash */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {c.t("Baholash")}
          </h3>
          <p className={`text-xl font-bold ${
            percentage >= 90 ? "text-green-600" :
            percentage >= 70 ? "text-blue-600" :
            percentage >= 50 ? "text-yellow-600" :
            "text-red-600"
          }`}>
            {percentage >= 90 ? c.t("A'lo") :
             percentage >= 70 ? c.t("Yaxshi") :
             percentage >= 50 ? c.t("Qoniqarli") :
             c.t("Qoniqarsiz")}
          </p>
        </div>

        {/* Harakatlar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
          >
            {c.t("Bosh sahifaga qaytish")}
          </button>
          <button
            onClick={() => navigate("/")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-colors"
          >
            {c.t("Yana test ishlash")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResult;