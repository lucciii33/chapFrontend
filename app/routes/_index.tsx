import { useState, useEffect } from "react";
import type { MetaFunction } from "@remix-run/node";
import dogHi from "../images/hidog.png";
import nobgtag from "../images/testtag.png";
import dogSitting from "../images/dogSitting.png";
import dogTag from "../images/test2.png";
import { Link } from "@remix-run/react";
import ScrollVideo from "~/components/scroll-video";
import "../../styles/dashboard.css";
import { useTranslation } from "react-i18next";
import WhyChap from "~/components/whyChap";

export const meta: MetaFunction = () => {
  return [
    { title: "Chap" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { t } = useTranslation();

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
              src={dogTag}
              alt="homepageimage"
              className="h-full"
              style={{ filter: "drop-shadow(0px 8px 10px rgba(0, 0, 0, 0.2))" }}
            />
          ) : (
            <img
              src={dogTag}
              alt="homepageimage mix-blend-multiply"
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
            {t("hero.title")}
          </h1>
          <p className="text-1xl lg:text-3xl font-medium text-white mb-4">
            {t("hero.subtitle")}
          </p>
          <p className="text-base text-white max-w-lg">{t("hero.paragraph")}</p>{" "}
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
      <div className="mt-0">
        <WhyChap />
        <div className="bg-[#65BCBB] h-[120vh] lg:h-[55vh]">
          <div className="">
            <h1
              className="text-[70px] font-bold text-black p-5 text-center"
              style={{ fontFamily: "chapFont" }}
            >
              Chap
            </h1>
          </div>
          <div className=" flex  justify-center items-center px-5">
            <div className="w-full h-100 lg:h-[14rem] mt-0 lg:mt-[0px] flex flex-col items-center justify-center lg:justify-center lg:flex-row gap-5 z-10 relative">
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
