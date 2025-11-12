// UsersManagement.tsx
import { useState, useEffect } from "react";
import server from "../../../utils/Admin";
import c from "../../../utils/latinToCyrillic";

interface User {
  id: number;
  username: string;
  full_name?: string;
  role: string; // "ADMIN" yoki "STUDENT"
}

interface StatisticsData {
  total_tests: number;
  total_correct: number;
  total_incorrect: number;
  total_questions: number;
  average_score: number;
  average_percent: number;
  best_score: number;
}

export const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showUserStatisticModal, setUserStatisticModal] = useState(false);
  const [stats, setStats] = useState<StatisticsData>({
    total_tests: 0,
    total_correct: 0,
    total_incorrect: 0,
    total_questions: 0,
    average_score: 0,
    average_percent: 0,
    best_score: 0
  });

  const getUserStatistics = async (user_id: number) => {
    try {
      const res = await server.requestGet<StatisticsData>("/admin/user_statistics/" + user_id+"/");
      setStats(res);
      setUserStatisticModal(true);
    } catch (error) {
      console.error(c.t("Statistikani olishda xatolik:"), error);
    } finally {
      setLoading(false);
    }
  };
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    full_name: ""
  });
  const [editFormData, setEditFormData] = useState({
    username: "",
    full_name: "",
    role: "USER",
    password: ""
  });

  const fetchUsers = async () => {
    try {
      const data = await server.requestGet<User[]>("/admin/user/");
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await server.requestPost("/admin/user/", formData);
      setShowModal(false);
      setFormData({ username: "", password: "", full_name: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      if (editFormData.password) {
        await server.requestPut(`/admin/user/${editingUser.id}/`, {
          username: editFormData.username,
          full_name: editFormData.full_name,
          role: editFormData.role,
          password: editFormData.password
        });
      } else {
        await server.requestPut(`/admin/user/${editingUser.id}/`, {
          username: editFormData.username,
          full_name: editFormData.full_name,
          role: editFormData.role
        });
      }
      setShowEditModal(false);
      setEditingUser(null);
      setEditFormData({ username: "", full_name: "", role: "STUDENT", password: "" });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      username: user.username,
      full_name: user.full_name || "",
      role: user.role,
      password: ""
    });
    setShowEditModal(true);
  };

  const deleteUser = async (id: number) => {
    if (!window.confirm(c.t("Foydalanuvchini o'chirishni tasdiqlaysizmi?"))) return;
    
    try {
      await server.requestDelete(`/admin/user/${id}/`);
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const toggleAdminRole = async (user: User) => {
    const newRole = user.role === "ADMIN" ? "STUDENT" : "ADMIN";
    
    try {
      await server.requestPut(`/admin/user/${user.id}/`, {
        username: user.username,
        full_name: user.full_name || "",
        role: newRole
      });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  if (loading) return <div>{c.t("Yuklanmoqda...")}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-800">{c.t("Foydalanuvchilar Boshqaruvi")}</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {c.t("+ Yangi Foydalanuvchi")}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                {c.t("ID")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                {c.t("Username")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                {c.t("Ism")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                {c.t("Statistika")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                {c.t("Admin")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                {c.t("Harakatlar")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-neutral-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                  {user.full_name || "-"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                  <button
                    className="cursor-pointer text-neutral-600 hover:text-neutral-900 rounded p-2 bg-green-100"
                    onClick={() => getUserStatistics(user.id)}
                  >📊 ko'rish</button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={user.role === "ADMIN"}
                      onChange={() => toggleAdminRole(user)}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {c.t("Tahrirlash")}
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    {c.t("O'chirish")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{c.t("Yangi Foydalanuvchi")}</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {c.t("Username")} *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {c.t("Parol")} *
                  </label>
                  <input
                    type="password"
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {c.t("To'liq Ism")}
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-800"
                >
                  {c.t("Bekor qilish")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {c.t("Saqlash")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{c.t("Foydalanuvchini Tahrirlash")}</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {c.t("Username")} *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={editFormData.username}
                    onChange={(e) => setEditFormData({...editFormData, username: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {c.t("To'liq Ism")} *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={editFormData.full_name}
                    onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})}
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    {c.t("Update qilish uchun To'liq Ism majburiy")}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <label className="block text-sm font-medium text-neutral-700">
                    {c.t("Admin huquqlari")}
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFormData.role === "ADMIN"}
                      onChange={(e) => setEditFormData({
                        ...editFormData, 
                        role: e.target.checked ? "ADMIN" : "STUDENT"
                      })}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {c.t("Yangilash")}
                </button>
              </div>
            <h3 className="text-lg font-semibold mb-4">{c.t("Parolni almashtirish")}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {c.t("Parol")} *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({...editFormData, password: e.target.value || ""})}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-800"
                >
                  {c.t("Bekor qilish")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {c.t("Yangilash")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Show User Statistic Modal */}
      {showUserStatisticModal && (

        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
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
                onClick={() => setUserStatisticModal(false)}
                className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all"
              >
                {c.t("❌ Yopish")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};