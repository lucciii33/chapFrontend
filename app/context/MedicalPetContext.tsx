import { useState } from "react";

type CreateMedicalHistory = {
  description: string;
};

type VetSession = {
  id: number;
  address: string;
  treatment: string;
  notes: string;
  cause: string;
  cost: number;
  medical_notes: string;
  medical_history_id: number;
};

type Vaccine = {
  id: number;
  name: string;
  date_administered: string;
};

type CreatePetMedicalHistoryResponse = {
  description: string;
  id: number;
  pet_id: number;
  vet_sessions: VetSession[];
  vaccines: Vaccine[];
};

export const useMedicalPetContext = () => {
  const getToken = (): string | null => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user.access_token;
    }
    return null;
  };

  const createMedicalHistory = async (
    petId: number,
    data: CreateMedicalHistory
  ): Promise<CreatePetMedicalHistoryResponse | null> => {
    const token = getToken();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/pets/${petId}/medical_history`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Error creating medical history");

      return await response.json();
    } catch (error) {
      console.error("Error creating medical history:", error);
      return null;
    }
  };

  const deleteMedicalHistory = async (
    medicalHistoryId: number
  ): Promise<boolean> => {
    const token = getToken();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/medical_history/${medicalHistoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error deleting medical history");

      return true;
    } catch (error) {
      console.error("Error deleting medical history:", error);
      return false;
    }
  };

  const editMedicalHistory = async (
    medicalHistoryId: number,
    data: CreateMedicalHistory
  ): Promise<CreatePetMedicalHistoryResponse | null> => {
    const token = getToken();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/medical_history/${medicalHistoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Error editing medical history");

      return await response.json();
    } catch (error) {
      console.error("Error editing medical history:", error);
      return null;
    }
  };

  return { createMedicalHistory, deleteMedicalHistory, editMedicalHistory };
};
