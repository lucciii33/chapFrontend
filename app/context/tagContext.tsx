import { useState } from "react";

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
      const response = await fetch(
        `http://127.0.0.1:8000/api/tag/${petId}/pets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Añadimos el token aquí
          },
          body: JSON.stringify(tagData), // Aquí pasamos los datos de la mascota
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear la mascota");
      }

      const responseData: CreateTagResponse = await response.json();
      setTagInfo(responseData); // Guardamos la mascota creada en el estado
      return responseData;
    } catch (error) {
      console.error("Error al crear la mascota:", error);
      return null;
    }
  };

  //   const getPets = async (userId: number): Promise<CreatePetResponse | null> => {
  //     try {
  //       const response = await fetch(
  //         `http://127.0.0.1:8000/api/users/${userId}/pets`,
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error("Error al crear la mascota");
  //       }

  //       const responseData: CreatePetResponse[] = await response.json();
  //       setAllPets(responseData); // Guardamos la mascota creada en el estado
  //       return responseData;
  //     } catch (error) {
  //       console.error("Error al crear la mascota:", error);
  //       return null;
  //     }
  //   };

  //   const getPetById = async (
  //     petId: number
  //   ): Promise<CreatePetResponse | null> => {
  //     try {
  //       const response = await fetch(`http://127.0.0.1:8000/api/pets/${petId}`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error("Error al crear la mascota");
  //       }

  //       const responseData: CreatePetResponse = await response.json();
  //       setPetByID(responseData); // Guardamos la mascota creada en el estado
  //       return responseData;
  //     } catch (error) {
  //       console.error("Error al crear la mascota:", error);
  //       return null;
  //     }
  //   };

  //   const deletePetById = async (
  //     petId: number
  //   ): Promise<CreatePetResponse | null> => {
  //     try {
  //       const response = await fetch(
  //         `http://127.0.0.1:8000/api/pets/${petId}/delete`,
  //         {
  //           method: "DELETE",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error("Error al crear la mascota");
  //       }

  //       const responseData: CreatePetResponse = await response.json();
  //       setPetByID(responseData); // Guardamos la mascota creada en el estado
  //       return responseData;
  //     } catch (error) {
  //       console.error("Error al crear la mascota:", error);
  //       return null;
  //     }
  //   };

  //   const editPet = async (
  //     petId: number,
  //     petData: Pet
  //   ): Promise<CreatePetResponse | null> => {
  //     try {
  //       const response = await fetch(
  //         `http://127.0.0.1:8000/api/pets/${petId}/edit`,
  //         {
  //           method: "PUT",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify(petData), // Aquí pasamos los datos de la mascota
  //         }
  //       );

  //       if (!response.ok) {
  //         throw new Error("Error al crear la mascota");
  //       }

  //       const responseData: CreatePetResponse = await response.json();
  //       // setPetProfile(responseData); // Guardamos la mascota creada en el estado
  //       return responseData;
  //     } catch (error) {
  //       console.error("Error al crear la mascota:", error);
  //       return null;
  //     }
  //   };

  return {
    createTag,
    tagInfo,
  };
};
