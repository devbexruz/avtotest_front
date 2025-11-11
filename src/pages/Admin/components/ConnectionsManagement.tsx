// src/pages/Admin/components/ConnectionsManagement.tsx
import { useState, useEffect } from "react";
import server from "../../../utils/Admin";

interface Connections {
  telegram_link: string;
  phone_number: string;
  // Yangi qo'shildi
  instagram_link: string;
  youtube_link: string;
}

export const ConnectionsManagement = () => {
  const [connections, setConnections] = useState<Connections>({
    telegram_link: "",
    phone_number: "",
    // Boshlang'ich qiymatlar
    instagram_link: "",
    youtube_link: "",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      // '/public/connection/' endpointdan barcha 4 ta ma'lumotni yuklaydi deb taxmin qilinadi
      const data = await server.requestGet<Connections>("/public/connection/");
      setConnections(data);
    } catch (error) {
      console.error("Error fetching connections:", error);
      setMessage("Ma'lumotlarni yuklab bo'lmadi");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage("");

      // Har bir field uchun alohida PUT so'rovi (yangi fieldlar qo'shildi)
      const updates = [];
      
      if (connections.telegram_link !== undefined) {
        updates.push(
          server.requestPut("/public/connection/", {
            key: "telegram_link",
            value: connections.telegram_link
          })
        );
      }

      if (connections.phone_number !== undefined) {
        updates.push(
          server.requestPut("/public/connection/", {
            key: "phone_number",
            value: connections.phone_number
          })
        );
      }
      
      // *** YANGI QO'SHILGAN QISMLAR ***
      if (connections.instagram_link !== undefined) {
        updates.push(
          server.requestPut("/public/connection/", {
            key: "instagram_link",
            value: connections.instagram_link
          })
        );
      }

      if (connections.youtube_link !== undefined) {
        updates.push(
          server.requestPut("/public/connection/", {
            key: "youtube_link",
            value: connections.youtube_link
          })
        );
      }
      // *******************************

      await Promise.all(updates);
      setMessage("Ma'lumotlar muvaffaqiyatli saqlandi!");
      setEditing(false);
      
      // Yangilangan ma'lumotlarni qayta yuklash
      setTimeout(() => fetchConnections(), 1000);
      
    } catch (error) {
      console.error("Error saving connections:", error);
      setMessage("Ma'lumotlarni saqlashda xatolik yuz berdi");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Connections, value: string) => {
    setConnections(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-neutral-800">Bog'lanish Ma'lumotlari</h2>
        <div className="flex gap-3">
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-green-400 flex items-center gap-2"
              >
                {saving ? "⏳" : "💾"}
                {saving ? "Saqlanmoqda..." : "Saqlash"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  fetchConnections(); // O'zgarishlarni bekor qilish
                }}
                disabled={saving}
                className="bg-neutral-600 text-white px-4 py-2 rounded-lg hover:bg-neutral-700 disabled:bg-neutral-400"
              >
                Bekor qilish
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              ✏️ Tahrirlash
            </button>
          )}
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.includes("muvaffaqiyatli") 
            ? "bg-green-100 text-green-700 border border-green-300" 
            : "bg-red-100 text-red-700 border border-red-300"
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Telefon Raqami */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-neutral-700">
              Telefon Raqami
            </label>
            {editing ? (
              <input
                type="text"
                value={connections.phone_number}
                onChange={(e) => handleChange("phone_number", e.target.value)}
                placeholder="+998901234567"
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <div className="p-3 bg-neutral-50 rounded-lg border">
                <a 
                  href={`tel:${connections.phone_number}`}
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {connections.phone_number || "Ma'lumot kiritilmagan"}
                </a>
              </div>
            )}
            <p className="text-sm text-neutral-500">
              Bog'lanish uchun telefon raqamingiz
            </p>
          </div>

          {/* Telegram Link */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-neutral-700">
              Telegram Link
            </label>
            {editing ? (
              <input
                type="text"
                value={connections.telegram_link}
                onChange={(e) => handleChange("telegram_link", e.target.value)}
                placeholder="https://t.me/username"
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <div className="p-3 bg-neutral-50 rounded-lg border">
                <a 
                  href={connections.telegram_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {connections.telegram_link || "Ma'lumot kiritilmagan"}
                </a>
              </div>
            )}
            <p className="text-sm text-neutral-500">
              Telegram kanal yoki profilingizga havola
            </p>
          </div>

          {/* *** YANGI QO'SHILGAN MAYDON: Instagram Link *** */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-neutral-700">
              Instagram Link
            </label>
            {editing ? (
              <input
                type="text"
                value={connections.instagram_link}
                onChange={(e) => handleChange("instagram_link", e.target.value)}
                placeholder="https://instagram.com/username"
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <div className="p-3 bg-neutral-50 rounded-lg border">
                <a 
                  href={connections.instagram_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {connections.instagram_link || "Ma'lumot kiritilmagan"}
                </a>
              </div>
            )}
            <p className="text-sm text-neutral-500">
              Instagram profilingizga havola
            </p>
          </div>

          {/* *** YANGI QO'SHILGAN MAYDON: YouTube Link *** */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-neutral-700">
              YouTube Link
            </label>
            {editing ? (
              <input
                type="text"
                value={connections.youtube_link}
                onChange={(e) => handleChange("youtube_link", e.target.value)}
                placeholder="https://youtube.com/channelname"
                className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <div className="p-3 bg-neutral-50 rounded-lg border">
                <a 
                  href={connections.youtube_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {connections.youtube_link || "Ma'lumot kiritilmagan"}
                </a>
              </div>
            )}
            <p className="text-sm text-neutral-500">
              YouTube kanalingizga havola
            </p>
          </div>
          {/* ************************************************* */}
        </div>

        {/* Preview Section */}
        {!editing && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold text-neutral-800 mb-4">
              Ko'rinish Preview
            </h3>
            <div className="bg-neutral-900 text-white p-6 rounded-lg">
              <div className="max-w-md mx-auto text-center">
                <div className="mb-4">
                  <h4 className="text-xl font-bold mb-2">Biz bilan bog'laning</h4>
                  {connections.phone_number && (
                    <div className="bg-blue-500 text-white px-4 py-2 rounded-lg inline-block">
                      <span className="font-semibold">{connections.phone_number}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  {connections.phone_number && (
                    <a
                      href={`tel:${connections.phone_number}`}
                      className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-colors"
                    >
                      📞 Qo'ng'iroq qilish
                    </a>
                  )}
                  
                  {connections.telegram_link && (
                    <a
                      href={connections.telegram_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-colors"
                    >
                      ✈️ Telegram orqali yozish
                    </a>
                  )}
                  
                  {/* *** YANGI PREVIEW ELEMENTLARI *** */}
                  {connections.instagram_link && (
                    <a
                      href={connections.instagram_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center bg-pink-600 hover:bg-pink-700 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-colors"
                    >
                      📸 Instagram
                    </a>
                  )}
                  
                  {connections.youtube_link && (
                    <a
                      href={connections.youtube_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-colors"
                    >
                      ▶️ YouTube
                    </a>
                  )}
                  {/* ********************************* */}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};