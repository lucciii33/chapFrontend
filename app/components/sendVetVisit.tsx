import { useState } from "react";
import { useGlobalContext } from "../context/GlobalProvider";
import { useTranslation } from "react-i18next";

type Props = {
  petId: number;
};

export default function SendVetVisit({ petId }: Props) {
  console.log("petIdpetIdpetIdpetId", petId);
  const { medicalHistory } = useGlobalContext();
  const { sendVetVisits } = medicalHistory;
  const [doctorEmail, setDoctorEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSend = async () => {
    try {
      setLoading(true);
      await sendVetVisits(petId, doctorEmail);
      (
        document.getElementById("my_modal_10_vet_visit") as HTMLDialogElement
      ).close();
      setDoctorEmail("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="relative mt-5 mb-5">
        {/* 🔹 Etiqueta NEW flotante */}
        <span className="absolute -top-2 left-3 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-md">
          NUEVO
        </span>

        <div
          className="border p-3 rounded-md cursor-pointer hover:bg-gray-50 p-3"
          onClick={() =>
            (
              document.getElementById(
                "my_modal_10_vet_visit"
              ) as HTMLDialogElement
            ).showModal()
          }
        >
          <p className="font-semibold text-white mt-2">
            {t("send_vet_visit.title")}
          </p>
          <small className="text-white">{t("send_vet_visit.subtitle")}</small>
        </div>
      </div>

      <dialog id="my_modal_10_vet_visit" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-3">
            {t("send_vet_visit.subtitle_2")}
          </h3>

          <input
            type="email"
            value={doctorEmail}
            onChange={(e) => setDoctorEmail(e.target.value)}
            placeholder={t("send_vet_visit.email")}
            className="input input-bordered w-full mb-4"
          />

          <div className="flex justify-end gap-2">
            <button
              className="btn btn-outline"
              onClick={() =>
                (
                  document.getElementById(
                    "my_modal_10_vet_visit"
                  ) as HTMLDialogElement
                ).close()
              }
            >
              Cancelar
            </button>

            <button
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              disabled={!doctorEmail || loading}
              onClick={handleSend}
            >
              {loading ? t("send_vet_visit.sending") : t("send_vet_visit.send")}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
