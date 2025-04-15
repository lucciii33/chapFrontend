import { useState, useEffect } from "react";
import {
  MoonIcon,
  SunIcon,
  PowerIcon,
  UserIcon,
  ShoppingCartIcon,
} from "@heroicons/react/24/solid";
import { useGlobalContext } from "../context/GlobalProvider"; // Ajusta el path
import { Link } from "@remix-run/react";
import Cart from "./cart";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const [theme, setTheme] = useState("light");
  const { auth, cart } = useGlobalContext();
  const { activateSideBar, actSideBar, closeSideBar } = cart;
  console.log("actSideBar", actSideBar);
  const { t, i18n } = useTranslation();

  const toggleLang = () => {
    const nextLang = i18n.language === "es" ? "en" : "es";
    i18n.changeLanguage(nextLang);
  };

  const { logout, user } = auth;

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <>
      <nav className="p-4 flex justify-between items-center bg-zinc-950">
        <div>
          <Link to="/">
            <h1
              className="text-[20px] font-bold text-white"
              style={{ fontFamily: "chapFont" }}
            >
              Chap
            </h1>
          </Link>
        </div>
        {/* <div className="text-white flex">
          <div className="ms-2">
            {" "}
            <p>the foudners</p>
          </div>
          <div className="ms-2">
            {" "}
            <p>Our bussines</p>
          </div>
        </div> */}
        <div>
          {user ? (
            <div>
              <button className="btn ms-2" onClick={logout}>
                logout
                {/* <PowerIcon className="h-6 w-6 text-red-500" /> */}
              </button>
              {/* <button className="btn ms-2" onClick={toggleTheme}>
                {theme === "light" ? (
                  <MoonIcon className="h-6 w-6 text-blue-500" />
                ) : (
                  <SunIcon className="h-6 w-6 text-yellow-500 " />
                )}
              </button> */}
              <Link to="/dashboard">
                <button className="btn ms-2">
                  {/* {t("login")} */}
                  Dashboard
                </button>
              </Link>
              <label
                htmlFor="my-drawer-4"
                className="drawer-button btn ms-2"
                onClick={() => activateSideBar()}
              >
                <ShoppingCartIcon className="h-6 w-6 text-teal-500" />
              </label>
              <div
                className="btn ms-2 d-flex justify-center items-center"
                onClick={toggleLang}
              >
                <button
                  className="text-teal-500"
                  title={
                    i18n.language === "es"
                      ? "Cambiar a inglés"
                      : "Switch to Spanish"
                  }
                >
                  {i18n.language === "es" ? "ES" : "EN"}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex">
              <Link to="/login">
                <button className="btn ms-2">
                  {/* {t("login")} */}
                  LOGIN
                </button>
              </Link>

              <div
                className="btn ms-2 d-flex justify-center items-center"
                onClick={toggleLang}
              >
                <button
                  className="text-teal-500"
                  title={
                    i18n.language === "es"
                      ? "Cambiar a inglés"
                      : "Switch to Spanish"
                  }
                >
                  {i18n.language === "es" ? "ES" : "EN"}
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content"></div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
            onClick={() => closeSideBar()} // Actualiza el estado global al cerrar
          ></label>
          <div className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            <Cart />
          </div>
        </div>
      </div>
    </>
  );
}
