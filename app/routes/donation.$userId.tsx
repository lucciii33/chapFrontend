import { useEffect, useState } from "react";
import { useParams } from "@remix-run/react";
import { useGlobalContext } from "~/context/GlobalProvider";

import "../../styles/dashboard.css";

import { useTranslation } from "react-i18next";
import { showInfoToast } from "~/utils/toast";

export default function PetTracker() {
  const { t } = useTranslation();
  const { userId } = useParams();
  console.log("userId", userId);
  const handleOnboard = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_REACT_APP_URL
        }/stripe/onboard-user?user_id=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error en la petición");
      }

      const data = await res.json();

      if (data.onboarding_url) {
        window.location.href = data.onboarding_url;
      } else {
        alert("No se recibió el link de onboarding");
      }
    } catch (err) {
      console.error(err);
      alert("Error al crear el onboarding link");
    }
  };

  return (
    <div className="p-5">
      test {userId}
      <div className="donation-container">
        <h1>Test donation</h1>
        <button onClick={handleOnboard} className="btn">
          Conectar con Stripe
        </button>
      </div>
    </div>
  );
}
