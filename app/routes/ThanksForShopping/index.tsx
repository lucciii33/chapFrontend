/* eslint-disable jsx-a11y/label-has-associated-control */
import "../../../styles/dashboard.css";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/GlobalProvider";
import { use } from "i18next";
import { Link } from "@remix-run/react";
import { useTranslation } from "react-i18next";

export default function ShippingAddress() {
  const [size, setSize] = useState([0, 0]);
  const [isClient, setIsClient] = useState(false);
  const { auth, cart } = useGlobalContext();
  const { user } = auth;
  const { getCartByUser } = cart;
  const { t, i18n } = useTranslation();

  useEffect(() => {
    setIsClient(true); // Ya podemos usar window

    const handleResize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };

    // Solo ejecutar si window existe
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let attempts = 0;
    const interval = setInterval(async () => {
      const result = await getCartByUser(user.id);
      attempts++;

      // Si el carrito ya está vacío o después de varios intentos, detenemos
      if (result.length === 0 || attempts >= 5) {
        clearInterval(interval);
      }
    }, 2000); // intenta cada 2 segundos

    return () => clearInterval(interval);
  }, []);

  const [width, height] = size;

  return (
    <div className="flex h-[100vh] justify-center items-center">
      {isClient && <Confetti width={width} height={height} />}
      <div className="text-center text-black bg-slate-100 w-[500px] max-w-full p-6 shadow-md border border-slate-200 rounded-2xl mx-3">
        <h2
          style={{ fontFamily: "chapFont" }}
          className="text-2xl font-semibold text-teal-500 mb-2"
        >
          {t("order_confirmation.thanks")}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {user?.country === "venezuela"
            ? t("order_confirmation.contact_text_manual")
            : t("order_confirmation.contact_text")}
        </p>
        {/* <p>{t("order_confirmation.contact_email")}</p> */}
        <Link to="/dashboard">
          {" "}
          <button
            className="btn bg-teal-500 mt-4 hover:bg-teal-600 text-white px-6 py-2 rounded-md transition duration-300 border-none"
            onClick={() => document.getElementById("my_modal_1").showModal()}
          >
            {t("order_confirmation.back_dash_button")}
          </button>{" "}
        </Link>
      </div>
    </div>
  );
}
