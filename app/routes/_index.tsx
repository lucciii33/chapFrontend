import { useState, useEffect } from "react";
import type { MetaFunction } from "@remix-run/node";
import dogHi from "../images/hidog.png";
import dogSitting from "../images/dogSitting.png";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Chap" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1000);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className="flex h-screen items-center justify-evenly bg-teal-500 flex-col lg:flex-row">
      <div className="order-2 lg:order-1">
        {isSmallScreen ? (
          <img src={dogSitting} alt="homepageimage" />
        ) : (
          <img src={dogHi} alt="homepageimage" />
        )}
      </div>
      <div className="order-1 lg:order-2 p-5 lg:p-0">
        <h1 className="text-4xl lg:text-6xl font-bold text-white">
          Un QR, toda la vida de tu perro al alcance de un escaneo.
        </h1>
        <p className="text-1xl lg:text-3xl font-medium text-white mb-4">
          Porque su seguridad no debería quedarse atrás.
        </p>
        <p className="text-base text-white max-w-lg">
          Imagina un mundo donde nunca tengas que preocuparte por actualizar el
          tag de tu perro. Con nuestra app y collar inteligente, toda la
          información de tu mejor amigo está a un escaneo de distancia.
        </p>{" "}
        <div className="mt-5">
          <Link to="/login">
            <button className=" border-none py-3 px-4  bg-slate-950 text-white rounded-lg">
              Login
            </button>
          </Link>
          <Link to="register">
            <button className=" border-none py-3 px-4 ms-3 bg-cyan-950 text-white rounded-lg">
              Register
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
