/* eslint-disable jsx-a11y/label-has-associated-control */
import { Link, useNavigate } from "@remix-run/react";
import { useEffect, useState } from "react";
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
    agree_to_terms_and_conditions: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  console.log("formData", formData);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    const newData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };
    localStorage.setItem("registerFormData", JSON.stringify(newData));
  };

  useEffect(() => {
    const savedData = localStorage.getItem("registerFormData");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  const isValidPassword = (password: string): boolean => {
    return (
      password.length >= 9 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password) &&
      /[!@#$%^&*(),.?":{}|<>]/.test(password)
    );
  };

  const handleRegisterClick = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: boolean } = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (
        (typeof value === "string" && value.trim() === "") ||
        (typeof value === "number" && value === 0) ||
        (typeof value === "boolean" &&
          key === "agree_to_terms_and_conditions" &&
          !value)
      ) {
        newErrors[key] = true;
      }
    });

    if (!isValidPassword(formData.hashed_password)) {
      newErrors.hashed_password = true;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const result = await auth.register(formData);
      console.log("Result", result);
      if (result) {
        console.log("Login exitoso", result);
        localStorage.removeItem("registerFormData");
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
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.full_name ? "border-red-500" : ""
              }`}
              placeholder={t("register_page.full_name")}
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
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.email ? "border-red-500" : ""
              }`}
              placeholder={t("register_page.email")}
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
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.hashed_password ? "border-red-500" : ""
              }`}
              placeholder={t("register_page.password")}
              onChange={onChange}
              name="hashed_password"
              value={formData.hashed_password}
            />
            {formData.hashed_password.length === 0 ||
            isValidPassword(formData.hashed_password) ? (
              <p className="text-sm text-gray-400 mt-1">
                Debe tener al menos 9 caracteres, una mayúscula, un número y un
                símbolo
              </p>
            ) : (
              <p className="text-red-500 text-xs mt-1">
                La contraseña no cumple con los requisitos, Debe tener al menos
                9 caracteres, una mayúscula, un número y un símbolo
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-slate-50">
              {" "}
              {t("register_page.country")}
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.country ? "border-red-500" : ""
              }`}
              placeholder={t("register_page.country")}
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
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.age ? "border-red-500" : ""
              }`}
              placeholder={t("register_page.age")}
              onChange={onChange}
              name="age"
              value={formData.age}
            />
          </div>
          <div className="mb-1 flex align-middle">
            <div>
              <input
                type="checkbox"
                name="agree_to_terms_and_conditions"
                checked={formData.agree_to_terms_and_conditions}
                onChange={onChange}
                className={`w-4 h-4 mx-2 ${
                  errors.agree_to_terms_and_conditions
                    ? "ring-2 ring-red-500"
                    : ""
                }`}
              />
            </div>
            <div>
              <Link to="/termsAndCondition">
                {" "}
                <label className="text-sm block text-blue-500 underline cursor-pointer">
                  {t("register_page.terms")}
                </label>
              </Link>
            </div>
          </div>
          <div className="mb-2 text-sm cursor-pointer underline font-bold">
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
          <p className="block mt-2 text-sm text-blue-500 underline">
            <Link to="/dataProtection">
              {" "}
              {t("register_page.data_protection")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
