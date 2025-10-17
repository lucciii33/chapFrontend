import { useState } from "react";
import { showErrorToast, showSuccessToast } from "~/utils/toast";
import { useTranslation } from "react-i18next";

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
  date: string;
};

type CreatePetMedicalHistoryResponse = {
  description: string;
  id: number;
  pet_id: number;
  vet_sessions: VetSession[];
  vaccines: Vaccine[];
};

type Vaccine = {
  name: string;
  vaccine_type: string;
  date_administered: string; // o Date si prefieres usar objetos Date
  expiration_date: string; // o Date si prefieres usar objetos Date
};

type VaccineResponse = {
  id: number; // ID único de la vacuna
  name: string;
  vaccine_type: string;
  date_administered: string; // Puede ser Date si prefieres manejarlo así
  expiration_date: string; // Puede ser Date si prefieres manejarlo así
};
const baseUrl = import.meta.env.VITE_REACT_APP_URL;

export const useMedicalPetContext = () => {
  const { t } = useTranslation();
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
        `${baseUrl}/api/pets/${petId}/medical_history`,
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
      showSuccessToast(t("context_pet_med.medical_history_created"));
      return await response.json();
    } catch (error) {
      console.error("Error creating medical history:", error);
      showErrorToast(t("context_pet_med.medical_history_create_error"));
      return null;
    }
  };

  const deleteMedicalHistory = async (
    medicalHistoryId: number
  ): Promise<boolean> => {
    const token = getToken();
    try {
      const response = await fetch(
        `${baseUrl}/api/medical_history/${medicalHistoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error deleting medical history");
      showSuccessToast(t("context_pet_med.medical_history_deleted"));
      return true;
    } catch (error) {
      console.error("Error deleting medical history:", error);
      showErrorToast(t("context_pet_med.medical_history_delete_error"));
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
        `${baseUrl}/api/medical_history/${medicalHistoryId}`,
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
      showSuccessToast(t("context_pet_med.medical_history_updated"));
      return await response.json();
    } catch (error) {
      console.error("Error editing medical history:", error);
      showErrorToast(t("context_pet_med.medical_history_update_error"));

      return null;
    }
  };

  const createVetSession = async (
    medicalHistoryId: number,
    data: VetSession
  ): Promise<VetSession | null> => {
    const token = getToken();

    const formData = new FormData();
    formData.append("address", data.address || "");
    formData.append("treatment", data.treatment || "");
    formData.append("notes", data.notes || "");
    formData.append("cause", data.cause || "");
    formData.append("medical_notes", data.medical_notes || "");
    if (data.cost !== undefined && data.cost !== null && data.cost !== "") {
      formData.append("cost", String(data.cost));
    }

    if (data.date) {
      formData.append("date", data.date);
    }

    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    try {
      const response = await fetch(
        `${baseUrl}/api/medical_history/${medicalHistoryId}/vet`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`, // ❌ NO pongas "Content-Type": "application/json"
          },
          body: formData, // ✅ Enviar como FormData
        }
      );

      if (!response.ok) throw new Error("Error creando la sesión veterinaria");
      showSuccessToast(t("context_pet_med.vet_visit_created"));
      return await response.json();
    } catch (error) {
      showErrorToast(t("context_pet_med.vet_visit_create_error"));
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
    formData.append("cost", data.cost ? String(data.cost) : 0);
    formData.append("medical_notes", data.medical_notes || "");
    formData.append("date", data.date || "");

    // Agregar archivos a FormData si existen
    if (data.files && data.files.length > 0) {
      data.files.forEach((file) => {
        formData.append("files", file);
      });
    }

    try {
      const response = await fetch(`${baseUrl}/api/vet/${data.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // No poner "Content-Type"
        },
        body: formData, // Enviar como FormData
      });

      if (!response.ok) throw new Error("Error editando la sesión veterinaria");
      showSuccessToast(t("context_pet_med.vet_visit_updated"));
      return await response.json();
    } catch (error) {
      console.error("Error editando sesión veterinaria:", error);
      showErrorToast(t("context_pet_med.vet_visit_update_error"));
      return null;
    }
  };

  const deleteVetSession = async (
    vetId: number
  ): Promise<VetSession | null> => {
    const token = getToken();
    try {
      const response = await fetch(`${baseUrl}/api/vet/${vetId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error creating medical history");
      showSuccessToast(t("context_pet_med.vet_visit_deleted"));
      return await response.json();
    } catch (error) {
      console.error("Error creating medical history:", error);
      showErrorToast("context_pet_med.vet_visit_delete_error");
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
        `${baseUrl}/api/vet/${vetId}/document/${documentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error eliminando el documento");
      showSuccessToast(t("context_pet_med.document_deleted"));
      return true;
    } catch (error) {
      console.error("Error eliminando el documento:", error);
      showErrorToast(t("context_pet_med.document_delete_error"));
      return false;
    }
  };

  const createVaccine = async (
    medicalHisotryId: number,
    data: Vaccine
  ): Promise<VaccineResponse | null> => {
    const token = getToken();
    try {
      const response = await fetch(
        `${baseUrl}/api/medical_history/${medicalHisotryId}/vaccines`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok)
        throw new Error("Error creating medical history VACCINE");
      showSuccessToast(t("context_pet_med.vaccine_created"));
      return await response.json();
    } catch (error) {
      console.error("Error creating medical history:", error);
      showErrorToast(t("context_pet_med.vaccine_create_error"));
      return null;
    }
  };

  const deleteVetVaccine = async (
    vaccineId: number,
    medicalHisotryId: number
  ): Promise<boolean> => {
    const token = getToken();
    try {
      const response = await fetch(
        `${baseUrl}/api/medical_history/${medicalHisotryId}/delete/${vaccineId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Error eliminando el documento");
      showSuccessToast(t("context_pet_med.vaccine_deleted"));
      return true;
    } catch (error) {
      console.error("Error eliminando el documento:", error);
      showErrorToast(t("context_pet_med.vaccine_delete_error"));
      return false;
    }
  };

  const editVaccine = async (
    vaccineId: number,
    medicalHisotryId: number,
    data: Vaccine
  ): Promise<VaccineResponse | null> => {
    const token = getToken();
    try {
      const response = await fetch(
        `${baseUrl}/api/medical_history/${medicalHisotryId}/edit/${vaccineId}`,
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
      showSuccessToast("Tu vacuna sido editado con exito");
      return await response.json();
    } catch (error) {
      console.error("Error editing medical history:", error);
      showErrorToast("Tu vacuna no pudo ser editado");

      return null;
    }
  };

  const sendVetVisits = async (petId: number, doctorEmail: string) => {
    const token = getToken();
    try {
      const response = await fetch(`${baseUrl}/api/send_vet_visits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pet_id: petId,
          doctor_email: doctorEmail,
        }),
      });

      if (!response.ok) throw new Error("Error enviando historial veterinario");
      showSuccessToast(t("send_vet_visit.toast_success"));
    } catch (error) {
      console.error(error);
      showErrorToast(t("send_vet_visit.toast_error"));
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
    deleteVetVaccine,
    createVaccine,
    editVaccine,
    sendVetVisits,
  };
};
