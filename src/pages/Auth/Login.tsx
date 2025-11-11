import { useState, useEffect } from "react";
import server from "../../utils/Backend";
import { useNavigate } from "react-router-dom";
import c from "../../utils/latinToCyrillic";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [goHome, setGoHome] = useState(false);
	const navigator = useNavigate();
  
  useEffect(() => {
    if (!window.location.href.includes("/login")) {
      navigator("/login");
      setGoHome(true);
    }
  })

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
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-neutral-900 p-4">
      <div className="flex flex-col space-y-4 mb-8 p-10 mt-20  bg-neutral-800 border border-neutral-700 max-w-md w-full">
        {goHome && <a href="/" className="text-blue-400">Bosh sahifa</a>}
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-400">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder={`${c.t("Login")}`}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-3 rounded bg-neutral-700 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder={`${c.t("Parol")}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded bg-neutral-700 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="p-3 bg-blue-600 rounded text-white font-semibold hover:bg-blue-500 transition"
          >
            {c.t("Kirish")}
          </button>
        </form>
        <p className="mt-4 text-neutral-400 text-sm text-center">
          {c.t("Sizda account yo‘qmi?")} <a href="/connections" className="text-blue-400 hover:underline cursor-pointer">{c.t("Biz bilan bog‘laning")}</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
