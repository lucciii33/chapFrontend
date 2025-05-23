import { Link } from "@remix-run/react"; // Importa Link de Remix
import { useEffect, useState } from "react";
import { useGlobalContext } from "../context/GlobalProvider";
import "../../styles/dashboard.css";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

type AlertCircleProps = {
  petId: number;
};

export default function AlertCircle({ petObj }: AlertCircleProps) {
  const user = petObj;
  console.log("petObj ddddddddddddd", petObj.alerts);
  console.log("user", user);
  const vaccines = petObj?.medical_history?.[0]?.vaccines || [];
  const today = new Date();

  const expiringVaccine = vaccines.find((vaccine) => {
    const expirationDate = new Date(vaccine.expiration_date);
    const diffInDays =
      (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
    return diffInDays <= 14 && diffInDays >= 0;
  });

  if (!expiringVaccine) return null;

  const formattedDate = new Date(
    expiringVaccine.expiration_date
  ).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const vaccineName = expiringVaccine.name;
  const petName = petObj.name;
  const ownerName = petObj.mom_name;
  const ownerNameTwo = petObj.dad_name;

  const alertMessage = `Hola ${ownerName} o ${ownerNameTwo}, la vacuna "${vaccineName}" de tu perro "${petName}" vence el ${formattedDate}.`;

  const generalAlerts = petObj.alerts || [];

  return (
    <div className="tooltip tooltip-top" data-tip="click me">
      <div className="w-10 h-10 bg-red-600 rounded-full flex justify-center items-center flex-col text-white font-bold text-center text-[8px] p-1 leading-tight">
        <ExclamationTriangleIcon
          className="w-4 h-4 text-white mb-1"
          onClick={() =>
            document.getElementById("my_modal_10_pet_id_alerts").showModal()
          }
        />
      </div>

      <dialog id="my_modal_10_pet_id_alerts" className="modal">
        <div className="modal-box">
          <div className="">
            <div>
              <strong className="block text-md">Alertas de Vacunas</strong>
              <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 rounded">
                <h2>{alertMessage}</h2>
              </div>
            </div>

            {generalAlerts.length > 0 && (
              <div className="mt-4">
                <strong className="block text-md">Alertas generales:</strong>
                {generalAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 rounded"
                  >
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs mt-1">
                      Fecha programada:{" "}
                      {new Date(alert.scheduled_date).toLocaleString("es-ES", {
                        dateStyle: "long",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* if there is a button in form, it will close the modal */}
            <div className="mt-5 flex justify-end">
              <button className="btn">Close</button>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
