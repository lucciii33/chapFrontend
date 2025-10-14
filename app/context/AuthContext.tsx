import { useState, useEffect } from "react";
import { Link, useNavigate } from "@remix-run/react";
import { showErrorToast, showSuccessToast } from "~/utils/toast";
import { useTranslation } from "react-i18next";

type User = {
  access_token: string;
  token_type: string;
  full_name: string;
  id: number;
  email_subscription: boolean;
  accept_send_info_email_pet_lost: boolean;
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
  email_subscription: boolean;
  accept_send_info_email_pet_lost: boolean;
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

  const getToken = (): string | null => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.access_token; // token guardado al login
    }
    return null;
  };

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
        email_subscription: responseData.email_subscription,
        accept_send_info_email_pet_lost:
          responseData.accept_send_info_email_pet_lost,
        country: responseData.country,
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

  const updateEmailSubscription = async (
    userId: number,
    emailSubscription: boolean
  ): Promise<boolean> => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token found");

      const response = await fetch(
        `${baseUrl}/users/${userId}/email-subscription`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: userId,
            email_subscription: emailSubscription,
          }),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar suscripción");
      setUser((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, email_subscription: emailSubscription };
        localStorage.setItem("user", JSON.stringify(updated));
        return updated;
      });

      showSuccessToast(
        emailSubscription
          ? t("subscription.enabled")
          : t("subscription.disabled")
      );

      return true;
    } catch (error) {
      console.error("Error al actualizar suscripción:", error);
      showErrorToast(t("subscription.error"));
      return false;
    }
  };

  const updatePetLostPreference = async (
    userId: number,
    accept: boolean
  ): Promise<boolean> => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token found");

      const response = await fetch(
        `${baseUrl}/users/update-preference?user_id=${userId}&accept_send_info_email_pet_lost=${accept}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al actualizar preferencia");

      setUser((prev) => {
        if (!prev) return prev;
        const updated = {
          ...prev,
          accept_send_info_email_pet_lost: accept,
        };
        localStorage.setItem("user", JSON.stringify(updated));
        return updated;
      });

      showSuccessToast(
        accept ? t("pet_lost_pref.enabled") : t("pet_lost_pref.disabled")
      );

      return true;
    } catch (error) {
      console.error("Error al actualizar preferencia:", error);
      showErrorToast(t("pet_lost_pref.error"));
      return false;
    }
  };

  return {
    user,
    login,
    register,
    logout,
    requestPasswordReset,
    resetPassword,
    updateEmailSubscription,
    updatePetLostPreference,
  };
};
