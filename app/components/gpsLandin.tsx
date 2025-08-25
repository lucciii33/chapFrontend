import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function GpsLandignd() {
  const { t, i18n } = useTranslation();

  return (
    <div className="bg-teal-700 py-8 md:py-24 px-4">
      <div className="flex text-white flex-col md:flex-row items-center gap-8">
        {/* Imagen a la izquierda */}
        <div className="order-2 md:order-1 w-full md:w-1/2 flex justify-center">
          <img src="iphoneL.png" alt="Founder" className="max-w-sm w-full" />
        </div>

        {/* Texto a la derecha */}
        <div className="order-1 md:order-2  w-full md:w-1/2 ">
          <h2
            className="text-4xl font-bold mb-4 text-center md:text-left mt-[70px] md:mt-0"
            style={{ fontFamily: "chapFont" }}
          >
            {i18n.language === "es"
              ? "GPS en tiempo real las 24 horas"
              : "Real-time GPS Tracking 24/7"}
          </h2>
          <p className="">
            {i18n.language === "es"
              ? "Rastrea a tu perro en un radio de 50 a 100 metros directamente en el mapa de tu celular. Una protección extra junto a su chapa inteligente, esencial en caso de que se pierda."
              : "Track your dog within a range of 50 to 100 meters directly on your phone’s map. An extra layer of protection alongside their smart tag, essential in case they get lost."}
          </p>
          <p className="mt-2">
            {i18n.language === "es"
              ? "Es mejor tenerlo y no necesitarlo, que necesitarlo y no tenerlo."
              : "Better to have it and not need it, than to need it and not have it."}
          </p>
          <p className="mt-4 text-sm font-light">
            {i18n.language === "es"
              ? "Compatible con iPhone y Android, diseñado para que lo uses sin complicaciones en cualquier celular."
              : "Compatible with iPhone and Android, designed for effortless use on any phone."}
          </p>
        </div>
      </div>
    </div>
  );
}
