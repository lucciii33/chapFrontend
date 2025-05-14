import { showErrorToast, showSuccessToast } from "~/utils/toast";

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
}

export const PetTrackerContext = () => {
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

      showSuccessToast("Pet data successfully saved");
    } catch (error) {
      console.error(error);
      showErrorToast("Error saving pet data");
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
      showErrorToast("Error fetching pet data");
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

      showSuccessToast("Pet data successfully deleted");
    } catch (error) {
      console.error(error);
      showErrorToast("Error deleting pet data");
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

      showSuccessToast("Pet data successfully updated");
    } catch (error) {
      console.error(error);
      showErrorToast("Error updating pet data");
    }
  };

  return { createPetTrack, getPetTrack, deletePetTrack, editPetTrack };
};
