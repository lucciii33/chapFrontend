import { useState } from "react";

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

      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/pets`,
        {
          method: "POST",
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Añadimos el token aquí
          },
          body: formData, // Aquí pasamos los datos de la mascota
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear la mascota");
      }

      const responseData: CreatePetResponse = await response.json();
      setPetProfile(responseData); // Guardamos la mascota creada en el estado
      return responseData;
    } catch (error) {
      console.error("Error al crear la mascota:", error);
      return null;
    }
  };

  const getPets = async (userId: number): Promise<CreatePetResponse | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/pets`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Añadimos el token aquí
          },
        }
      );

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
      const response = await fetch(`http://127.0.0.1:8000/api/pets/${petId}`, {
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
      const response = await fetch(
        `http://127.0.0.1:8000/api/pets/${petId}/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Añadimos el token aquí
          },
        }
      );

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

  const editPet = async (
    petId: number,
    petData: Pet
  ): Promise<CreatePetResponse | null> => {
    try {
      const token = getToken();
      if (!token) throw new Error("Usuario no autenticado");
      const response = await fetch(
        `http://127.0.0.1:8000/api/pets/${petId}/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Añadimos el token aquí
          },
          body: JSON.stringify(petData), // Aquí pasamos los datos de la mascota
        }
      );

      if (!response.ok) {
        throw new Error("Error al crear la mascota");
      }

      const responseData: CreatePetResponse = await response.json();
      // setPetProfile(responseData); // Guardamos la mascota creada en el estado
      return responseData;
    } catch (error) {
      console.error("Error al crear la mascota:", error);
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
