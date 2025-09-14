import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGlobalContext } from "~/context/GlobalProvider";
import { showErrorToast, showInfoToast } from "~/utils/toast";

interface GpsModalProps {
  gpsModal: boolean;
  setGpsModal: (value: boolean) => void;
  handleGpsApiCall: (data: { deviceType: string; gpsColor: string }) => void;
}

export default function GpsModal({
  gpsModal,
  setGpsModal,
  handleGpsApiCall,
}: GpsModalProps) {
  const { t, i18n } = useTranslation();
  const { inventory } = useGlobalContext();

  const [addGps, setAddGps] = useState(true);
  const [deviceType, setDeviceType] = useState<"iphone" | "android" | "">("");
  const [gpsColor, setGpsColor] = useState("black");

  const { getInventoryForUser, inventoryItemsUser } = inventory;
  useEffect(() => {
    getInventoryForUser();
  }, []);

  const selectedInventory = inventoryItemsUser.find(
    (item) => item.type_tag === deviceType && item.color === gpsColor
  );
  const [deviceError, setDeviceError] = useState(false);

  if (!gpsModal) return null;

  const handleSave = () => {
    if (!deviceType) {
      setDeviceError(true);
      showErrorToast(
        i18n.language === "es"
          ? "Debes seleccionar tu celular antes de continuar"
          : "Please select your phone before continuing"
      );
      return;
    }

    const deviceInventory = inventoryItemsUser.find(
      (item) => item.type_tag === deviceType && item.color === gpsColor
    );

    if (!deviceInventory || deviceInventory.quantity <= 0) {
      showInfoToast(
        i18n.language === "es"
          ? "No tenemos este dispositivo en este momento"
          : "We don’t have this device available right now"
      );
      return;
    }

    setDeviceError(false);
    handleGpsApiCall({ deviceType, gpsColor });
  };

  return (
    <div className="mt-5">
      <h2
        className="text-2xl font-bold text-teal-500"
        style={{ fontFamily: "chapFont" }}
      >
        {t("tag_description.gps-c")}
      </h2>
      <div className="text-teal-500 border border-teal-500 rounded-lg p-4 mt-2">
        <p className="m-2 text-sm">{t("tag_description.text-gps")}</p>
      </div>

      <div className="text-orange-500 border border-orange-500 rounded-lg p-4 mt-2">
        <p className="m-2 text-sm">{t("tag_description.warning-gps")}</p>
      </div>

      <div className="">
        <div className="flex gap-4 justify-center md:justify-between flex-col md:flex-row px-[20px] mt-2 w-full">
          <div className="order-2 md:order-1 md:border-r w-full">
            <div className="mt-4"></div>
            {addGps && (
              <div className="mt-4">
                <p className="font-semibold">
                  {i18n.language === "es"
                    ? "Selecciona tu celular:"
                    : "Select your phone:"}
                </p>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deviceType"
                      value="iphone"
                      checked={deviceType === "iphone"}
                      onChange={(e) =>
                        setDeviceType(e.target.value as "iphone")
                      }
                      className={`radio radio-accent ${
                        deviceError ? "border-red-500" : ""
                      }`}
                    />
                    iPhone
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="deviceType"
                      value="android"
                      checked={deviceType === "android"}
                      onChange={(e) =>
                        setDeviceType(e.target.value as "android")
                      }
                      className={`radio radio-accent ${
                        deviceError ? "border-red-500" : ""
                      }`}
                    />
                    Android
                  </label>
                </div>
              </div>
            )}

            {/* Selección de color e imagen preview */}
            {addGps && (
              <div className="mt-4 flex flex-col md:flex-row gap-4 items-center">
                <div className="w-full pr-0 md:pr-4">
                  <label className="block mb-1 font-semibold">
                    {i18n.language === "es" ? "Color del GPS" : "GPS Color"}
                  </label>
                  <select
                    value={gpsColor}
                    onChange={(e) => setGpsColor(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg border-gray-300"
                  >
                    <option value="black">
                      {i18n.language === "es" ? "Negro" : "Black"}
                    </option>
                  </select>
                </div>

                {/* Imagen de preview */}
              </div>
            )}
          </div>
          <div className="order-1 md:order-2 flex justify-center mt-[10px] object-cover">
            {addGps && (
              <div className="w-[200px] h-[200px] flex items-center justify-center border rounded-lg bg-gray-50">
                <img
                  src={
                    deviceType === "android" ? "/android.jpg" : "/iphone.png"
                  }
                  alt="GPS Preview"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Botones */}
      <div className="modal-action flex gap-2 items-center justify-center md:justify-end">
        <button
          className="btn mt-4 bg-teal-500 text-white hover:bg-teal-600"
          onClick={handleSave}
        >
          {i18n.language === "es" ? "Guardar y continuar" : "Save & Continue"}
        </button>

        <button
          className="btn mt-4 text-white"
          onClick={() => setGpsModal(false)}
        >
          {t("petCreation.step4.buttons.close")}
        </button>
      </div>
      {deviceType && (
        <p className="mt-2 text-sm">
          {selectedInventory
            ? i18n.language === "es"
              ? `Disponibles: ${selectedInventory.quantity}`
              : `Available: ${selectedInventory.quantity}`
            : i18n.language === "es"
            ? "No tenemos este dispositivo en este momento"
            : "We don’t have this device available right now"}
        </p>
      )}
      {((deviceType && !selectedInventory) ||
        selectedInventory?.quantity <= 0) && (
        <div>
          <p className="mt-2 text-sm text-red-500">
            {i18n.language === "es"
              ? "No tenemos este modelo en este momento"
              : "We don’t have this model available right now"}
          </p>
        </div>
      )}
    </div>
  );
}
