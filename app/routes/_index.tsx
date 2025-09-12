import { useState, useEffect } from "react";
import type { MetaFunction } from "@remix-run/node";
import dogHi from "../images/hidog.png";
import nobgtag from "../images/testtag.png";
import dogSitting from "../images/dogSitting.png";
import dogTag from "../images/test2.png";
import phoneimage from "../images/phoneimage3.png";
import { Link } from "@remix-run/react";
import ScrollVideo from "~/components/scroll-video";
import "../../styles/dashboard.css";
import { useTranslation } from "react-i18next";
import WhyChap from "~/components/whyChap";
import Founders from "~/components/founder";
import { useGlobalContext } from "~/context/GlobalProvider";
import GpsLandignd from "~/components/gpsLandin";
import Footer from "~/components/footer";

export const meta: MetaFunction = () => {
  return [
    { title: "Chap" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const { cart } = useGlobalContext();

  const { actSideBar } = cart;
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

  useEffect(() => {
    fetch(`${import.meta.env.VITE_REACT_APP_URL}/users/test-country`)
      .then((res) => res.json())
      .then((data) => {
        console.log("DEBUG country headers:", data);
      })
      .catch((err) => console.error("Error test-country:", err));
  }, []);

  return (
    <>
      <div className="flex h-[100%] lg:h-screen items-center justify-evenly bg-teal-500 flex-col lg:flex-row py-5 lg:py-0">
        <div className="p-5 lg:p-0">
          {/* order-2 lg:order-1 */}
          {isSmallScreen ? (
            <img
              src={phoneimage}
              alt="homepageimage"
              className="h-auto"
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
        <div
          className="mt-3 lg:mt-0 p-5 lg:px-4 max-w-xl lg:max-w-2xl z-10"
          style={{ zIndex: actSideBar ? 0 : "auto" }}
        >
          {/* order-1 lg:order-2 */}
          <h1
            className="text-3xl lg:text-6xl font-bold text-white"
            style={{ fontFamily: "chapFont" }}
          >
            {t("hero.title")}
          </h1>
          {/* <p className="text-1xl lg:text-3xl font-medium text-white mb-4">
            {t("hero.subtitle")}
          </p> */}
          <p className="text-base text-white max-w-lg"> {t("hero.subtitle")}</p>{" "}
          {/* <p className="text-base text-white max-w-lg">{t("hero.paragraph")}</p>{" "} */}
          <div className="mt-5">
            <Link to="register">
              <button className=" border-none py-3 px-4 ms-0 md:ms-3 w-full md:w-auto bg-cyan-950 text-white rounded-lg">
                {t("register")}
              </button>
            </Link>
            <a
              href="#why-chap"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("why-chap")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              <button className="border-none py-3 px-4 ms-0 md:ms-3 w-full md:w-auto mt-2 md:mt-0 bg-teal-700 text-white rounded-lg">
                {t("features")}
              </button>
            </a>
          </div>
        </div>
      </div>
      <div className="mt-0">
        <WhyChap />
        {/* <GpsLandignd /> */}
        <Founders />
        <div className="bg-[#65BCBB] h-[135vh] lg:h-[65vh] pb-5">
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
              <div className="w-[320px] h-[250px] ml-5 mt-3 bg-zinc-900 flex flex-col items-center justify-center rounded-lg text-center p-3">
                <h2
                  className="text-white text-4xl font-bold"
                  style={{ fontFamily: "chapFont" }}
                >
                  {t("ChapStats.boxOneTitle")}
                </h2>
                <small className="text-white">{t("ChapStats.boxOnePar")}</small>
              </div>
              <div className="w-[320px] h-[250px] bg-[#4B4A4A] mt-3 flex flex-col items-center justify-center rounded-lg text-center p-3">
                <h2
                  className="text-white text-4xl font-bold"
                  style={{ fontFamily: "chapFont" }}
                >
                  {t("ChapStats.boxTwoTitle")}
                </h2>
                <small className="text-white">{t("ChapStats.boxTwoPar")}</small>
              </div>
              <div className="w-[320px] h-[250px] bg-cyan-950 mt-3 flex flex-col items-center justify-center  text-center rounded-lg p-3">
                <h2
                  className="text-white text-4xl font-bold "
                  style={{ fontFamily: "chapFont" }}
                >
                  {t("ChapStats.boxThreeTitle")}
                </h2>
                <small className="text-white">
                  {t("ChapStats.boxThreePar")}
                </small>
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
      <Footer />
    </>
  );
}
