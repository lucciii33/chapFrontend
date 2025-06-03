import { useEffect, useState } from "react";
import { PetTrackerContext } from "../context/PetTrackContext"; // Ajusta el path correcto aquí
import { useParams } from "@remix-run/react";
import { useGlobalContext } from "~/context/GlobalProvider";
import PetCalendar from "~/components/petCalendar";
import "../../styles/dashboard.css";
import {
  FireIcon,
  BoltIcon,
  BeakerIcon,
  AdjustmentsVerticalIcon,
  CakeIcon,
} from "@heroicons/react/24/solid";
import { Bars3Icon } from "@heroicons/react/24/solid";

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

  console.log("petByID", petByID);

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

  const weightKg = petByID?.medical_history?.[0]?.weight ?? 0;
  const breed = petByID?.breed ?? "";
  const kcalPerGram = 3.5;

  const calories = weightKg
    ? Math.round(95 * Math.pow(weightKg, 0.75) * 1.5)
    : 0;
  const gramsOfFood = weightKg ? Math.round(calories / kcalPerGram) : 0;

  // Recomendación de minutos de caminata por peso
  const recommendedMinutes = weightKg < 10 ? 30 : weightKg < 25 ? 45 : 60;
  const estimatedCaloriesBurned = Math.round(
    (recommendedMinutes / 60) * weightKg * 4
  );
  const waterMl = Math.round(weightKg * 55);

  return (
    <div className="p-5">
      <div className="border-2 border-gray-700 bg-gray-800 rounded-lg p-5 mt-5">
        <h2
          className="text-1xl lg:text-2xl font-bold text-white"
          style={{ fontFamily: "chapFont" }}
        >
          Tips for{petByID?.name} !
        </h2>
        <div className="flex items-center justify-between flex-col md:flex-row gap-2 mt-4">
          <div className="border-2 border-teal-500 bg-gray-800 h-auto md:h-[7rem] w-full rounded p-3">
            <div className="flex gap-2">
              <span>
                <CakeIcon className="text-teal-500 w-6 h-6" />
              </span>
              <p className="text-sm font-semibold text-white">Alimentación</p>
            </div>

            {weightKg ? (
              <p className="text-xs mt-1 leading-tight text-white">
                {petByID.name} necesita entre{" "}
                <strong>
                  {Math.round(95 * Math.pow(weightKg, 0.75) * 1.2)} y{" "}
                  {Math.round(95 * Math.pow(weightKg, 0.75) * 1.5)} kcal/día
                </strong>
                , dependiendo de su actividad. <br />
                Eso equivale a aprox.{" "}
                <strong>
                  {Math.round((95 * Math.pow(weightKg, 0.75) * 1.2) / 3.8)}g –{" "}
                  {Math.round((95 * Math.pow(weightKg, 0.75) * 1.5) / 3.8)}g
                </strong>{" "}
                de perrarina estándar (3.8 kcal/g).
              </p>
            ) : (
              <p className="text-xs mt-1">
                Agrega el peso en el medical history para obtener informacion
                utilpara tu mascota
              </p>
            )}
          </div>

          <div className="border-2 border-teal-500 bg-gray-800 h-auto md:h-[7rem] w-full rounded p-3">
            <div className="flex gap-2">
              <span>
                <BoltIcon className="w-6 h-6 text-teal-500" />{" "}
              </span>
              <p className="text-sm font-semibold text-white">
                Actividad diaria
              </p>
            </div>
            {weightKg ? (
              <p className="text-xs mt-1 text-white">
                {recommendedMinutes
                  ? `Debe caminar ~${recommendedMinutes} min/día`
                  : "Cargando..."}
              </p>
            ) : (
              <p className="text-xs mt-1">
                Agrega el peso en el medical history para obtener informacion
                utilpara tu mascota
              </p>
            )}
          </div>

          <div className="border-2 border-teal-500 bg-gray-800 h-auto md:h-[7rem] w-full rounded p-3">
            <div className="flex gap-2">
              <span>
                <BeakerIcon className="w-6 h-6 text-teal-500" />{" "}
              </span>
              <p className="text-sm font-semibold text-white">
                Agua recomendada
              </p>
            </div>
            {weightKg ? (
              <p className="text-xs mt-1 text-white">
                {petByID.name} debería beber aproximadamente {waterMl} ml de
                agua al día (55ml por kg)`
              </p>
            ) : (
              <p className="text-xs mt-1">
                Agrega el peso en el medical history para obtener informacion
                utilpara tu mascota
              </p>
            )}
          </div>

          <div className="border-2 border-teal-500 bg-gray-800 h-auto md:h-[7rem] w-full rounded p-3">
            <div className="flex gap-2">
              <span>
                <FireIcon className="w-6 h-6 text-teal-500" />{" "}
              </span>
              <p className="text-sm font-semibold text-white">
                Calorías quemadas
              </p>
            </div>
            {weightKg ? (
              <p className="text-xs mt-1 text-white">
                {estimatedCaloriesBurned
                  ? `Un paseo de ${recommendedMinutes} min quema ~${estimatedCaloriesBurned} kcal`
                  : "Cargando..."}
              </p>
            ) : (
              <p className="text-xs mt-1">
                Agrega el peso en el medical history para obtener informacion
                utilpara tu mascota
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-2 border-gray-700 bg-gray-800 rounded-lg p-5 mt-5">
        <h2
          className="text-1xl lg:text-2xl font-bold mt-2 text-white"
          style={{ fontFamily: "chapFont" }}
        >
          Track your pet
        </h2>
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
