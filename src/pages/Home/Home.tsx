import { Link } from "react-router-dom";

import "./Home.css";
import c from "../../utils/latinToCyrillic";

const Home = () => {
  return (
    <div
      id="home_page"
      className="relative min-h-screen flex flex-col items-center justify-center text-neutral-100 overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed bg-no-repeat"
        style={{
          backgroundImage: "url('/path/to/your/background.jpg')", // siz bu yo'lni o'zingiz almashtirasiz
          filter: "brightness(0.4) blur(2px)",
        }}
      ></div>

      {/* Overlay content */}
      <div className="relative z-10 text-center p-6 max-w-2xl">
        {/* Loyiha nomi */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-400 mb-6 drop-shadow-lg">
          {c.t("Avto Test")}
        </h1>

        {/* Qisqacha tavsif */}
        <p className="text-xl md:text-lg text-neutral-200 mb-12 leading-relaxed drop-shadow-md">
          {c.t(
            "Avto Test — haydovchilik guvohnomasi imtihonlariga tayyorgarlik ko'rish uchun interaktiv test platformasi. Siz turli testlar orqali bilimlaringizni sinab ko'rishingiz mumkin."
          )}
        </p>

        {/* Tugmalar */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            to="/login"
            className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-blue-500/25 hover:scale-105 transition-all duration-300 transform"
          >
            {c.t("Kirish")}
          </Link>
          <Link
            to="/connections"
            className="px-10 py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-lg shadow-2xl hover:shadow-green-500/25 hover:scale-105 transition-all duration-300 transform"
          >
            {c.t("Biz bilan bog'laning")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;