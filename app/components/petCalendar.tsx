import { useState, useEffect } from "react";
import DeleteDialog from "../components/deleteDialog";
import { useTranslation } from "react-i18next";

export default function PetCalendar({
  trackers,
  onDelete,
  onEdit,
  onCreate,
  petId,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTracker, setSelectedTracker] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [selectedDate, setSelectedDate] = useState(null); // 🆕

  const { t } = useTranslation();

  console.log("trackers", trackers);

  const handleChange = (e) => {
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
          ? Number(value)
          : value,
    }));
  };

  const [formData, setFormData] = useState({
    pet_id: "",
    urinated: false,
    pooped: false,
    poop_quality: "",
    urine_color: "",
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
    scratching: null, // 🆕
    hair_loss: null, // 🆕
    seizures: null, // 🆕
    eye_discharge: null, // 🆕
    ear_discharge: null, // 🆕
    limping: null,
  });

  const daysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const monthDays = [];
  const totalDays = daysInMonth(currentDate);
  const firstDayIndex = firstDayOfMonth(currentDate);

  for (let i = 0; i < firstDayIndex; i++) {
    monthDays.push(null);
  }

  for (let i = 1; i <= totalDays; i++) {
    monthDays.push(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
    );
  }

  const isTracked = (day) => {
    return trackers?.some((tracker) => {
      const trackerDate = new Date(tracker.date);
      return (
        trackerDate.getFullYear() === day.getFullYear() &&
        trackerDate.getMonth() === day.getMonth() &&
        trackerDate.getDate() === day.getDate()
      );
    });
  };

  const handleClick = (day) => {
    const tracker = trackers.find((t) => {
      const trackerDate = new Date(t.date);
      return (
        trackerDate.getFullYear() === day.getFullYear() &&
        trackerDate.getMonth() === day.getMonth() &&
        trackerDate.getDate() === day.getDate()
      );
    });

    if (tracker) {
      setSelectedTracker(tracker);
      setFormData({ ...tracker });
      setIsModalOpen(true);
    } else {
      setSelectedTracker(null);
      setIsModalOpen(true);
      // setFormData((prev) => ({
      //   ...prev,
      //   pet_id: petId,
      //   date: new Date(
      //     day.getFullYear(),
      //     day.getMonth(),
      //     day.getDate(),
      //     12,
      //     0,
      //     0
      //   ).toISOString(),
      // }));
      const newDate = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        12,
        0,
        0
      ).toISOString();

      setFormData({
        pet_id: petId,
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
        date: newDate,
      });
      setSelectedDate(day);
    }
  };

  return (
    <div className="p-5 mx-auto p-4 bg-gray-800 rounded-xl text-white mt-5">
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
            )
          }
          className="text-white px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
        >
          ←
        </button>

        <h2 className="text-xl font-bold text-center">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button
          onClick={() =>
            setCurrentDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
            )
          }
          className="text-white px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
        >
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mt-4 text-sm text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="font-semibold">
            {day}
          </div>
        ))}

        {monthDays.map((day, idx) => (
          <div
            key={idx}
            onClick={() => day && handleClick(day)}
            className={`p-2 rounded cursor-pointer ${
              day
                ? isTracked(day)
                  ? "bg-teal-500"
                  : "bg-gray-600"
                : "bg-transparent cursor-default"
            }`}
          >
            {day ? day.getDate() : ""}
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center ">
          <div className="bg-gray-800 text-white p-6 rounded-lg shadow-xl max-w-sm w-full relative overflow-auto max-h-[750px]">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsModalOpen(false)}
            >
              ✖️
            </button>

            {selectedTracker ? (
              <>
                <h3 className="text-xl font-bold mb-4">
                  {" "}
                  {t("tracker_page.title_edit")}
                </h3>

                <div>
                  <label className="block text-sm font-semibold">
                    {t("tracker_page.label_mood")}
                  </label>
                  <select
                    name="mood"
                    value={formData.mood || ""}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg bg-transparent"
                  >
                    <option value="">
                      {t("tracker_page.select_placeholder")}
                    </option>
                    <option value="happy">{t("moods.happy")}</option>
                    <option value="sad">{t("moods.sad")}</option>
                    <option value="calm">{t("moods.calm")}</option>
                    <option value="anxious">{t("moods.anxious")}</option>
                    <option value="aggressive">{t("moods.aggressive")}</option>
                    <option value="hyper">{t("moods.hyper")}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  {/* Inputs normales */}
                  {[
                    // { label: "label_mood", name: "mood" },
                    { label: "label_poop_quality", name: "poop_quality" },
                    {
                      label: "label_minutes_walked",
                      name: "walked_minutes",
                      type: "number",
                    },
                    {
                      label: "label_food",
                      name: "food_consumed",
                      type: "number",
                    },
                    {
                      label: "label_water",
                      name: "water_consumed",
                      type: "number",
                    },
                    {
                      label: "label_sleep_hours",
                      name: "sleep_hours",
                      type: "number",
                    },
                    { label: "label_medications", name: "medication_given" },
                    { label: "label_weight", name: "weight", type: "number" },
                  ].map(({ label, name, type = "text" }) => (
                    <div key={name}>
                      <label className="block text-sm font-semibold">
                        {t(`tracker_page.${label}`)}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={formData?.[name] ?? ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg bg-transparent"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-semibold">
                      {t("tracker_page.label_urine_color")}
                    </label>
                    <select
                      name="urine_color"
                      value={formData.urine_color || ""}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg bg-transparent"
                    >
                      <option value="">
                        {t("tracker_page.select_placeholder")}
                      </option>
                      <option value="clara">Clara</option>
                      <option value="normal">Amarillo normal</option>
                      <option value="oscura">Oscura</option>
                      <option value="sangre">Con sangre</option>
                    </select>
                  </div>

                  {[
                    "scratching",
                    "hair_loss",
                    "seizures",
                    "eye_discharge",
                    "ear_discharge",
                    "limping",
                  ].map((field) => (
                    <label key={field} className="block text-sm font-medium">
                      <input
                        type="checkbox"
                        name={field}
                        checked={formData?.[field] || false}
                        onChange={handleChange}
                        className="radio radio-accent mr-2"
                      />
                      {field}
                    </label>
                  ))}

                  {/* Checkboxes */}
                  {[
                    "urinated",
                    "pooped",
                    "played",
                    "vomited",
                    "coughing",
                    "lethargy",
                    "fever",
                  ].map((field) => (
                    <label key={field} className="block text-sm font-medium">
                      <input
                        type="checkbox"
                        name={field}
                        checked={formData?.[field] || false}
                        onChange={handleChange}
                        className="radio radio-accent mr-2"
                      />
                      {t(`tracker_page.symptom_labels.${field}`)}
                    </label>
                  ))}
                </div>
                <div className="flex justify-between mt-5">
                  <button
                    className="px-4 py-2 bg-teal-700 text-white rounded"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    {t(`tracker_page.edit_button_delete`)}
                  </button>
                  <button
                    className="px-4 py-2 bg-teal-500 text-white rounded"
                    onClick={async () => {
                      await onEdit(selectedTracker.id, formData); // << guarda cambios
                      setIsModalOpen(false); // cierra modal
                    }}
                  >
                    {" "}
                    {t(`tracker_page.edit_button_save`)}
                  </button>
                </div>

                <DeleteDialog
                  isOpen={showDeleteDialog}
                  onClose={() => setShowDeleteDialog(false)}
                  onConfirm={async () => {
                    await onDelete(selectedTracker.id);
                    setShowDeleteDialog(false);
                    setIsModalOpen(false);
                  }}
                  itemName="this pet tracking record"
                />
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">
                  {t("tracker_page.title_create")}
                </h3>

                <div className="space-y-2">
                  {[
                    { label: "label_mood", name: "mood" },
                    { label: "label_poop_quality", name: "poop_quality" },
                    {
                      label: "label_minutes_walked",
                      name: "walked_minutes",
                      type: "number",
                    },
                    {
                      label: "label_food",
                      name: "food_consumed",
                      type: "number",
                    },
                    {
                      label: "label_water",
                      name: "water_consumed",
                      type: "number",
                    },
                    {
                      label: "label_sleep_hours",
                      name: "sleep_hours",
                      type: "number",
                    },
                    { label: "label_medications", name: "medication_given" },
                    { label: "label_weight", name: "weight", type: "number" },
                  ].map(({ label, name, type = "text" }) => (
                    <div key={name}>
                      <label className="block text-sm font-semibold">
                        {t(`tracker_page.${label}`)}
                      </label>
                      <input
                        type={type}
                        name={name}
                        value={formData?.[name] ?? ""}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg bg-transparent"
                      />
                    </div>
                  ))}

                  {[
                    "urinated",
                    "pooped",
                    "played",
                    "vomited",
                    "coughing",
                    "lethargy",
                    "fever",
                  ].map((field) => (
                    <label key={field} className="block text-sm font-medium">
                      <input
                        type="checkbox"
                        name={field}
                        checked={formData?.[field] || false}
                        onChange={handleChange}
                        className="radio radio-accent mr-2"
                      />
                      {t(`tracker_page.symptom_labels.${field}`)}
                    </label>
                  ))}
                </div>

                <div className="flex justify-end mt-5">
                  <button
                    className="px-4 py-2 bg-teal-500 text-white rounded"
                    onClick={async () => {
                      await onCreate(formData);
                      // await getPetById(formData.pet_id);
                      setIsModalOpen(false);
                    }}
                  >
                    {t("tracker_page.create_button_save")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
