import { useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "~/utils/toast";

export default function ScheduleAlertForm({
  userId,
  petId,
  t,
}: {
  userId: number;
  petId: number;
  t: (key: string) => string;
}) {
  const [alertData, setAlertData] = useState({
    phone_number: "",
    message: "",
    scheduled_date: "",
    email: "",
    pet_id: petId.id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAlertData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const storedUser = localStorage.getItem("user");
      const token = storedUser ? JSON.parse(storedUser).access_token : null;

      if (!token) {
        showErrorToast("User not authenticated");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_URL}/api/users/${userId}/alert`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            phone_number: alertData.phone_number,
            message: alertData.message,
            scheduled_date: alertData.scheduled_date,
            email: alertData.email,
            pet_id: alertData.pet_id,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || "Error scheduling alert");
      }

      showSuccessToast(t("alerts_toast.alert_scheduled"));
      document.getElementById("my_modal_5_pet_id_alerts").close();

      setAlertData({
        phone_number: "",
        message: "",
        scheduled_date: "",
        email: "",
        pet_id: petId.id, // reset
      });
    } catch (error) {
      console.error(error);
      showErrorToast(t("alerts_toast.alert_schedule_error"));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        {/* <div className="">
          <label className="block text-slate-700 mb-2">Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={alertData.phone_number}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="+34600111222"
            required
          />
        </div> */}
        <div className="mb-4">
          {/* <label className="block text-slate-700 mb-2">
            esta alerta sera para {petId.name}
          </label> */}
          {/* <select
            name="pet_id"
            value={alertData.pet_id}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            required
          >
            <option value="" disabled>
              -- Selecciona una mascota --
            </option>
            {userPets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name}
              </option>
            ))}
          </select> */}
        </div>

        {/* <div className="">
          <label className="block text-slate-700 mb-2">
            {t("create_alerts.email")}
          </label>
          <input
            type="text"
            name="email"
            value={alertData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder={t("create_alerts.email")}
            required
          />
        </div> */}
      </div>

      <div className="mb-4">
        <label className="block text-slate-700 mb-2">
          {t("create_alerts.message")}
        </label>
        <input
          type="text"
          name="message"
          value={alertData.message}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          placeholder={t("create_alerts.message")}
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-slate-700 mb-2">
          {t("create_alerts.schedule_button")}
        </label>
        <input
          type="datetime-local"
          name="scheduled_date"
          value={alertData.scheduled_date}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
          required
        />
      </div>

      <button
        type="submit"
        className=" border-none py-3 px-4 bg-teal-500 text-white rounded-lg w-full"
      >
        {t("create_alerts.schedule_button")}
      </button>
    </form>
  );
}
