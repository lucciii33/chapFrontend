import { useState } from "react";
import { showErrorToast, showSuccessToast } from "~/utils/toast";

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
      showSuccessToast("Tu tag ha sido creado con exito");
      return responseData;
    } catch (error) {
      console.error("Error al crear la mascota:", error);
      showErrorToast("Error al crear el tag");
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
