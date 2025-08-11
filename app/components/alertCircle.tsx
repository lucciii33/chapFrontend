import { useState } from "react";
import { ExclamationTriangleIcon, TrashIcon } from "@heroicons/react/24/solid";
import DeleteDialog from "../components/deleteDialog";
import { useGlobalContext } from "../context/GlobalProvider";
import { useTranslation } from "react-i18next";
import { showSuccessToast } from "~/utils/toast";

type AlertCircleProps = {
  petObj: {
    id: number;
    name: string;
    mom_name: string;
    dad_name: string;
    medical_history?: Array<{
      vaccines?: Array<{
        id: number;
        name: string;
        expiration_date: string;
      }>;
    }>;
    alerts?: Array<{
      id: number;
      message: string;
      scheduled_date: string;
    }>;
  };
};

export default function AlertCircle({ petObj }: AlertCircleProps) {
  const { userAlerts } = useGlobalContext();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAlertId, setSelectedAlertId] = useState<number | null>(null);
  const { t } = useTranslation();

  // Obtener vacunas de manera segura
  const vaccines = petObj?.medical_history?.[0]?.vaccines || [];
  const today = new Date();

  // Encontrar vacunas que expiran en los próximos 14 días
  const expiringVaccine = vaccines.find((vaccine) => {
    if (!vaccine?.expiration_date) return false;

    try {
      const expirationDate = new Date(vaccine.expiration_date);
      const diffInDays = Math.ceil(
        (expirationDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return diffInDays <= 14 && diffInDays >= 0;
    } catch (error) {
      console.error("Error al procesar fecha de vacuna:", error);
      return false;
    }
  });

  // Obtener alertas generales
  const generalAlerts = petObj.alerts || [];

  // No mostrar si no hay alertas ni vacunas próximas a vencer
  if (!expiringVaccine && generalAlerts.length === 0) {
    return null;
  }

  // Formatear fecha de expiración si existe
  const formattedDate = expiringVaccine
    ? new Date(expiringVaccine.expiration_date).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const alertMessage = expiringVaccine
    ? `Hola ${petObj.mom_name} o ${petObj.dad_name}, la vacuna "${expiringVaccine.name}" de tu perro "${petObj.name}" vence el ${formattedDate}.`
    : "";

  const handleOpenDeleteDialog = (alertId: number) => {
    setSelectedAlertId(alertId);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedAlertId !== null) {
      try {
        await userAlerts.deleteAlert(selectedAlertId);
        showSuccessToast(t("alerts_toast.alert_deleted"));
      } catch (error) {
        console.error("Error al eliminar alerta:", error);
      } finally {
        setIsDeleteDialogOpen(false);
        setSelectedAlertId(null);
        window.location.reload();
      }
    }
  };

  return (
    <div
      className="tooltip tooltip-top"
      data-tip={t("programmed_alerts.alert_tip")}
    >
      <div
        className="w-10 h-10 bg-red-600 rounded-full flex justify-center items-center flex-col text-white font-bold text-center text-[8px] p-1 leading-tight cursor-pointer"
        onClick={() =>
          document.getElementById(`pet_alerts_${petObj.id}`)?.showModal()
        }
      >
        <ExclamationTriangleIcon className="w-4 h-4 text-white mb-1" />
        {/* <span>{generalAlerts.length}</span> */}
      </div>

      <dialog id={`pet_alerts_${petObj.id}`} className="modal">
        <div className="modal-box">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">
                {" "}
                {t("programmed_alerts.title")} {petObj.name}
              </h3>
            </div>
            <div>
              <div
                className="bg-slate-800 p-5 w-6 h-6 flex justify-center items-center rounded-lg"
                onClick={() =>
                  document.getElementById(`pet_alerts_${petObj.id}`).close()
                }
              >
                <div>X</div>
              </div>
            </div>
          </div>

          {expiringVaccine && (
            <div className="mt-4">
              <h4 className="font-semibold">
                {t("programmed_alerts.subtitle_vacines")}{" "}
              </h4>
              <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 rounded mt-2">
                {alertMessage}
              </div>
            </div>
          )}

          {generalAlerts.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold">
                {" "}
                {t("programmed_alerts.subtitle")}
              </h4>
              {generalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-3 rounded mt-2"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm mt-1">
                        {new Date(alert.scheduled_date).toLocaleString(
                          "es-ES",
                          {
                            dateStyle: "long",
                            timeStyle: "short",
                          }
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => handleOpenDeleteDialog(alert.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="modal-action">
            <form method="dialog">
              <button className="btn"> {t("programmed_alerts.button")}</button>
            </form>
          </div>
        </div>
      </dialog>

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName="esta alerta"
      />
    </div>
  );
}
