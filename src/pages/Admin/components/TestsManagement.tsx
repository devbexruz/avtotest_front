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
    ticket: ticketId?.toString() || "",
    imageFile: null as File | null 
  });
  const [variantFormData, setVariantFormData] = useState({ value: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [themeSearch, setThemeSearch] = useState("");
  // YANGI: Mavzular ro'yxatining ochilganligini boshqarish
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  // Tanlangan mavzu nomini olish uchun yordamchi funksiya
  const selectedThemeName = themes.find(t => t.id.toString() === testFormData.theme)?.name || c.t("Mavzu tanlanmagan");

  const closeAddTestModal = () => {
    setShowTestModal(false);
    setTestFormData({ value: "", theme: "", ticket: ticketId?.toString() || "", imageFile: null });  
    // Modal yopilganda qidiruv maydoni va dropdown holatini tozalash
    setThemeSearch("");
    setShowThemeDropdown(false);
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
    const selectedId = themeId.toString();
    const isAlreadySelected = selectedId === testFormData.theme;

    // Tanlangan mavzuni tanlash/olib tashlash (toggle)
    setTestFormData({
      ...testFormData,
      theme: isAlreadySelected ? "" : selectedId,
      ticket: ticketId?.toString() || ""
    });
    // Mavzu tanlanganda ro'yxatni yopish
    setShowThemeDropdown(false); 
    setThemeSearch(""); // Qidiruvni tozalash
  };

  const handleTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append("value", testFormData.value);
    formDataToSend.append("ticket", ticketId as string);
    // theme tanlanmagan bo'lsa, uni yubormaslik uchun tekshiruv
    if (testFormData.theme) {
        formDataToSend.append("theme", testFormData.theme);
    }
    
    if (testFormData.imageFile) {
      formDataToSend.append("image", testFormData.imageFile);
    }

    try {
      await server.requestPost("/admin/test/", formDataToSend);
      
      setShowTestModal(false);
      setTestFormData({ value: "", theme: "", ticket: ticketId?.toString() || "", imageFile: null }); 
      fetchTests();
    } catch (error) {
      console.error("Error creating test:", error);
      alert(c.t("Test yaratishda xatolik yuz berdi"));
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
      // Rasmni o'chirish uchun maxsus PATCH so'rovi (faqat shu yerda o'zgartirilmasdan qoladi)
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
        <h2 className="text-2xl font-bold text-neutral-800">
          {ticketId ? `${c.t("Bilet")} #${ticketName} ${c.t("Testlari")}` : c.t("Barcha Testlar")}
        </h2>
        {ticketId && <button
          onClick={() => setShowTestModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {c.t("+ Yangi Test")}
        </button>}
      </div>

      <div className="space-y-6">
        {tests.map((test) => {
          const testTicket = tickets.find(t => t.id === test.ticket);
          
          return (
            <div key={test.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{test.value}</h3>
                  <div className="text-sm text-neutral-600 space-y-1">
                    <p>
                      <span className="font-medium">Bilet:</span> {testTicket?.name || test.ticket}
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
                    className={`flex justify-between items-center p-3 rounded border-2 ${
                      test.correct_answer === variant.id
                        ? "bg-green-50 border-green-500"
                        : "bg-neutral-50 border-neutral-200"
                    }`}
                  >
                    <span
                    onClick={() => setCorrectAnswer(variant.id)}
                    className="cursor-pointer flex-1">{variant.value}</span>
                    <div
                      className="flex space-x-2 items-center"
                    >
                      {test.correct_answer !== variant.id ? (
                        <button
                          onClick={() => setCorrectAnswer(variant.id)}
                          className="text-green-600 hover:text-green-900 text-sm bg-green-50 px-2 py-1 rounded"
                        >
                        </button>
                      ) : (
                        <button
                          className="text-blue-600 text-sm bg-blue-50 px-2 py-1 rounded"
                        >
                          {c.t("Ushbu javon tanlangan")}
                        </button>
                      )}
                      <span className={`text-xs px-2 py-1 rounded ${
                        test.correct_answer === variant.id  
                          ? "bg-green-100 text-green-800"  
                          : "bg-neutral-100 text-neutral-800"
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

      {/* Add Test Modal (YANGILANGAN MAVZU QISMI) */}
      {showTestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">{c.t("Yangi Test")}</h3>
            <form onSubmit={handleTestSubmit}>
              <div className="space-y-4">
                {/* Savol maydoni */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {c.t("Savol")} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={testFormData.value}
                    onChange={(e) => setTestFormData({...testFormData, value: e.target.value})}
                    placeholder={c.t("Test savolini kiriting...")}
                  />
                </div>
                
                {/* Rasm tanlash maydoni (o'zgarishsiz) */}
                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">
                      {c.t("Rasm (ixtiyoriy)")}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      onChange={(e) => setTestFormData({...testFormData, imageFile: e.target.files?.[0] || null})}
                    />
                    {testFormData.imageFile && (
                        <p className="text-xs text-green-600 mt-1">
                            {c.t("Tanlangan fayl:")} **{testFormData.imageFile.name}**
                        </p>
                    )}
                </div>
                
                {/* Mavzu maydoni (YANGILANGAN QISM) */}
                <div className="relative">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {c.t("Mavzu")} *
                  </label>
                  
                  {/* Dropdown tugmasi - Tanlangan elementni ko'rsatib turadi */}
                  <button
                    type="button"
                    onClick={() => setShowThemeDropdown(prev => !prev)}
                    className={`w-full text-left px-3 py-2 border rounded-md transition-colors duration-150 flex justify-between items-center ${
                      testFormData.theme 
                        ? "bg-blue-50 border-blue-500 text-blue-800 font-medium" 
                        : "bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    {selectedThemeName}
                    <svg className={`w-4 h-4 transition-transform ${showThemeDropdown ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  
                  {/* Mavzular ro'yxati (Dropdown Content) */}
                  {showThemeDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-300 rounded-md shadow-lg">
                      <div className="p-2">
                        {/* Qidiruv maydoni */}
                        <input
                          type="text"
                          placeholder={c.t("Mavzu nomi bo'yicha qidirish...")}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-2"
                          value={themeSearch}
                          onChange={(e) => setThemeSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()} // Inputga bosilganda dropdown yopilmasligi uchun
                        />
                      </div>
                      <div className="max-h-40 overflow-y-auto">
                        {filteredThemes.length > 0 ? (
                            filteredThemes.map((theme) => (
                              <div
                                key={theme.id}
                                className={`p-3 cursor-pointer hover:bg-neutral-50 ${
                                  testFormData.theme === theme.id.toString() 
                                    ? "bg-blue-100 font-semibold" 
                                    : ""
                                }`}
                                onClick={() => handleThemeSelect(theme.id)}
                              >
                                {theme.name}
                              </div>
                            ))
                        ) : (
                          <div className="p-3 text-neutral-500 text-sm">
                            {c.t("Mavzu topilmadi.")}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Qo'shimcha ma'lumot - tanlangan mavzuni yana bir bor ko'rsatish */}
                  {testFormData.theme && (
                    <div className="text-xs text-blue-600 mt-2">
                        {c.t("Tanlangan: ")} **{selectedThemeName}**
                    </div>
                  )}
                </div>
                {/* ******************************* */}
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => closeAddTestModal()}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-800 border border-neutral-300 rounded-md"
                >
                  {c.t("Bekor qilish")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-neutral-400 disabled:cursor-not-allowed"
                >
                  {c.t("Saqlash")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Add Variant Modal (o'zgarishsiz) */}
      {showVariantModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{c.t("Yangi Variant")}</h3>
            <form onSubmit={(e) => handleVariantSubmit(e, showVariantModal)}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    {c.t("Variant matni")} *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-800 border border-neutral-300 rounded-md"
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

      {/* Image Upload Modal (o'zgarishsiz) */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{c.t("Test rasmini yuklash (O'zgartirish)")}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  {c.t("Rasm faylini tanlang")}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                <p className="text-xs text-neutral-500 mt-1">
                  {c.t("Qo'llab-quvvatlanadigan formatlar: JPEG, PNG, GIF")}
                </p>
              </div>
              
              {imageFile && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-green-800 text-sm">
                    {c.t("Tanlangan fayl:")} **{imageFile.name}**
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
                className="px-4 py-2 text-neutral-600 hover:text-neutral-800 border border-neutral-300 rounded-md"
              >
                {c.t("Bekor qilish")}
              </button>
              <button
                onClick={() => handleImageUpload(showImageModal)}
                disabled={!imageFile}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-neutral-400 disabled:cursor-not-allowed"
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