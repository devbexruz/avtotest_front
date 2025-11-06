import { Link } from "react-router-dom";
import "./Home.css";
import c from "../../utils/latinToCyrillic";

const Home = () => {
  return (
    <div id="home_page" className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 text-gray-100">
      {/* Loyiha nomi */}
      <h1 className="text-4xl font-bold text-blue-400 mb-4">
        {c.t("Avto Test")}
      </h1>

      {/* Qisqacha tavsif */}
      <p className="text-center text-gray-300 mb-8 max-w-xl">
        
        {c.t("Avto Test — haydovchilik guvohnomasi imtihonlariga tayyorgarlik ko‘rish uchun interaktiv test platformasi. Siz turli testlar orqali bilimlaringizni sinab ko‘rishingiz mumkin.")}
      </p>

      {/* Kirish va Test bo‘limlari tugmalari */}
      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition"
        >
          {c.t("Kirish")}
          
        </Link>
        <Link
          to="/connections"
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition"
        >
          
        {c.t("Biz bilan bog'laning")}
        </Link>
      </div>
    </div>
  );
};

export default Home;
