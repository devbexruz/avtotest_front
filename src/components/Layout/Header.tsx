import React from "react";
import { Link } from "react-router-dom";
import server from "../../utils/Backend";
import { useNavigate } from "react-router-dom";
import c from "../../utils/latinToCyrillic";

// Misol uchun user context yoki prop orqali keladi

type UserRole = "ADMIN" | "USER" | "GUEST";
interface User {
  full_name: string;
  role: UserRole;
}

interface HeaderProps {
  user?: User; // agar user mavjud bo'lsa login qilingan hisoblanadi
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const [userState, setServerState] = React.useState(user || server.getUser());
  server.setUserState = setServerState;
  const check_login = server.checkAuth();
  const projectName = import.meta.env.VITE_PROJECT_NAME || "AvtoTest"; // .env fayldan
  const projectIcon = import.meta.env.VITE_PROJECT_ICON || "/vite.svg"; // .env fayldan

  const navigator = useNavigate();
	const logOut = (e: React.FormEvent) => {
		e.preventDefault();
		server.logout();
		localStorage.removeItem("token");
		navigator("/");
    window.location.reload();
	}
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo va loyiha nomi */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={projectIcon} alt="Logo" className="w-8 h-8" />
          <span className="text-xl font-bold">{c.t(projectName)}</span>
        </Link>
          {
            server.isAdmin() && (
              <Link
                to="/admin/dashboard"
                className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded transition"
              >
                {c.t("Admin panel")}
              </Link>
            )
          }

        {/* Chap va o‘ng qism */}
        <div className="flex items-center space-x-4">
          {/* Agar foydalanuvchi login qilgan bo'lsa */}
          {check_login ? (
            <>
              <span>
                {userState.full_name}
              </span>
              <button
                onClick={logOut}
                className="bg-red-600 hover:bg-red-500 px-3 py-1 rounded transition">
                {c.t("Chiqish")}
              </button>
            </>
          ) : (
            
            <>

            {/* "Biz bilan bog'laning" tugmasi */}
            <Link
                to="/connections"
                className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition"
            >
                {c.t("Biz bilan bog'laning")}
            </Link>
              <Link
                to="/login"
                className="bg-green-600 hover:bg-green-500 px-3 py-1 rounded transition"
              >
                {c.t("Kirish")}
              </Link>
            </>
          )}

          {/* Til tanlash dropdown */}
          <select
            defaultValue={c.lang}
            className="bg-gray-800 text-white px-2 py-1 rounded"
            onChange={
              (e) => {
                if(e.target.value === "latin") {
                  c.toUzbek();
                  window.location.reload();
                } else if(e.target.value === "cyril") {
                  c.toCyril();
                  window.location.reload();
                }
              }
            }
          >
            {
              c.lang === "latin" ?
              (<span>
                  <option value="cyril">Ўзбекча</option>
                  <option value="latin">O'zbek</option>
                </span>):(<span>
                <option value="latin">O'zbek</option>
                <option value="cyril">Ўзбекча</option>
              </span>)
            }
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;
