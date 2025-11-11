import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import c from '../../utils/latinToCyrillic';
import server from '../../utils/Admin';



interface Result {
  id: number;
  name: string;
  trues: number;
  wrong: number;
  all: number;
  percentage: number;
  status: boolean;
  end_time: string;
}
interface Connections {
  telegram_link: string;
  phone_number: string;
  // Yangi qo'shildi
  instagram_link: string;
  youtube_link: string;
}


const Dashboard: React.FC = () => {
  const navigator = useNavigate();
  const [results, setResults] = useState<Result[]>([]);
  const [connections, setConnections] = React.useState<Connections>({
    telegram_link: "",
    phone_number: "",
    instagram_link: "",
    youtube_link: "",
  });

  const buttons = [
    {
      icon: "🏢",
      title: "Mavzu bo'yicha testlar",
      description: "Har xil mavzular bo'yicha testlar",
      location: "themes"
    },
    {
      icon: "✔",
      title: "Imtihon topshirish",
      description: "Rasmiy imtihon topshirish",
      location: "exam"
    },
    {
      icon: "⚙",
      title: "Sozlamali testlar",
      description: "Test sozlamalarini o'zgartirish",
      location: "settests"
    },
    {
      icon: "⛽",
      title: "Biletlar bo'yicha testlar",
      description: "Biletlar asosida testlar",
      location: "tickets"
    },
    {
      icon: "📊",
      title: "Statistika",
      description: "Natijalar statistikasi",
      location: "statistics"
    }
  ];

  const res = server.requestGet<Result[]>("/results/");
  
  useEffect(() => {
    res.then((data) => {
      setResults(data);
    }).catch((error) => {
      console.error("Error fetching results:", error);
    });
  }, []);


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

  return (
    <div 
      id='main_container' className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        

        {/* Vertical Buttons Section */}
        <div className="flex flex-col space-y-4 mb-8 p-10 mt-20  bg-neutral-800 border border-neutral-700">

          {/* Header Section */}
          <div className="text-center m-0 p-0">
            <h1 className="text-3xl font-bold mb-2 text-white">
              {c.t("🚀 Prava olish endi biz bilan oson!")}
            </h1>
            <p className="text-lg text-neutral-300 mt-4">
              {c.t("2025-yil 6-martdan yangilangan testlar")}
            </p>
          </div>
          <hr className='text-neutral-600 mb-10'/>

          {/* Buttons Section */}
          {buttons.map((button, index) => (
            <div
              key={index}
              onClick={() => navigator(`/${button.location}`)}
              className="bg-neutral-800 hover:translate-y-[-2px] p-2shadow hover:bg-neutral-700 p-2 border border-neutral-700 hover:bg-neutral-900 cursor-pointer transition-all ease-out-in duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl p-1">
                  {button.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-white mb-1">
                    {c.t(button.title)}
                  </h3>
                </div>
              </div>
            </div>
          ))}
          {/* Horizontal Connections IconButtons */}
          <div className="flex items-center space-x-4 mt-4 justify-center gap-4 ">
            { connections.telegram_link && <a className='bg-neutral-600 hover:scale-110 duration-200 ease-in border border-neutral-500 rounded-full p-2' href={connections.telegram_link} target="_blank" rel="noopener noreferrer">
              <img
                src="https://img.icons8.com/color/48/000000/telegram-app--v1.png"
                alt="Telegram"
                className="w-8 h-8"
              />
            </a>}
            { connections.instagram_link && <a className='bg-neutral-600 hover:scale-110 duration-200 ease-in border border-neutral-500 rounded-full p-2' href={connections.instagram_link} target="_blank" rel="noopener noreferrer">
              <img
                src="https://img.icons8.com/color/48/000000/instagram-new.png"
                alt="Instagram"
                className="w-8 h-8"
              />
            </a>}
            { connections.youtube_link && <a className='bg-neutral-600 hover:scale-110 duration-200 ease-in border border-neutral-500 rounded-full p-2' href={connections.youtube_link} target="_blank" rel="noopener noreferrer">
              <img
                src="https://img.icons8.com/color/48/000000/youtube-play.png"
                alt="YouTube"
                className="w-8 h-8"
              />
            </a> }
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-neutral-800 p-6 border border-neutral-700 bg-neutral-800 ">
          {/* Section Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white mb-1">
              {c.t("Natijalar statistikasi")}
            </h2>
          </div>

          {/* Stats Header */}
          <div className="grid grid-cols-5 gap-2 text-center bg-neutral-700 p-3 mb-4 text-white font-semibold text-sm">
            <div>{c.t("F.I.O")}</div>
            <div>{c.t("To'g'ri/Jami")}</div>
            <div>{c.t("Vaqt")}</div>
            <div>{c.t("Natija")}</div>
            <div>{c.t("Holat")}</div>
          </div>

          {/* Stats Content */}
          <div className="space-y-2">
            {results.map((result) => (
              <div 
                key={result.id}
                className="grid grid-cols-5 gap-2 text-center hover:bg-neutral-600 text-white p-3 transition-colors duration-200"
              >
                <div className="text-sm font-medium truncate" title={result.name}>
                  {result.name}
                </div>
                <div className="text-sm">
                  <span className="text-green-400 font-bold">{result.trues}</span> / {result.all}
                </div>
                <div className="text-sm text-neutral-300">
                  {result.end_time}
                </div>
                <div className="flex items-center justify-center">
                  {result.status ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>
                <div className="text-sm">
                  <span className={`px-2 py-1 text-xs font-bold ${
                    result.status 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    {result.status ? c.t("O'tdi") : c.t("Yiqildi")}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {results.length === 0 && (
            <div className="text-center py-8 ">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-neutral-400">
                {c.t("Hali hech qanday natija mavjud emas")}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pb-6">
          <p className="text-neutral-400 text-sm">
            {c.t("Professional tayyorgarlik va sifatli testlar bilan muvaffaqiyatga erishing")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;