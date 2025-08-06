import { useSearchParams } from "@remix-run/react";
import { useState } from "react";
import { useGlobalContext } from "~/context/GlobalProvider";
import { showErrorToast, showSuccessToast } from "~/utils/toast";
import { useTranslation } from "react-i18next";

export default function ResetPasswordPage() {
  const { t } = useTranslation();

  const { auth } = useGlobalContext();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [passwordError, setPasswordError] = useState("");

  const [newPassword, setNewPassword] = useState("");

  function validatePassword(password) {
    if (password.length < 9) {
      return "La contraseña debe tener al menos 9 caracteres";
    }
    if (!/[A-Z]/.test(password)) {
      return "La contraseña debe contener al menos una letra mayúscula";
    }
    if (!/[0-9]/.test(password)) {
      return "La contraseña debe contener al menos un número";
    }
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      return "La contraseña debe contener al menos un carácter especial";
    }
    return null; // válida
  }

  const handleReset = async () => {
    if (!token) {
      showErrorToast("Token no válido");
      return;
    }

    const error = validatePassword(newPassword);
    if (error) {
      console.log("Error", error);
      showErrorToast(error);
      setPasswordError(error);
      return;
    }

    const result = await auth.resetPassword(token, newPassword);

    if (result?.success) {
      showSuccessToast(t("password_recovery.success"));
    } else {
      showErrorToast(t("password_recovery.request_error"));
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">{t("password_reset.title")}</h1>
      <label>{t("password_reset.new_password")}</label>
      <input
        type="password"
        placeholder={t("password_reset.new_password")}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className={`w-full p-2 border rounded mb-1 ${
          passwordError ? "border-red-500" : "border-gray-300"
        }`}
      />
      <button
        onClick={handleReset}
        className="w-full bg-teal-600 text-white py-2 rounded"
      >
        {t("password_reset.change_password")}
      </button>
    </div>
  );
}
