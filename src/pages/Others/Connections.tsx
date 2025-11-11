import c from '../../utils/latinToCyrillic';
import server from "../../utils/Backend";
import React, { useEffect } from "react";
import {
  Phone as PhoneIcon,
  MessageSquare as MessageSquareIcon,
  Instagram as InstagramIcon,
  Youtube as YoutubeIcon,
} from 'lucide-react'; // Populyar ikonka kutubxonasidan foydalanamiz

// Yangilangan Connections interfeysi
interface Connections {
  telegram_link: string;
  phone_number: string;
  instagram_link: string; // Yangi qo'shildi
  youtube_link: string;   // Yangi qo'shildi
}

const Connections: React.FC = () => {
  const [connections, setConnections] = React.useState<Connections>({
    telegram_link: "",
    phone_number: "",
    instagram_link: "",
    youtube_link: "",
  });

  // 'serConnections' o'rniga 'setConnections' ishlatildi
  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const data = await server.requestGet<Connections>("/public/connection/");
        setConnections(data);
      } catch (error) {
        console.error("Bog'lanish ma'lumotlarini yuklashda xatolik:", error);
      }
    };
    fetchConnections();
  }, []);

  // Ijtimoiy tarmoqlar uchun umumiy komponent/array
  const socialLinks = [
    {
      name: c.t("Telegram"),
      href: connections.telegram_link,
      icon: MessageSquareIcon,
      bgColor: "bg-blue-500 hover:bg-blue-600",
    },
    {
      name: c.t("Instagram"),
      href: connections.instagram_link,
      icon: InstagramIcon,
      bgColor: "bg-pink-600 hover:bg-pink-700",
    },
    {
      name: c.t("YouTube"),
      href: connections.youtube_link,
      icon: YoutubeIcon,
      bgColor: "bg-red-600 hover:bg-red-700",
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-neutral-800 p-20 shadow-2xl text-center  px-[5%]">
        
        {/* Sarlavha va Telefon Raqami */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            {c.t("Biz bilan bog'laning")} 📞
          </h1>
          <p className="text-neutral-400 mb-6">
            {c.t("Savollaringiz bormi yoki yordam kerakmi? Quyidagi raqam orqali bog'laning.")}
          </p>

          <a href={`tel:${connections.phone_number}`}
             className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold text-xl py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
            <PhoneIcon className="w-5 h-5 mr-3" />
            {c.t(connections.phone_number) || c.t("Raqam yuklanmoqda...")}
          </a>
        </header>

        ---

        {/* Qo'ng'iroq Tugmasi */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-neutral-200">
            {c.t("Tezkor Bog'lanish")}
          </h2>
          <a
            href={`tel:${connections.phone_number}`}
            className="w-full flex items-center justify-center bg-green-700 hover:bg-green-800 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300"
          >
            <PhoneIcon className="w-6 h-6 mr-3" />
            {c.t("Qo'ng'iroq qilish")}
          </a>
        </div>

        ---

        {/* Ijtimoiy Tarmoqlar */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 text-neutral-200">
            {c.t("Ijtimoiy Tarmoqlar")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center ${link.bgColor} text-white py-3 px-4 rounded-xl font-semibold text-base transition-colors duration-200 transform hover:shadow-xl`}
              >
                <link.icon className="w-5 h-5 mr-2" />
                {link.name}
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Connections;