import c from "../../utils/latinToCyrillic";

const Footer = () => {
  const projectName = import.meta.env.VITE_PROJECT_NAME || "AvtoTest"; // .env fayldan
  return (
    <footer className="bg-neutral-900 text-white py-6">
      <div className="container mx-auto text-center">
        <h2 className="text-lg font-semibold">{c.t(projectName)}</h2>
        <p className="mt-2 text-sm">&copy; {new Date().getFullYear()} <a className="text-blue-300 underline" href="https://ibots.uz">iBots.uz</a> &  <a className="text-blue-300 underline" href="https://myweb.uz">MyWeb.uz</a> {c.t(`Barcha huquqlar himoyalangan.`)}</p>
      </div>
    </footer>
  );
};

export default Footer;
