/* eslint-disable jsx-a11y/label-has-associated-control */
import { useState } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { useGlobalContext } from "../../context/GlobalProvider"; // Ajusta el path
import loginImage from "../../images/imageLogin4.png";
import loginImageMobile from "../../images/cat3.png";
import { useTranslation } from "react-i18next";
import "../../../styles/dashboard.css";
import { showErrorToast, showSuccessToast } from "~/utils/toast";

export default function Login() {
  const { auth } = useGlobalContext();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    hashed_password: "",
  });

  const [resetPassword, setResetpassword] = useState("");
  const { t } = useTranslation();

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: name === "email" ? value.toLowerCase() : value,
    }));
  };
  const handleLoginClick = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await auth.login(loginData);
      if (result) {
        navigate("/dashboard");
      } else {
        console.error("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  const handleResetRequest = async () => {
    if (!resetPassword) {
      showErrorToast(t("password_recovery.email_validation"));
      return;
    }

    const result = await auth.requestPasswordReset(resetPassword);

    if (result?.status === 200) {
      showSuccessToast(t("password_recovery.toast_success"));
      document.getElementById("resetPassword").close();
      setResetpassword(""); // Limpiar input
    } else {
      // showErrorToast(t("password_recovery.toast_error"));
    }
  };
  return (
    <div className="flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <picture className="w-full">
          <source srcSet={loginImage} media="(min-width: 768px)" />
          <img
            src={loginImageMobile}
            alt="Login"
            className="w-full h-[25rem] object-cover md:h-screen"
          />
        </picture>
      </div>
      <div className=" w-full md:w-1/2 flex items-center justify-center bg-neutral-950">
        <div className="w-full max-w-lg px-4 py-5 md:py-0">
          <div className="flex items-center justify-center">
            <h1
              className="text-4xl font-bold mb-4 text-slate-50"
              style={{ fontFamily: "chapFont" }}
            >
              {t("login_page.title")}
            </h1>
          </div>
          <div className="mb-4">
            <label className="block text-slate-50">
              {t("login_page.email")}
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder={t("login_page.email")}
              name="email"
              value={loginData.email}
              onChange={handleOnChange}
            />
          </div>
          <div className="mb-2">
            <label className="block text-slate-50">
              {t("login_page.password")}
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg"
              placeholder={t("login_page.password")}
              name="hashed_password"
              value={loginData.hashed_password}
              onChange={handleOnChange}
            />
          </div>
          <p
            className="block mt-2 text-sm text-slate-50 underline cursor-pointer font-bold"
            onClick={() => document.getElementById("resetPassword").showModal()}
          >
            {t("login_page.forgot_password")}
          </p>
          <div className="mb-2">
            <Link className="underline cursor-pointer font-bold" to="/register">
              {t("login_page.no_account")}
            </Link>
          </div>

          <div className="w-full">
            <button
              className="w-full border-none py-3 px-4  bg-teal-500 text-white rounded-lg"
              onClick={handleLoginClick}
            >
              {t("login_page.button")}
            </button>
          </div>
        </div>
      </div>
      <dialog id="resetPassword" className="modal">
        <div className="modal-box w-3/4 max-w-4xl h-auto p-6">
          <div>
            <label> {t("password_recovery.email_placeholder")}</label>
          </div>
          <div>
            <input
              placeholder={t("password_recovery.email_placeholder")}
              type="email"
              value={resetPassword}
              onChange={(e) => setResetpassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <button
            className="mt-4 py-2 px-4 bg-teal-500 text-white rounded-lg"
            onClick={handleResetRequest}
          >
            {t("password_recovery.send_button")}
          </button>
          <button
            onClick={() => document.getElementById("resetPassword").close()}
            className="ms-2 py-2 px-4 bg-slate-800 text-white rounded-lg"
          >
            {t("password_recovery.close_button")}
          </button>
        </div>
      </dialog>
    </div>
  );
}
