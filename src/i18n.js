import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationES from "./data/expedientes-es.json";
import translationEN from "./data/expedientes-en.json";

// i18next pide los datos dentro de "translation"
const resources = {
  es: {
    translation: translationES,
  },
  en: {
    translation: translationEN,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "es",
    fallbackLng: "en",

    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
