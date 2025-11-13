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
    <header className="bg-neutral-900 text-white shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between py-4 px-6">
        {/* Logo va loyiha nomi */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={projectIcon} alt="Logo" className="w-8 h-8" style={{ filter: "drop-shadow(0px 0px 10px rgba(0, 0, 20, 255))"}} />
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
            {/* Til tanlash dropdown */}
            {
              c.lang === "latin" ?
              (
                <span>
                  <button
                    onClick={() => {c.toCyril();
                      window.location.reload();}}
                    className="text-[10px] sm:text-xl cursor-pointer bg-neutral-700 hover:bg-neutral-500 m-1 px-3 py-1 rounded transition">
                    Ўзбекча
                  </button>
                  <button
                    onClick={() => {c.toUzbek();
                      window.location.reload();}}
                    className="text-[10px] sm:text-xl cursor-pointer bg-neutral-700 hover:bg-neutral-500 m-1 px-3 py-1 rounded transition"
                    style={{
                      borderLeft: "10px solid rgb(40,255,40)"
                    }}>
                    O'zbek
                  </button>
                </span>
              ):(
                <span>
                  <button
                    onClick={() => {c.toCyril();
                      window.location.reload();}}
                    className="text-[10px] sm:text-xl cursor-pointer bg-neutral-700 hover:bg-neutral-500 m-1 px-3 py-1 rounded transition"
                    style={{
                      borderLeft: "10px solid rgb(40,255,40)"
                    }}>
                    Ўзбекча
                  </button>
                  <button
                    onClick={() => {c.toUzbek();
                      window.location.reload();}}
                    className="text-[10px] sm:text-xl cursor-pointer bg-neutral-700 hover:bg-neutral-500 m-1 px-3 py-1 rounded transition">
                    O'zbek
                  </button>
                </span>
              )
            }

              <span
                className="text-[10px] sm:text-xl bg-neutral-700 px-3 py-1 rounded transition flex items-center gap-2">
                <svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 24 24" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 9C16 11.2091 14.2091 13 12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9ZM14 9C14 10.1046 13.1046 11 12 11C10.8954 11 10 10.1046 10 9C10 7.89543 10.8954 7 12 7C13.1046 7 14 7.89543 14 9Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1ZM3 12C3 14.0902 3.71255 16.014 4.90798 17.5417C6.55245 15.3889 9.14627 14 12.0645 14C14.9448 14 17.5092 15.3531 19.1565 17.4583C20.313 15.9443 21 14.0524 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12ZM12 21C9.84977 21 7.87565 20.2459 6.32767 18.9878C7.59352 17.1812 9.69106 16 12.0645 16C14.4084 16 16.4833 17.1521 17.7538 18.9209C16.1939 20.2191 14.1881 21 12 21Z" fill="currentColor"></path></svg>
                {userState.full_name}
              </span>
              <button
                onClick={logOut}
                className="text-[10px] sm:text-xl cursor-pointer bg-neutral-700 hover:bg-red-500 px-3 py-1 rounded transition">
                {c.t("Chiqish")}
              </button>
            </>
          ) : (
            
            <>

            {/* Til tanlash dropdown */}
            {
              c.lang === "latin" ?
              (
                <span>
                  <button
                    onClick={() => {c.toCyril();
                      window.location.reload();}}
                    className="text-[10px] sm:text-xl cursor-pointer bg-neutral-700 hover:bg-neutral-500 m-1 px-3 py-1 rounded transition">
                    Ўзбекча
                  </button>
                  <button
                    onClick={() => {c.toUzbek();
                      window.location.reload();}}
                    className="text-[10px] sm:text-xl cursor-pointer bg-neutral-700 hover:bg-neutral-500 m-1 px-3 py-1 rounded transition"
                    style={{
                      borderLeft: "10px solid rgb(40,255,40)"
                    }}>
                    O'zbek
                  </button>
                </span>
              ):(
                <span>
                  <button
                    onClick={() => {c.toCyril();
                      window.location.reload();}}
                    className="text-[10px] sm:text-xl cursor-pointer bg-neutral-700 hover:bg-neutral-500 m-1 px-3 py-1 rounded transition"
                    style={{
                      borderLeft: "10px solid rgb(40,255,40)"
                    }}>
                    Ўзбекча
                  </button>
                  <button
                    onClick={() => {c.toUzbek();
                      window.location.reload();}}
                    className="text-[10px] sm:text-xl cursor-pointer bg-neutral-700 hover:bg-neutral-500 m-1 px-3 py-1 rounded transition">
                    O'zbek
                  </button>
                </span>
              )
            }
            {/* "Biz bilan bog'laning" tugmasi */}
            <Link
                to="/connections"
                className="text-[8px] sm:text-xl bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded transition"
            >
                {c.t("Biz bilan bog'laning")}
            </Link>
              <Link
                to="/login"
                className="text-[8px] sm:text-xl bg-green-600 hover:bg-green-500 px-3 py-1 rounded transition"
              >
                {c.t("Kirish")}
              </Link>
            </>
          )}

        </div>
      </div>
    </header>
  );
};

export default Header;
