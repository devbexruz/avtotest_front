// TestsManagement.tsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import server from "../../../utils/Admin";
import c from "../../../utils/latinToCyrillic";

interface Test {
  id: number;
  value: string;
  image?: string;
  ticket: number;
  correct_answer?: number;
}

interface Variant {
  id: number;
  value: string;
  test: number;
}

interface Theme {
  id: number;
  name: string;
}

interface Ticket {
  id: number;
  name: string;
  theme: number;
}

export const TestsManagement = () => {
  const [searchParams] = useSearchParams();
  const ticketId = searchParams.get("ticket");
  
  const [tests, setTests] = useState<Test[]>([]);
  const [variants, setVariants] = useState<{[key: number]: Variant[]}>({});
  const [themes, setThemes] = useState<Theme[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTestModal, setShowTestModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState<number | null>(null);
  const [showImageModal, setShowImageModal] = useState<number | null>(null);
  const [testFormData, setTestFormData] = useState({ 
    value: "", 
    theme: "",
    ticket: ticketId?.toString() || ""
  });
  const [variantFormData, setVariantFormData] = useState({ value: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [themeSearch, setThemeSearch] = useState("");
  
  const closeAddTestModal = () => {
    setShowTestModal(false);
  };

  const fetchTests = async () => {
    try {
      const data = await server.requestGet<Test[]>("/admin/test/");
      const filteredTests = ticketId 
        ? data.filter(test => test.ticket === parseInt(ticketId))
        : data;
      setTests(filteredTests);
      
      for (const test of filteredTests) {
        fetchVariants(test.id);
      }
    } catch (error) {
      console.error("Error fetching tests:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchThemes = async () => {
    try {
      const data = await server.requestGet<Theme[]>("/admin/theme/");
      setThemes(data);
    } catch (error) {
      console.error("Error fetching themes:", error);
    }
  };

  const fetchTickets = async () => {
    try {
      const data = await server.requestGet<Ticket[]>("/admin/ticket/");
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const fetchVariants = async (testId: number) => {
    try {
      const data = await server.requestGet<Variant[]>(`/admin/test/${testId}/variant/`);
      setVariants(prev => ({...prev, [testId]: data}));
    } catch (error) {
      console.error("Error fetching variants:", error);
    }
  };

  useEffect(() => {
    fetchTests();
    fetchThemes();
    fetchTickets();
  }, [ticketId]);

  const handleThemeSelect = (themeId: number) => {
      setTestFormData({
        ...testFormData,
        theme: themeId.toString(),
        ticket: ticketId?.toString() || ""
      });
  };

  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await server.requestPost("/admin/test/", {
        value: testFormData.value,
        ticket: parseInt(ticketId as string),
        theme: parseInt(testFormData.theme as string)
      });
      setShowTestModal(false);
      setTestFormData({ value: "", theme: "", ticket: "" });
      fetchTests();
    } catch (error) {
      console.error("Error creating test:", error);
    }
  };

  const handleVariantSubmit = async (e: React.FormEvent, testId: number) => {
    e.preventDefault();
    try {
      await server.requestPost(`/admin/test/${testId}/variant/`, variantFormData);
      setShowVariantModal(null);
      setVariantFormData({ value: "" });
      fetchVariants(testId);
    } catch (error) {
      console.error("Error creating variant:", error);
    }
  };

  const handleImageUpload = async (testId: number) => {
    if (!imageFile) return;

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch(server.baseURL+`/admin/test/${testId}/`, {
        method: "PATCH",
        headers: {
          "Authorization": localStorage.getItem("token") || "",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      setShowImageModal(null);
      setImageFile(null);
      fetchTests();
    } catch (error) {
      console.error("Error uploading image:", error);
      alert(c.t("Rasm yuklashda xatolik yuz berdi"));
    }
  };

  const handleImageDelete = async (testId: number) => {
    if (!window.confirm(c.t("Test rasmini o'chirishni tasdiqlaysizmi?"))) return;

    try {
      const response = await fetch(`${server.baseURL}/admin/test/${testId}/`, {
        method: "PATCH",
        headers: {
          "Authorization": localStorage.getItem("token") || "",
        },
      });

      if (!response.ok) {
        throw new Error("Image delete failed");
      }

      fetchTests();
    } catch (error) {
      console.error("Error deleting image:", error);
      alert(c.t("Rasm o'chirishda xatolik yuz berdi"));
    }
  };

  const setCorrectAnswer = async (variantId: number) => {
    try {
      await server.requestPost(`/admin/test/variant/${variantId}/true/`, {});
      fetchTests();
    } catch (error) {
      console.error("Error setting correct answer:", error);
    }
  };

  const removeCorrectAnswer = async (testId: number) => {
    return;
    
    try {
      await server.requestPut(`/admin/test/${testId}/`, {
        correct_answer: null
      });
      fetchTests();
    } catch (error) {
      console.error("Error removing correct answer:", error);
    }
  };

  const deleteTest = async (id: number) => {
    if (!window.confirm(c.t("Testni o'chirishni tasdiqlaysizmi?"))) return;
    
    try {
      await server.requestDelete(`/admin/test/${id}/`);
      fetchTests();
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  const deleteVariant = async (variantId: number, testId: number) => {
    if (!window.confirm(c.t("Variantni o'chirishni tasdiqlaysizmi?"))) return;
    
    try {
      await server.requestDelete(`/admin/test/variant/${variantId}/`);
      fetchVariants(testId);
    } catch (error) {
      console.error("Error deleting variant:", error);
    }
  };

  const filteredThemes = themes.filter(theme =>
    theme.name.toLowerCase().includes(themeSearch.toLowerCase())
  );


  if (loading) return <div>{c.t("Yuklanmoqda...")}</div>;
  
  let ticketName = "";
  tickets.forEach((ticket) => {
    if (ticket.id === parseInt(ticketId as string)) {
      ticketName = ticket.name;
    }
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {ticketId ? `${c.t("Bilet")} #${ticketName} ${c.t("Testlari")}` : c.t("Barcha Testlar")}
        </h2>
        <button
          onClick={() => setShowTestModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {c.t("+ Yangi Test")}
        </button>
      </div>

      <div className="space-y-6">
        {tests.map((test) => {
          const testTicket = tickets.find(t => t.id === test.ticket);
          const testTheme = themes.find(t => t.id === testTicket?.theme);
          
          return (
            <div key={test.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{test.value}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <span className="font-medium">Bilet:</span> {testTicket?.name || test.ticket}
                    </p>
                    <p>
                      <span className="font-medium">Mavzu:</span> {testTheme?.name || "Noma'lum"}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowImageModal(test.id)}
                    className="text-green-600 hover:text-green-900 text-sm bg-green-50 px-3 py-1 rounded"
                  >
                    {c.t("📷 Rasm")}
                  </button>
                  <button
                    onClick={() => setShowVariantModal(test.id)}
                    className="text-blue-600 hover:text-blue-900 text-sm bg-blue-50 px-3 py-1 rounded"
                  >
                    {c.t("+ Variant")}
                  </button>
                  <button
                    onClick={() => deleteTest(test.id)}
                    className="text-red-600 hover:text-red-900 text-sm bg-red-50 px-3 py-1 rounded"
                  >
                    {c.t("O'chirish")}
                  </button>
                </div>
              </div>

              {test.image && (
                <div className="mb-4 flex items-center gap-4">
                  <img 
                    src={server.baseURL.substring(0, server.baseURL.length - 4)+test.image} 
                    alt="Test" 
                    className="max-w-xs rounded-lg shadow"
                  />
                  <button
                    onClick={() => handleImageDelete(test.id)}
                    className="text-red-600 hover:text-red-800 text-sm bg-red-50 px-3 py-1 rounded"
                  >
                    {c.t("Rasmni o'chirish")}
                  </button>
                </div>
              )}

              <div className="space-y-2">
                {variants[test.id]?.map((variant) => (
                  <div
                    key={variant.id}
                    className={`flex justify-between items-center p-3 rounded border ${
                      test.correct_answer === variant.id
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <span className="flex-1">{variant.value}</span>
                    <div className="flex space-x-2 items-center">
                      {test.correct_answer !== variant.id ? (
                        <button
                          onClick={() => setCorrectAnswer(variant.id)}
                          className="text-green-600 hover:text-green-900 text-sm bg-green-50 px-2 py-1 rounded"
                        >
                          {c.t("To'g'ri")}
                        </button>
                      ) : (
                        <button
                          onClick={() => removeCorrectAnswer(test.id)}
                          className="text-blue-600 text-sm bg-blue-50 px-2 py-1 rounded"
                        >
                          {c.t("Ushbu javon tanlangan")}
                        </button>
                      )}
                      <span className={`text-xs px-2 py-1 rounded ${
                        test.correct_answer === variant.id 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {test.correct_answer === variant.id ? c.t("✓ To'g'ri") : c.t("Variant")}
                      </span>
                      <button
                        onClick={() => deleteVariant(variant.id, test.id)}
                        className="text-red-600 hover:text-red-900 text-sm bg-red-50 px-2 py-1 rounded"
                      >
                        {c.t("O'chirish")}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Test Modal */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">{c.t("Yangi Test")}</h3>
            <form onSubmit={handleTestSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {c.t("Savol")} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={testFormData.value}
                    onChange={(e) => setTestFormData({...testFormData, value: e.target.value})}
                    placeholder={c.t("Test savolini kiriting...")}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {c.t("Mavzu")} *
                  </label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder={c.t("Mavzu nomi bo'yicha qidirish...")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      value={themeSearch}
                      onChange={(e) => setThemeSearch(e.target.value)}
                    />
                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
                      {filteredThemes.map((theme) => (
                        <div
                          key={theme.id}
                          className={`p-3 cursor-pointer hover:bg-gray-50 ${
                            testFormData.theme === theme.id.toString() ? "bg-blue-50 border-l-4 border-blue-500" : ""
                          }`}
                          onClick={() => handleThemeSelect(theme.id)}
                        >
                          <div className="font-medium">{theme.name}</div>
                        </div>
                      ))}
                    </div>
                    
                    {testFormData.theme && (
                      <div className="space-y-2">
                        <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                          {c.t("Tanlangan mavzu:")} {themes.find(t => t.id === parseInt(testFormData.theme))?.name}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => closeAddTestModal()}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
                >
                  {c.t("Bekor qilish")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {c.t("Saqlash")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Variant Modal */}
      {showVariantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{c.t("Yangi Variant")}</h3>
            <form onSubmit={(e) => handleVariantSubmit(e, showVariantModal)}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {c.t("Variant matni")} *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={variantFormData.value}
                    onChange={(e) => setVariantFormData({value: e.target.value})}
                    placeholder={c.t("Variant matnini kiriting...")}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowVariantModal(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
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

      {/* Image Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{c.t("Test rasmini yuklash")}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {c.t("Rasm faylini tanlang")}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {c.t("Qo'llab-quvvatlanadigan formatlar: JPEG, PNG, GIF")}
                </p>
              </div>
              
              {imageFile && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-green-800 text-sm">
                    {c.t("Tanlangan fayl:")} {imageFile.name}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowImageModal(null);
                  setImageFile(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
              >
                {c.t("Bekor qilish")}
              </button>
              <button
                onClick={() => handleImageUpload(showImageModal)}
                disabled={!imageFile}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {c.t("Yuklash")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};