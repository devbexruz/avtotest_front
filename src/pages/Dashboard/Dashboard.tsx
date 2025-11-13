import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import c from '../../utils/latinToCyrillic';
import server from '../../utils/Admin';



interface Connections {
  telegram_link: string;
  phone_number: string;
  // Yangi qo'shildi
  instagram_link: string;
  youtube_link: string;
}


const Dashboard: React.FC = () => {
  const navigator = useNavigate();
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
      id='main_container' className="sm:min-h-screen p-4">
      <div className="max-w-2xl sm:mx-auto">
        

        {/* Vertical Buttons Section */}
        <div className="flex flex-col space-y-4 mb-8 p-10 sm:mt-20  bg-neutral-800 border border-neutral-700">

          {/* Header Section */}
          <div className="text-center m-0 p-0">
            <h1 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-10 text-white">
              {c.t("🚀 Prava olish endi biz bilan oson!")}
            </h1>
          </div>

          {/* Buttons Section */}
          {buttons.map((button, index) => (
            <div
              key={index}
              onClick={() => navigator(`/${button.location}`)}
              className="bg-neutral-800 hover:translate-y-[-2px] p-2shadow hover:bg-neutral-700 p-2 border border-neutral-700 hover:bg-neutral-900 cursor-pointer transition-all ease-out-in duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="text-x sm:text-2xl p-1">
                  {button.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-x sm:text-base font-semibold text-white mb-1">
                    {c.t(button.title)}
                  </h3>
                </div>
              </div>
            </div>
          ))}
          {/* Horizontal Connections IconButtons */}
          <div className="flex items-center space-x-4 mt-2 sm:mt-4 justify-center gap-4 ">
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