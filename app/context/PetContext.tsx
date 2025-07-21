import { useState } from "react";
import { showErrorToast, showSuccessToast } from "~/utils/toast";
import { useTranslation } from "react-i18next";

type Pet = {
  name: string;
  age: number; // Cambiado de string a number
  personality: string;
  address: string;
  phone_number: number; // Cambiado de string a number
  phone_number_optional: number | null; // Cambiado de string a number
  profile_photo: File | null;
  pet_color: string;
  breed: string;
  lost: boolean;
  vet_address: string;
  neighbourhood: string;
  mom_name: string;
  dad_name: string;
  chip_number: number;
};

type CreatePetResponse = {
  id: number;
  name: string;
  age: number;
  personality: string;
  address: string;
  phone_number: number; // Cambiado de string a number
  phone_number_optional: number | null; // Cambiado de string a number
  profile_photo: string;
  pet_color: string;
  breed: string;
  lost: boolean;
  vet_address: string;
  neighbourhood: string;
  mom_name: string;
  dad_name: string;
  chip_number: number; // Cambiado de string a number
  user_id: number;
};

export const usePetContext = () => {
  const baseUrl = import.meta.env.VITE_REACT_APP_URL;
  const { t } = useTranslation();

  const [petProfile, setPetProfile] = useState<CreatePetResponse | null>(null);
  const [allPets, setAllPets] = useState<CreatePetResponse[]>([]);
  const [petByID, setPetByID] = useState<CreatePetResponse>();

  const getToken = (): string | null => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.access_token; // Obtener el token del almacenamiento local
    }
    return null;
  };

  // Función para manejar la creación de una nueva mascota
  const createPet = async (
    userId: number,
    petData: Pet
  ): Promise<CreatePetResponse | null> => {
    console.log("petData", petData);
    try {
      const formData = new FormData();
      if (petData.profile_photo) {
        formData.append("profile_photo", petData.profile_photo); // Solo si existe
      }
      const { profile_photo, ...petDataWithoutFile } = petData;
      formData.append("pet", JSON.stringify(petDataWithoutFile));
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");

      console.log("formDataformDataformData", formData);

      const response = await fetch(`${baseUrl}/api/users/${userId}/pets`, {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Añadimos el token aquí
        },
        body: formData, // Aquí pasamos los datos de la mascota
      });

      if (!response.ok) {
        throw new Error("Error al crear la mascota");
      }

      const responseData: CreatePetResponse = await response.json();
      setPetProfile(responseData); // Guardamos la mascota creada en el estado
      showSuccessToast(t("dashboard_toast.pet_created"));
      return responseData;
    } catch (error) {
      console.error("Error al crear la mascota:", error);
      showErrorToast(t("dashboard_toast.error_pet_creation"));
      return null;
    }
  };

  const getPets = async (userId: number): Promise<CreatePetResponse | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(`${baseUrl}/api/users/${userId}/pets`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Añadimos el token aquí
        },
      });

      if (!response.ok) {
        throw new Error("Error al crear la mascota");
      }

      const responseData: CreatePetResponse[] = await response.json();
      setAllPets(responseData); // Guardamos la mascota creada en el estado
      return responseData;
    } catch (error) {
      console.error("Error al crear la mascota:", error);
      return null;
    }
  };

  const getPetById = async (
    petId: number
  ): Promise<CreatePetResponse | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(`${baseUrl}/api/pets/${petId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Añadimos el token aquí
        },
      });

      if (!response.ok) {
        throw new Error("Error al crear la mascota");
      }

      const responseData: CreatePetResponse = await response.json();
      setPetByID(responseData); // Guardamos la mascota creada en el estado
      return responseData;
    } catch (error) {
      console.error("Error al crear la mascota:", error);
      return null;
    }
  };

  const deletePetById = async (
    petId: number
  ): Promise<CreatePetResponse | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(`${baseUrl}/api/pets/${petId}/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Añadimos el token aquí
        },
      });

      if (!response.ok) {
        throw new Error("Error al crear la mascota");
      }

      const responseData: CreatePetResponse = await response.json();
      setPetByID(responseData); // Guardamos la mascota creada en el estado
      showSuccessToast("Tu mascota ha sido eliminada con exito");
      return responseData;
    } catch (error) {
      console.error("Error al crear la mascota:", error);
      showErrorToast("Error al eliminar la mascota");
      return null;
    }
  };

  // const editPet = async (
  //   petId: number,
  //   petData: Pet
  // ): Promise<CreatePetResponse | null> => {
  //   try {
  //     const token = getToken();
  //     if (!token) throw new Error("Usuario no autenticado");
  //     const response = await fetch(
  //       `http://127.0.0.1:8000/api/pets/${petId}/edit`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`, // Añadimos el token aquí
  //         },
  //         body: JSON.stringify(petData), // Aquí pasamos los datos de la mascota
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Error al crear la mascota");
  //     }

  //     const responseData: CreatePetResponse = await response.json();
  //     // setPetProfile(responseData); // Guardamos la mascota creada en el estado
  //     return responseData;
  //   } catch (error) {
  //     console.error("Error al crear la mascota:", error);
  //     return null;
  //   }
  // };

  // const editPet = async (
  //   petId: number,
  //   petData: Pet // Recibe el objeto `Pet` como argumento
  // ): Promise<CreatePetResponse | null> => {
  //   try {
  //     const token = getToken();
  //     if (!token) throw new Error("Usuario no autenticado");

  //     // Crear FormData
  //     const formData = new FormData();
  //     if (petData.profile_photo) {
  //       formData.append("profile_photo", petData.profile_photo); // Agrega el archivo de foto
  //     }
  //     const { profile_photo, ...petDataWithoutFile } = petData;
  //     formData.append("pet_update", JSON.stringify(petDataWithoutFile)); // Agrega los demás datos

  //     // Hacer el fetch
  //     const response = await fetch(
  //       `http://127.0.0.1:8000/api/pets/${petId}/edit`,
  //       {
  //         method: "PUT",
  //         headers: {
  //           Authorization: `Bearer ${token}`, // Agregar token
  //         },
  //         body: formData, // Enviar FormData como body
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Error al editar la mascota");
  //     }

  //     const responseData: CreatePetResponse = await response.json();
  //     return responseData; // Devuelve la respuesta
  //   } catch (error) {
  //     console.error("Error al editar la mascota:", error);
  //     return null;
  //   }
  // };

  const editPet = async (
    petId: number,
    petData: Pet
  ): Promise<CreatePetResponse | null> => {
    try {
      console.log("petDatapetData", petData);
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");

      // ✅ Crear FormData
      const formData = new FormData();

      // ✅ SOLO si es un archivo, se agrega al formData
      if (petData.profile_photo instanceof File) {
        formData.append("profile_photo", petData.profile_photo);
      }

      // ✅ Agregar pet_update como string JSON
      const { profile_photo, ...petDataWithoutFile } = petData;
      formData.append("pet_update", JSON.stringify(petDataWithoutFile));

      // ✅ Hacer el fetch
      const response = await fetch(`${baseUrl}/api/pets/${petId}/edit`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // Solo el token, sin Content-Type aquí
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData); // ✅ Ve el error real del backend
        throw new Error("Error al editar la mascota");
      }

      const responseData: CreatePetResponse = await response.json();
      showSuccessToast("Tu mascota ha sido editada con exito");
      return responseData;
    } catch (error) {
      console.error("Error al editar la mascota:", error);
      showErrorToast("Error al editar la mascota");
      return null;
    }
  };
  return {
    petProfile,
    createPet,
    getPets,
    allPets,
    getPetById,
    petByID,
    deletePetById,
    editPet,
  };
};
