import { useState } from "react";
import { showErrorToast, showSuccessToast } from "~/utils/toast";

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
      showSuccessToast("Tu hsitorial medico ha sido creada con exito");
      return await response.json();
    } catch (error) {
      console.error("Error creating medical history:", error);
      showErrorToast("Tu hsitorial medico no pudo ser creado");
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
      showSuccessToast("Tu hsitorial medico ha sido eliminada con exito");
      return true;
    } catch (error) {
      console.error("Error deleting medical history:", error);
      showErrorToast("Tu hsitorial medico no pudo ser eliminado");
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
      showSuccessToast("Tu hsitorial medico ha sido editado con exito");
      return await response.json();
    } catch (error) {
      console.error("Error editing medical history:", error);
      showErrorToast("Tu hsitorial medico no pudo ser editado");

      return null;
    }
  };

  // const createVetSession = async (
  //   medicalHistoryId: number,
  //   data: VetSession
  // ): Promise<VetSession | null> => {
  //   const token = getToken();
  //   try {
  //     const response = await fetch(
  //       `http://127.0.0.1:8000/api/medical_history/${medicalHistoryId}/vet`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify(data),
  //       }
  //     );

  //     if (!response.ok) throw new Error("Error creating medical history");
  //     showSuccessToast("Tu visita al veterinario ha sido creada con exito");
  //     return await response.json();
  //   } catch (error) {
  //     showErrorToast("no pudimos crear tu visita al veterinario");
  //     console.error("Error creating medical history:", error);
  //     return null;
  //   }
  // };

  const createVetSession = async (
    medicalHistoryId: number,
    data: VetSession
  ): Promise<VetSession | null> => {
    const token = getToken();

    // Convertir datos a FormData
    const formData = new FormData();
    formData.append("address", data.address || "");
    formData.append("treatment", data.treatment || "");
    formData.append("notes", data.notes || "");
    formData.append("cause", data.cause || "");
    formData.append("cost", data.cost ? String(data.cost) : "");
    formData.append("medical_notes", data.medical_notes || "");

    // Agregar archivos a FormData
    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/medical_history/${medicalHistoryId}/vet`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // ❌ NO pongas "Content-Type": "application/json"
          },
          body: formData, // ✅ Enviar como FormData
        }
      );

      if (!response.ok) throw new Error("Error creando la sesión veterinaria");
      showSuccessToast("Tu visita al veterinario ha sido creada con éxito");
      return await response.json();
    } catch (error) {
      showErrorToast("No pudimos crear tu visita al veterinario");
      console.error("Error creando sesión veterinaria:", error);
      return null;
    }
  };

  const editVetSession = async (
    vetId: number,
    data: VetSession
  ): Promise<VetSession | null> => {
    const token = getToken();

    // Convertir datos a FormData
    const formData = new FormData();
    formData.append("address", data.address || "");
    formData.append("treatment", data.treatment || "");
    formData.append("notes", data.notes || "");
    formData.append("cause", data.cause || "");
    formData.append("cost", data.cost ? String(data.cost) : "");
    formData.append("medical_notes", data.medical_notes || "");

    // Agregar archivos a FormData si existen
    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/vet/${data.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // No poner "Content-Type"
        },
        body: formData, // Enviar como FormData
      });

      if (!response.ok) throw new Error("Error editando la sesión veterinaria");
      showSuccessToast("Tu visita al veterinario ha sido editada con éxito");
      return await response.json();
    } catch (error) {
      console.error("Error editando sesión veterinaria:", error);
      showErrorToast("No pudimos editar tu visita al veterinario");
      return null;
    }
  };

  const deleteVetSession = async (
    vetId: number
  ): Promise<VetSession | null> => {
    const token = getToken();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/vet/${vetId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error creating medical history");
      showSuccessToast("Tu visita al veterinario ha sido eliminada con exito");
      return await response.json();
    } catch (error) {
      console.error("Error creating medical history:", error);
      showErrorToast("no pudimos eliminar tu visita al veterinario");
      return null;
    }
  };

  const deleteVetDocument = async (
    vetId: number,
    documentId: number
  ): Promise<boolean> => {
    const token = getToken();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/vet/${vetId}/document/${documentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error eliminando el documento");
      showSuccessToast("El documento ha sido eliminado con éxito");
      return true;
    } catch (error) {
      console.error("Error eliminando el documento:", error);
      showErrorToast("No pudimos eliminar el documento");
      return false;
    }
  };

  return {
    createMedicalHistory,
    deleteMedicalHistory,
    editMedicalHistory,
    createVetSession,
    deleteVetSession,
    editVetSession,
    deleteVetDocument,
  };
};
