import { useState } from "react";
import { MoonIcon, SunIcon, PowerIcon } from "@heroicons/react/24/solid";
import { useGlobalContext } from "../context/GlobalProvider"; // Ajusta el path

export default function Navbar() {
  const [theme, setTheme] = useState("light");
  const { auth } = useGlobalContext();
  const { logout, user } = auth;

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <nav className="p-4 flex justify-between items-center bg-teal-500">
      <h1 className="text-xl font-bold">Mi App</h1>
      <div>
        <button className="btn" onClick={toggleTheme}>
          {theme === "light" ? (
            <MoonIcon className="h-6 w-6 text-blue-500" />
          ) : (
            <SunIcon className="h-6 w-6 text-yellow-500 " />
          )}
        </button>
        {user && (
          <button className="btn ms-2" onClick={logout}>
            <PowerIcon className="h-6 w-6 text-red-500" />
          </button>
        )}
      </div>
    </nav>
  );
}
