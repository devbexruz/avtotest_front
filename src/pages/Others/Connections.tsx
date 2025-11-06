import React from 'react';
import c from '../../utils/latinToCyrillic';

const Connections: React.FC = () => {
  const phoneNumber = import.meta.env.VITE_PHONE_NUMBER || "+998 71 123 45 67"; // .env fayldan
  const telegramLink = import.meta.env.VITE_TELEGRAM_LINK || "https://t.me/avto_test_bot"; // .env fayldan
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white mb-4">
            {c.t("Biz bilan bog'laning")}
          </h1>
          <div className="bg-blue-500 text-white px-4 py-3 rounded-lg inline-block">
            <span className="font-semibold">{c.t(phoneNumber)}</span>
          </div>
        </div>

        {/* Contact Buttons */}
        <div className="space-y-4 mb-8">
          <a
            href="tel:+998711234567"
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-colors duration-200"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {c.t("Qo'ng'iroq qilish")}
          </a>
          
          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-colors duration-200"
          >
            <svg className="w-6 h-6 mr-2" fill="white" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.139c-.174-.761-1.003-1.188-1.694-.799l-2.974 1.732c-.529.308-1.193.211-1.624-.214l-3.536-3.374-4.665 1.411c-.728.22-1.023 1.064-.619 1.654l2.918 4.497-2.918 4.497c-.404.59-.109 1.434.619 1.654l4.665 1.411 3.536-3.374c.431-.425 1.095-.522 1.624-.214l2.974 1.732c.691.389 1.52-.038 1.694-.799l2.438-10.622c.176-.767-.354-1.506-1.121-1.682L17.562 8.14z"/>
            </svg>
            {c.t("Telegram orqali yozish")}
          </a>
        </div>

        {/* Address */}
        <div className="text-gray-400">
          <p>{c.t("📍 Toshkent shahar, Yunusobod tumani")}</p>
          <p className="mt-2 text-sm">{c.t("🕘 Ish vaqti: 9:00 - 18:00")}</p>
        </div>

      </div>
    </div>
  );
};

export default Connections;