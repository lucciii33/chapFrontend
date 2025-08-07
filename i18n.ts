// i18n.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./app/locales/en/common.json";
import es from "./app/locales/es/common.json";
console.log("HOLAAA LLAMANDOOOOOO")
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: en },
      es: { common: es },
    },
    lng: "es",
    fallbackLng: "en",
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
  });

  if (typeof window !== "undefined") {
  const savedLang = localStorage.getItem("lang");

  if (!savedLang) {
    fetch(`${import.meta.env.VITE_REACT_APP_URL}/users/test-country`)
      .then((res) => res.json())
      .then((data) => {
        const { lang } = data;
        console.log("lang", lang);
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
      })
      .catch((err) => console.error("Error test-country:", err));
  } else {
    i18n.changeLanguage(savedLang);
  }
}


export default i18n;
