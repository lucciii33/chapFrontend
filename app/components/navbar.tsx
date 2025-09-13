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
  const { logout, user } = auth;
  const [subscribed, setSubscribed] = useState(null);

  useEffect(() => {
    if (user?.email_subscription !== undefined) {
      setSubscribed(user?.email_subscription);
    }
  }, [user]);
  console.log("subscribedsubscribed", subscribed);

  const toggleLang = () => {
    const nextLang = i18n.language === "es" ? "en" : "es";
    i18n.changeLanguage(nextLang);
  };

  console.log("user", user);
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, i18n.language]);

  const handleSave = async () => {
    if (user) {
      await auth.updateEmailSubscription(user.id, subscribed);
    }
    document.getElementById("user-modal").close();
  };

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

          <button className="btn md:w-atuo">
            <UserIcon
              className="h-6 w-6 text-teal-500"
              onClick={() => document.getElementById("user-modal").showModal()}
            />
          </button>

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
          <Link to="/waitList">
            <button className="btn w-full md:w-auto">
              {t("navbar.waitList")}
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
      <dialog id="user-modal" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{t("setting_user.title")}</h3>
          <p className="font-bold text-xs">{t("setting_user.description")}</p>

          <div className="form-control my-4">
            <label className="cursor-pointer label">
              <span className="label-text">{t("setting_user.title_2")}</span>
              <input
                type="checkbox"
                className="toggle checked:bg-teal-500 checked:border-teal-500"
                checked={subscribed}
                onChange={(e) => setSubscribed(e.target.checked)}
              />
            </label>
          </div>

          <div className="modal-action">
            <button
              className="btn"
              onClick={() => document.getElementById("user-modal").close()}
            >
              {t("setting_user.close")}
            </button>
            <button className="btn bg-teal-500" onClick={handleSave}>
              {t("setting_user.save")}
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
