import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
import { Link } from "@remix-run/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function TravelModeForm({
  travelModeData,
  onSubmit,
  petId,
  isCollapsed,
  onToggleCollapse,
  payShowInfo,
  t,
}) {
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
            <h2 className="text-lg text-teal-500">
              {" "}
              {t("general_pet_id.create_travel_mode")}
            </h2>
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
                  <h2>{t("expenses.lockedFeature")}</h2>
                </p>
              </div>
            )}
            <div className="mb-5">
              <h2 className="text-1xl font-bold text-white">
                {t("travelMode.title")}
              </h2>
              <small className="text-sm text-white">
                {t("travelMode.description")}
              </small>
              <small className="text-sm text-white">
                {t("travelMode.subtitle")}
              </small>
            </div>
            <div>
              <div>
                <label>{t("travelMode.walkingInstructions")}</label>
              </div>
              <input
                type="text"
                name="walk_instructions"
                value={formData.walk_instructions}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg mb-2"
                placeholder={t("travelMode.walkingInstructions")}
              />
            </div>

            <div>
              <div>
                <label>{t("travelMode.feedingInstructions")}</label>
              </div>
              <input
                type="text"
                name="feeding_instructions"
                value={formData.feeding_instructions}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg mb-2"
                placeholder={t("travelMode.feedingInstructions")}
              />
            </div>

            <div>
              <div>
                <label>{t("travelMode.medicationInstructions")}</label>
              </div>
              <input
                type="text"
                name="medication_instructions"
                value={formData.medication_instructions}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg mb-2"
                placeholder={t("travelMode.medicationInstructions")}
              />
            </div>

            <div>
              <div>
                <label>{t("travelMode.allergies")}</label>
              </div>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg mb-2"
                placeholder={t("travelMode.allergies")}
              />
            </div>

            <div>
              <div>
                <label>{t("travelMode.emergencyContact")}</label>
              </div>
              <input
                type="text"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg mb-2"
                placeholder={t("travelMode.emergencyContact")}
              />
            </div>
            <div>
              <div>
                <label>{t("travelMode.notes")}</label>
              </div>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg mb-2"
                placeholder={t("travelMode.notes")}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={handleSubmit}
                className=" border-none py-3 px-4  bg-teal-900 text-white rounded-lg  w-full md:w-auto"
              >
                {travelModeData
                  ? t("travelMode.buttonEdit")
                  : t("travelMode.buttonCreate")}
              </button>
              <button className="btn" onClick={onToggleCollapse}>
                {t("expenses.buttonClose")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
