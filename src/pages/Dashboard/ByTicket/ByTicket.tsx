import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import server from "../../../utils/Backend";
import c from "../../../utils/latinToCyrillic";

interface Ticket {
  id: number;
  name: string;
  error: string;
  
}

const Tickets = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // 🔹 Biletlarni olish
  const fetchTickets = async () => {
    try {
      const data = await server.requestGet<Ticket[]>("/tickets/");
      setTickets(data);
      setFilteredTickets(data);
    } catch (error) {
      console.error("Biletlarni olishda xatolik:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // 🔍 Qidiruv funksiyasi
  useEffect(() => {
    const filtered = tickets.filter((ticket) =>
      ticket.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredTickets(filtered);
  }, [search, tickets]);

  // 🔹 Biletni bosganda testni boshlash
  const handleStartTicket = async (ticketId: number) => {
    try {
      const res = await server.requestPost<Ticket>("/start_tests/start_ticket/", {
        ticket_id: ticketId,
      });

      const resultId = res.id;
      if (resultId) {
        navigate(`/testresult/${resultId}`);
      } else {
        alert(res.error);
      }
    } catch (err) {
      console.error("Biletni boshlashda xatolik:", err);
      alert("Bilet asosida testni boshlashda xatolik yuz berdi!");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-neutral-500 text-lg animate-pulse">
        {c.t("Yuklanmoqda...")}
      </div>
    );
  }

  return (
    <div id='main_container' className="min-h-screen bg-gradient-to-br from-blackblue-500 to-neutral-700 p-4">
      <div className="max-w-5xl mx-auto">

        {/* Ortga qaytish */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg transition"
          >
            {c.t("⬅️ Ortga")}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-200 mb-2">{c.t("Biletlar")}</h1>
          <p className="text-neutral-200 max-w-2xl mx-auto">
            {c.t("Sizga kerakli biletni tanlang va testni boshlang 🎯")}
          </p>
        </div>

        {/* Qidiruv */}
        <div className="mb-8 flex justify-center text-neutral-200">
          <input
            type="text"
            placeholder={c.t("🔍 Biletni qidiring...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/2 px-4 py-2 border border-neutral-300 rounded-full shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all"
          />
        </div>

        {/* Biletlar grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTickets.length > 0 ? (
            filteredTickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => handleStartTicket(ticket.id)}
                className="bg-neutral-800 hover:bg-neutral-900 w-full p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:translate-y-[-10px] border border-neutral-600 flex flex-col justify-center items-center text-center group"
              >
                <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  🎫
                </div>
                <h3 className="text-lg font-semibold text-neutral-200 mb-1 truncate">
                  {ticket.name}
                </h3>
                <p className="text-neutral-300 text-sm max-w-[160px] truncate">
                  {c.t("Ushbu bilet asosida test mavjud")}
                </p>
              </button>
            ))
          ) : (
            <p className="text-neutral-500 text-center col-span-full">
              Hech narsa topilmadi 😕
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Tickets;
