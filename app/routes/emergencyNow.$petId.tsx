import { useEffect, useState } from "react";
import { PetTrackerContext } from "../context/PetTrackContext"; // Ajusta el path correcto aquí
import { Link, useParams } from "@remix-run/react";
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

  const { getWeeklyActivity } = PetTrackerContext();
  const { pet } = useGlobalContext();
  const { getPetById, petByID, editPet } = pet;
  const { petId } = useParams();
  const [weeklyActivity, setWeeklyActivity] = useState<any | null>(null);
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

  const handlePetSelect = (e) => {
    const selectedId = e.target.value;
    if (!selectedId) return;

    const selectedPet = allPets.find((pet) => pet.id === parseInt(selectedId));

    const hasPurchasedTag = selectedPet?.tags?.some((tag) => tag.is_purchased);

    if (hasPurchasedTag) {
      navigate(`/trackerPet/${selectedId}`);
    } else {
      document.getElementById("purchase_aler").showModal();
    }
    // const selectedId = e.target.value;
    // if (selectedId) {
    //   navigate(`/trackerPet/${selectedId}`);
    // }
  };

  return (
    <div className="p-5">
      <h1
        className="text-2xl lg:text-3xl font-bold text-white mb-5"
        style={{ fontFamily: "chapFont" }}
      >
        {t("emergency_tracker.title")}
      </h1>
      <div className="mb-5 border border-gray-700 bg-gray-800 rounded-lg p-5">
        {t("emergency_tracker.introduction")}
      </div>
      <div className="flex gap-2 border-b border-gray-700 pb-3">
        <div>1</div>
        <div>
          {t("emergency_tracker.actions.go_to")}{" "}
          <Link className="underline text-teal-500" to={`/pets/${petId}`}>
            {t("emergency_tracker.links.pet_details")}
          </Link>{" "}
          {t("emergency_tracker.steps.step1")}
        </div>
      </div>
      <div className=" border-b border-gray-700 pb-3 mt-2">
        <div className="flex gap-2">
          <div>2</div>
          <div>
            <div>{t("emergency_tracker.steps.step2")}</div>
          </div>
        </div>

        <div>
          {" "}
          <EmergencyNow
            petId={Number(petId)}
            weeklyActivity={weeklyActivity}
            t={t}
          />
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-700 pb-3 mt-2">
        <div>3</div>
        <div>
          <div>{t("emergency_tracker.steps.step3")}</div>
        </div>
      </div>
      <div className="flex gap-2 border-b border-gray-700 pb-3 mt-2">
        <div>4</div>
        <div>
          {t("emergency_tracker.actions.print")}{" "}
          <Link
            className="underline text-teal-500"
            to={`/emergencyPdf/${petId}`}
          >
            {t("emergency_tracker.links.emergency_pdf")}
          </Link>
          , {t("emergency_tracker.actions.share")}{" "}
          {t("emergency_tracker.steps.step4")}
        </div>
      </div>
      <div className="flex gap-2 border-b border-gray-700 pb-3 mt-2">
        <div>5</div>
        <div>{t("emergency_tracker.steps.step5")}</div>
      </div>
    </div>
  );
}
