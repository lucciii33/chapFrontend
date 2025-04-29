import { useEffect, useState } from "react";
import { PetTrackerContext } from "../context/PetTrackContext"; // Ajusta el path correcto aquí
import { useParams } from "@remix-run/react";
import { useGlobalContext } from "~/context/GlobalProvider";
import PetCalendar from "~/components/petCalendar";
import "../../styles/dashboard.css";

export default function PetTracker() {
  const { createPetTrack, getPetTrack } = PetTrackerContext();
  const { pet } = useGlobalContext();
  const { getPetById, petByID, editPet } = pet;
  const { petId } = useParams();
  console.log("petByIDINTRACK", petByID);

  useEffect(() => {
    if (petId) {
      getPetById(petId);
    }
  }, []);

  const [formData, setFormData] = useState<PetFormData>({
    pet_id: petId ? petId : null,
    urinated: false,
    pooped: false,
    poop_quality: "",
    mood: "",
    walked_minutes: 0,
    played: false,
    food_consumed: 0,
    water_consumed: 0,
    vomited: false,
    coughing: false,
    lethargy: false,
    fever: false,
    medication_given: "",
    weight: 0,
    sleep_hours: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : [
              "walked_minutes",
              "food_consumed",
              "water_consumed",
              "weight",
              "sleep_hours",
            ].includes(name)
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleSubmit = async () => {
    if (formData.pet_id === "") {
      alert("Pet ID is required");
      return;
    }
    await createPetTrack(formData);
  };

  return (
    <div className="p-5">
      <h2>Track your pet</h2>

      <div className="flex flex-col md:flex-row gap-3 mt-3 mb-3">
        <div className="w-full">
          <label className="block text-slate-50">Poop Quality</label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Poop Quality"
            name="poop_quality"
            value={formData.poop_quality}
            onChange={handleChange}
          />
        </div>
        <div className="w-full">
          <label className="block text-slate-50">Mood</label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Mood"
            name="mood"
            value={formData.mood}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="w-full">
          <label className="block text-slate-50">Walked Minutes</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-lg"
            name="walked_minutes"
            value={formData.walked_minutes}
            onChange={handleChange}
          />
        </div>
        <div className="w-full">
          <label className="block text-slate-50">Food Consumed</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-lg"
            name="food_consumed"
            value={formData.food_consumed}
            onChange={handleChange}
          />
        </div>
        <div className="w-full">
          <label className="block text-slate-50">Water Consumed</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-lg"
            name="water_consumed"
            value={formData.water_consumed}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mt-3 mb-3">
        <div className="w-full">
          <label className="block text-slate-50">Medication Given</label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            name="medication_given"
            value={formData.medication_given}
            onChange={handleChange}
          />
        </div>
        <div className="w-full">
          <label className="block text-slate-50">Weight</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-lg"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
          />
        </div>
        <div className="w-full">
          <label className="block text-slate-50">Sleep Hours</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-lg"
            name="sleep_hours"
            value={formData.sleep_hours}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3 mt-3">
        {[
          "urinated",
          "pooped",
          "played",
          "vomited",
          "coughing",
          "lethargy",
          "fever",
        ].map((field) => (
          <div key={field}>
            <label>{field}</label>
            <input
              type="checkbox"
              name={field}
              className="radio radio-accent"
              checked={(formData as any)[field]}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>

      <div className="mt-2">
        <button
          className="border-none py-3 px-4 bg-teal-500 text-white rounded-lg"
          onClick={handleSubmit}
        >
          Submit Pet Data
        </button>
      </div>

      <PetCalendar trackers={petByID?.trackers} />
    </div>
  );
}
