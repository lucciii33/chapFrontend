import { useState } from "react";
import { showErrorToast, showSuccessToast, showInfoToast } from "~/utils/toast";
import { useTranslation } from "react-i18next";

type Finance = {
  user_id: number;
  pet_id: number;
  expense_date: string; // YYYY-MM-DD
  amount: number;
  expense_type?: string;
  description?: string;
  category?: string;
  payment_method?: string;
  receipt_photo_url?: string;
  recurring: boolean;
};

type FinanceResponse = {
  id: number;
  user_id: number;
  pet_id: number;
  expense_date: string;
  amount: number;
  expense_type?: string;
  description?: string;
  category?: string;
  payment_method?: string;
  receipt_photo_url?: string;
  recurring: boolean;
};

export const useFinanceContext = () => {
  const [financeInfo, setFinanceInfo] = useState<FinanceResponse | null>(null);
  const { t } = useTranslation();

  const baseUrl = import.meta.env.VITE_REACT_APP_URL;

  const getToken = (): string | null => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.access_token;
    }
    return null;
  };

  const createFinance = async (
    financeData: Finance
  ): Promise<FinanceResponse | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");

      const response = await fetch(`${baseUrl}/api/financial`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(financeData),
      });

      if (!response.ok) throw new Error("Error al crear el gasto");

      const responseData: FinanceResponse = await response.json();
      setFinanceInfo(responseData);
      showSuccessToast(t("finances.expense_saved"));

      return responseData;
    } catch (error) {
      console.error("Error al crear el gasto:", error);
      showErrorToast(t("finances.expense_save_error"));
      return null;
    }
  };

  const getUserFinances = async (
    userId: number
  ): Promise<FinanceResponse[] | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");

      const response = await fetch(`${baseUrl}/api/financial/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        showInfoToast(t("finances.no_finances"));
        return [];
      }

      if (!response.ok) throw new Error("Error al obtener los gastos");

      const data: FinanceResponse[] = await response.json();
      if (Array.isArray(data) && data.length === 0) {
        return []; // o null, como prefieras manejarlo
      }

      return data;
    } catch (error) {
      showErrorToast(t("finances.expenses_load_error"));
      return null;
    }
  };

  const updateFinance = async (
    financeId: number,
    financeData: Partial<Finance>
  ): Promise<boolean> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");

      const response = await fetch(`${baseUrl}/api/financial/${financeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(financeData),
      });

      if (!response.ok) throw new Error("Error al actualizar el gasto");

      showSuccessToast(t("finances.expense_updated"));
      return true;
    } catch (error) {
      console.error("Error al actualizar el gasto:", error);
      showErrorToast(t("finances.expense_update_error"));
      return false;
    }
  };

  const deleteFinance = async (financeId: number): Promise<boolean> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");

      const response = await fetch(`${baseUrl}/api/financial/${financeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar el gasto");

      showSuccessToast(t("finances.expense_deleted"));
      return true;
    } catch (error) {
      console.error("Error al eliminar el gasto:", error);
      showErrorToast(t("finances.expense_delete_error"));
      return false;
    }
  };

  return {
    financeInfo,
    createFinance,
    getUserFinances,
    updateFinance,
    deleteFinance,
  };
};
