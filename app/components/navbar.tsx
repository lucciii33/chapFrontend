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

export default function Navbar() {
  const [theme, setTheme] = useState("light");
  const { auth, cart } = useGlobalContext();
  const { activateSideBar, actSideBar, closeSideBar } = cart;
  console.log("actSideBar", actSideBar);

  const { logout, user } = auth;

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <>
      <nav className="p-4 flex justify-between items-center bg-teal-500">
        <div>
          <Link to="/">
            <h1 className="text-xl font-bold text-white">Chap</h1>
          </Link>
        </div>
        <div className="text-white flex">
          <div className="border-r pe-2">
            {" "}
            <p>The Founders</p>
          </div>
          <div className="ms-2">
            {" "}
            <p>Our bussines</p>
          </div>
        </div>
        <div>
          {user ? (
            <div>
              <button className="btn ms-2" onClick={logout}>
                <PowerIcon className="h-6 w-6 text-red-500" />
              </button>
              <button className="btn ms-2" onClick={toggleTheme}>
                {theme === "light" ? (
                  <MoonIcon className="h-6 w-6 text-blue-500" />
                ) : (
                  <SunIcon className="h-6 w-6 text-yellow-500 " />
                )}
              </button>
              <label
                htmlFor="my-drawer-4"
                className="drawer-button btn btn-primary ms-2"
                onClick={() => activateSideBar()}
              >
                <ShoppingCartIcon className="h-6 w-6 text-blue-500" />
              </label>
            </div>
          ) : (
            <div>
              <UserIcon className="h-6 w-6 text-blue-500" />
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
