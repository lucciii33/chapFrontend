import { useState, useEffect } from "react";
import {
  MoonIcon,
  SunIcon,
  PowerIcon,
  UserIcon,
  ShoppingCartIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import { useLocation } from "@remix-run/react";
import { useGlobalContext } from "../context/GlobalProvider"; // Ajusta el path
import { Link } from "@remix-run/react";
import Cart from "./cart";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { authAdmin } = useGlobalContext(); // ✅ AGREGADO
  const { adminUser, logoutAdmin } = authAdmin;
  console.log("adminUser NAVBAR", adminUser);
  const [theme, setTheme] = useState("light");
  const location = useLocation();
  const { auth, cart } = useGlobalContext();
  const { activateSideBar, actSideBar, closeSideBar, allCarts } = cart;
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);

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

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, i18n.language]);

  const renderLinks = () => (
    <>
      {adminUser && (
        <button className="btn" onClick={logoutAdmin}>
          {/* {t("navbar.logout")} */}
          <PowerIcon className="h-6 w-6 text-teal-500" />
        </button>
      )}
      {user ? (
        <>
          <Link to="/dashboard">
            <button className="btn w-full md:w-atuo">
              {t("navbar.dashboard")}
            </button>
          </Link>

          <button
            className="btn text-teal-500"
            onClick={() => {
              toggleLang();
              setOpen(false);
            }}
            title={
              i18n.language === "es" ? "Cambiar a inglés" : "Switch to Spanish"
            }
          >
            {i18n.language === "es" ? "ES" : "EN"}
          </button>
          <label
            htmlFor="my-drawer-4"
            className="drawer-button btn"
            onClick={activateSideBar}
          >
            <ShoppingCartIcon className="h-6 w-6 text-teal-500" />
            {allCarts.length > 0 && (
              <span className="absolute md:top-2 ms-[50px] bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {allCarts.length}
              </span>
            )}
          </label>
          <button className="btn" onClick={logout}>
            {/* {t("navbar.logout")} */}
            <PowerIcon className="h-6 w-6 text-teal-500" />
          </button>
        </>
      ) : (
        <>
          <Link to="/login">
            <button className="btn w-full md:w-auto">
              {t("navbar.login")}
            </button>
          </Link>
          <button
            className="btn text-teal-500"
            onClick={toggleLang}
            title={
              i18n.language === "es" ? "Cambiar a inglés" : "Switch to Spanish"
            }
          >
            {i18n.language === "es" ? "ES" : "EN"}
          </button>
        </>
      )}
    </>
  );

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
        <div className="hidden md:flex gap-4 items-center">{renderLinks()}</div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          <Bars3Icon className="h-6 w-6" />
        </button>
      </nav>

      {open && (
        <div className="md:hidden bg-zinc-950 flex flex-col gap-4 p-4">
          {renderLinks()}
        </div>
      )}

      <div className="drawer drawer-end">
        <input
          id="my-drawer-4"
          type="checkbox"
          className="drawer-toggle"
          checked={actSideBar}
        />
        <div className="drawer-content"></div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
            onClick={() => closeSideBar()}
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
