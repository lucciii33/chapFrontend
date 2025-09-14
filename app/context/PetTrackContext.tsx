import { showErrorToast, showInfoToast, showSuccessToast } from "~/utils/toast";
import { useTranslation } from "react-i18next";

export interface PetFormData {
  pet_id: number | "";
  urinated: boolean;
  pooped: boolean;
  poop_quality: string;
  mood: string;
  walked_minutes: number;
  played: boolean;
  food_consumed: number;
  water_consumed: number;
  vomited: boolean;
  coughing: boolean;
  lethargy: boolean;
  fever: boolean;
  medication_given: string;
  weight: number;
  sleep_hours: number;
  urine_color: string;
  scratching: boolean | null;
  hair_loss: boolean | null;
  seizures: boolean | null;
  eye_discharge: boolean | null;
  ear_discharge: boolean | null;
  limping: boolean | null;
}

export const PetTrackerContext = () => {
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

  const createPetTrack = async (data: PetFormData) => {
    const token = getToken();
    if (!token) {
      showErrorToast("User not authenticated");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/pet_tracker`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      showSuccessToast(t("diary.diary_saved"));
    } catch (error) {
      console.error(error);
      showErrorToast(t("diary.diary_save_error"));
    }
  };

  const getPetTrack = async (petId: number): Promise<PetFormData | null> => {
    const token = getToken();
    if (!token) {
      showErrorToast("User not authenticated");
      return null;
    }

    try {
      const response = await fetch(`${baseUrl}/api/pet_tracker/${petId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Network response was not ok");

      return await response.json();
    } catch (error) {
      showErrorToast(t("diary.diary_load_error"));
      console.error(error);
      return null;
    }
  };

  const deletePetTrack = async (trackerId: number) => {
    const token = getToken();
    if (!token) {
      showErrorToast("User not authenticated");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/pet_tracker/${trackerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Network response was not ok");

      showSuccessToast(t("diary.diary_deleted"));
    } catch (error) {
      console.error(error);
      showErrorToast(t("diary.diary_delete_error"));
    }
  };

  const editPetTrack = async (trackerId: number, data: PetFormData) => {
    const token = getToken();
    if (!token) {
      showErrorToast("User not authenticated");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/pet_tracker/${trackerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      showSuccessToast(t("diary.diary_updated"));
    } catch (error) {
      console.error(error);
      showErrorToast(t("diary.diary_update_error"));
    }
  };

  const getWeeklyActivity = async (petId: number) => {
    const token = getToken();
    if (!token) {
      showErrorToast("User not authenticated");
      return null;
    }

    try {
      const response = await fetch(
        `${baseUrl}/api/pets/${petId}/weekly_activity`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      return await response.json();
    } catch (error) {
      console.error(error);
      showErrorToast(t("diary.diary_load_error"));
      return null;
    }
  };

  const getLostDogArea = async (petId: number, address: string) => {
    const token = getToken();
    if (!token) {
      showErrorToast("User not authenticated");
      return null;
    }

    try {
      const response = await fetch(
        `${baseUrl}/api/pets/${petId}/lost_dog?address=${encodeURIComponent(
          address
        )}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.detail === "Pet weight not found in medical history") {
        showInfoToast(t("diary.add_weight_height_first"));
        return null;
      }
      return data;
    } catch (error) {
      showErrorToast("try again");
      return null;
    }
  };

  const getLastLostDogEvent = async (petId: number) => {
    try {
      const res = await fetch(`${baseUrl}/api/pets/${petId}/lost_dog/last`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error("Error fetching last lost dog event", err);
      return null;
    }
  };

  return {
    createPetTrack,
    getPetTrack,
    deletePetTrack,
    editPetTrack,
    getWeeklyActivity,
    getLostDogArea,
    getLastLostDogEvent,
  };
};
