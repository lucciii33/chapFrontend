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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    const newValue =
      name === "email"
        ? value.toLowerCase()
        : type === "checkbox"
        ? checked
        : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    const newData = {
      ...formData,
      [name]: newValue,
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

      if (result) {
        localStorage.removeItem("registerFormData");
        navigate("/login");
      } else {
        console.error("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  const countries = [
    { value: "spain", label: "España" },
    { value: "portugal", label: "Portugal" },
    { value: "italy", label: "Italia" },
    { value: "france", label: "Francia" },
    { value: "germany", label: "Alemania" },
    { value: "uk", label: "Reino Unido" },
    { value: "usa", label: "Estados Unidos" },
    { value: "canada", label: "Canadá" },
    { value: "ireland", label: "Irlanda" },
    { value: "netherlands", label: "Países Bajos" },
    { value: "sweden", label: "Suecia" },
    { value: "argentina", label: "Argentina" },
    { value: "chile", label: "Chile" },
    { value: "colombia", label: "Colombia" },
    { value: "mexico", label: "México" },
    { value: "venezuela", label: "Venezuela" },
    { value: "peru", label: "Perú" },
    { value: "uruguay", label: "Uruguay" },
    { value: "ecuador", label: "Ecuador" },
    { value: "bolivia", label: "Bolivia" },
    { value: "paraguay", label: "Paraguay" },
    { value: "costa_rica", label: "Costa Rica" },
    { value: "panama", label: "Panamá" },
    { value: "dominican_republic", label: "República Dominicana" },
  ];

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
                {t("register_page.password_alert")}
              </p>
            ) : (
              <p className="text-red-500 text-xs mt-1">
                {t("register_page.password_alert")}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-slate-50">
              {" "}
              {t("register_page.country")}
            </label>
            <select
              className={`w-full px-4 py-2 border rounded-lg ${
                errors.country ? "border-red-500" : ""
              }`}
              name="country"
              value={formData.country}
              onChange={onChange}
            >
              <option value="">{t("register_page.country")}</option>
              {countries.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
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
