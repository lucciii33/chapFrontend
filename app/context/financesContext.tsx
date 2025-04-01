import { useState } from "react";
import { showErrorToast, showSuccessToast } from "~/utils/toast";

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
      showSuccessToast("Tu gasto ha sido registrado con éxito");
      return responseData;
    } catch (error) {
      console.error("Error al crear el gasto:", error);
      showErrorToast("No se pudo registrar el gasto");
      return null;
    }
  };

  const getUserFinances = async (
    userId: number
  ): Promise<FinanceResponse[] | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");
      console.log("llamando desde conetxttt");

      const response = await fetch(`${baseUrl}/api/financial/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al obtener los gastos");

      const data: FinanceResponse[] = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener los gastos:", error);
      showErrorToast("No se pudieron cargar los gastos");
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

      showSuccessToast("El gasto fue actualizado correctamente");
      return true;
    } catch (error) {
      console.error("Error al actualizar el gasto:", error);
      showErrorToast("No se pudo actualizar el gasto");
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

      showSuccessToast("El gasto fue eliminado correctamente");
      return true;
    } catch (error) {
      console.error("Error al eliminar el gasto:", error);
      showErrorToast("No se pudo eliminar el gasto");
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
