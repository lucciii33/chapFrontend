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
      console.log("HOLASDDDDDD:", petByID);
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
    console.log("selectedPet", selectedPet);

    const hasPurchasedTag = selectedPet?.tags?.some((tag) => tag.is_purchased);
    console.log("hasPurchasedTag", hasPurchasedTag);

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
        You are not alone in this emergency
      </h1>
      <div className="mb-5 border border-gray-700 bg-gray-800 rounded-lg p-5">
        luego de una busqueda constante de perros perdidos, hemos desarrollado
        una herramienta que te permite localizar a tu mascota en caso de
        emergencia. Simplemente ingresa la dirección donde se perdió tu perro y
        nuestra aplicación utilizará Google Maps para mostrarte un mapa con la
        ubicación aproximada de tu mascota y un círculo que indica el área donde
        podría encontrarse. Esta función es especialmente útil para actuar
        rápidamente y aumentar las posibilidades de encontrar a tu amigo peludo.
      </div>
      <div className="flex gap-2 border-b border-gray-700 pb-3">
        <div>1</div>
        <div>
          go to{" "}
          <Link className="underline text-teal-500" to={`/pets/${petId}`}>
            {" "}
            pet details and mark you pet as lost
          </Link>
        </div>
      </div>
      <div className=" border-b border-gray-700 pb-3 mt-2">
        <div className="flex gap-2">
          <div>2</div>
          <div>
            Add the adrees where you last see you rdog we will generate a map
            with the radio
          </div>
        </div>

        <div>
          {" "}
          <EmergencyNow petId={Number(petId)} weeklyActivity={weeklyActivity} />
        </div>
      </div>

      <div className="flex gap-2 border-b border-gray-700 pb-3 mt-2">
        <div>3</div>
        <div>
          contact local aoutorities and shelters to report your lost dog and
          show him the radio the dog could be
        </div>
      </div>
      <div className="flex gap-2 border-b border-gray-700 pb-3 mt-2">
        <div>4</div>
        <div>
          call a frind, prinf out{" "}
          <Link
            className="underline text-teal-500"
            to={`/emergencyPdf/${petId}`}
          >
            emergency pds
          </Link>
          , and share it your social media so people on the area can help you.
        </div>
      </div>
      <div className="flex gap-2 border-b border-gray-700 pb-3 mt-2">
        <div>5</div>
        <div>
          leave food and somthing with your scent on the area, dogs have a great
          sense of smell and this will help him to find his way back to you.
        </div>
      </div>
    </div>
  );
}
