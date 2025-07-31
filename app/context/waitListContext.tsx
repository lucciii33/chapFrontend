import { useState } from "react";
import { showSuccessToast, showErrorToast } from "~/utils/toast";
import { useTranslation } from "react-i18next";

type WaitlistEntry = {
  id: number;
  full_name: string;
  email: string;
  country: string;
  created_at: string;
};

type CreateWaitlistData = {
  full_name: string;
  email: string;
  country: string;
};

export const useWaitlistApi = () => {
  const { t } = useTranslation();
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);

  const getToken = (): string | null => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.access_token;
    }
    return null;
  };

  const baseUrl = import.meta.env.VITE_REACT_APP_URL;

  // ✅ Crear sin token
  const createWaitlistEntry = async (
    data: CreateWaitlistData
  ): Promise<WaitlistEntry | null> => {
    try {
      const response = await fetch(`${baseUrl}/api/waitlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.detail || "Error al registrarte en la lista de espera"
        );
      }

      const result = await response.json();
      showSuccessToast("Te uniste a la lista de espera 🥳");
      return result.data;
    } catch (error) {
      console.error(error);
      showErrorToast("Ocurrió un error al enviar tus datos.");
      return null;
    }
  };

  // ✅ Solo admin
  const fetchWaitlist = async (): Promise<WaitlistEntry[] | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Token no encontrado");

      const response = await fetch(`${baseUrl}/api/waitlist`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener la lista");

      const data = await response.json();
      setWaitlist(data);
      return data;
    } catch (error) {
      console.error("Error al obtener la lista:", error);
      showErrorToast("Error al cargar la lista de espera");
      return null;
    }
  };

  // ✅ Solo admin
  const deleteWaitlistEntry = async (id: number): Promise<boolean> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Token no encontrado");

      const response = await fetch(`${baseUrl}/api/waitlist/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar entrada");

      showSuccessToast("Entrada eliminada correctamente");
      setWaitlist((prev) => prev.filter((entry) => entry.id !== id));
      return true;
    } catch (error) {
      console.error("Error al eliminar entrada:", error);
      showErrorToast("No se pudo eliminar esta entrada.");
      return false;
    }
  };

  return {
    waitlist,
    createWaitlistEntry,
    fetchWaitlist,
    deleteWaitlistEntry,
  };
};
