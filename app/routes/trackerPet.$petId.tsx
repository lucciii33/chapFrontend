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
  FaceSmileIcon,
  FaceFrownIcon,
  ExclamationTriangleIcon,
  FireIcon,
} from "@heroicons/react/24/solid";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useTranslation } from "react-i18next";
import { showInfoToast } from "~/utils/toast";
import WeeklyActivityChart from "~/components/weeklyActivity";
import { EmergencyNow } from "~/components/emergencyNow";

export default function PetTracker() {
  const { t } = useTranslation();

  const {
    createPetTrack,
    getPetTrack,
    deletePetTrack,
    editPetTrack,
    getWeeklyActivity,
  } = PetTrackerContext();
  const { pet } = useGlobalContext();
  const { getPetById, petByID, editPet } = pet;
  const { petId } = useParams();
  const [weeklyActivity, setWeeklyActivity] = useState<any | null>(null);
  console.log("weeklyActivity", weeklyActivity);
  const moodMap: Record<string, JSX.Element> = {
    happy: <FaceSmileIcon className="w-6 h-6 text-teal-500" />,
    sad: <FaceFrownIcon className="w-6 h-6 text-teal-500" />,
    calm: <FaceSmileIcon className="w-6 h-6 text-teal-500" />,
    anxious: <ExclamationTriangleIcon className="w-6 h-6 text-teal-500" />,
    aggressive: <FireIcon className="w-6 h-6 text-teal-500" />,
    hyper: <FaceSmileIcon className="w-6 h-6 text-teal-500" />,
  };

  useEffect(() => {
    if (petId) {
      getPetById(petId);
      const fetchWeekly = async () => {
        const data = await getWeeklyActivity(Number(petId));
        if (data) {
          setWeeklyActivity(data);
        }
      };
      fetchWeekly();
    }
  }, []);

  console.log("petByID", petByID);

  const [formData, setFormData] = useState<PetFormData>({
    pet_id: petId ? petId : null,
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
    scratching: null,
    hair_loss: null,
    seizures: null,
    eye_discharge: null,
    ear_discharge: null,
    limping: null,
    sleep_hours: 0,
  });

  const hasAnyValue = (data: typeof formData) => {
    return Object.entries(data).some(([key, value]) => {
      if (key === "pet_id") return false; // no cuenta
      if (typeof value === "boolean") return value === true; // algún checkbox marcado
      if (typeof value === "number") return value > 0; // números > 0
      if (typeof value === "string") return value.trim() !== ""; // textos no vacíos
      return false;
    });
  };

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

    if (!hasAnyValue(formData)) {
      showInfoToast(t("diary.fill_one_field_toast"));
      return;
    }

    const existingTrackers = await getPetTrack(petId);

    const today = new Date().toISOString().split("T")[0]; // Solo la fecha YYYY-MM-DD

    const alreadyTrackedToday = existingTrackers?.some((t) =>
      t.date.startsWith(today)
    );

    if (alreadyTrackedToday) {
      showInfoToast(t("diary.diary_already_exists_toast"));
      return;
    }

    await createPetTrack(formData);
    await getPetById(petId);
    const updatedWeekly = await getWeeklyActivity(Number(petId));
    setWeeklyActivity(updatedWeekly);
    setFormData({
      pet_id: petId,
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
      scratching: null,
      hair_loss: null,
      seizures: null,
      eye_discharge: null,
      ear_discharge: null,
      limping: null,
    });
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
      <EmergencyNow petId={Number(petId)} />
      <div className="border-2 border-gray-700 bg-gray-800 rounded-lg p-5 mt-5">
        <h2
          className="text-1xl lg:text-2xl font-bold text-white"
          style={{ fontFamily: "chapFont" }}
        >
          {t("tracker_page.title", { name: petByID?.name })}
          {/* Tips for{petByID?.name} ! */}
        </h2>
        <div className="flex items-center justify-between flex-col md:flex-row gap-2 mt-4">
          <div className="border-2 border-teal-500 bg-gray-800 h-auto md:h-[7rem] w-full rounded p-3">
            <div className="flex gap-2">
              <span>
                <CakeIcon className="text-teal-500 w-6 h-6" />
              </span>
              <p className="text-sm font-semibold text-white">
                {" "}
                {t("tracker_page.subtitle_food")}
              </p>
            </div>

            {weightKg ? (
              <p className="text-xs mt-1 leading-tight text-white">
                {t("tracker_page.food_line1", {
                  name: petByID?.name,
                  minCalories: Math.round(95 * Math.pow(weightKg, 0.75) * 1.2),
                  maxCalories: Math.round(95 * Math.pow(weightKg, 0.75) * 1.5),
                })}{" "}
                <br />
                {t("tracker_page.food_line2", {
                  minGrams: Math.round(
                    (95 * Math.pow(weightKg, 0.75) * 1.2) / 3.8
                  ),
                  maxGrams: Math.round(
                    (95 * Math.pow(weightKg, 0.75) * 1.5) / 3.8
                  ),
                  kcalPerGram: 3.8,
                })}
              </p>
            ) : (
              <p className="text-xs mt-1 text-white">
                {t("tracker_page.no_weight")}
              </p>
            )}
          </div>

          <div className="border-2 border-teal-500 bg-gray-800 h-auto md:h-[7rem] w-full rounded p-3">
            <div className="flex gap-2">
              <span>
                <BoltIcon className="w-6 h-6 text-teal-500" />{" "}
              </span>
              <p className="text-sm font-semibold text-white">
                {t("tracker_page.subtitle_activity")}
              </p>
            </div>
            {weightKg ? (
              <p className="text-xs mt-1 text-white">
                {recommendedMinutes &&
                  t("tracker_page.activity_line", {
                    minutesPerDay: recommendedMinutes,
                  })}
              </p>
            ) : (
              <p className="text-xs mt-1">{t("tracker_page.no_weight")}</p>
            )}
          </div>

          <div className="border-2 border-teal-500 bg-gray-800 h-auto md:h-[7rem] w-full rounded p-3">
            <div className="flex gap-2">
              <span>
                <BeakerIcon className="w-6 h-6 text-teal-500" />{" "}
              </span>
              <p className="text-sm font-semibold text-white">
                {t("tracker_page.subtitle_water")}
              </p>
            </div>
            {weightKg ? (
              <p className="text-xs mt-1 text-white">
                {t("tracker_page.water_line", {
                  name: petByID.name,
                  mlPerDay: waterMl,
                })}
                {/* {petByID.name} debería beber aproximadamente {waterMl} ml de
                agua al día (55ml por kg)` */}
              </p>
            ) : (
              <p className="text-xs mt-1">{t("tracker_page.no_weight")}</p>
            )}
          </div>

          <div className="border-2 border-teal-500 bg-gray-800 h-auto md:h-[7rem] w-full rounded p-3">
            <div className="flex gap-2">
              <span>
                <FireIcon className="w-6 h-6 text-teal-500" />{" "}
              </span>
              <p className="text-sm font-semibold text-white">
                {t("tracker_page.subtitle_burn")}
              </p>
            </div>
            {weightKg ? (
              <p className="text-xs mt-1 text-white">
                {estimatedCaloriesBurned &&
                  t("tracker_page.burn_line", {
                    minutes: recommendedMinutes,
                    burnedKcal: estimatedCaloriesBurned,
                  })}
              </p>
            ) : (
              <p className="text-xs mt-1">{t("tracker_page.no_weight")}</p>
            )}
          </div>
        </div>
      </div>

      {weeklyActivity?.alerts?.urine_blood && (
        <div className="border-2 border-red-500 bg-gray-800 h-auto w-full rounded-lg p-3 mt-4">
          <div className="flex gap-2 items-center">
            <span>
              <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
            </span>
            <p className="text-sm font-semibold text-white">
              {t("alert_tracker.urine_blood")}
            </p>
          </div>
        </div>
      )}

      {weeklyActivity?.alerts?.vomit_multiple && (
        <div className="border-2 border-red-500 bg-gray-800 h-auto w-full rounded p-3 mt-3">
          <div className="flex gap-2 items-center">
            <span>
              <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
            </span>
            <p className="text-sm font-semibold text-white">
              {t("alert_tracker.vomit_multiple")}
            </p>
          </div>
        </div>
      )}

      {weeklyActivity?.alerts?.poop_blood && (
        <div className="border-2 border-red-500 bg-gray-800 h-auto w-full rounded p-3 mt-3">
          <div className="flex gap-2 items-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />
            <p className="text-sm font-semibold text-white">
              {t("alert_tracker.poop_blood")}
            </p>
          </div>
        </div>
      )}

      {weeklyActivity?.alerts?.poop_diarrhea_multiple && (
        <div className="border-2 border-yellow-500 bg-gray-800 h-auto w-full rounded-lg p-3 mt-4">
          <div className="flex gap-2 items-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
            <p className="text-sm font-semibold text-white">
              {t("alert_tracker.poop_diarrhea_multiple")}
            </p>
          </div>
        </div>
      )}

      {weeklyActivity?.alerts?.poop_constipation_multiple && (
        <div className="border-2 border-yellow-500 bg-gray-800 h-auto w-full rounded-lg p-3 mt-4">
          <div className="flex gap-2 items-center">
            <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
            <p className="text-sm font-semibold text-white">
              {t("alert_tracker.poop_constipation_multiple")}
            </p>
          </div>
        </div>
      )}

      {weeklyActivity?.alerts?.urine_dark_multiple && (
        <div className="border-2 border-yellow-500 bg-gray-800 h-auto w-full rounded-lg p-3 mt-4">
          <div className="flex gap-2 items-center">
            <span>
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />
            </span>
            <p className="text-sm font-semibold text-white">
              {t("alert_tracker.urine_dark_multiple")}
            </p>
          </div>
        </div>
      )}

      <div className="border-2 border-gray-700 bg-gray-800 rounded-lg p-5 mt-5">
        <h2
          className="text-1xl lg:text-2xl font-bold mt-2 text-white"
          style={{ fontFamily: "chapFont" }}
        >
          {t("tracker_page.title_tracker")}
        </h2>
        <div className="flex flex-col md:flex-row gap-3 mt-3 mb-3">
          <div className="w-full">
            <label className="block text-slate-50">
              {" "}
              {t("tracker_page.label_mood")}
            </label>
            {/* <input
              className="w-full px-4 py-2 border rounded-lg"
              placeholder={t("tracker_page.placeholder_mood")}
              name="mood"
              value={formData.mood}
              onChange={handleChange}
            /> */}
            <select
              name="mood"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.mood}
              onChange={handleChange}
            >
              <option value="">{t("tracker_page.placeholder_mood")}</option>
              <option value="happy">{t("moods.happy")}</option>
              <option value="sad">{t("moods.sad")}</option>
              <option value="calm">{t("moods.calm")}</option>
              <option value="anxious">{t("moods.anxious")}</option>
              <option value="aggressive">{t("moods.aggressive")}</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="w-full">
            <label className="block text-slate-50">
              {t("tracker_page.label_minutes_walked")}
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              name="walked_minutes"
              value={formData.walked_minutes}
              onChange={handleChange}
            />
          </div>
          <div className="w-full">
            <label className="block text-slate-50">
              {t("tracker_page.label_food")}
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              name="food_consumed"
              value={formData.food_consumed}
              onChange={handleChange}
            />
          </div>
          <div className="w-full">
            <label className="block text-slate-50">
              {t("tracker_page.label_poop_quality")}
            </label>
            <select
              name="poop_quality"
              value={formData.poop_quality || ""}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value=""></option>
              <option value="normal">{t("poop_quality.normal")}</option>
              <option value="soft">{t("poop_quality.soft")}</option>
              <option value="diarrhea">{t("poop_quality.diarrhea")}</option>
              <option value="constipation">
                {t("poop_quality.constipation")}
              </option>
              <option value="mucus">{t("poop_quality.mucus")}</option>
              <option value="blood">{t("poop_quality.blood")}</option>
              <option value="color_change">
                {t("poop_quality.color_change")}
              </option>
            </select>
          </div>
          <div className="w-full">
            <label className="block text-slate-50">
              {t("tracker_page.label_water")}
            </label>
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
            <label className="block text-slate-50">
              {t("tracker_page.label_medications")}
            </label>
            <input
              className="w-full px-4 py-2 border rounded-lg"
              name="medication_given"
              value={formData.medication_given}
              onChange={handleChange}
            />
          </div>
          <div className="w-full">
            <label className="block text-slate-50">
              {t("tracker_page.label_weight")}
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
            />
          </div>
          <div className="w-full">
            <label className="block text-slate-50">
              {t("tracker_page.label_sleep_hours")}
            </label>
            <input
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
              name="sleep_hours"
              value={formData.sleep_hours}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="w-full mt-3">
          <label className="block text-slate-50">
            {t("urine_colors.urine_color_label")}
          </label>
          <select
            name="urine_color"
            className="w-full px-4 py-2 border rounded-lg"
            value={formData.urine_color || ""}
            onChange={handleChange}
          >
            <option value=""></option>
            <option value="clear">{t("urine_colors.clear")}</option>
            <option value="normal">{t("urine_colors.normal")}</option>
            <option value="dark">{t("urine_colors.dark")}</option>
            <option value="blood">{t("urine_colors.blood")}</option>
          </select>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mt-3 border border-1 rounded p-4">
          {["urinated", "pooped", "played"].map((field) => (
            <div key={field}>
              <label>{t(`tracker_page.symptom_labels.${field}`)}</label>
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

        {/* Síntomas extra */}
        <div className="flex flex-col md:flex-row gap-3 mt-3  border border-1 rounded p-4">
          {[
            "scratching",
            "hair_loss",
            "seizures",
            "eye_discharge",
            "ear_discharge",
            "limping",
            "vomited",
            "coughing",
            "lethargy",
            "fever",
          ].map((field) => (
            <div key={field}>
              <label>{t(`tracker_page.symptom_labels.${field}`)}</label>
              <input
                type="checkbox"
                name={field}
                className="radio radio-accent ms-4"
                checked={(formData as any)[field] || false}
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
            {t("tracker_page.button_save")}
          </button>
        </div>
      </div>

      <div className="border-2 border-gray-700 bg-gray-800 rounded-lg p-5 mt-5">
        <h2
          className="text-1xl lg:text-2xl font-bold mt-2 text-white"
          style={{ fontFamily: "chapFont" }}
        >
          {t("tracker_page_2.title_tracker_2")}
        </h2>
        <div className="flex items-center justify-between flex-col md:flex-row gap-2">
          <div className="border-2 border-teal-500 bg-gray-800 h-auto  w-full rounded p-3">
            <h3 className="text-lg font-bold text-white mb-2">
              {t("tracker_page_2.food_per_day")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {weeklyActivity?.days?.map((d) => (
                <div
                  key={d.date}
                  className="border border-gray-600 rounded p-3 text-center"
                >
                  <p className="text-xs text-gray-400">{d.day.slice(0, 3)}</p>{" "}
                  {/* Mon, Tue... */}
                  <p className="text-sm font-semibold text-white">
                    {d.food_consumed} g
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-2 border-teal-500 bg-gray-800 h-auto  w-full rounded p-3">
            <h3 className="text-lg font-bold text-white mb-2">
              {t("tracker_page_2.water_per_day")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {weeklyActivity?.days?.map((d) => (
                <div
                  key={d.date}
                  className="border border-gray-600 rounded p-3 text-center"
                >
                  <p className="text-xs text-gray-400">{d.day.slice(0, 3)}</p>
                  <p className="text-sm font-semibold text-white">
                    {d.water_consumed} ml
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="border-2 border-gray-700 bg-gray-800 rounded-lg p-5 mt-5">
        <h2
          className="text-1xl lg:text-2xl font-bold mt-2 text-white"
          style={{ fontFamily: "chapFont" }}
        >
          {t("tracker_page_2.mood_this_week")}
        </h2>
        <div className="border-2 border-teal-500 bg-gray-800 h-auto w-full rounded p-3">
          <div className="flex gap-2 items-center">
            <span>
              {weeklyActivity?.weekly_mood &&
                moodMap[weeklyActivity.weekly_mood]}
            </span>
            <p className="text-sm font-semibold text-white">
              {weeklyActivity?.weekly_mood
                ? t(`mood_comments.${weeklyActivity.weekly_mood}`)
                : t("tracker_page_2.no_mood_data")}
            </p>
          </div>
        </div>
      </div>

      {weeklyActivity && <WeeklyActivityChart data={weeklyActivity.days} />}

      <PetCalendar
        trackers={petByID?.trackers}
        petId={Number(petId)}
        onDelete={async (id) => {
          await deletePetTrack(id);
          await getPetById(petId);
        }}
        onEdit={async (id, updatedData) => {
          await editPetTrack(id, updatedData);
          await getPetById(petId);
          const updatedWeekly = await getWeeklyActivity(Number(petId));
          setWeeklyActivity(updatedWeekly);
        }}
        onCreate={async (data) => {
          await createPetTrack(data);
          await getPetById(petId);
          const updatedWeekly = await getWeeklyActivity(Number(petId));
          setWeeklyActivity(updatedWeekly);
        }}
      />
    </div>
  );
}
