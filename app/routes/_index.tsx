import { useState, useEffect } from "react";
import type { MetaFunction } from "@remix-run/node";
import dogHi from "../images/hidog.png";
import dogSitting from "../images/dogSitting.png";
import { Link } from "@remix-run/react";
import ScrollVideo from "~/components/scroll-video";
import "../../styles/dashboard.css";

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
    <>
      <div className="flex h-[100%] lg:h-screen items-center justify-evenly bg-teal-500 flex-col lg:flex-row py-5 lg:py-0">
        <div className="p-5 lg:p-0">
          {/* order-2 lg:order-1 */}
          {isSmallScreen ? (
            <img
              src={dogSitting}
              alt="homepageimage"
              className="h-[343px] lg:h-full"
              style={{ filter: "drop-shadow(0px 8px 10px rgba(0, 0, 0, 0.2))" }}
            />
          ) : (
            <img
              src={dogHi}
              alt="homepageimage"
              style={{ filter: "drop-shadow(0px 8px 10px rgba(0, 0, 0, 0.2))" }}
            />
          )}
        </div>
        <div className="mt-3 lg:mt-0 p-5 lg:px-4 max-w-xl lg:max-w-2xl z-10">
          {/* order-1 lg:order-2 */}
          <h1
            className="text-4xl lg:text-6xl font-bold text-white"
            style={{ fontFamily: "chapFont" }}
          >
            Un QR, toda la vida de tu perro al alcance de un escaneo.
          </h1>
          <p className="text-1xl lg:text-3xl font-medium text-white mb-4">
            Porque su seguridad no debería quedarse atrás.
          </p>
          <p className="text-base text-white max-w-lg">
            Imagina un mundo donde nunca tengas que preocuparte por actualizar
            el tag de tu perro. Con nuestra app y collar inteligente, toda la
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
      <div className="mt-0 lg:mt-3">
        <div className="absolute -bottom-32 left-0 w-full hidden lg:block">
          <svg
            className="w-full h-100"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="#fff"
              fillOpacity="1"
              d="M0,256L48,240C96,224,192,192,288,186.7C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,154.7C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              style={{ filter: "drop-shadow(0px 8px 10px rgba(0, 0, 0, 0.2))" }}
            ></path>
          </svg>
        </div>
        <div className="absolute -bottom-40 left-0 w-full hidden lg:block">
          <svg
            className="w-full h-100"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 290"
          >
            <path
              fill="#65BCBB" /* Azul claro (#60a5fa es el azul de Tailwind `blue-400`) */
              fillOpacity="1"
              d="M0,64L48,96C96,128,192,192,288,224C384,256,480,256,576,224C672,192,768,128,864,96C960,64,1056,64,1152,96C1248,128,1344,192,1392,224L1440,256L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>

        <div className="bg-[#65BCBB] h-[120vh] lg:h-[70vh] ">
          <div className="block lg:hidden">
            <h1
              className="text-[70px] font-bold text-black p-5 text-center"
              style={{ fontFamily: "chapFont" }}
            >
              Chap
            </h1>
          </div>
          <div className=" flex  justify-between items-center px-5">
            <div className="w-full h-100 lg:h-64 mt-0 lg:mt-[70px] flex flex-col items-center justify-center lg:justify-start lg:flex-row gap-5 z-10 relative">
              <div className="w-[200px] h-[200px] ml-5 mt-3 bg-zinc-900 flex flex-col items-center justify-center rounded-lg text-center">
                <h2
                  className="text-white text-4xl font-bold"
                  style={{ fontFamily: "chapFont" }}
                >
                  100 QR sold
                </h2>
                <small className="text-white">The best tags the market</small>
              </div>
              <div className="w-[200px] h-[200px] bg-[#4B4A4A] mt-3 flex flex-col items-center justify-center rounded-lg text-center">
                <h2
                  className="text-white text-4xl font-bold"
                  style={{ fontFamily: "chapFont" }}
                >
                  35 pets Founded
                </h2>
                <small className="text-white">We still in humanity</small>
              </div>
              <div className="w-[200px] h-[200px] bg-cyan-950 mt-3 flex flex-col items-center justify-center  text-center rounded-lg">
                <h2
                  className="text-white text-4xl font-bold "
                  style={{ fontFamily: "chapFont" }}
                >
                  WE LOVE
                </h2>
                <small className="text-white">your pets as much as you</small>
              </div>
            </div>
            <div>
              {/* <h1 className="text-white text-5xl font-bold z-10 relative">
              CHAP
            </h1> */}
            </div>
          </div>
        </div>
      </div>
      <ScrollVideo />
    </>
  );
}
