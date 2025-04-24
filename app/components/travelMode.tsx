import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";

export default function TravelModeForm({
  travelModeData,
  onSubmit,
  petId,
  isCollapsed,
  onToggleCollapse,
  payShowInfo,
}) {
  console.log(
    "petIdpetIdpetIdpetIdpetIdpetIdpetIdpetIdpetIdpetIdpetIdpetId",
    petId
  );
  const [formData, setFormData] = useState({
    walk_instructions: "",
    feeding_instructions: "",
    medication_instructions: "",
    allergies: "",
    emergency_contact: "",
    notes: "",
    pet_id: petId,
  });

  useEffect(() => {
    if (travelModeData) {
      setFormData({
        walk_instructions: travelModeData.walk_instructions || "",
        feeding_instructions: travelModeData.feeding_instructions || "",
        medication_instructions: travelModeData.medication_instructions || "",
        allergies: travelModeData.allergies || "",
        emergency_contact: travelModeData.emergency_contact || "",
        notes: travelModeData.notes || "",
        pet_id: petId || prev.pet_id,
      });
    }
  }, [travelModeData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log("formData", formData);
    if (onSubmit) {
      await onSubmit(formData);
    }
  };

  return (
    <div className="border-2 border-gray-700 bg-gray-800 rounded-lg p-5g">
      <div className=" rounded-lg p-5">
        <div className="flex justify-between">
          <div>
            {" "}
            <h2 className="text-lg text-teal-500"> Create Travel Mode</h2>
          </div>
          <div>
            {" "}
            <span onClick={onToggleCollapse}>
              {isCollapsed ? (
                <ChevronUpIcon className="h-6 w-6 text-teal-500" />
              ) : (
                <ChevronDownIcon className="h-6 w-6 text-teal-500" />
              )}
            </span>
          </div>
        </div>
        {isCollapsed && (
          <div className="mt-5 relative">
            {!payShowInfo && (
              <div className="absolute inset-0 z-50 bg-gray-900 bg-opacity-60 flex items-center justify-center pointer-events-auto">
                <p className="text-white text-center text-lg opacity-70">
                  this feature will be usable when you finish paying your tag
                </p>
              </div>
            )}
            <div className="mb-5">
              <h2 className="text-1xl font-bold text-white">
                Te vas de viaje? agrega aqui la info necesaria para quien vaya a
                cuidar a tu mascota
              </h2>
              <small className="text-sm text-white">
                tu perro te manda a decir que eres muy mala persona por dejarlo,
                dice que al menos ponga bastante pollito en donde sale su
                aliemntacion
              </small>
            </div>
            <div>
              <div>
                <label>Instrucciones para paseos</label>
              </div>
              <input
                type="text"
                name="walk_instructions"
                value={formData.walk_instructions}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg mb-2"
                placeholder="Instrucciones para paseos"
              />
            </div>

            <div>
              <div>
                <label>Instrucciones de alimentación</label>
              </div>
              <input
                type="text"
                name="feeding_instructions"
                value={formData.feeding_instructions}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg mb-2"
                placeholder="Instrucciones de alimentación"
              />
            </div>

            <div>
              <div>
                <label>Instrucciones de medicación</label>
              </div>
              <input
                type="text"
                name="medication_instructions"
                value={formData.medication_instructions}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg mb-2"
                placeholder="Instrucciones de medicación"
              />
            </div>

            <div>
              <div>
                <label>Alergias</label>
              </div>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg mb-2"
                placeholder="Alergias"
              />
            </div>

            <div>
              <div>
                <label>Contacto de emergencia</label>
              </div>
              <input
                type="text"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg mb-2"
                placeholder="Contacto de emergencia"
              />
            </div>
            <div>
              <div>
                <label>Notas adicionales</label>
              </div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg mb-2"
                placeholder="Notas adicionales"
              />
            </div>

            <button
              onClick={handleSubmit}
              className=" border-none py-3 px-4  bg-teal-900 text-white rounded-lg  w-full md:w-auto"
            >
              {travelModeData ? "Editar" : "Crear"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
