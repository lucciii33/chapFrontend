import { useState, useEffect } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { showErrorToast, showSuccessToast } from "~/utils/toast";
import { useTranslation } from "react-i18next";

type User = {
  access_token: string;
  token_type: string;
  full_name: string;
  id: number;
};

type RegisterData = {
  name: string;
  email: string;
  hashed_password: string;
  country: string;
  age: number;
};

type RegisterResponse = {
  id: number;
  email: string;
  full_name: string;
  country: string;
  age: number;
};

type LoginData = {
  email: string;
  hashed_password: string;
};

type LoginResponse = {
  access_token: string;
  token_type: string;
  full_name: string;
  id: number;
};

export const useAuthContext = () => {
  const { t } = useTranslation();

  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const baseUrl = import.meta.env.VITE_REACT_APP_URL;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (data: LoginData): Promise<LoginResponse | null> => {
    try {
      const response = await fetch(`${baseUrl}/users/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error en login");
      }

      const responseData: LoginResponse = await response.json();
      const userData: User = {
        access_token: responseData.access_token,
        token_type: responseData.token_type,
        full_name: responseData.full_name,
        id: responseData.id,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      // showSuccessToast("Login exitoso");
      showSuccessToast(t("login_toast.success"));
      return responseData;
    } catch (error) {
      console.error("Error en login:", error);
      showErrorToast(t("login_toast.error"));
      return null;
    }
  };

  const register = async (
    data: RegisterData
  ): Promise<RegisterResponse | null> => {
    try {
      const response = await fetch(`${baseUrl}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Error al registrar");
      }

      const responseData: RegisterResponse = await response.json();
      showSuccessToast(t("register_toast.success"));
      return responseData;
    } catch (error) {
      console.error("Error en registro:", error);
      showErrorToast(t("register_toast.error"));
      return null;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    showSuccessToast(t("dashboard_toast.logging_out"));
    navigate("/");
  };

  const requestPasswordReset = async (email: string): Promise<void> => {
    try {
      const response = await fetch(`${baseUrl}/users/request-password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Error al solicitar recuperación de contraseña");
      }

      showSuccessToast(t("password_recovery.instructions"));
      return response;
    } catch (error) {
      console.error("Error al solicitar reset:", error);
      showErrorToast(t("password_recovery.toast_error"));
    }
  };

  const resetPassword = async (
    token: string,
    newPassword: string
  ): Promise<{ success: boolean } | null> => {
    try {
      const response = await fetch(`${baseUrl}/users/reset-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password: newPassword }),
      });

      if (!response.ok) {
        throw new Error("No se pudo resetear");
      }

      return { success: true };
    } catch (error) {
      console.error("Error al resetear contraseña:", error);
      return null;
    }
  };

  return { user, login, register, logout, requestPasswordReset, resetPassword };
};
