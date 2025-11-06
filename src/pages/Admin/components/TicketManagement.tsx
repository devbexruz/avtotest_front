// TicketsManagement.tsx
import { useState, useEffect } from "react";
import server from "../../../utils/Admin";
import c from "../../../utils/latinToCyrillic";

interface Ticket {
  id: number;
  name: string;
  // theme maydoni olib tashlandi
}

export const TicketsManagement = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "" }); // theme olib tashlandi

  const fetchTickets = async () => {
    try {
      const data = await server.requestGet<Ticket[]>("/admin/ticket/");
      setTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await server.requestPost("/admin/ticket/", formData); // faqat name yuboriladi
      setShowModal(false);
      setFormData({ name: "" });
      fetchTickets();
    } catch (error) {
      console.error("Error creating ticket:", error);
    }
  };

  const deleteTicket = async (id: number) => {
    if (!window.confirm(c.t("Biletni o'chirishni tasdiqlaysizmi?"))) return;
    
    try {
      await server.requestDelete(`/admin/ticket/${id}/`);
      fetchTickets();
    } catch (error) {
      console.error("Error deleting ticket:", error);
    }
  };

  if (loading) return <div>{c.t("Yuklanmoqda...")}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{c.t("Biletlar Boshqaruvi")}</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          {c.t("+ Yangi Bilet")}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {c.t("ID")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {c.t("Nomi")}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                {c.t("Harakatlar")}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ticket.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {ticket.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => navigateToTests(ticket.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {c.t("Testlar")}
                  </button>
                  <button
                    onClick={() => deleteTicket(ticket.id)}
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

      {/* Add Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">{c.t("Yangi Bilet")}</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {c.t("Bilet nomi")} *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ name: e.target.value })}
                    placeholder={c.t("Bilet nomini kiriting...")}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
    </div>
  );
};

const navigateToTests = (ticketId: number) => {
  window.location.href = `/admin/tests?ticket=${ticketId}`;
};