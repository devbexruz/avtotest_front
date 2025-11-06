import { useState } from "react";
import server from "../../utils/Backend";
import { useNavigate } from "react-router-dom";
import c from "../../utils/latinToCyrillic";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

	const navigator = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Bu yerga login funksiyasi yoziladi
    const res = server.login(username, password);
    res.then((data) => {
      if (data.token) {
				localStorage.setItem("token", data.token);
				alert(c.t("✅ Hisobingizga muvaffaqiyatli kirdingiz!"));
				navigator("/");
				window.location.reload();
			} else {alert(c.t("❌ Hisobingizga kirib bo'lmadi!"));
			}
    })
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md text-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder={`${c.t("Login")}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder={`${c.t("Parol")}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 rounded text-white font-semibold hover:bg-blue-500 transition"
          >
            Kirish
          </button>
        </form>
        <p className="mt-4 text-gray-400 text-sm text-center">
          Sizda account yo‘q? <span className="text-blue-400 hover:underline cursor-pointer">Ro‘yxatdan o‘tish</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
