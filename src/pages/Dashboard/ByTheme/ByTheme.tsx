import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../../../utils/Backend";
import c from "../../../utils/latinToCyrillic";

interface Theme {
  id: number;
  name: string;
}

const Themes = () => {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeResults, setActiveResults] = useState<Record<number, number>>({});
  const navigate = useNavigate();

  // 🔹 Mavzularni olish
  const fetchThemes = async () => {
    try {
      const data = await server.requestGet<Theme[]>("/themes/");
      setThemes(data);
    } catch (error) {
      console.error("Mavzularni olishda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, []);

  // 🔹 Testni boshlash
  const startThemeTest = async (themeId: number) => {
    try {
      const response = await server.requestPost<{ id: number, error?: string }>("/start_tests/start_theme/", { theme_id: themeId });
      if (response.error) {
        alert(response.error);
        return;
      }
      const resultId = response.id; // backendda Result id qaytishi kerak
      setActiveResults((prev) => ({ ...prev, [themeId]: resultId }));
      navigate(`/testresult/${resultId}`);
    } catch (error) {
      console.error("Testni boshlashda xatolik:", error);
    }
  };

  // 🔹 Testni qayta boshlash
  const restartThemeTest = async (themeId: number) => {
    try {
      const response = await server.requestPost<{ id: number }>("/start_tests/start_theme/", { theme_id: themeId });
      const resultId = response.id;
      setActiveResults((prev) => ({ ...prev, [themeId]: resultId }));
      navigate(`/testresult/${resultId}`);
    } catch (error) {
      console.error("Testni qayta boshlashda xatolik:", error);
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-neutral-500">{c.t("Yuklanmoqda...")}</div>;
  }

  return (
    <div id='main_container' className="min-h-screen p-6 bg-gradient-to-br from-blackblue-500 to-neutral-700 p-4">
      <div className="max-w-8xl mx-auto">

        {/* Ortga qaytish */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition"
          >
            {c.t("⬅️ Ortga")}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-200 mb-2">{c.t("Mavzular bo‘yicha testlar")}</h1>
          <p className="text-neutral-200 max-w-2xl mx-auto">
            {c.t("Sizga qiziqqan mavzuni tanlang va testlarni boshlang")}
          </p>
        </div>

        {/* Qidiruv */}
        <div className="mb-8 flex justify-center text-neutral-200">
          <input
            type="text"
            placeholder={c.t("🔍 Mavzuni qidiring...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-neutral-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all"
          />
        </div>

        {/* Tugmalar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {themes
            .filter((theme) => theme.name.toLowerCase().includes(search.toLowerCase()))
            .map((theme) => (
              <div key={theme.id} className="relative">
                <button
                  onClick={() => startThemeTest(theme.id)}
                  className="bg-neutral-800 hover:bg-neutral-900 w-full p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-10px] border border-neutral-600 flex flex-col justify-center items-center text-center group"
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">📚</div>
                  <h3 className="text-lg font-semibold text-neutral-200 mb-1">{c.t(theme.name)}</h3>
                  <p className="text-neutral-300 text-sm max-w-[160px] truncate">{c.t("Bu mavzu bo‘yicha testlar mavjud")}</p>
                </button>

                {/* Agar test allaqachon boshlandi */}
                {activeResults[theme.id] && (
                  <button
                    onClick={() => restartThemeTest(theme.id)}
                    className="absolute top-2 right-2 bg-yellow-300 hover:bg-yellow-400 text-neutral-800 px-3 py-1 rounded-full text-xs font-semibold shadow"
                  >
                    Qayta boshlash
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Themes;
