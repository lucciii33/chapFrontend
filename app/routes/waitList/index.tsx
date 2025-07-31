/* eslint-disable jsx-a11y/label-has-associated-control */
import "../../../styles/dashboard.css";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import { useTranslation } from "react-i18next";

export default function WaitList() {
  const { t, i18n } = useTranslation();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);
  const { auth, cart } = useGlobalContext();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    country: "venezuela",
  });
  console.log("formData", formData);

  useEffect(() => {
    setIsClient(true);

    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex h-[100vh] justify-center items-center bg-white">
      {isClient && <Confetti width={size.width} height={size.height} />}
      <div className="text-center text-black bg-slate-100 w-[500px] max-w-full p-6 shadow-md border border-slate-200 rounded-2xl">
        <h1 className="text-2xl font-bold mb-4">¡Gracias por estar aquí!</h1>
        <p className="mb-6 text-sm">
          Completa estos campos y entrarás en una lista de espera. Luego te
          llegará un email con un <strong>20% de descuento</strong> que podrás
          usar cuando compres tus tags.
        </p>

        <form className="space-y-4">
          <div>
            <input
              type="text"
              name="fullName"
              placeholder="Nombre completo"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-slate-300 focus:outline-none"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-slate-300 focus:outline-none"
            />
          </div>
          <div>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md border border-slate-300 focus:outline-none bg-white"
            >
              <option value="venezuela">Venezuela</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-4 bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition"
          >
            Unirme a la lista de espera
          </button>
        </form>
      </div>
    </div>
  );
}
