import { useState } from "react";
import { showErrorToast, showSuccessToast } from "~/utils/toast";
import { useTranslation } from "react-i18next";

type Tag = {
  shape: string;
  name: boolean;
  continue_later: boolean;
  material: string;
  color: string;
};

type CreateTagResponse = {
  id: number;
  shape: string;
  name: boolean;
  continue_later: boolean;
  material: string;
  color: string;
};

export const useTagContext = () => {
  const [tagInfo, setTagInfo] = useState<Tag | null>(null);
  const baseUrl = import.meta.env.VITE_REACT_APP_URL;
  const { t } = useTranslation();

  const getToken = (): string | null => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.access_token; // Obtener el token del almacenamiento local
    }
    return null;
  };

  const createTag = async (
    petId: number,
    tagData: Tag
  ): Promise<CreateTagResponse | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(`${baseUrl}/api/tag/${petId}/pets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Añadimos el token aquí
        },
        body: JSON.stringify(tagData), // Aquí pasamos los datos de la mascota
      });

      if (!response.ok) {
        throw new Error("Error al crear la mascota");
      }

      const responseData: CreateTagResponse = await response.json();
      setTagInfo(responseData); // Guardamos la mascota creada en el estado
      showSuccessToast(t("dashboard_toast.tag_created"));
      return responseData;
    } catch (error) {
      console.error("Error al crear la mascota:", error);
      showErrorToast(t("dashboard_toast.error_tag_creation"));
      return null;
    }
  };

  const deletePetTag = async (tagId: number): Promise<boolean> => {
    const token = getToken();
    try {
      const response = await fetch(`${baseUrl}/api/pets/${tagId}/tag/delete`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error eliminando el tag");
      showSuccessToast("haz eliminado tu tag corectamente");
      return true;
    } catch (error) {
      console.error("Error eliminando el tag:", error);
      showErrorToast("No pudimos eliminar tu tag");
      return false;
    }
  };

  return {
    createTag,
    tagInfo,
    deletePetTag,
  };
};
