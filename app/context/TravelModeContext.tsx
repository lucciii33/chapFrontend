import { showErrorToast, showSuccessToast } from "~/utils/toast";
import { useTranslation } from "react-i18next";

type PetTravelMode = {
  pet_id: number;
  feeding_instructions?: string;
  walk_instructions?: string;
  medication_instructions?: string;
  allergies?: string;
  notes?: string;
  emergency_contact?: string;
};

// Para respuesta del backend (mostrar datos)
type PetTravelModeResponse = {
  id: number;
  pet_id: number;
  feeding_instructions?: string;
  walk_instructions?: string;
  medication_instructions?: string;
  allergies?: string;
  notes?: string;
  emergency_contact?: string;
};

export const useTravelModelContext = () => {
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

  const createTravelMode = async (
    travelModeData: PetTravelMode
  ): Promise<PetTravelModeResponse | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(`${baseUrl}/api/travel_mode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(travelModeData),
      });

      if (!response.ok) throw new Error("Error al crear el travle mode");

      const responseData: PetTravelModeResponse = await response.json();
      showSuccessToast(t("travel_mode_toast.travel_mode_created"));
      return responseData;
    } catch (error) {
      console.error("Error al crear el gasto:", error);
      showErrorToast(t("travel_mode_toast.travel_mode_create_error"));
      return null;
    }
  };

  const getTravelMode = async (
    travelModeId: number
  ): Promise<PetTravelMode | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");
      console.log("llamando desde conetxttt");

      const response = await fetch(
        `${baseUrl}/api/travel_mode/${travelModeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error al obtener los gastos");

      const data: PetTravelModeResponse = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener los gastos:", error);
      showErrorToast(t("travel_mode_toast.expenses_load_error"));
      return null;
    }
  };

  const updateTravelMode = async (
    travelModeId: number,
    travelmodeData: Partial<PetTravelMode>
  ): Promise<boolean> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");

      const response = await fetch(
        `${baseUrl}/api/travel_mode/${travelModeId}/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(travelmodeData),
        }
      );

      if (!response.ok) throw new Error("Error al actualizar el gasto");

      showSuccessToast(t("travel_mode_toast.travel_mode_updated"));
      return true;
    } catch (error) {
      console.error("Error al actualizar el gasto:", error);
      showErrorToast(t("travel_mode_toast.travel_mode_update_error"));
      return false;
    }
  };

  const deleteTravelMode = async (travelModeId: number): Promise<boolean> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");

      const response = await fetch(
        `${baseUrl}/api/travel_mode/${travelModeId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    createTravelMode,
    getTravelMode,
    updateTravelMode,
    deleteTravelMode,
  };
};
