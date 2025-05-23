import { useEffect, useState } from "react";
import { PetTrackerContext } from "../context/PetTrackContext"; // Ajusta el path correcto aquí
import { useParams } from "@remix-run/react";
import { useGlobalContext } from "~/context/GlobalProvider";
import PetCalendar from "~/components/petCalendar";
import "../../styles/dashboard.css";

export default function PetTracker() {
  const { createPetTrack, getPetTrack, deletePetTrack, editPetTrack } =
    PetTrackerContext();
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
          ? Number(value.replace(/^0+(?=\d)/, "")) || "" // 🧠 elimina ceros al inicio
          : value,
    }));
  };

  const handleSubmit = async () => {
    if (formData.pet_id === "") {
      alert("Pet ID is required");
      return;
    }
    await createPetTrack(formData);
    await getPetById(petId);
  };

  const symptomLabels: Record<string, string> = {
    urinated: "Orinó",
    pooped: "Defecó",
    played: "Jugó",
    vomited: "Vomito",
    coughing: "Tos",
    lethargy: "Letargo",
    fever: "Fiebre",
  };

  return (
    <div className="p-5">
      <h2>Track your pet</h2>

      <div className="flex flex-col md:flex-row gap-3 mt-3 mb-3">
        <div className="w-full">
          <label className="block text-slate-50">Estado de Animo</label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Estado de Animo"
            name="mood"
            value={formData.mood}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="w-full">
          <label className="block text-slate-50">Minutos caminados</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-lg"
            name="walked_minutes"
            value={formData.walked_minutes}
            onChange={handleChange}
          />
        </div>
        <div className="w-full">
          <label className="block text-slate-50">Comida consumida(g)</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-lg"
            name="food_consumed"
            value={formData.food_consumed}
            onChange={handleChange}
          />
        </div>
        <div className="w-full">
          <label className="block text-slate-50">Calidad de las heces</label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="heces"
            name="poop_quality"
            value={formData.poop_quality}
            onChange={handleChange}
          />
        </div>
        <div className="w-full">
          <label className="block text-slate-50">Agua consumida(ml)</label>
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
          <label className="block text-slate-50">Medicamentos tomados</label>
          <input
            className="w-full px-4 py-2 border rounded-lg"
            name="medication_given"
            value={formData.medication_given}
            onChange={handleChange}
          />
        </div>
        <div className="w-full">
          <label className="block text-slate-50">Peso</label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded-lg"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
          />
        </div>
        <div className="w-full">
          <label className="block text-slate-50">Horas de sueño</label>
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
            <label>{symptomLabels[field]}</label>
            <input
              type="checkbox"
              name={field}
              className="radio radio-accent ms-4"
              checked={(formData as any)[field]}
              onChange={handleChange}
            />
          </div>
        ))}
      </div>

      <div className="mt-2">
        <button
          className="w-full md:w-auto border-none py-3 px-4 bg-teal-500 text-white rounded-lg"
          onClick={handleSubmit}
        >
          Submit Pet Data
        </button>
      </div>

      <PetCalendar
        trackers={petByID?.trackers}
        onDelete={async (id) => {
          await deletePetTrack(id); // llama al context
          await getPetById(petId); // recarga los datos
        }}
        onEdit={async (id, updatedData) => {
          await editPetTrack(id, updatedData);
          await getPetById(petId);
        }}
      />
    </div>
  );
}
