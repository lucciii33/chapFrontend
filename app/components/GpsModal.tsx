import React, { useState } from "react";
import { useTranslation } from "react-i18next";

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

  // Estados internos
  const [addGps, setAddGps] = useState(true);
  const [deviceType, setDeviceType] = useState<"iphone" | "android" | "">("");
  const [gpsColor, setGpsColor] = useState("black");
  const [priceGps, setPriceGps] = useState(17.99);

  if (!gpsModal) return null;

  return (
    <div className="mt-5">
      <h2
        className="text-2xl font-bold text-teal-500"
        style={{ fontFamily: "chapFont" }}
      >
        GPS Configuration
      </h2>

      {/* <p className="mt-2 text-md">
        {i18n.language === "es"
          ? "Configura el GPS de tu mascota."
          : "Setup your pet's GPS tracker."}
      </p> */}
      <p className="m-2 text-sm">{t("tag_description.text")}</p>

      {/* Checkbox para agregar GPS */}

      {/* Selección del tipo de dispositivo */}

      <div className="flex justify-center md:justify-between flex-col md:flex-row px-[20px]">
        <div className="order-2 md:order-1">
          <div className="mt-4">
            {/* <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={addGps}
                onChange={(e) => setAddGps(e.target.checked)}
                className="checkbox checkbox-accent"
              />
              <span>
                {i18n.language === "es"
                  ? "Quiero agregar el GPS a mi orden"
                  : "I want to add GPS to my order"}
              </span>
            </label> */}
          </div>
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
                    onChange={(e) => setDeviceType(e.target.value as "iphone")}
                    className="radio radio-accent"
                  />
                  iPhone
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="deviceType"
                    value="android"
                    checked={deviceType === "android"}
                    onChange={(e) => setDeviceType(e.target.value as "android")}
                    className="radio radio-accent"
                  />
                  Android
                </label>
              </div>
            </div>
          )}

          {/* Selección de color e imagen preview */}
          {addGps && (
            <div className="mt-4 flex flex-col md:flex-row gap-4 items-center">
              <div className="w-full md:w-1/2">
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
        <div className="order-1 md:order-2">
          {addGps && (
            <div className="w-[200px] h-[200px] flex items-center justify-center border rounded-lg bg-gray-50">
              <img
                src={deviceType === "android" ? "/android.jpg" : "/iphone.png"}
                alt="GPS Preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </div>
      </div>

      {/* Botones */}
      <div className="modal-action flex gap-2 items-center">
        <button
          className="btn mt-4 bg-teal-500 text-white hover:bg-teal-600"
          onClick={() => {
            handleGpsApiCall({
              deviceType,
              gpsColor,
            });
          }}
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
    </div>
  );
}
