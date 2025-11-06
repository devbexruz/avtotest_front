


// src/pages/Admin/AdminDashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import server from "../../utils/Admin";

// Admin boshqaruv komponentlari
import { UsersManagement } from "./components/UserManagement";
import { ThemesManagement } from "./components/ThemeManagement";
import { TicketsManagement } from "./components/TicketManagement";
import { TestsManagement } from "./components/TestsManagement";

interface Statistics {
  users: number;
  themes: number;
  tickets: number;
  tests: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (activeTab === "dashboard") {
      fetchStatistics();
    }
  }, [activeTab]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const data = await server.requestGet<Statistics>("/admin/statistics/");
      setStats(data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: "📊" },
    { id: "users", name: "Foydalanuvchilar", icon: "👥" },
    { id: "themes", name: "Mavzular", icon: "📚" },
    { id: "tickets", name: "Biletlar", icon: "🎫" },
    { id: "tests", name: "Testlar", icon: "📝" },
  ];
  const setPage = (id: string) => {
    navigate(`/admin/${id}`);
    setActiveTab(id);
  }
  menuItems.map((item) => {
    if (window.location.href.includes(`/admin/${item.id}`) && activeTab !== item.id) {
      setPage(item.id);
    }
  })
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        
        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span className="mr-3">🚪</span>
            Chiqish
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        {activeTab === "dashboard" && <DashboardContent stats={stats} loading={loading} onRefresh={fetchStatistics} />}
        {activeTab === "users" && <UsersManagement />}
        {activeTab === "themes" && <ThemesManagement />}
        {activeTab === "tickets" && <TicketsManagement />}
        {activeTab === "tests" && <TestsManagement />}
      </div>
    </div>
  );
};

// Dashboard Content Component
interface DashboardContentProps {
  stats: Statistics | null;
  loading: boolean;
  onRefresh: () => void;
}

const DashboardContent = ({ stats, loading, onRefresh }: DashboardContentProps) => {
    // const navigate = useNavigate();
  const setPage = (id: string) => {
    window.location.replace(`/admin/${id}`);
  }
  if (loading) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <button
            onClick={onRefresh}
            disabled
            className="bg-gray-400 text-white px-4 py-2 rounded-lg cursor-not-allowed"
          >
            Yangilash...
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <button
            onClick={onRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Qayta Yuklash
          </button>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Statistika ma'lumotlarini yuklab bo'lmadi
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <button
          onClick={onRefresh}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>🔄</span>
          Yangilash
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600">Jami Foydalanuvchilar</h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.users}</p>
            </div>
            <div className="text-3xl text-blue-500">👥</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600">Jami Mavzular</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.themes}</p>
            </div>
            <div className="text-3xl text-green-500">📚</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600">Jami Biletlar</h3>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.tickets}</p>
            </div>
            <div className="text-3xl text-purple-500">🎫</div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-600">Jami Testlar</h3>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.tests}</p>
            </div>
            <div className="text-3xl text-orange-500">📝</div>
          </div>
        </div>
      </div>

      {/* Additional Stats Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Umumiy Statistika</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Foydalanuvchilar</span>
              <span className="font-semibold">{stats.users} ta</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Mavzular</span>
              <span className="font-semibold">{stats.themes} ta</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Biletlar</span>
              <span className="font-semibold">{stats.tickets} ta</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Testlar</span>
              <span className="font-semibold">{stats.tests} ta</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Tezkor Harakatlar</h3>
          <div className="space-y-3">
            <button 
              onClick={() => setPage("users")}
              className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-blue-600">👥</span>
                <div>
                  <p className="font-medium text-gray-800">Foydalanuvchilarni boshqarish</p>
                  <p className="text-sm text-gray-600">{stats.users} ta foydalanuvchi</p>
                </div>
              </div>
            </button>
            
            <button 
              onClick={() => setPage("tests")}
              className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-green-600">📝</span>
                <div>
                  <p className="font-medium text-gray-800">Testlarni boshqarish</p>
                  <p className="text-sm text-gray-600">{stats.tests} ta test</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;