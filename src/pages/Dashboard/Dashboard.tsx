import React from 'react';
import { useNavigate } from 'react-router-dom';
import c from '../../utils/latinToCyrillic';

const Dashboard: React.FC = () => {
  const navigator = useNavigate();
  const buttons = [
    {
      icon: "🏢",
      title: "Mavzu bo‘yicha testlar",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {c.t("Haydovchilik guvohnomasini biz bilan olish oson")}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {c.t("Professional tayyorgarlik va sifatli testlar bilan muvaffaqiyatga erishing")}
          </p>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {buttons.map((button, index) => (
            <button
              key={index}
              onClick={() => navigator(`/${button.location}`)}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 text-left group"
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                  {button.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {c.t(button.title)}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {c.t(button.description)}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Stats Section */}
        {/* <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-gray-600">Test topshirganlar</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
              <div className="text-gray-600">Muvaffaqiyat darajasi</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600">Turli testlar</div>
            </div>
          </div>
        </div>
 */}
      </div>
    </div>
  );
};

export default Dashboard;