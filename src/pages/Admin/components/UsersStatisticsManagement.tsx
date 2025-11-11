// src/pages/Admin/components/UsersStatisticsManagement.tsx
import { useState, useEffect } from "react";
import server from "../../../utils/Admin";

// Foydalanuvchi statistikasi uchun interfeys
interface UserStat {
  id: number;
  name: string;
  total_tests: number;
  total_correct: number;
  total_incorrect: number;
  total_questions: number;
  average_score: number;
  average_percent: number;
  best_score: number;
}

export const UsersStatisticsManagement = () => {
  const [usersStats, setUsersStats] = useState<UserStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsersStatistics();
  }, []);

  const fetchUsersStatistics = async () => {
    setLoading(true);
    setError(null);
    try {
      // API call: GET /admin/all_users_stats/
      const data = await server.requestGet<UserStat[]>("/admin/all_users_stats/");
      setUsersStats(data);
    } catch (err) {
      console.error("Error fetching user statistics:", err);
      setError("Foydalanuvchilar statistikasi yuklanmadi. Serverda xatolik.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResults = async (userId: number) => {
    if (!window.confirm("Haqiqatan ham bu foydalanuvchining barcha test (EXAM) natijalarini o'chirmoqchimisiz?")) {
      return;
    }

    setDeletingUserId(userId);
    try {
      // API call: DELETE /admin/all_users_stats/
      await server.requestPost("/admin/all_users_stats/", {
        user_id: userId,
      });
      
      // Natijalarni o'chirgandan so'ng, jadvalni yangilaymiz.
      // O'chirilgan foydalanuvchini jadvaldan olib tashlaymiz yoki statistikani qayta yuklaymiz
      fetchUsersStatistics(); 
      // Agar backend foydalanuvchini qaytarmasa, uni shu yerdan olib tashlaymiz:
      // setUsersStats(prev => prev.filter(stat => stat.id !== userId));
      
      alert(`Foydalanuvchi ID ${userId} uchun natijalar muvaffaqiyatli o'chirildi.`);

    } catch (err) {
      console.error("Error deleting user results:", err);
      alert("Natijalarni o'chirishda xatolik yuz berdi.");
    } finally {
      setDeletingUserId(null);
    }
  };

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">Foydalanuvchilar Statistikasi</h2>
        <div className="text-center py-10 text-neutral-500">Yuklanmoqda...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-neutral-800 mb-6">Foydalanuvchilar Statistikasi</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button 
          onClick={fetchUsersStatistics}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Qayta Yuklash
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-800">Foydalanuvchilar Statistikasi (EXAM)</h2>
        <button
          onClick={fetchUsersStatistics}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>🔄</span>
          Yangilash
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-neutral-200">
          <thead>
            <tr className="bg-neutral-50 text-left text-neutral-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 border-b border-neutral-200">ID</th>
              <th className="py-3 px-6 border-b border-neutral-200">Foydalanuvchi</th>
              <th className="py-3 px-6 border-b border-neutral-200">Jami Testlar</th>
              <th className="py-3 px-6 border-b border-neutral-200">To'g'ri Javob</th>
              <th className="py-3 px-6 border-b border-neutral-200">Noto'g'ri Javob</th>
              <th className="py-3 px-6 border-b border-neutral-200">Jami Savollar</th>
              <th className="py-3 px-6 border-b border-neutral-200">O'rtacha</th>
              <th className="py-3 px-6 border-b border-neutral-200">Eng Yaxshi</th>
              <th className="py-3 px-6 border-b border-neutral-200 text-center">Harakatlar</th>
            </tr>
          </thead>
          <tbody className="text-neutral-700 text-sm font-light">
            {usersStats.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-3 px-6 text-center border-b border-neutral-200">
                  Statistik ma'lumotlar topilmadi.
                </td>
              </tr>
            ) : (
              usersStats.map((stat) => (
                <tr key={stat.id} className="border-b border-neutral-200 hover:bg-neutral-50">
                  <td className="py-3 px-6 text-black whitespace-nowrap">{stat.id}</td>
                  <td className="py-3 px-6 text-black">{stat.name}</td>
                  <td className="py-3 px-6 text-black">{stat.total_tests}</td>
                  <td className="py-3 px-6 text-black">{stat.total_correct}</td>
                  <td className="py-3 px-6 text-black">{stat.total_incorrect}</td>
                  <td className="py-3 px-6 text-black">{stat.total_questions}</td>
                  <td className="py-3 px-6 text-black font-medium">{stat.average_score}</td>
                  <td className="py-3 px-6 text-black font-semibold text-green-600">{stat.best_score}</td>
                  <td className="py-3 px-6 text-center">
                    <button
                      onClick={() => handleDeleteResults(stat.id)}
                      disabled={deletingUserId === stat.id}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${
                        deletingUserId === stat.id
                          ? "bg-neutral-400 text-neutral-700 cursor-not-allowed"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      {deletingUserId === stat.id ? "O'chirilmoqda..." : "Natijalarni o'chirish"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};