import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const currentLng = i18n.language.split("-")[0] || "es"; // Para manejar casos como 'en-US'

  return (
    <div className="flex border-2 bg-black  p-0.5 pointer-events-auto">
      <button
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1 font-mono text-xs  font-bold transition-all ${
          currentLng === "en"
            ? "bg-green-400 text-black"
            : "text-green-400 hover:bg-green-900"
        }`}
      >
        EN
      </button>
      <div className="w-0.5 bg-gray-900 mx-px" />
      <button
        onClick={() => changeLanguage("es")}
        className={`px-3 py-1 font-mono text-xs font-bold transition-all ${
          currentLng === "es"
            ? "bg-green-400 text-black"
            : "text-green-400 hover:bg-green-900"
        }`}
      >
        ES
      </button>
    </div>
  );
};

export default LanguageSelector;
