/* eslint-disable jsx-a11y/label-has-associated-control */
import { Link, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { useGlobalContext } from "../../context/GlobalProvider"; // Ajusta el path
import { useTranslation } from "react-i18next";
import loginImage from "../../images/imageLogin4.png";
import "../../../styles/dashboard.css";
export default function Register() {
  const { auth } = useGlobalContext();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    full_name: "",
    country: "",
    email: "",
    hashed_password: "",
    age: 0,
  });

  console.log("formData", formData);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegisterClick = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await auth.register(formData);
      console.log("Result", result);
      if (result) {
        console.log("Login exitoso", result);
        navigate("/login");
      } else {
        console.error("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en login:", error);
    }
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <img
          src={loginImage}
          alt="Login"
          className="min-w-full h-80 md:h-screen object-cover"
        />
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-neutral-950">
        <div className="w-full max-w-lg px-5 py-5 md:py-0">
          <div className="flex items-center justify-center">
            <h1
              className="text-4xl font-bold mb-4 text-slate-50"
              style={{ fontFamily: "chapFont" }}
            >
              {t("register_page.title")}
            </h1>
          </div>

          <div className="mb-4 ">
            <label className="block text-slate-50">
              {" "}
              {t("register_page.full_name")}
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your username"
              onChange={onChange}
              name="full_name"
              value={formData.full_name}
            />
          </div>
          <div className="mb-4">
            <label className="block text-slate-50">
              {t("register_page.email")}
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your username"
              onChange={onChange}
              name="email"
              value={formData.email}
            />
          </div>
          <div className="mb-4">
            <label className="block text-slate-50">
              {" "}
              {t("register_page.password")}
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your password"
              onChange={onChange}
              name="hashed_password"
              value={formData.hashed_password}
            />
          </div>
          <div className="mb-4">
            <label className="block text-slate-50">
              {" "}
              {t("register_page.country")}
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your password"
              onChange={onChange}
              name="country"
              value={formData.country}
            />
          </div>
          <div className="mb-4">
            <label className="block text-slate-50">
              {t("register_page.age")}
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Enter your password"
              onChange={onChange}
              name="age"
              value={formData.age}
            />
          </div>
          <div className="mb-1 flex align-middle">
            <div>
              <label className="block text-slate-50">
                {t("register_page.terms")}
              </label>
            </div>
            <div>
              <input
                type="checkbox"
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter your password"
              />
            </div>
          </div>
          <div className="mb-2 text-sm">
            <Link to="/login">{t("register_page.account")}</Link>
          </div>

          <div className="w-full mb-4 md:mb-0">
            <button
              className="w-full border-none py-3 px-4  bg-teal-500 text-white rounded-lg"
              onClick={handleRegisterClick}
            >
              {t("register_page.button")}
            </button>
          </div>
          <p className="block mt-2 text-sm text-slate-50">
            {t("register_page.data_protection")}
          </p>
        </div>
      </div>
    </div>
  );
}
