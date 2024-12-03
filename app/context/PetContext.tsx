import { useState } from "react";

type Pet = {
  name: string;
  age: number; // Cambiado de string a number
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
  const [petProfile, setPetProfile] = useState<Pet | null>(null);
  const [allPets, setAllPets] = useState<CreatePetResponse[]>([]);
  const [petByID, setPetByID] = useState<CreatePetResponse>();

  // Función para manejar la creación de una nueva mascota
  const createPet = async (
    userId: number,
    petData: Pet
  ): Promise<CreatePetResponse | null> => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/pets`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(petData), // Aquí pasamos los datos de la mascota
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
      const response = await fetch(
        `http://127.0.0.1:8000/api/users/${userId}/pets`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
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
      const response = await fetch(`http://127.0.0.1:8000/api/pets/${petId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
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
      const response = await fetch(
        `http://127.0.0.1:8000/api/pets/${petId}/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
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
      const response = await fetch(
        `http://127.0.0.1:8000/api/pets/${petId}/edit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
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
